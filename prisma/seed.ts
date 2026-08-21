import "dotenv/config";

import { randomBytes, scryptSync } from "node:crypto";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Status } from "@prisma/client";

const connectionString = process.env["DATABASE_URL"];

if (!connectionString) {
  throw new Error("DATABASE_URL belum dikonfigurasi.");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const hashPassword = (password: string, salt: string) =>
  scryptSync(password, salt, 64).toString("hex");

async function main() {
  const username = process.env["SEED_SUPER_ADMIN_USERNAME"] ?? "Super Admin";
  const email =
    process.env["SEED_SUPER_ADMIN_EMAIL"] ?? "superadmin@karimunkab.go.id";
  const plainPassword =
    process.env["SEED_SUPER_ADMIN_PASSWORD"] ?? "Admin1234";
  const salt = randomBytes(32).toString("hex");
  const password = hashPassword(plainPassword, salt);

  const existingRole = await prisma.role.findFirst({
    where: { name: "Super Admin" },
  });

  const role = existingRole
    ? await prisma.role.update({
        where: { id: existingRole.id },
        data: { permission: { all: true } },
      })
    : await prisma.role.create({
        data: {
          name: "Super Admin",
          permission: { all: true },
        },
      });

  const nomenclatureData = {
    name: "Administrator Sistem",
    description: "Nomenklatur untuk administrator sistem",
    status: Status.ACTIVE,
  };
  const existingNomenclature = await prisma.nomenclature.findFirst({
    where: { name: nomenclatureData.name },
  });

  const nomenclature = existingNomenclature
    ? await prisma.nomenclature.update({
        where: { id: existingNomenclature.id },
        data: nomenclatureData,
      })
    : await prisma.nomenclature.create({ data: nomenclatureData });

  const institutionData = {
    nomenclatureId: nomenclature.id,
    name: "Administrator Sistem",
    type: "system",
    status: Status.ACTIVE,
    deletedAt: null,
  };
  const existingInstitution = await prisma.institution.findFirst({
    where: {
      name: institutionData.name,
      type: institutionData.type,
    },
  });

  const institution = existingInstitution
    ? await prisma.institution.update({
        where: { id: existingInstitution.id },
        data: institutionData,
      })
    : await prisma.institution.create({ data: institutionData });

  await prisma.user.upsert({
    where: { username },
    update: {
      roleId: role.id,
      institutionId: institution.id,
      email,
      fullname: "Super Administrator",
      status: Status.ACTIVE,
      password,
      salt,
      deletedAt: null,
    },
    create: {
      roleId: role.id,
      institutionId: institution.id,
      username,
      email,
      fullname: "Super Administrator",
      status: Status.ACTIVE,
      password,
      salt,
    },
  });

  console.info(`Super Admin berhasil dibuat dengan username: ${username}`);

  if (!process.env["SEED_SUPER_ADMIN_PASSWORD"]) {
    console.warn(
      "Password default digunakan. Set SEED_SUPER_ADMIN_PASSWORD sebelum menjalankan seed di production.",
    );
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
