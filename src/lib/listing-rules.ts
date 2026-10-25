import { siteConfig } from "@/config/site";

// Listings not confirmed since this date are treated as stale.
export const freshCutoff = () =>
  new Date(Date.now() - siteConfig.listingFreshDays * 86_400_000);

export const isStale = (lastConfirmedAt: Date) => lastConfirmedAt < freshCutoff();