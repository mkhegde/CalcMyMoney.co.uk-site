import React from 'react';
import { Helmet } from 'react-helmet-async';
import Heading from '@/components/common/Heading';
import { JsonLd } from '@/components/seo/JsonLd';

const canonical = '/link-to-us';
const defaultOgImage = 'https://www.calcmymoney.co.uk/og-image.png';
const defaultRobots = 'index,follow,max-image-preview:large';
const defaultTwitterCard = 'summary_large_image';

export default function LinkToUs() {
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.calcmymoney.co.uk/' },
      { '@type': 'ListItem', position: 2, name: 'Resources', item: 'https://www.calcmymoney.co.uk/resources' },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Embed Our Calculators',
        item: 'https://www.calcmymoney.co.uk/link-to-us',
      },
    ],
  };

  const salaryIframe = `<iframe
  src="https://www.calcmymoney.co.uk/salary-calculator-uk?embed=1"
  width="100%" height="260" style="border:1px solid #e5e7eb;border-radius:12px"
  loading="lazy" title="UK Salary (Take-Home) Calculator"></iframe>
<p style=\"font-size:12px;color:#6b7280\">Powered by <a href=\"https://www.calcmymoney.co.uk/salary-calculator-uk\" rel=\"noopener\">CalcMyMoney</a></p>`;

  const mortgageIframe = `<iframe
  src="https://www.calcmymoney.co.uk/mortgage-calculator-uk?embed=1"
  width="100%" height="320" style="border:1px solid #e5e7eb;border-radius:12px"
  loading="lazy" title="Mortgage Repayment Calculator"></iframe>
<p style=\"font-size:12px;color:#6b7280\">Powered by <a href=\"https://www.calcmymoney.co.uk/mortgage-calculator-uk\" rel=\"noopener\">CalcMyMoney</a></p>`;

  const capIframe = `<iframe
  src="https://www.calcmymoney.co.uk/uk-financial-stats?embed=cap"
  width="100%" height="180" style="border:1px solid #e5e7eb;border-radius:12px"
  loading="lazy" title="Ofgem Energy Price Cap (typical)"></iframe>
<p style=\"font-size:12px;color:#6b7280\">Powered by <a href=\"https://www.calcmymoney.co.uk/uk-financial-stats\" rel=\"noopener\">CalcMyMoney</a></p>`;

  const scriptEmbed = `<!-- Beta: small, non‑blocking salary tile -->\n<div id=\"cmm-salary-tile\" data-salary=\"50000\"></div>\n<script async defer src=\"https://www.calcmymoney.co.uk/embed/salary-tile.js\"></script>`;

  return (
    <div className="bg-white dark:bg-gray-900">
      <Helmet>
        <title>Embed Our Calculators | CalcMyMoney</title>
        <meta
          name="description"
          content="Free, embeddable UK salary, mortgage and energy cap widgets with live data."
        />
        <meta name="robots" content={defaultRobots} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content="Embed Our Calculators | CalcMyMoney" />
        <meta
          property="og:description"
          content="Free, embeddable UK salary, mortgage and energy cap widgets with live data."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content={defaultOgImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content={defaultTwitterCard} />
        <meta name="twitter:title" content="Embed Our Calculators | CalcMyMoney" />
        <meta
          name="twitter:description"
          content="Free, embeddable UK salary, mortgage and energy cap widgets with live data."
        />
        <meta name="twitter:image" content={defaultOgImage} />
      </Helmet>
      <JsonLd data={breadcrumb} />

      <div className="bg-gray-50 dark:bg-gray-800/40 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <Heading as="h1" size="h1" weight="bold" className="text-gray-900 dark:text-gray-100 mb-2">
            Embed Our UK Money Calculators
          </Heading>
          <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Fast, free and kept up‑to‑date with the latest UK tax rules and official data. Copy a snippet
            below to embed a calculator on your website in minutes.
          </p>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Salary */}
        <section className="space-y-3">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-gray-100">
            Salary (Take‑Home) — iframe embed
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            A compact take‑home calculator ideal for job ads, career pages or finance guides.
          </p>
          <div className="p-4 bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-700 rounded-lg overflow-x-auto">
            <pre className="text-sm text-gray-800 dark:text-gray-200"><code>{salaryIframe}</code></pre>
          </div>
        </section>

        {/* Mortgage */}
        <section className="space-y-3">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-gray-100">
            Mortgage Payment — iframe embed
          </h2>
          <p className="text-gray-700 dark:text-gray-300">Great for property pages and remortgage guides.</p>
          <div className="p-4 bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-700 rounded-lg overflow-x-auto">
            <pre className="text-sm text-gray-800 dark:text-gray-200"><code>{mortgageIframe}</code></pre>
          </div>
        </section>

        {/* Energy cap */}
        <section className="space-y-3">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-gray-100">
            Energy Price Cap badge — iframe embed
          </h2>
          <p className="text-gray-700 dark:text-gray-300">Shows the current Ofgem typical‑use cap.</p>
          <div className="p-4 bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-700 rounded-lg overflow-x-auto">
            <pre className="text-sm text-gray-800 dark:text-gray-200"><code>{capIframe}</code></pre>
          </div>
        </section>

        {/* Script embed */}
        <section className="space-y-3">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-gray-100">
            (Beta) Script embed — salary tile
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            Non‑blocking script renders a small salary tile. Safe on HTTPS pages and mobile‑friendly.
          </p>
          <div className="p-4 bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-700 rounded-lg overflow-x-auto">
            <pre className="text-sm text-gray-800 dark:text-gray-200"><code>{scriptEmbed}</code></pre>
          </div>
        </section>

        {/* Helpful links & attribution */}
        <section className="space-y-3">
          <p className="text-gray-700 dark:text-gray-300">
            For context and live figures, see our{' '}
            <a href="/uk-financial-stats" className="text-blue-600 hover:underline">UK Financial Stats</a>{' '}
            hub. Popular calculators: {' '}
            <a href="/salary-calculator-uk" className="text-blue-600 hover:underline">Salary</a>,{' '}
            <a href="/paye-calculator" className="text-blue-600 hover:underline">PAYE</a>,{' '}
            <a href="/mortgage-calculator-uk" className="text-blue-600 hover:underline">Mortgage</a>,{' '}
            <a href="/budget-calculator" className="text-blue-600 hover:underline">Budget</a>.
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Attribution: Please include a visible link to{' '}
            <a href="https://www.calcmymoney.co.uk/" className="text-blue-600 hover:underline" rel="noopener">CalcMyMoney</a>.
          </p>
        </section>

        {/* Technical notes */}
        <section className="space-y-2">
          <h3 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-gray-100">Technical notes</h3>
          <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-1">
            <li>HTTPS sites only; mobile responsive iframes.</li>
            <li>No cookies or tracking; embeds are read‑only.</li>
            <li>Use <code>?embed=1</code> to load compact layouts where available.</li>
            <li>
              Questions? <a href="/contact" className="text-blue-600 hover:underline">Contact us</a> — we’re happy to help.
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
}
