import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function normalizeRegionValue(value?: string | null): string | null {
  const rawValue = value?.toString().trim();

  if (!rawValue) {
    return null;
  }

  const normalizedValue = rawValue.toLowerCase();
  const peruKeywords = [
    'peru',
    'perú',
    'lima',
    'arequipa',
    'cusco',
    'piura',
    'trujillo',
    'chiclayo',
    'ica',
    'ayacucho',
    'junín',
    'junin',
    'huánuco',
    'huanuco',
    'puno',
    'tacna',
    'tarapoto',
    'amazonas',
    'ancash',
    'apurímac',
    'apurimac',
    'callao',
    'madre de dios',
    'moquegua',
    'pasco',
    'ucayali',
    'huancavelica',
    'la libertad',
    'loreto',
    'san martin',
    'tumbes',
  ];

  if (peruKeywords.some((keyword) => normalizedValue.includes(keyword))) {
    return 'Perú';
  }

  return null;
}

export function extractDashboardRegions(payload: unknown): string[] {
  if (Array.isArray(payload)) {
    return payload
      .map((item) => {
        if (typeof item === 'string') {
          return normalizeRegionValue(item);
        }

        if (item && typeof item === 'object') {
          const record = item as Record<string, unknown>;
          const regionValue = record.region ?? record.name ?? record.nombre ?? record.región ?? record.region_name ?? record.regionName;

          if (typeof regionValue === 'string') {
            return normalizeRegionValue(regionValue);
          }
        }

        return null;
      })
      .filter((value): value is string => Boolean(value));
  }

  if (payload && typeof payload === 'object') {
    const record = payload as Record<string, unknown>;
    const nestedKeys = ['data', 'regions', 'items', 'result'];

    for (const key of nestedKeys) {
      const nestedValue = record[key];
      if (nestedValue !== undefined) {
        const extracted = extractDashboardRegions(nestedValue);
        if (extracted.length > 0) {
          return extracted;
        }
      }
    }
  }

  return [];
}
