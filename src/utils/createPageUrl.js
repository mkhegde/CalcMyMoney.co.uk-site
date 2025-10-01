/*
 * Convert internal page names to clean, kebab-case URLs.
 * Handles CamelCase, trims leading/trailing hyphens, collapses repeats,
 * and strips non URL-safe chars.
 *
 * Examples:
 *  "SalaryCalculatorUK"  -> "/salary-calculator-uk"
 *  " Over-time  Rate  "  -> "/over-time-rate"
 *  "calculators/-foo"    -> "/calculators-foo"  (won't emit leading '-')
 */
export const createPageUrl = (pageName) => {
  if (!pageName || typeof pageName !== 'string') return '/';

  const trimmed = pageName.trim();
  if (trimmed === 'Home' || trimmed === 'HomePage') return '/';

  const slug = trimmed
    // Insert hyphen between lower/number -> Upper, and before Upper that follows Upper (UK -> u-k)
    .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2')
    .toLowerCase()
    // Replace any non-url-safe chars with hyphens
    .replace(/[^a-z0-9-]+/g, '-')
    // Collapse multiple hyphens
    .replace(/-+/g, '-')
    // Trim leading/trailing hyphens
    .replace(/^-+/, '')
    .replace(/-+$/, '');

  return `/${slug}`;
};
