import csv from 'csv-parser';
import fs from 'fs';

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

export function parseBoolean(
  value: unknown,
  defaultValue: boolean = false,
): boolean {
  switch (typeof value) {
    case 'boolean':
      return value;

    case 'number':
      return value === 1;

    case 'string': {
      const normalized = value.toLowerCase().trim();
      switch (normalized) {
        case 'true':
        case '1':
        case 'yes':
          return true;
        case 'false':
        case '0':
        case 'no':
          return false;
        default:
          return defaultValue;
      }
    }

    case 'undefined':
      return defaultValue;

    default:
      return value === null ? defaultValue : false;
  }
}

export async function readCsvFile(
  filePath: string,
  separator: string,
): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv({ separator }))
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (err) => reject(err));
  });
}
