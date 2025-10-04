import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import RelatedCalculators from '../components/calculators/RelatedCalculators';

import Heading from '@/components/common/Heading';
export default function TaxAndNICalculator() {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const breadcrumbJson = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${origin}/` },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Tax Calculators Hub',
        item: `${origin}/TaxCalculatorsUK`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Tax + NI Calculator',
        item: `${origin}/TaxAndNICalculator`,
      },
    ],
  };
  const faqs = [
    {
      question: 'Does this include both Income Tax and NI?',
      answer: 'Yes, it provides a combined estimate for 2025/26.',
    },
  ];
  const faqJson = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };

  return (
    <>
      <script type="application/ld+json">{JSON.stringify(breadcrumbJson)}</script>
      <script type="application/ld+json">{JSON.stringify(faqJson)}</script>

      <div className="bg-white">
        <div className="bg-gray-50 border-b border-gray-200 text-center py-10">
          <Heading as="h1" size="h1" weight="bold" className="text-gray-900">Tax + NI Calculator UK</Heading>
          <p className="text-gray-600 mt-2">
            Calculate combined UK Income Tax and National Insurance.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <Link
              to={createPageUrl('TaxCalculatorsUK')}
              className="px-4 py-2 rounded-md border border-blue-200 text-blue-700 bg-white hover:bg-blue-50"
            >
              Tax Hub
            </Link>
            <Link
              to={createPageUrl('TaxAfterTaxCalculator')}
              className="px-4 py-2 rounded-md border border-blue-200 text-blue-700 bg-white hover:bg-blue-50"
            >
              Tax After Tax
            </Link>
            <Link
              to={createPageUrl('NetIncomeUKCalculator')}
              className="px-4 py-2 rounded-md border border-blue-200 text-blue-700 bg-white hover:bg-blue-50"
            >
              Net Income
            </Link>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="p-6 bg-gray-50 border rounded">
            <p className="text-gray-700">
              Calculator coming soon. Try our National Insurance Calculator for detailed NI
              breakdowns.
            </p>
          </div>

          <div className="mt-12">
            <RelatedCalculators
              calculators={[
                {
                  name: 'Back to Tax Calculators Hub',
                  url: createPageUrl('TaxCalculatorsUK'),
                  description: 'Explore all UK tax tools.',
                },
                {
                  name: 'Tax After Tax Calculator',
                  url: createPageUrl('TaxAfterTaxCalculator'),
                  description: 'Band-by-band tax.',
                },
                {
                  name: 'Net Income Calculator',
                  url: createPageUrl('NetIncomeUKCalculator'),
                  description: 'Estimate take-home pay.',
                },
              ]}
            />
          </div>
        </div>
      </div>
    </>
  );
}
