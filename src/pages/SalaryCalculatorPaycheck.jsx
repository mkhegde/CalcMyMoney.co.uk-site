import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import FAQSection from '../components/calculators/FAQSection';
import RelatedCalculators from '../components/calculators/RelatedCalculators';

export default function SalaryCalculatorPaycheck() {
  const origin =
    typeof window !== 'undefined' ? window.location.origin : 'https://calcmymoney.co.uk';
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
      question: 'Can I see weekly, fortnightly or monthly net pay?',
      answer:
        'Yes. Choose your pay frequency to calculate the paycheck amount after tax, NI, pension and student loans.',
    },
    {
      question: 'Does this handle overtime or bonuses?',
      answer:
        'You can add extra gross pay (like overtime or a bonus) and the calculator will estimate the deductions for that period.',
    },
    {
      question: 'How accurate are paycheck estimates?',
      answer:
        'Figures are estimates based on HMRC 2025/26 rules. Actual payroll can vary with tax codes, benefits, and employer-specific settings.',
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
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Paycheck Calculator UK</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mt-3">
              Work out your UK paycheck after tax and NI. Supports weekly, fortnightly and monthly
              pay.
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
                to={createPageUrl('SalaryCalculatorTakeHomePay')}
                className="px-4 py-2 rounded-md border border-blue-200 text-blue-700 bg-white hover:bg-blue-50"
              >
                Take‑Home Pay
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
            <h2 className="text-2xl font-semibold text-gray-900">Check Your Net Paycheck</h2>
            <p className="text-gray-700">
              Use the hub calculator for precise paycheck breakdowns per pay period, with pension
              and student loan options.
            </p>
          </div>

          <div className="mt-12">
            <FAQSection faqs={faqs} title="Paycheck FAQs" />
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
            description: 'Comprehensive salary breakdown for 2025/26.',
          },
          {
            name: 'Take-Home Pay Calculator UK (2025/26)',
            url: createPageUrl('SalaryCalculatorTakeHomePay'),
            description: 'Estimate your take‑home pay using HMRC thresholds.',
          },
          {
            name: 'Gross to Net Income Calculator (UK)',
            url: createPageUrl('GrossToNetCalculator'),
            description: 'Convert gross to net figures accurately.',
          },
        ]}
      />
    </>
  );
}
