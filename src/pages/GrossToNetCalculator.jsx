import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import FAQSection from '../components/calculators/FAQSection';
import RelatedCalculators from '../components/calculators/RelatedCalculators'; // Added import

export default function GrossToNetCalculator() {
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
      question: 'What does gross to net mean?',
      answer:
        'Gross pay is before deductions. Net pay is what you take home after income tax, National Insurance, pension and student loan repayments where applicable.',
    },
    {
      question: 'Can I convert an annual salary to monthly net pay?',
      answer:
        'Yes. Enter your gross annual salary and select monthly as the output. The tool will show tax, NI and net pay per month.',
    },
    {
      question: 'Does this account for pension and student loans?',
      answer:
        'You can toggle pension contributions and choose a student loan plan to see their effect on your net pay.',
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
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Gross to Net Income Calculator (UK)
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mt-3">
              Convert gross salary to net take‑home pay with UK tax and NI for 2025/26.
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
                to={createPageUrl('SalaryCalculatorPaycheck')}
                className="px-4 py-2 rounded-md border border-blue-200 text-blue-700 bg-white hover:bg-blue-50"
              >
                Paycheck
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">Convert Gross to Net</h2>
            <p className="text-gray-700">
              Use the hub calculator to enter your gross pay and see an instant net figure after tax
              and NI.
            </p>
          </div>

          <div className="mt-12">
            <FAQSection faqs={faqs} title="Gross‑to‑Net FAQs" />
          </div>
          <p className="text-xs text-gray-500 mt-6">
            Last updated: <time dateTime={LAST_UPDATED_ISO}>{LAST_UPDATED_DISPLAY}</time>
          </p>
        </div>
      </div>

      <RelatedCalculators // Added RelatedCalculators component
        calculators={[
          {
            name: 'UK Salary Calculator (Take-Home Pay 2025/26)',
            url: createPageUrl('SalaryCalculatorUK'),
            description: 'Full breakdown of your net pay for 2025/26.',
          },
          {
            name: 'Take-Home Pay Calculator UK (2025/26)',
            url: createPageUrl('SalaryCalculatorTakeHomePay'),
            description: 'HMRC‑based take‑home pay estimates.',
          },
          {
            name: 'Paycheck Calculator UK (After Tax & NI)',
            url: createPageUrl('SalaryCalculatorPaycheck'),
            description: 'Net pay by pay period with deductions.',
          },
        ]}
      />
    </>
  );
}
