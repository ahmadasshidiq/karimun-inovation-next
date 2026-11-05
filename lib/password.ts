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
