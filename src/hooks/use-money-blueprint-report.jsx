import * as React from 'react';

import { callMoneyBlueprintAI } from '@/api/moneyBlueprint';
import { buildMoneyBlueprintPrompt } from '@/lib/moneyBlueprint/prompt';

const globalCacheStore = new Map();

const defaultCacheKey = (promptPayload) => {
  if (!promptPayload) return null;
  if (typeof promptPayload === 'string') return promptPayload;
  if (promptPayload.reportId) return `report:${promptPayload.reportId}`;
  if (promptPayload.fingerprint) return promptPayload.fingerprint;
  return null;
};

const useIsDev = () => {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return Boolean(import.meta.env.DEV);
  }
  if (typeof process !== 'undefined' && process.env) {
    return process.env.NODE_ENV === 'development';
  }
  return false;
};

export function useMoneyBlueprintReport(options = {}) {
  const {
    provider,
    endpoint,
    tone: toneOption,
    systemInstructions,
    cache = globalCacheStore,
    getCacheKey,
  } = options ?? {};

  const isDev = useIsDev();
  const cacheRef = React.useRef(cache instanceof Map ? cache : new Map());
  const [state, setState] = React.useState({ status: 'idle', data: null, error: null });
  const mountedRef = React.useRef(true);

  React.useEffect(() => () => {
    mountedRef.current = false;
  }, []);

  const setStateSafe = React.useCallback((updater) => {
    if (!mountedRef.current) return;
    setState((prev) => (typeof updater === 'function' ? updater(prev) : updater));
  }, []);

  const resolveCacheKey = React.useCallback(
    (payload) => {
      if (typeof payload === 'string') return payload;

      if (typeof getCacheKey === 'function') {
        try {
          const result = getCacheKey(payload);
          if (result) return result;
        } catch (error) {
          if (isDev && typeof console !== 'undefined') {
            console.warn('useMoneyBlueprintReport: getCacheKey threw an error', error);
          }
        }
      }

      return defaultCacheKey(payload);
    },
    [getCacheKey, isDev]
  );

  const getCacheStore = React.useCallback(() => {
    if (!(cacheRef.current instanceof Map)) {
      cacheRef.current = new Map();
    }
    return cacheRef.current;
  }, []);

  const reset = React.useCallback(() => {
    setStateSafe({ status: 'idle', data: null, error: null });
  }, [setStateSafe]);

  const clearCache = React.useCallback(() => {
    const store = getCacheStore();
    store.clear();
  }, [getCacheStore]);

  const removeFromCache = React.useCallback(
    (identifier) => {
      const store = getCacheStore();
      const key = resolveCacheKey(identifier);
      if (key) {
        store.delete(key);
      }
    },
    [getCacheStore, resolveCacheKey]
  );

  const getCachedReport = React.useCallback(
    (identifier) => {
      const store = getCacheStore();
      const key = resolveCacheKey(identifier);
      if (!key) return null;
      return store.get(key) ?? null;
    },
    [getCacheStore, resolveCacheKey]
  );

  const hasCachedReport = React.useCallback(
    (identifier) => getCachedReport(identifier) != null,
    [getCachedReport]
  );

  const generateReport = React.useCallback(
    async ({
      wizardData,
      reportId,
      tone = toneOption,
      systemInstructions: overrideInstructions,
      forceRefresh = false,
      signal,
    } = {}) => {
      if (!wizardData) {
        throw new Error('Wizard data is required to request a Money Blueprint report.');
      }

      const promptPayload = buildMoneyBlueprintPrompt({
        wizardData,
        reportId,
        tone,
        systemInstructions: overrideInstructions ?? systemInstructions,
      });

      const cacheKey = resolveCacheKey(promptPayload);
      const store = getCacheStore();

      if (!forceRefresh && cacheKey && store.has(cacheKey)) {
        const cached = store.get(cacheKey);
        setStateSafe({ status: 'success', data: cached, error: null });
        return cached;
      }

      setStateSafe((prev) => ({ status: 'loading', data: forceRefresh ? null : prev.data, error: null }));

      try {
        const response = await callMoneyBlueprintAI({
          prompt: promptPayload,
          provider,
          endpoint,
          signal,
        });

        const payload = { ...response, prompt: promptPayload };
        if (cacheKey) {
          store.set(cacheKey, payload);
        }
        setStateSafe({ status: 'success', data: payload, error: null });
        return payload;
      } catch (error) {
        setStateSafe((prev) => ({ status: 'error', data: prev.data, error }));
        throw error;
      }
    },
    [endpoint, getCacheStore, provider, resolveCacheKey, setStateSafe, systemInstructions, toneOption]
  );

  return {
    status: state.status,
    data: state.data,
    error: state.error,
    isIdle: state.status === 'idle',
    isLoading: state.status === 'loading',
    isSuccess: state.status === 'success',
    isError: state.status === 'error',
    generateReport,
    reset,
    clearCache,
    removeFromCache,
    getCachedReport,
    hasCachedReport,
  };
}

