/* eslint-env node */

/**
 * Build an array of schema.org Dataset JSON-LD objects for available stats.
 * @param {object} params
 * @param {string} params.origin - e.g. https://www.calcmymoney.co.uk
 * @param {string} params.canonical - canonical URL of the stats page
 * @param {object} params.stats - the stats object from the API (bankRate, cpih, housePrice, ofgemCap)
 * @returns {Array<object>}
 */
export default function buildDatasetsJsonLd({ origin, canonical, stats }) {
  const out = [];
  if (!stats || typeof stats !== 'object') return out;

  const add = (obj) => out.push(obj);
  const isoOrNull = (v) => (v && !Number.isNaN(new Date(v).getTime()) ? v : null);

  // Bank Rate
  if (stats.bankRate && typeof stats.bankRate.value === 'number') {
    const s = stats.bankRate;
    add({
      '@context': 'https://schema.org',
      '@type': 'Dataset',
      name: 'Bank of England – Official Bank Rate',
      description:
        'Monthly policy interest rate (Bank Rate) set by the Monetary Policy Committee of the Bank of England.',
      inLanguage: 'en-GB',
      isAccessibleForFree: true,
      keywords: ['Bank Rate', 'BoE', 'interest rate', 'UK monetary policy'],
      url: canonical,
      sameAs: ['https://www.bankofengland.co.uk/boeapps/database/Bank-Rate.asp'],
      creator: {
        '@type': 'Organization',
        name: 'Bank of England',
        url: 'https://www.bankofengland.co.uk/',
      },
      temporalCoverage: isoOrNull(s?.period?.start) || undefined,
      variableMeasured: {
        '@type': 'PropertyValue',
        name: 'Official Bank Rate',
        unitText: 'PERCENT',
        value: s.value,
      },
      distribution: {
        '@type': 'DataDownload',
        encodingFormat: 'application/json',
        contentUrl: `${origin}/api/boe/bank-rate`,
      },
    });
  }

  // CPIH
  if (stats.cpih && typeof stats.cpih.value === 'number') {
    const s = stats.cpih;
    add({
      '@context': 'https://schema.org',
      '@type': 'Dataset',
      name: 'ONS – CPIH 12-month inflation rate',
      description:
        'UK CPIH 12-month inflation rate published by the Office for National Statistics.',
      inLanguage: 'en-GB',
      isAccessibleForFree: true,
      keywords: ['inflation', 'CPIH', 'ONS', 'price indices', 'UK'],
      url: canonical,
      sameAs: ['https://www.ons.gov.uk/economy/inflationandpriceindices'],
      creator: {
        '@type': 'Organization',
        name: 'Office for National Statistics',
        url: 'https://www.ons.gov.uk/',
      },
      temporalCoverage: isoOrNull(s?.period?.start) || undefined,
      variableMeasured: {
        '@type': 'PropertyValue',
        name: 'CPIH 12-month rate',
        unitText: 'PERCENT',
        value: s.value,
      },
      distribution: {
        '@type': 'DataDownload',
        encodingFormat: 'application/json',
        contentUrl: `${origin}/api/ons/cpih`,
      },
    });
  }

  // UK HPI – Average price
  if (stats.housePrice && typeof stats.housePrice.value === 'number') {
    const s = stats.housePrice;
    add({
      '@context': 'https://schema.org',
      '@type': 'Dataset',
      name: 'UK House Price Index – Average UK House Price',
      description:
        'Average UK house price from the UK House Price Index (HPI).',
      inLanguage: 'en-GB',
      isAccessibleForFree: true,
      keywords: ['UK HPI', 'house prices', 'property', 'ONS', 'Land Registry'],
      url: canonical,
      sameAs: ['https://landregistry.data.gov.uk/app/hpi/'],
      creator: {
        '@type': 'Organization',
        name: 'HM Land Registry & ONS',
        url: 'https://landregistry.data.gov.uk/',
      },
      temporalCoverage: isoOrNull(s?.period?.start) || undefined,
      variableMeasured: {
        '@type': 'PropertyValue',
        name: 'Average UK House Price',
        unitText: 'GBP',
        value: s.value,
      },
      distribution: {
        '@type': 'DataDownload',
        encodingFormat: 'application/json',
        contentUrl: `${origin}/api/ukhpi/average-price`,
      },
    });
  }

  // Ofgem price cap
  if (stats.ofgemCap && typeof stats.ofgemCap.value === 'number') {
    const s = stats.ofgemCap;
    add({
      '@context': 'https://schema.org',
      '@type': 'Dataset',
      name: 'Ofgem – Energy Price Cap (typical household)',
      description:
        'Typical annualised energy price cap for a dual-fuel household on standard variable tariff.',
      inLanguage: 'en-GB',
      isAccessibleForFree: true,
      keywords: ['Ofgem', 'energy price cap', 'gas', 'electricity', 'UK energy'],
      url: canonical,
      sameAs: ['https://www.ofgem.gov.uk/energy-price-cap'],
      creator: {
        '@type': 'Organization',
        name: 'Ofgem',
        url: 'https://www.ofgem.gov.uk/',
      },
      temporalCoverage: isoOrNull(s?.period?.start) || undefined,
      variableMeasured: {
        '@type': 'PropertyValue',
        name: 'Energy Price Cap (typical annualised)',
        unitText: 'GBP',
        value: s.value,
      },
      distribution: {
        '@type': 'DataDownload',
        encodingFormat: 'application/json',
        contentUrl: `${origin}/api/ofgem/price-cap`,
      },
    });
  }

  return out;
}

