// src/utils/createPageUrl.js
var createPageUrl = (pageName) => {
  if (!pageName || typeof pageName !== "string") return "/";
  const trimmed = pageName.trim();
  if (/^home(page)?$/i.test(trimmed)) return "/";
  const slug = trimmed.replace(/[_\s/]+/g, "-").replace(/([a-z\d])([A-Z])/g, "$1-$2").replace(/([A-Z]+)([A-Z][a-z\d]+)/g, "$1-$2").toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/-+/g, "-").replace(/^-+|-+$/g, "");
  return `/${slug}`;
};

export {
  createPageUrl
};
