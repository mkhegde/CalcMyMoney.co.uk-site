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
