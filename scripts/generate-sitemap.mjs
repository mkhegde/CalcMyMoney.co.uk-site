#!/usr/bin/env node
import { createServer } from 'vite';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { promises as fs } from 'node:fs';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');
const outputPath = join(rootDir, 'public', 'sitemap.xml');
const defaultBaseUrl = 'https://www.calcmymoney.co.uk';
const rawBaseUrl = process.env.SITE_URL || defaultBaseUrl;
const baseUrl = rawBaseUrl.replace(/\/+$/, '');
const defaultLastmod = new Date().toISOString();

const server = await createServer({
  root: rootDir,
  logLevel: 'error',
  server: { middlewareMode: true },
  appType: 'custom',
  optimizeDeps: { disabled: true },
  ssr: {
    noExternal: ['react-router-dom'],
  },
});

async function pathExists(path) {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
}

function normalisePath(path) {
  if (!path) return '/';
  const prefixed = path.startsWith('/') ? path : `/${path}`;
  if (prefixed === '/') return '/';
  return prefixed.replace(/\/+$/, '');
}

function escapeXml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

async function getLastModified(pageName, fallbackFiles = []) {
  const candidateFiles = [];
  if (pageName) {
    const pagesDir = resolve(rootDir, 'src', 'pages');
    candidateFiles.push(resolve(pagesDir, `${pageName}.jsx`));
    candidateFiles.push(resolve(pagesDir, `${pageName}.js`));
    candidateFiles.push(resolve(pagesDir, pageName, 'index.jsx'));
    candidateFiles.push(resolve(pagesDir, pageName, 'index.js'));
  }

  for (const rel of fallbackFiles) {
    candidateFiles.push(resolve(rootDir, rel));
  }

  const seen = new Set();
  for (const candidate of candidateFiles) {
    if (seen.has(candidate)) continue;
    seen.add(candidate);
    if (!(await pathExists(candidate))) continue;

    try {
      const { stdout } = await execFileAsync('git', ['log', '-1', '--format=%cI', candidate], {
        cwd: rootDir,
      });
      const stamped = stdout.trim();
      if (stamped) {
        return stamped;
      }
    } catch {
      // ignore git errors and try next candidate
    }
  }

  return defaultLastmod;
}

try {
  const calculatorModule = await server.ssrLoadModule('/src/components/data/calculatorConfig.jsx');
  const { allCalculators = [] } = calculatorModule;
  const { pageSeo = {} } = await server.ssrLoadModule('/src/components/data/pageSeo.js');
  const seoDataModule = await server.ssrLoadModule('/src/components/data/seo-data.jsx');
  const { jobTitles = [], ukCities = [], createSlug = (value = '') => value } = seoDataModule;
  const { createPageUrl } = await server.ssrLoadModule('/src/utils/createPageUrl.js');

  const pagePathMap = new Map();
  for (const [pageName, meta] of Object.entries(pageSeo)) {
    const path = normalisePath(createPageUrl(pageName));
    const robots = String(meta?.robots || '').toLowerCase();
    if (robots.includes('noindex')) continue;
    pagePathMap.set(path, pageName);
  }

  const entries = new Map();

  async function addEntry(path, { pageName, fallbackFiles = [] } = {}) {
    const normalised = normalisePath(path);
    if (!normalised) return;

    const loc = normalised === '/' ? `${baseUrl}/` : `${baseUrl}${normalised}`;
    if (entries.has(loc)) return;

    const lastmod = await getLastModified(pageName, fallbackFiles);
    entries.set(loc, { loc, lastmod });
  }

  // Page SEO-driven routes (ensures core content is included)
  for (const [path, pageName] of pagePathMap.entries()) {
    await addEntry(path, { pageName });
  }

  // Active calculators from the central config
  const activeCalculators = allCalculators.filter((calc) => calc?.status === 'active' && calc?.url);
  for (const calc of activeCalculators) {
    const path = normalisePath(calc.url);
    const pageName = calc.page || pagePathMap.get(path);
    await addEntry(path, {
      pageName,
      fallbackFiles: ['src/components/data/calculatorConfig.jsx'],
    });
  }

  // Job salary explorer (hub + individual roles)
  const jobBasePath = normalisePath(createPageUrl('JobSalaries'));
  const jobPageName = pagePathMap.get(jobBasePath) || 'JobSalaries';
  await addEntry(jobBasePath, { pageName: jobPageName });

  for (const job of jobTitles) {
    const slug = createSlug(job?.title ?? '').trim();
    if (!slug) continue;
    await addEntry(`${jobBasePath}/${slug}`, {
      pageName: 'JobSalaryPage',
      fallbackFiles: ['src/components/data/seo-data.jsx'],
    });
  }

  // Cost of living explorer (hub + individual city pages)
  const costBasePath = normalisePath(createPageUrl('CostOfLiving'));
  const costPageName = pagePathMap.get(costBasePath) || 'CostOfLiving';
  await addEntry(costBasePath, { pageName: costPageName });

  for (const city of ukCities) {
    const slug = createSlug(city?.name ?? '').trim();
    if (!slug) continue;
    await addEntry(`${costBasePath}/${slug}`, {
      pageName: 'CostOfLivingPage',
      fallbackFiles: ['src/components/data/seo-data.jsx'],
    });
  }

  const sortedEntries = Array.from(entries.values()).sort((a, b) => a.loc.localeCompare(b.loc));
  const xmlLines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...sortedEntries.map(({ loc, lastmod }) => `  <url>\n    <loc>${escapeXml(loc)}</loc>\n    <lastmod>${escapeXml(lastmod)}</lastmod>\n  </url>`),
    '</urlset>',
    '',
  ];

  await fs.mkdir(join(rootDir, 'public'), { recursive: true });
  await fs.writeFile(outputPath, xmlLines.join('\n'), 'utf8');
  console.log(`Generated sitemap with ${sortedEntries.length} entries → ${outputPath}`);
} catch (error) {
  console.error('Failed to generate sitemap:', error);
  process.exitCode = 1;
} finally {
  await server.close();
}
