// Role.permission berisi { all: true } atau daftar { model, actions }.
export const hasPermission = (
  permission: unknown,
  model: string,
  action: string,
) => {
  if (!Array.isArray(permission)) {
    return (
      typeof permission === "object" &&
      permission !== null &&
      (permission as { all?: unknown }).all === true
    );
  }

  return permission.some(
    (item) =>
      typeof item === "object" &&
      item !== null &&
      (item as { model?: unknown }).model === model &&
      Array.isArray((item as { actions?: unknown }).actions) &&
      (item as { actions: unknown[] }).actions.includes(action),
  );
};
