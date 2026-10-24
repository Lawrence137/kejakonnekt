import type { PropertyType } from "@/generated/prisma/client";

export const formatKes = (amount: number) =>
  `KES ${amount.toLocaleString("en-KE")}`;

export const propertyTypeLabels: Record<PropertyType, string> = {
  BEDSITTER: "Bedsitter",
  STUDIO: "Studio",
  ONE_BEDROOM: "1 Bedroom",
  TWO_BEDROOM: "2 Bedroom",
  THREE_BEDROOM: "3 Bedroom",
  FOUR_PLUS_BEDROOM: "4+ Bedroom",
  MAISONETTE: "Maisonette",
  BUNGALOW: "Bungalow",
};

export function daysAgo(date: Date) {
  const days = Math.floor((Date.now() - date.getTime()) / 86_400_000);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  return `${days} days ago`;
}