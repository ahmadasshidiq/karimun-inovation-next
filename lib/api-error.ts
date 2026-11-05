export function clientErrorMessage(error: unknown, fallback: string) {
  if (!(error instanceof Error)) return fallback;

  if (error.name.startsWith("PrismaClient") || error instanceof SyntaxError) {
    console.error(error);
    return fallback;
  }

  return error.message;
}
