import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  // Locations: County -> Area
  const kiambu = await db.location.upsert({
    where: { slug: "kiambu" },
    update: {},
    create: { name: "Kiambu County", slug: "kiambu", type: "COUNTY" },
  });

  const lowerKabete = await db.location.upsert({
    where: { slug: "lower-kabete" },
    update: {},
    create: {
      name: "Lower Kabete",
      slug: "lower-kabete",
      type: "AREA",
      parentId: kiambu.id,
    },
  });

  // Amenities
  const amenityNames = [
    "Water 24/7",
    "Borehole",
    "Parking",
    "Security / CCTV",
    "Fibre internet ready",
    "Balcony",
    "Backup generator",
    "Gated compound",
    "Pet friendly",
    "Lift",
  ];

  for (const name of amenityNames) {
    await db.amenity.upsert({ where: { name }, update: {}, create: { name } });
  }

  // Sample landlord (fake number, for development only)
const owner = await db.user.upsert({
  where: { email: "sample.landlord@kejakonnect.invalid" },
  update: {},
  create: {
    name: "Sample Landlord",
    email: "sample.landlord@kejakonnect.invalid",
    phoneNumber: "+254700000001",
    phoneNumberVerified: true,
    role: "LANDLORD",
    isVerified: true,
  },
});

  // Sample listings (only created if this owner has none yet)
  const existing = await db.listing.count({ where: { ownerId: owner.id } });
  if (existing === 0) {
    const samples = [
      {
        title: "Modern bedsitter near Kabete Road",
        description: "Bright, secure bedsitter with water and parking. Sample listing.",
        priceKes: 8500,
        bedrooms: 0,
        bathrooms: 1,
        propertyType: "BEDSITTER" as const,
      },
      {
        title: "Spacious 1 bedroom in a gated compound",
        description: "Quiet compound with CCTV and borehole water. Sample listing.",
        priceKes: 18000,
        bedrooms: 1,
        bathrooms: 1,
        propertyType: "ONE_BEDROOM" as const,
      },
      {
        title: "2 bedroom apartment with balcony",
        description: "Master ensuite, ample parking, fibre ready. Sample listing.",
        priceKes: 35000,
        bedrooms: 2,
        bathrooms: 2,
        propertyType: "TWO_BEDROOM" as const,
      },
    ];

    for (const s of samples) {
      await db.listing.create({
        data: {
          ...s,
          status: "APPROVED",
          contactPhone: "+254700000002", // fake number
          ownerId: owner.id,
          locationId: lowerKabete.id,
        },
      });
    }
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());