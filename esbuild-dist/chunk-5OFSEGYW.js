// src/utils/index.ts
function createPageUrl(pageName) {
  return "/" + pageName.replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/([A-Z])([A-Z][a-z])/g, "$1-$2").replace(/\s+/g, "-").toLowerCase();
}

export {
  createPageUrl
};
