type PermissionEntry = { model?: unknown; actions?: unknown };

export const competitionRole = {
  SUPER_ADMIN: "Super Admin",
  OPD_ADMIN: "Admin OPD",
  JUDGE: "Juri / Tim Penilai",
} as const;

export function canAccessCompetition(
  user: { role: { name: string; permission: unknown } },
  action: string,
) {
  return canAccessModel(user, "innovation-competitions", action);
}

export function canAccessModel(
  user: { role: { name: string; permission: unknown } },
  model: string,
  action: string,
) {
  if (user.role.name === competitionRole.SUPER_ADMIN) return true;
  const permission = user.role.permission;
  if (!Array.isArray(permission)) return false;
  const entry = permission.find(
    (item): item is PermissionEntry =>
      typeof item === "object" &&
      item !== null &&
      "model" in item &&
      item.model === model,
  );
  return Array.isArray(entry?.actions) && entry.actions.includes(action);
}
