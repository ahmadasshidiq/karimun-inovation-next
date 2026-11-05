export const SYSTEM_ADMIN_NOMENCLATURE = "Administrator Sistem";

export const nomenclatureToCategory = (name: string) =>
  name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const isSystemAdminNomenclature = (name?: string | null) =>
  name?.trim() === SYSTEM_ADMIN_NOMENCLATURE;

export const allowedInnovationCategory = (nomenclature?: string | null) =>
  isSystemAdminNomenclature(nomenclature)
    ? null
    : nomenclatureToCategory(nomenclature ?? "");

export const canAccessInnovationCategory = (
  nomenclature: string | null | undefined,
  category: string,
) => {
  const allowed = allowedInnovationCategory(nomenclature);
  return allowed === null || allowed === category;
};
