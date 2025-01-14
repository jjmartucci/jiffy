import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

const makeUser = async () => {
  const password = await hash("ilovegifs", 12);
  return [
    {
      name: "jiffy",
      password,
    },
  ];
};

async function seedData() {
  console.log("Seeding...");
  const users = await makeUser();

  await prisma.role.create({
    data: {
      name: "admin",
      users: {
        create: users,
      },
    },
  });

  await prisma.role.create({
    data: {
      name: "user",
    },
  });

  console.log("Finished seeding.");
}

seedData()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
