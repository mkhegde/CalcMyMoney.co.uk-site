import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

import { calculatorCategories } from '../src/components/data/calculatorConfig.js';
import { createPageUrl } from '../src/utils/createPageUrl.js';
import { pageSeo } from '../src/components/data/pageSeo.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseUrl = 'https://www.calcmymoney.co.uk';
const nowIso = new Date().toISOString();

const urls = new Set();

const normalisePath = (input) => {
  if (!input) return null;
  let slug = String(input).trim();
  if (!slug) return null;
  if (!slug.startsWith('/')) {
    slug = `/${slug.replace(/^\/+/, '')}`;
  }
  slug = slug.replace(/\/+/g, '/');
  if (slug !== '/' && slug.endsWith('/')) {
    slug = slug.slice(0, -1);
  }
  return slug || '/';
};

const addPath = (slug) => {
  const normalised = normalisePath(slug);
  if (!normalised) return;
  if (normalised === '/') {
    urls.add(`${baseUrl}/`);
    return;
  }
  urls.add(`${baseUrl}${normalised}`);
};

// Static pages from pageSeo configuration
Object.keys(pageSeo).forEach((key) => {
  addPath(createPageUrl(key));
});

// Calculator pages from the master calculator config
calculatorCategories.forEach((category) => {
  (category?.calculators || []).forEach((calculator) => {
    addPath(calculator?.url || createPageUrl(calculator?.pageName));
  });
});

// Cost of living dynamic city pages from seo-data.jsx
try {
  const seoDataPath = path.resolve(__dirname, '../src/components/data/seo-data.jsx');
  const seoDataRaw = fs.readFileSync(seoDataPath, 'utf8');
  const transformed = seoDataRaw
    .replace(/export\s+const\s+([a-zA-Z0-9_]+)\s*=/g, 'globalThis.$1 =')
    .replace(/export\s+default[\s\S]*?;/g, '');
  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(transformed, sandbox);

  if (Array.isArray(sandbox.ukCities)) {
    const costOfLivingBase = normalisePath(createPageUrl('CostOfLiving'));
    const slugify =
      typeof sandbox.createSlug === 'function'
        ? sandbox.createSlug
        : (text) =>
            String(text)
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/^-+|-+$/g, '');

    sandbox.ukCities.forEach((city) => {
      const citySlug = slugify(city?.name || '');
      if (!citySlug) return;
      addPath(`${costOfLivingBase}/${citySlug}`);
    });
  }
} catch (error) {
  console.warn('Unable to include cost of living city pages in sitemap:', error);
}

const sortedUrls = Array.from(urls).sort((a, b) => a.localeCompare(b));

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...sortedUrls.map(
    (loc) => [
      '  <url>',
      `    <loc>${loc}</loc>`,
      `    <lastmod>${nowIso}</lastmod>`,
      '  </url>',
    ].join('\n')
  ),
  '</urlset>',
  '',
].join('\n');

const outputPath = path.resolve(__dirname, '../public/sitemap.xml');
fs.writeFileSync(outputPath, xml, 'utf8');
console.log(`Generated sitemap with ${sortedUrls.length} URLs at ${outputPath}`);
