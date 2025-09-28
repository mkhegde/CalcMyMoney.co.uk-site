// utils/createPageUrl.js (ensure file name & import casing match!)
export const createPageUrl = (pageName) => {
  if (!pageName || typeof pageName !== 'string') {
    if (import.meta?.env?.MODE !== 'production') {
      console.warn('createPageUrl received invalid input:', pageName);
    }
    return '/';
  }
  if (pageName === 'Home' || pageName === 'HomePage') return '/';

  let s = pageName.trim();

  // Normalize existing separators first (spaces, underscores, multiple hyphens)
  s = s.replace(/[^a-zA-Z0-9]+/g, '-');

  // Insert hyphen at acronym-to-word boundaries (ABCDef -> ABC-Def)
  s = s.replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2');

  // Insert hyphen at lower/number-to-upper boundaries (aB, 1B -> a-B/1-B)
  s = s.replace(/([a-z0-9])([A-Z])/g, '$1-$2');

  // Lowercase and clean up
  s = s.toLowerCase().replace(/-{2,}/g, '-').replace(/^-|-$/g, '');

  return `/${s}`;
};
