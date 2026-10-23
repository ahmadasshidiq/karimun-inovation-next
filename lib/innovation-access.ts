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

export const innovationOwnerScope = (user: AuthenticatedUser) =>
  canAccessAllInnovations(user)
    ? {}
    : { createdBy: { institutionId: user.institutionId } };
