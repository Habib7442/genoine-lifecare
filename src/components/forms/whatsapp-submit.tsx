import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";

/** Magenta "Send on WhatsApp" submit button + the note shown after WhatsApp opens. */
export function WhatsAppSubmit({ sent }: { sent: boolean }) {
  return (
    <div className="sm:col-span-2">
      <button
        type="submit"
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 text-base font-medium text-primary-foreground transition-colors outline-none hover:bg-brand-primary-light focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:w-auto"
      >
        <WhatsAppIcon className="size-5" />
        Send on WhatsApp
      </button>
      <p role="status" className="mt-3 text-sm font-medium text-primary empty:hidden">
        {sent ? "WhatsApp opened — send the message to reach us." : ""}
      </p>
    </div>
  );
}
