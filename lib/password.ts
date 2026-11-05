export function getPasswordError(password: string) {
  if (password.length < 8) return "Password minimal 8 karakter.";
  if (password.length > 128) return "Password maksimal 128 karakter.";
  if (
    !/[A-Z]/.test(password) ||
    !/[a-z]/.test(password) ||
    !/\d/.test(password) ||
    !/[^A-Za-z0-9]/.test(password)
  ) {
    return "Password wajib mengandung huruf besar, huruf kecil, angka, dan karakter khusus.";
  }
  return null;
}

export const getPasswordRules = (password: string) => [
  { label: "Minimal 8 karakter", valid: password.length >= 8 },
  { label: "Minimal 1 huruf besar", valid: /[A-Z]/.test(password) },
  { label: "Minimal 1 huruf kecil", valid: /[a-z]/.test(password) },
  { label: "Minimal 1 angka", valid: /\d/.test(password) },
  {
    label: "Minimal 1 karakter khusus",
    valid: /[^A-Za-z0-9]/.test(password),
  },
];
