export function createPageUrl(pageName: string) {
  return (
    '/' +
    pageName
      // Insert hyphens before uppercase characters that follow lowercase or numbers
      .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
      // Handle sequences of uppercase letters before a lowercase letter
      .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
      // Replace any remaining spaces with hyphens
      .replace(/\s+/g, '-')
      .toLowerCase()
  );
}
