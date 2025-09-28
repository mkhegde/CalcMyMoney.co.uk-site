// absolute path glob is safest in Vite
const modules = import.meta.glob('/src/pages/*.jsx');

export const prefetchPage = (pageName) => {
  const key = `/src/pages/${pageName}.jsx`;
  const loader = modules[key];
  if (loader) loader(); // start downloading the chunk
};
