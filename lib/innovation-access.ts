import type { getAuthenticatedUser } from "@/lib/auth-user";

type AuthenticatedUser = NonNullable<Awaited<ReturnType<typeof getAuthenticatedUser>>>;

const globalRoleIds = () =>
  new Set(
    [
      process.env.INNOVATION_ROLE_SUPERADMIN_ID,
      process.env.INNOVATION_ROLE_ADMIN_ID,
    ].filter((value): value is string => Boolean(value?.trim()))
      .map((value) => value.trim()),
  );

export const canAccessAllInnovations = (user: AuthenticatedUser) =>
  globalRoleIds().has(user.roleId);

export const isSuperAdmin = (user: AuthenticatedUser) =>
  Boolean(process.env.INNOVATION_ROLE_SUPERADMIN_ID?.trim()) &&
  user.roleId === process.env.INNOVATION_ROLE_SUPERADMIN_ID?.trim();

// Super admin melihat semua inovasi. Co-admin hanya melihat inovasi instansi lain
// yang sudah dikirim (draft/belum lengkap tetap tersembunyi).
export const innovationOwnerScope = (user: AuthenticatedUser) => {
  if (isSuperAdmin(user)) return {};
  if (canAccessAllInnovations(user)) {
    return {
      OR: [
        { createdBy: { institutionId: user.institutionId } },
        { submissionStatus: "SUBMITTED" },
      ],
    };
  }
  return { createdBy: { institutionId: user.institutionId } };
};

// Database inovasi di dashboard: selain super admin, inovasi instansi lain
// hanya tampil jika sudah dikirim.
export const innovationVisibilityScope = (user: AuthenticatedUser) =>
  isSuperAdmin(user)
    ? {}
    : {
        OR: [
          { createdBy: { institutionId: user.institutionId } },
          { submissionStatus: "SUBMITTED" },
        ],
      };
