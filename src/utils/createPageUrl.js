/*
 * Central utility function to generate SEO-friendly, kebab-case URLs
 * from internal PascalCase page names (e.g., "OvertimeRateCalculator" -> "/overtime-rate-calculator").
 */
export const createPageUrl = (pageName) => {
  if (!pageName || typeof pageName !== 'string') {
    console.error('createPageUrl received invalid input:', pageName);
    return '/';
  }

  // Handle the Home page as a special case to ensure it resolves to the root path.
  if (pageName === 'Home' || pageName === 'HomePage') {
    return '/';
  }

  // 1. Insert a hyphen before every capital letter that follows a lowercase letter or number,
  //    or a capital letter that follows another capital letter (like in 'UK').
  const slug = pageName
    .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2')
    // 2. Convert the entire string to lowercase.
    .toLowerCase();

  return `/${slug}`;
};
