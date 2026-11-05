const categoryEnvKeys = {
  "perangkat-daerah": "NOMENCLATURE_PERANGKAT_DAERAH_ID",
  kecamatan: "NOMENCLATURE_KECAMATAN_ID",
  kelurahan: "NOMENCLATURE_KELURAHAN_ID",
  "upt-puskesmas": "NOMENCLATURE_UPT_PUSKESMAS_ID",
  "satuan-pendidikan": "NOMENCLATURE_SATUAN_PENDIDIKAN_ID",
} as const;

const envValue = (key: string) => process.env[key]?.trim() || "";

export const isSystemAdminNomenclature = (nomenclatureId: string) =>
  Boolean(envValue("NOMENCLATURE_ADMIN_ID")) &&
  nomenclatureId === envValue("NOMENCLATURE_ADMIN_ID");

export const allowedInnovationCategory = (nomenclatureId: string) => {
  if (isSystemAdminNomenclature(nomenclatureId)) return null;

  const match = Object.entries(categoryEnvKeys).find(
    ([, envKey]) => envValue(envKey) && envValue(envKey) === nomenclatureId,
  );

  return match ? match[0] : "";
};

export const canAccessInnovationCategory = (
  allowedCategory: string | null | undefined,
  category: string,
) => allowedCategory === null || allowedCategory === category;
