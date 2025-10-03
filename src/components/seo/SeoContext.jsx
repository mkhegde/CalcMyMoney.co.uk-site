import React, { createContext, useContext } from 'react';

const defaultContextValue = {
  seo: {},
  defaults: {},
  overrides: {},
  setSeo: () => {
    throw new Error('setSeo called outside of SeoProvider');
  },
  resetSeo: () => {
    throw new Error('resetSeo called outside of SeoProvider');
  },
};

const SeoContext = createContext(defaultContextValue);

export function SeoProvider({ value, children }) {
  return <SeoContext.Provider value={value}>{children}</SeoContext.Provider>;
}

export function useSeo() {
  const context = useContext(SeoContext);
  if (!context || context === defaultContextValue) {
    throw new Error('useSeo must be used within a SeoProvider');
  }
  return context;
}

export default SeoContext;
