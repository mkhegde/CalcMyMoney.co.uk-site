import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import RelatedCalculators from '../components/calculators/RelatedCalculators';
import Heading from '@/components/common/Heading';

export default function MortgageComparison() {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const breadcrumbJson = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${origin}/` },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Mortgage Calculators Hub',
        item: `${origin}/MortgageCalculatorUK`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Mortgage Comparison',
        item: `${origin}/MortgageComparison`,
      },
    ],
  };
  const faqs = [
    {
      question: 'What can I compare?',
      answer: 'Compare rate, term, fees and total repayable between two mortgage offers.',
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
          <Heading as="h1" size="h1" weight="bold" className="text-gray-900">
            Mortgage Comparison Calculator
          </Heading>
          <p className="text-gray-600 mt-2">Compare two mortgage deals and see the total cost.</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <Link
              to={createPageUrl('MortgageCalculatorUK')}
              className="px-4 py-2 rounded-md border border-blue-200 text-blue-700 bg-white hover:bg-blue-50"
            >
              Mortgage Hub
            </Link>
            <Link
              to={createPageUrl('MortgageLoanRepayment')}
              className="px-4 py-2 rounded-md border border-blue-200 text-blue-700 bg-white hover:bg-blue-50"
            >
              Mortgage Repayment
            </Link>
            <Link
              to={createPageUrl('HomeLoanMortgageCalculator')}
              className="px-4 py-2 rounded-md border border-blue-200 text-blue-700 bg-white hover:bg-blue-50"
            >
              Home Loan Calculator
            </Link>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="p-6 bg-gray-50 border rounded">
            <p className="text-gray-700">
              Calculator coming soon. Use our main Mortgage Calculator for immediate repayment
              estimates.
            </p>
          </div>

          <div className="mt-12">
            <RelatedCalculators
              calculators={[
                {
                  name: 'Back to Mortgage Hub',
                  url: createPageUrl('MortgageCalculatorUK'),
                  description: 'Explore all mortgage tools.',
                },
                {
                  name: 'Mortgage Loan Repayment',
                  url: createPageUrl('MortgageLoanRepayment'),
                  description: 'Monthly payments.',
                },
                {
                  name: 'Home Loan Mortgage Calculator',
                  url: createPageUrl('HomeLoanMortgageCalculator'),
                  description: 'Quick estimates.',
                },
              ]}
            />
          </div>
        </div>
      </div>
    </>
  );
}
