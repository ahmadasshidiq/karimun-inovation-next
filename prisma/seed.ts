import { config } from "dotenv";

// .env.local diprioritaskan; .env tetap dibaca sebagai cadangan.
config({ path: ".env.local" });
config();

import { randomBytes, scryptSync } from "node:crypto";

import { PrismaPg } from "@prisma/adapter-pg";
import {
  NewsCategory,
  NewsStatus,
  NewsType,
  PrismaClient,
  Status,
} from "@prisma/client";

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

  const superAdmin = await prisma.user.upsert({
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

  const newsSeeds = [
    {
      title: "Sosialisasi Pengukuran dan Penilaian Indeks Inovasi Daerah Tahun 2026",
      slug: "sosialisasi-pengukuran-dan-penilaian-indeks-inovasi-daerah-tahun-2026",
      excerpt: "Pemerintah Kabupaten Karimun menyelenggarakan sosialisasi pedoman penilaian Indeks Inovasi Daerah (IID) kepada seluruh Organisasi Perangkat Daerah dan unit kerja.",
      content: "<p>Dalam rangka meningkatkan kematangan ekosistem inovasi di daerah, Pemerintah Kabupaten Karimun melalui Baperlitbang menggelar agenda sosialisasi teknis pengukuran Indeks Inovasi Daerah (IID) tahun 2026. Kegiatan ini diikuti oleh perwakilan admin inovasi dari seluruh OPD, kecamatan, serta unit pelaksana teknis.</p><p>Fokus utama pertemuan ini mencakup pemahaman indikator satuan inovasi, pemenuhan bukti dukung berbobot tinggi, dan penyelarasan jadwal pelaporan ke sistem nasional Badan Strategi Kebijakan Dalam Negeri (BSKDN) Kemendagri.</p>",
      category: NewsCategory.SOSIALISASI,
      publishedAt: new Date("2026-10-18T00:00:00.000Z"),
      isFeatured: true,
    },
    {
      title: "Bimbingan Teknis Penginputan 36 Indikator Satuan Inovasi Berbasis Digital",
      slug: "bimbingan-teknis-penginputan-36-indikator-satuan-inovasi-berbasis-digital",
      excerpt: "Pelatihan intensif simulasi penginputan bukti dukung regulasi, kemanfaatan, dan dokumentasi penerapan inovasi pada sistem aplikasi pelaporan.",
      content: "<p>Badan Perencanaan, Penelitian, dan Pengembangan Kabupaten Karimun memfasilitasi Bimbingan Teknis penginputan 36 indikator satuan inovasi daerah. Peserta diajarkan teknik verifikasi mandiri terhadap kelengkapan surat keputusan kepala daerah, parameter kemanfaatan ekonomi dan sosial, survei kepuasan masyarakat, hingga format video dokumentasi inovasi.</p><p>Kegiatan ini mengikuti standar validasi BSKDN Kemendagri.</p>",
      category: NewsCategory.BIMBINGAN_TEKNIS,
      publishedAt: new Date("2026-10-12T00:00:00.000Z"),
      isFeatured: false,
    },
    {
      title: "Pendampingan Lapangan Validasi Dokumen Evidensi Inovasi Pelayanan Publik",
      slug: "pendampingan-lapangan-validasi-dokumen-evidensi-inovasi-pelayanan-publik",
      excerpt: "Tim verifikator melakukan peninjauan langsung terhadap implementasi inovasi di loket pelayanan publik guna memastikan kesesuaian data lapangan.",
      content: "<p>Memasuki tahapan pra-evaluasi, tim penilai inovasi daerah melaksanakan pendampingan langsung ke berbagai unit pelayanan publik di Kabupaten Karimun.</p><p>Peninjauan ini bertujuan memastikan inovasi yang telah didaftarkan dalam sistem benar-benar telah diterapkan minimal dua tahun berturut-turut, memiliki dampak efisiensi waktu layanan, serta didukung oleh testimoni kepuasan para pengguna layanan.</p>",
      category: NewsCategory.DISEMINASI,
      publishedAt: new Date("2026-10-05T00:00:00.000Z"),
      isFeatured: false,
    },
  ];

  for (const news of newsSeeds) {
    await prisma.news.upsert({
      where: { slug: news.slug },
      update: {},
      create: {
        ...news,
        coverImage: "/images/hero-karimun-new.jpg",
        type: NewsType.BERITA,
        status: NewsStatus.PUBLISHED,
        authorId: superAdmin.id,
      },
    });
  }

  console.info("Tiga berita awal berhasil dipastikan tersedia.");

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
