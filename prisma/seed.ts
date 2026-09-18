import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

const books = [
  {
    slug: "the-alchemist",
    title: "The Alchemist",
    author: "Paulo Coelho",
    description:
      "A magical story about Santiago, an Andalusian shepherd boy who dreams of discovering a worldly treasure and sets out on a journey to find it.",
    price: 45.0,
    coverImage: "https://picsum.photos/seed/alchemist/400/600",
    pdfUrl: "https://www.w3.org/WAI/UR/wd-AERT",
    stock: 25,
    published: true,
  },
  {
    slug: "1984-george-orwell",
    title: "1984",
    author: "George Orwell",
    description:
      "A dystopian social science fiction novel that follows the life of Winston Smith, a low-ranking member of 'the Party' who is frustrated by the omnipresent eyes of the authorities.",
    price: 38.0,
    coverImage: "https://picsum.photos/seed/1984/400/600",
    pdfUrl: null,
    stock: 18,
    published: true,
  },
  {
    slug: "dune-frank-herbert",
    title: "Dune",
    author: "Frank Herbert",
    description:
      "Set in the distant future amidst a feudal interstellar society, Dune tells the story of young Paul Atreides as he and his family accept stewardship of the desert planet Arrakis.",
    price: 62.0,
    coverImage: "https://picsum.photos/seed/dune/400/600",
    pdfUrl: "https://www.w3.org/WAI/UR/wd-AERT",
    stock: 12,
    published: true,
  },
  {
    slug: "sapiens-brief-history",
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    description:
      "Explores the ways in which biology and history have defined us and enhanced our understanding of what it means to be human.",
    price: 55.0,
    coverImage: "https://picsum.photos/seed/sapiens/400/600",
    pdfUrl: null,
    stock: 30,
    published: true,
  },
  {
    slug: "atomic-habits",
    title: "Atomic Habits",
    author: "James Clear",
    description:
      "An easy and proven way to build good habits and break bad ones. Tiny changes, remarkable results.",
    price: 48.0,
    coverImage: "https://picsum.photos/seed/atomichabits/400/600",
    pdfUrl: "https://www.w3.org/WAI/UR/wd-AERT",
    stock: 40,
    published: true,
  },
  {
    slug: "the-little-prince",
    title: "The Little Prince",
    author: "Antoine de Saint-Exupéry",
    description:
      "A poetic tale in which a pilot stranded in the desert meets a young prince fallen from a tiny asteroid. A story of loss, loneliness, friendship, and love.",
    price: 29.0,
    coverImage: "https://picsum.photos/seed/littleprince/400/600",
    pdfUrl: "https://www.w3.org/WAI/UR/wd-AERT",
    stock: 50,
    published: true,
  },
  {
    slug: "to-kill-a-mockingbird",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    description:
      "The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it. Winner of the Pulitzer Prize.",
    price: 42.0,
    coverImage: "https://picsum.photos/seed/mockingbird/400/600",
    pdfUrl: null,
    stock: 22,
    published: true,
  },
  {
    slug: "the-great-gatsby",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    description:
      "A story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan, of lavish parties on Long Island at a time when the New York Times noted prohibition is being cheerfully disregarded.",
    price: 35.0,
    coverImage: "https://picsum.photos/seed/gatsby/400/600",
    pdfUrl: "https://www.w3.org/WAI/UR/wd-AERT",
    stock: 15,
    published: true,
  },
  {
    slug: "deep-work",
    title: "Deep Work",
    author: "Cal Newport",
    description:
      "Rules for focused success in a distracted world. The ability to perform deep work is becoming increasingly rare and valuable in our economy.",
    price: 50.0,
    coverImage: "https://picsum.photos/seed/deepwork/400/600",
    pdfUrl: null,
    stock: 28,
    published: true,
  },
  {
    slug: "the-midnight-library",
    title: "The Midnight Library",
    author: "Matt Haig",
    description:
      "Between life and death there is a library. Its shelves go on forever. Every book provides a chance to try another life you could have lived.",
    price: 44.0,
    coverImage: "https://picsum.photos/seed/midnightlib/400/600",
    pdfUrl: "https://www.w3.org/WAI/UR/wd-AERT",
    stock: 20,
    published: true,
  },
];

async function main() {
  console.log("🌱 Seeding database...");

  // Upsert books (safe to re-run)
  for (const book of books) {
    await prisma.book.upsert({
      where: { slug: book.slug },
      update: book,
      create: book,
    });
    console.log(`  ✓ ${book.title}`);
  }

  // Create a demo admin user
  await prisma.user.upsert({
    where: { email: "admin@sahifa.com" },
    update: {},
    create: {
      email: "admin@sahifa.com",
      name: "Admin",
      password: "hashed_placeholder", // replace with bcrypt hash in production
      role: Role.ADMIN,
    },
  });
  console.log("  ✓ Admin user");

  console.log(`\n✅ Seeded ${books.length} books successfully!`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
