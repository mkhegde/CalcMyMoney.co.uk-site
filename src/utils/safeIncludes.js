// src/utils/safeIncludes.ts
export const safeIncludes = (a: unknown, b: unknown): boolean =>
  typeof a === 'string' && typeof b === 'string' && a.includes(b);

export const safeStartsWith = (a: unknown, b: unknown): boolean =>
  typeof a === 'string' && typeof b === 'string' && a.startsWith(b);
