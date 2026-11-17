import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

type WebhookPayload = { _type?: string };

/**
 * Some changes affect other cached queries too:
 * product counts live on therapeutic area tiles, and products embed area titles.
 */
const RELATED_TAGS: Record<string, string[]> = {
  product: ["product", "therapeuticArea"],
  therapeuticArea: ["therapeuticArea", "product"],
  category: ["category", "product"],
};

/**
 * Sanity webhook → revalidate cache tags for the changed document type.
 * Configure in sanity.io/manage → API → Webhooks: POST to /api/revalidate,
 * projection `{_type}`, secret = SANITY_REVALIDATE_SECRET.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json({ message: "Revalidation is not configured" }, { status: 500 });
  }

  try {
    // `true`: wait briefly so the CDN serves the published change before we refetch.
    const { isValidSignature, body } = await parseBody<WebhookPayload>(req, secret, true);

    if (!isValidSignature) {
      return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
    }
    if (!body?._type) {
      return NextResponse.json({ message: "Missing _type" }, { status: 400 });
    }

    const tags = RELATED_TAGS[body._type] ?? [body._type];
    for (const tag of tags) revalidateTag(tag, "max");

    return NextResponse.json({ revalidated: true, tags });
  } catch (error) {
    console.error("[revalidate] failed:", error);
    return NextResponse.json({ message: "Error revalidating" }, { status: 500 });
  }
}
