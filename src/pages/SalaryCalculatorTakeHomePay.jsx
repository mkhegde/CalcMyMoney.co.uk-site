import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import FAQSection from '../components/calculators/FAQSection';
import RelatedCalculators from '../components/calculators/RelatedCalculators';

import Heading from '@/components/common/Heading';
export default function SalaryCalculatorTakeHomePay() {
  const origin =
    typeof window !== 'undefined' ? window.location.origin : 'https://www.calcmymoney.co.uk';
  const breadcrumbJson = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${origin}/` },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Salary & Income',
        item: `${origin}${createPageUrl('SalaryCalculatorUK')}`,
      },
    ],
  };

  const faqs = [
    {
      question: 'How do I calculate UK take-home pay for 2025/26?',
      answer:
        'Enter your gross salary, select pay frequency, and add pension and student loan options. The calculator applies 2025/26 HMRC thresholds to estimate tax, NI and your net pay.',
    },
    {
      question: 'Does this include Scottish or rUK tax bands?',
      answer:
        'Yes. Where applicable, the tool uses the correct UK or Scottish income tax bands for the 2025/26 tax year.',
    },
    {
      question: 'Can I export or print the results?',
      answer:
        'You can save or print your results for your records or to share with HR and recruiters.',
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

  const LAST_UPDATED_ISO = '2025-04-06';
  const LAST_UPDATED_DISPLAY = '6 April 2025';

  return (
    <>
      <script type="application/ld+json">{JSON.stringify(breadcrumbJson)}</script>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJson) }}
      />
      <div className="bg-white">
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
            <Heading as="h1" size="h1" weight="bold" className="text-gray-900">
              UK Financial Take-Home Pay Calculator 2025/26
            </Heading>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mt-3">
              Estimate UK take-home pay after tax, NI, pension and student loans for the 2025/26 tax
              year.
            </p>

            {/* Quick links: Hub + siblings */}
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <Link
                to={createPageUrl('SalaryCalculatorUK')}
                className="px-4 py-2 rounded-md border border-blue-200 text-blue-700 bg-white hover:bg-blue-50"
              >
                Salary Hub
              </Link>
              <Link
                to={createPageUrl('SalaryCalculatorPaycheck')}
                className="px-4 py-2 rounded-md border border-blue-200 text-blue-700 bg-white hover:bg-blue-50"
              >
                Paycheck
              </Link>
              <Link
                to={createPageUrl('GrossToNetCalculator')}
                className="px-4 py-2 rounded-md border border-blue-200 text-blue-700 bg-white hover:bg-blue-50"
              >
                Gross‑to‑Net
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="space-y-6">
            <Heading as="h2" size="h2" className="text-gray-900">Calculate Your Take-Home Pay</Heading>
            <p className="text-gray-700">
              For the most accurate take-home estimate (including tax, NI, pension, and student loan
              options), use our main Salary Calculator hub below.
            </p>
            <div>
              <Link
                to={createPageUrl('SalaryCalculatorUK')}
                className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Open Salary Calculator Hub
              </Link>
            </div>
          </div>

          <div className="mt-12">
            <FAQSection faqs={faqs} title="Take‑Home Pay FAQs" />
            <p className="text-xs text-gray-500 mt-6">
              Last updated: <time dateTime={LAST_UPDATED_ISO}>{LAST_UPDATED_DISPLAY}</time>
            </p>
          </div>
        </div>
      </div>

      <RelatedCalculators
        calculators={[
          {
            name: 'UK Salary Calculator (Take-Home Pay 2025/26)',
            url: createPageUrl('SalaryCalculatorUK'),
            description: 'Full take‑home breakdown with tax, NI, pension and student loan options.',
          },
          {
            name: 'Paycheck Calculator UK (After Tax & NI)',
            url: createPageUrl('SalaryCalculatorPaycheck'),
            description: 'See weekly, fortnightly or monthly net pay after deductions.',
          },
          {
            name: 'Gross to Net Income Calculator (UK)',
            url: createPageUrl('GrossToNetCalculator'),
            description: 'Convert a gross annual figure to monthly net pay after deductions.',
          },
        ]}
      />
    </>
  );
}
