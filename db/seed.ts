import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

const makeUser = async () => {
  const password = await hash("ilovegifs", 12);
  return [
    {
      name: "jiffy",
      isDefaultUser: true,
      password,
    },
  ];
};

async function seedData() {
  /*const defaultUser = await prisma.user.findFirst({
    where: {
      isDefaultUser: true,
    },
  });

  if (defaultUser) {
    console.info("Default user and roles already exists.");
    return;
  }
*/
  console.info("Seeding default user and roles.");
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
