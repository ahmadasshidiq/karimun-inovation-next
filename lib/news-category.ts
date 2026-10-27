import { NewsCategory } from "@prisma/client";

export const slugifyNewsCategory = (value: string) =>
  value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 120);

/** Legacy enum is retained during transition; public and dashboard use categoryRef.name. */
export const legacyCategoryFor = (slug: string) => {
  if (slug === "bimbingan-teknis") return NewsCategory.BIMBINGAN_TEKNIS;
  if (slug === "diseminasi") return NewsCategory.DISEMINASI;
  return NewsCategory.SOSIALISASI;
};

export const legacyCategoryLabel = (value: NewsCategory | string) => ({
  SOSIALISASI: "Sosialisasi",
  BIMBINGAN_TEKNIS: "Bimbingan Teknis",
  DISEMINASI: "Diseminasi",
}[value] || String(value));
