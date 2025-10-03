import { useMemo } from 'react';
import buildBreadcrumbs from './buildBreadcrumbs';
import buildFaqJsonLd from './buildFaqJsonLd';
import { calculatorCategories } from '../data/calculatorConfig';
import { createPageUrl } from '@/utils/createPageUrl';

const DEFAULT_ORIGIN = 'https://www.calcmymoney.co.uk';

function normalizeOrigin(origin) {
  if (!origin) return DEFAULT_ORIGIN;
  return String(origin).replace(/\/+$, '');
}

function resolveOrigin(originOverride) {
  if (originOverride) return originOverride;
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }
  return DEFAULT_ORIGIN;
}

function toSlug(value) {
  if (!value || typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith('/')) return trimmed.replace(/^\/+/, '');
  if (trimmed.includes('-')) return trimmed.replace(/^\/+/, '');
  return createPageUrl(trimmed).replace(/^\/+/, '');
}

function toPageKey(value) {
  if (!value || typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed ? trimmed.toLowerCase() : null;
}

const calculatorEntries = calculatorCategories.flatMap((category) =>
  (category?.subCategories || []).flatMap((subCategory) =>
    (subCategory?.calculators || []).map((calculator) => {
      const slug = calculator?.url ? calculator.url.replace(/^\/+/, '') : null;
      const pageName = calculator?.page ? String(calculator.page).trim() : null;
      const pageSlug = pageName ? toSlug(pageName) : null;
      return {
        slug,
        pageSlug,
        pageKey: pageName ? toPageKey(pageName) : null,
        calculator,
        category,
        subCategory,
      };
    })
  )
);

function findCalculator({ slug, pageKey }) {
  if (!slug && !pageKey) return null;
  return (
    calculatorEntries.find((entry) => {
      if (slug) {
        if (entry.slug === slug) return true;
        if (entry.pageSlug && entry.pageSlug === slug) return true;
      }
      if (pageKey && entry.pageKey === pageKey) return true;
      return false;
    }) || null
  );
}

export default function useCalculatorSchema(identifier, options = {}) {
  const { origin: originOverride, slug: slugOverride, page } = options;

  const resolvedSlug = useMemo(() => {
    if (slugOverride) return toSlug(slugOverride);
    if (identifier) return toSlug(identifier);
    if (page) return toSlug(page);
    return null;
  }, [identifier, page, slugOverride]);

  const resolvedPageKey = useMemo(() => {
    const candidate = page || (typeof identifier === 'string' ? identifier : null);
    return toPageKey(candidate);
  }, [identifier, page]);

  const entry = useMemo(() => findCalculator({ slug: resolvedSlug, pageKey: resolvedPageKey }), [resolvedSlug, resolvedPageKey]);

  const origin = useMemo(() => normalizeOrigin(resolveOrigin(originOverride)), [originOverride]);

  return useMemo(() => {
    if (!entry) {
      return {
        breadcrumbJsonLd: null,
        faqJsonLd: null,
        schemaNodes: [],
        calculator: null,
        category: null,
        subCategory: null,
      };
    }

    const calculator = entry.calculator || {};
    const category = entry.category || {};
    const subCategory = entry.subCategory || {};

    const calculatorUrlPath = calculator.url || (entry.slug ? `/${entry.slug}` : null);
    const calculatorUrl = calculatorUrlPath ? `${origin}${calculatorUrlPath}` : null;

    const homeUrl = `${origin}${createPageUrl('Home')}`;
    const breadcrumbItems = [
      { name: 'Home', url: homeUrl },
    ];

    if (category?.name) {
      const categoryUrl = category.slug ? `${homeUrl}#${category.slug}` : homeUrl;
      breadcrumbItems.push({ name: category.name, url: categoryUrl });
    }

    if (calculator?.name && calculatorUrl) {
      breadcrumbItems.push({ name: calculator.name, url: calculatorUrl });
    }

    const breadcrumbJsonLd = buildBreadcrumbs(breadcrumbItems);
    const faqJsonLd = buildFaqJsonLd(Array.isArray(calculator?.faq) ? calculator.faq : []);

    const schemaNodes = [breadcrumbJsonLd, faqJsonLd].filter(Boolean);

    return {
      breadcrumbJsonLd,
      faqJsonLd,
      schemaNodes,
      calculator,
      category,
      subCategory,
    };
  }, [entry, origin]);
}
