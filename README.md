# Base44 App

This app was created automatically by Base44.
It's a Vite+React app that communicates with the Base44 API.

## Running the app

```bash
npm install
npm run dev
```

## Building the app

```bash
npm run build
```

## UK Financial Stats data sources

The `/api/uk-financial-stats` endpoint aggregates publicly available statistics from:

- Bank of England Bank Rate time-series (`IUMABEDR`) via the `_iadb-download.aspx` CSV export.
- Office for National Statistics CPIH time series (`L55O`, dataset `mm23`).
- HM Land Registry UK House Price Index API (nationwide average price series).
- Ofgem default tariff price cap dataset from their data portal.

These feeds are fetched directly from the respective providers and normalised before being displayed on the UK Financial Statistics dashboard.

The build pipeline now regenerates `public/sitemap.xml` on every run. The sitemap is assembled
from the calculator configuration, core page SEO metadata, and dynamic collections (job salaries
and cost-of-living pages). To update it without performing a full build, run:

```bash
npm run sitemap
```

By default the sitemap uses `https://www.calcmymoney.co.uk` as the canonical origin. Override this
by setting the `SITE_URL` environment variable when invoking the script (e.g.
`SITE_URL=https://staging.calcmymoney.co.uk npm run sitemap`).

For more information and support, please contact Base44 support at app@base44.com.
