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
};