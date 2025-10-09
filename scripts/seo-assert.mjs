#!/usr/bin/env node
import { promises as fs } from 'node:fs';
import path from 'node:path';

const cwd = process.cwd();
const distDir = path.join(cwd, 'dist');
const publicSitemap = path.join(cwd, 'public', 'sitemap.xml');
const distSitemap = path.join(distDir, 'sitemap.xml');

const useColor = process.stdout && process.stdout.isTTY;
const red = (s) => (useColor ? `\x1b[31m${s}\x1b[0m` : s);
const green = (s) => (useColor ? `\x1b[32m${s}\x1b[0m` : s);
const yellow = (s) => (useColor ? `\x1b[33m${s}\x1b[0m` : s);

async function exists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function listHtml(dir, out = []) {
  let entries = [];
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const ent of entries) {
    const abs = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (abs.includes(`${path.sep}assets${path.sep}`)) continue; // ignore assets
      await listHtml(abs, out);
    } else if (ent.isFile() && ent.name.toLowerCase().endsWith('.html')) {
      out.push(abs);
    }
  }
  return out;
}

function extractCanonicals(html) {
  const tags = [];
  const linkRe = /<link\s+[^>]*rel=["']canonical["'][^>]*>/gi;
  let m;
  while ((m = linkRe.exec(html))) {
    tags.push(m[0]);
  }
  const hrefs = tags
    .map((t) => {
      const hrefM = t.match(/href=["']([^"']+)["']/i);
      return hrefM ? hrefM[1] : null;
    })
    .filter(Boolean);
  return hrefs;
}

function checkCanonical(url, file) {
  const issues = [];
  if (!/^https?:\/\//i.test(url)) issues.push(`canonical not absolute: ${url}`);
  if (!/^https:\/\//i.test(url)) issues.push(`canonical not https: ${url}`);
  if (/[?#]/.test(url)) issues.push(`canonical has query/fragment: ${url}`);
  return issues.map((i) => `${file}: ${i}`);
}

function extractSitemapLocs(xml) {
  const locs = [];
  const re = /<loc>([^<]+)<\/loc>/gi;
  let m;
  while ((m = re.exec(xml))) {
    locs.push(m[1]);
  }
  return locs;
}

function checkSitemapLoc(loc, file) {
  const issues = [];
  if (/[?#]/.test(loc)) issues.push(`sitemap <loc> has query/fragment: ${loc}`);
  return issues.map((i) => `${file}: ${i}`);
}

async function main() {
  const errors = [];
  const warnings = [];

  // A1) HTML canonical checks
  const htmlFiles = await listHtml(distDir);
  for (const f of htmlFiles) {
    const html = await fs.readFile(f, 'utf8');
    const canonicals = extractCanonicals(html);
    const isIndex = path.basename(f).toLowerCase() === 'index.html';
    if (!canonicals.length) {
      if (isIndex) {
        errors.push(`${f}: missing <link rel="canonical">`);
      } else {
        warnings.push(`${f}: missing <link rel="canonical">`);
      }
      continue;
    }
    // Validate first canonical only (expected single)
    const issues = checkCanonical(canonicals[0], f);
    errors.push(...issues);
  }

  // A2) Sitemap checks (public and dist copies)
  for (const smPath of [publicSitemap, distSitemap]) {
    if (!(await exists(smPath))) continue;
    const xml = await fs.readFile(smPath, 'utf8');
    const locs = extractSitemapLocs(xml);
    for (const loc of locs) {
      errors.push(...checkSitemapLoc(loc, smPath));
    }
  }

  // Report
  if (warnings.length) {
    console.log(yellow(`SEO assertions: ${warnings.length} warning(s)`));
    warnings.slice(0, 10).forEach((w) => console.log(yellow(`  - ${w}`)));
    if (warnings.length > 10) console.log(yellow(`  ... ${warnings.length - 10} more`));
  }

  if (errors.length) {
    console.error(red(`SEO assertions FAILED: ${errors.length} error(s)`));
    errors.slice(0, 10).forEach((e) => console.error(red(`  - ${e}`)));
    if (errors.length > 10) console.error(red(`  ... ${errors.length - 10} more`));
    process.exit(1);
  }

  console.log(green('SEO assertions passed'));
}

main().catch((err) => {
  console.error(red('seo-assert: unexpected error'));
  console.error(err);
  process.exit(1);
});

