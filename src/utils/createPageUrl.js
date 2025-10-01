// src/utils/createpage.js
/*
 * Robust slugger:
 * - Converts CamelCase to kebab-case
 * - Preserves acronyms (UK, PAYE, ISA, VAT, CGT, IR35, FIRE) → "uk", "paye", etc.
 * - Cleans unsafe chars and trims extra dashes
 * - Works with PascalCase ("SalaryCalculatorUK") or pre-kebab ("salary-calculator-uk")
 */
export const createPageUrl = (pageName) => {
  if (!pageName || typeof pageName !== 'string') return '/';
  const trimmed = pageName.trim();
  if (/^home(page)?$/i.test(trimmed)) return '/';

  const slug = trimmed
    .replace(/[_\s/]+/g, '-') // spaces/underscores/slashes → hyphen
    .replace(/([a-z\d])([A-Z])/g, '$1-$2') // lower/digit → Upper boundary
    .replace(/([A-Z]+)([A-Z][a-z\d]+)/g, '$1-$2') // ACRONYM → Word boundary (keep acronym whole)
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-') // strip non-url-safe chars
    .replace(/-+/g, '-') // collapse multiple dashes
    .replace(/^-+|-+$/g, ''); // trim leading/trailing dashes

  return `/${slug}`;
};
