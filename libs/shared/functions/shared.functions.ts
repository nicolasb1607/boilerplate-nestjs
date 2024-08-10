export async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getEnumKeyByValue(
  enumObject: any,
  value: string,
): string | undefined {
  for (const [key, val] of Object.entries(enumObject)) {
    if (val === value) {
      return key;
    }
  }
}

export function normalizeEmail(email: string): string {
  // Convert email to lowercase for consistency
  let normalized = email.toLowerCase();
  const [localPart, domain] = normalized.split('@');

  let cleanLocalPart = localPart;

  // Handle dot addressing
  cleanLocalPart = cleanLocalPart.replace(/\./g, '');

  // Handle plus addressing for any domain
  cleanLocalPart = cleanLocalPart.split('+')[0]; // Remove anything after '+'

  // Reconstruct the normalized email
  normalized = `${cleanLocalPart}@${domain}`;

  return normalized;
}
