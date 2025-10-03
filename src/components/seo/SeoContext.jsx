import React, { createContext, useContext } from 'react';

const loggedWarnings = new Set();

const warnMissingProvider = (methodName = 'useSeo') => {
  if (loggedWarnings.has(methodName)) {
    return;
  }

  loggedWarnings.add(methodName);

  if (typeof console !== 'undefined' && typeof console.warn === 'function') {
    console.warn(
      `[SeoContext] ${methodName} called before <SeoProvider> was initialised. Returning safe no-op defaults.`,
    );
  }
};

const defaultContextValue = {
  seo: {},
  defaults: {},
  overrides: {},
  setSeo: (...args) => {
    warnMissingProvider('setSeo');
    return args?.[0];
  },
  resetSeo: () => {
    warnMissingProvider('resetSeo');
  },
};

const SeoContext = createContext(defaultContextValue);

export function SeoProvider({ value, children }) {
  return <SeoContext.Provider value={value}>{children}</SeoContext.Provider>;
}

export function useSeo() {
  const context = useContext(SeoContext);

  if (!context || context === defaultContextValue) {
    warnMissingProvider('useSeo');
    return defaultContextValue;
  }

  return context;
}

export default SeoContext;
