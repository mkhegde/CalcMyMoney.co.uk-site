export function createCalculatorWebPageSchema({ name, description, url, keywords = [] }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name,
    url,
    description,
    keywords: Array.isArray(keywords) ? keywords.slice(0, 12) : [],
    inLanguage: 'en-GB',
    isPartOf: {
      '@type': 'WebSite',
      name: 'Calc My Money',
      url: 'https://www.calcmymoney.co.uk',
    },
  };
}

export function createCalculatorBreadcrumbs({ name, url }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.calcmymoney.co.uk/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Calculators',
        item: 'https://www.calcmymoney.co.uk/#calculator-directory',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name,
        item: url,
      },
    ],
  };
}
