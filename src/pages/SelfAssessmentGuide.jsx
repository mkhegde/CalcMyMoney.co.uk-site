import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import Heading from '@/components/common/Heading';

export default function SelfAssessmentGuide() {
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
        name: 'Self Assessment Guide',
        item: `${origin}/SelfAssessmentGuide`,
      },
    ],
  };
  const faqs = [
    {
      question: 'Who needs to do Self Assessment?',
      answer:
        'Self-employed individuals and those with untaxed income often need to file. Check GOV.UK for specifics.',
    },
    {
      question: 'When are the deadlines?',
      answer:
        '31 October (paper returns) and 31 January (online) following the end of the tax year.',
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
          <Heading as="h1" size="h1" weight="bold" className="text-gray-900">UK Self Assessment Guide</Heading>
          <p className="text-gray-600 mt-2">Deadlines, rates, allowances and tips for 2025/26.</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <Link
              to={createPageUrl('TaxCalculatorsUK')}
              className="px-4 py-2 rounded-md border border-blue-200 text-blue-700 bg-white hover:bg-blue-50"
            >
              Tax Hub
            </Link>
            <Link
              to={createPageUrl('NetIncomeUKCalculator')}
              className="px-4 py-2 rounded-md border border-blue-200 text-blue-700 bg-white hover:bg-blue-50"
            >
              Net Income
            </Link>
            <Link
              to={createPageUrl('TaxAndNICalculator')}
              className="px-4 py-2 rounded-md border border-blue-200 text-blue-700 bg-white hover:bg-blue-50"
            >
              Tax + NI
            </Link>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
          <p className="text-gray-700">
            A practical overview of Self Assessment. We recommend reading official HMRC guidance for
            full details before filing.
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Check if you need to file</li>
            <li>Register with HMRC in time</li>
            <li>Keep accurate records and receipts</li>
            <li>File before the deadline and pay any tax due</li>
          </ul>
        </div>
      </div>
    </>
  );
}
