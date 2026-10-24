import { Lock, ShieldCheck } from "lucide-react";
import { siteConfig } from "@/config/site";

export function ContactCard({ taken }: { taken: boolean }) {
  if (taken) {
    return (
      <div className="rounded-2xl border bg-secondary/50 p-6">
        <p className="font-semibold">This house has been taken</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Browse other available houses in {siteConfig.launchArea}.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border bg-background p-6 shadow-sm">
      <p className="text-sm font-medium text-muted-foreground">
        Landlord / agent contact
      </p>

      {/* Decorative mask only. The real number is never sent to the browser. */}
      <p
        aria-hidden="true"
        className="mt-2 flex items-center gap-2 text-2xl font-bold tracking-wider blur-[2px] select-none"
      >
        <Lock className="size-5" /> 07•• ••• •••
      </p>

      <button
        type="button"
        // TODO: wire up in the payments phase (check pass, then STK push)
        className="mt-5 w-full rounded-xl bg-primary px-4 py-3 font-semibold text-primary-foreground transition hover:opacity-90"
      >
        Unlock contact · KES {siteConfig.pass.priceKes}
      </button>

      <p className="mt-3 text-center text-sm text-muted-foreground">
        One payment gives you {siteConfig.pass.durationDays} days of access to
        every landlord&apos;s number.
      </p>

      <div className="mt-5 flex gap-2 border-t pt-4 text-xs text-muted-foreground">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
        <p>
          Never pay a deposit before viewing the house. Found it taken or the
          number doesn&apos;t work? Report it and we&apos;ll make it right.
        </p>
      </div>
    </div>
  );
}