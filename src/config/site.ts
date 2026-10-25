export const siteConfig = {
  name: "KejaKonnect",
  description: "Find rental houses in Lower Kabete and beyond.",
  pass: {
    priceKes: 250, // placeholder, we'll tune this later
    durationDays: 7,
  },
  launchArea: "Lower Kabete",
  listingFreshDays: 14, // listings not confirmed within this many days are hidden
  // Live numbers on the homepage only show once both are reached,
  // so an early marketplace never advertises "2 houses". Lower these to test.
  statsMin: { listings: 10, landlords: 5 },

  // Fill these in before launch. Empty values are simply not shown.
  contact: {
    email: "", // e.g. "support@kejakonnect.co.ke"
    phone: "", // e.g. "+254712345678"
    whatsapp: "", // digits only, e.g. "254712345678"
  },
  social: { instagram: "", facebook: "", x: "", tiktok: "" }, // full URLs
  company: {
    legalName: "KejaKonnect",
    odpcRegistration: "", // Data Protection Commissioner registration number
  },
  legalUpdated: "26 October 2026",
};