// src/utils/prefetchPage.js
const modules = import.meta.glob('/src/pages/*.jsx'); // absolute path

export const prefetchPage = (pageName) => {
  const key = `/src/pages/${pageName}.jsx`;
  const loader = modules[key];
  if (loader) loader(); // kick off download
};
