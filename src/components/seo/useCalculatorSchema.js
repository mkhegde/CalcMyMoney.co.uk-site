import { useMemo } from 'react';
import buildBreadcrumbs from './buildBreadcrumbs';
import buildFaqJsonLd from './buildFaqJsonLd';

const DEFAULT_ORIGIN = 'https://www.calcmymoney.co.uk';

export function normalizeOrigin(origin, fallback = DEFAULT_ORIGIN) {
  const value = origin == null ? '' : String(origin).trim();
  if (!value) return fallback;

  const sanitized = value.replace(/\/+$/, '');
  return sanitized || fallback;
}

function normalizePath(path = '/') {
  const value = path == null ? '' : String(path).trim();
  if (!value) return '/';

  const prefixed = value.startsWith('/') ? value : `/${value}`;
  let normalised = prefixed.replace(/\/+$/, '');
  if (!normalised) return '/';

  if (normalised === '/calculators') {
    return '/';
  }

  if (normalised.startsWith('/calculators/')) {
    normalised = normalised.replace(/^\/calculators/, '') || '/';
  }

  return normalised || '/';
}

function toAbsoluteUrl(origin, candidate) {
  if (!candidate) return null;
  const value = String(candidate).trim();
  if (!value) return null;

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  const path = normalizePath(value);
  if (path === '/') {
    return `${origin}/`;
  }

  return `${origin}${path}`;
}

export default function useCalculatorSchema({
  origin,
  path = '/',
  name,
  description,
  breadcrumbs = [],
  faq = [],
  additionalSchemas = [],
} = {}) {
  return useMemo(() => {
    const normalisedOrigin = normalizeOrigin(origin);
    const normalisedPath = normalizePath(path);
    const url = normalisedPath === '/' ? `${normalisedOrigin}/` : `${normalisedOrigin}${normalisedPath}`;

    const schemas = [];

    if (name || description) {
      const webPageSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        url,
      };

      if (name) {
        webPageSchema.name = String(name);
      }

      if (description) {
        webPageSchema.description = String(description);
      }

      schemas.push(webPageSchema);
    }

    const breadcrumbSchema = buildBreadcrumbs(
      (Array.isArray(breadcrumbs) ? breadcrumbs : [])
        .map((item) => {
          if (!item) return null;
          const label = item.name ?? item.label ?? item.title;
          const absoluteUrl = toAbsoluteUrl(
            normalisedOrigin,
            item.url ?? item.path ?? item.href
          );

          if (!label || !absoluteUrl) return null;

          return {
            name: String(label),
            url: absoluteUrl,
          };
        })
        .filter(Boolean)
    );

    if (breadcrumbSchema) {
      schemas.push(breadcrumbSchema);
    }

    const faqSchema = buildFaqJsonLd(Array.isArray(faq) ? faq : []);
    if (faqSchema) {
      schemas.push(faqSchema);
    }

    if (Array.isArray(additionalSchemas)) {
      for (const schema of additionalSchemas) {
        if (schema) {
          schemas.push(schema);
        }
      }
    }

    return schemas;
  }, [origin, path, name, description, breadcrumbs, faq, additionalSchemas]);
}
