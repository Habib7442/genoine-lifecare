import "server-only";

import { ABOUT_FALLBACK, type AboutValue, type AboutValueIcon } from "@/content/about";
import { INCORPORATED_ON } from "@/lib/company";
import { sanityFetch } from "@/sanity/lib/fetch";
import { urlFor } from "@/sanity/lib/image";
import { ABOUT_PAGE_QUERY, ABOUT_STATS_QUERY } from "@/sanity/queries";
import { DOSAGE_FORMS } from "@/sanity/dosage-forms";

export type AboutLeader = {
  key: string;
  name: string;
  role: string;
  bio?: string;
  /** Public profile (https only). */
  profileUrl?: string;
  /** Shown first, in the large highlighted card. */
  isFounder: boolean;
  photo?: { src: string; alt: string };
};

export type AboutPage = {
  eyebrow: string;
  heading: string;
  intro: string;
  storyHeading: string;
  storyParagraphs: string[];
  storyImage: { src: string; alt: string };
  mission: string;
  vision: string;
  valuesHeading: string;
  values: AboutValue[];
  leaders: AboutLeader[];
  /** ISO date, e.g. "2026-05-04". */
  incorporatedOn: string;
};

export type AboutStats = {
  areaCount: number;
  productCount: number;
  /** Dosage forms that exist on published products, in the schema's order. */
  forms: string[];
};

type SanityImage = {
  asset: { _ref: string };
  hotspot?: unknown;
  crop?: unknown;
  alt?: string | null;
};

type AboutPageResult = {
  eyebrow?: string | null;
  heading?: string | null;
  intro?: string | null;
  storyHeading?: string | null;
  storyParagraphs?: (string | null)[] | null;
  storyImage?: SanityImage | null;
  mission?: string | null;
  vision?: string | null;
  valuesHeading?: string | null;
  values?: { icon?: string | null; title?: string | null; text?: string | null }[] | null;
  leaders?: {
    _key: string;
    name: string;
    role?: string | null;
    bio?: string | null;
    profileUrl?: string | null;
    isFounder?: boolean | null;
    photo?: SanityImage | null;
  }[] | null;
  incorporatedOn?: string | null;
} | null;

const VALUE_ICONS: AboutValueIcon[] = ["quality", "integrity", "partnership", "reliability"];

function isValueIcon(icon: string | null | undefined): icon is AboutValueIcon {
  return VALUE_ICONS.includes(icon as AboutValueIcon);
}

/** About page content from Studio; any empty field falls back to src/content/about.ts. */
export async function getAboutPage(): Promise<AboutPage> {
  const result = await sanityFetch<AboutPageResult>({
    query: ABOUT_PAGE_QUERY,
    tags: ["aboutPage"],
    fallback: null,
  });

  const storyParagraphs = (result?.storyParagraphs ?? []).filter((text): text is string => Boolean(text?.trim()));
  const values = (result?.values ?? []).flatMap((value) =>
    isValueIcon(value.icon) && value.title && value.text
      ? [{ icon: value.icon, title: value.title, text: value.text }]
      : [],
  );

  return {
    eyebrow: result?.eyebrow || ABOUT_FALLBACK.eyebrow,
    heading: result?.heading || ABOUT_FALLBACK.heading,
    intro: result?.intro || ABOUT_FALLBACK.intro,
    storyHeading: result?.storyHeading || ABOUT_FALLBACK.storyHeading,
    storyParagraphs: storyParagraphs.length ? storyParagraphs : ABOUT_FALLBACK.storyParagraphs,
    storyImage: result?.storyImage?.asset
      ? {
          src: urlFor(result.storyImage).width(900).height(1080).fit("crop").auto("format").url(),
          alt: result.storyImage.alt || ABOUT_FALLBACK.storyImage.alt,
        }
      : ABOUT_FALLBACK.storyImage,
    mission: result?.mission || ABOUT_FALLBACK.mission,
    vision: result?.vision || ABOUT_FALLBACK.vision,
    valuesHeading: result?.valuesHeading || ABOUT_FALLBACK.valuesHeading,
    values: values.length ? values : ABOUT_FALLBACK.values,
    leaders: (result?.leaders ?? []).flatMap((leader) =>
      leader.name && leader.role
        ? [
            {
              key: leader._key,
              name: leader.name,
              role: leader.role,
              bio: leader.bio || undefined,
              profileUrl: leader.profileUrl?.startsWith("https://") ? leader.profileUrl : undefined,
              isFounder: leader.isFounder === true,
              photo: leader.photo?.asset
                ? {
                    src: urlFor(leader.photo).width(640).height(640).fit("crop").auto("format").url(),
                    alt: leader.photo.alt || `Photo of ${leader.name}`,
                  }
                : undefined,
            },
          ]
        : [],
    )
      // Founders first; otherwise keep the Studio order (sort is stable).
      .sort((a, b) => Number(b.isFounder) - Number(a.isFounder)),
    incorporatedOn: result?.incorporatedOn || INCORPORATED_ON,
  };
}

type AboutStatsResult = { areaCount?: number; productCount?: number; forms?: (string | null)[] } | null;

/** Real counts for the fact strip and the dosage form chips (zeros when Sanity is unavailable). */
export async function getAboutStats(): Promise<AboutStats> {
  const result = await sanityFetch<AboutStatsResult>({
    query: ABOUT_STATS_QUERY,
    tags: ["product", "therapeuticArea"],
    fallback: null,
  });
  const forms = new Set(result?.forms ?? []);
  return {
    areaCount: result?.areaCount ?? 0,
    productCount: result?.productCount ?? 0,
    forms: DOSAGE_FORMS.filter((form) => forms.has(form)),
  };
}
