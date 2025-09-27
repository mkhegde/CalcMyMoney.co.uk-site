import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import RelatedCalculators from '../components/calculators/RelatedCalculators';

export default function TaxAfterTaxCalculator() {
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
        name: 'Tax After Tax Calculator',
        item: `${origin}/TaxAfterTaxCalculator`,
      },
    ],
  };
  const faqs = [
    {
      question: 'What tax year is used?',
      answer: '2025/26 by default; updated when HMRC changes are published.',
    },
    {
      question: 'Does it include Scottish bands?',
      answer: 'Yes, where applicable the calculator supports Scottish tax bands.',
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
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Tax After Tax Calculator UK
          </h1>
          <p className="text-gray-600 mt-2">Work out your UK tax after tax for 2025/26.</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <Link
              to={createPageUrl('TaxCalculatorsUK')}
              className="px-4 py-2 rounded-md border border-blue-200 text-blue-700 bg-white hover:bg-blue-50"
            >
              Tax Hub
            </Link>
            <Link
              to={createPageUrl('TaxAndNICalculator')}
              className="px-4 py-2 rounded-md border border-blue-200 text-blue-700 bg-white hover:bg-blue-50"
            >
              Tax + NI Calculator
            </Link>
            <Link
              to={createPageUrl('NetIncomeUKCalculator')}
              className="px-4 py-2 rounded-md border border-blue-200 text-blue-700 bg-white hover:bg-blue-50"
            >
              Net Income Calculator
            </Link>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="p-6 bg-gray-50 border rounded">
            <p className="text-gray-700">
              Calculator coming soon. In the meantime, visit our Income Tax Calculator for a
              detailed breakdown.
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
                  name: 'Tax + NI Calculator (combined)',
                  url: createPageUrl('TaxAndNICalculator'),
                  description: 'See combined deductions.',
                },
                {
                  name: 'Net Income (after tax & NI)',
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
