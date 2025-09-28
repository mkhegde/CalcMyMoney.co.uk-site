import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { PoundSterling, Calculator, Clock } from 'lucide-react';
import ExportActions from '../components/calculators/ExportActions';
import FAQSection from '../components/calculators/FAQSection';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import RelatedCalculators from '../components/calculators/RelatedCalculators';

export default function ProRataSalaryCalculator() {
  const [fullTimeSalary, setFullTimeSalary] = useState('');
  const [fullTimeHours, setFullTimeHours] = useState('37.5');
  const [partTimeHours, setPartTimeHours] = useState('');
  const [results, setResults] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [csvData, setCsvData] = useState(null);

  // Constants for last updated date
  const LAST_UPDATED_ISO = '2025-04-06';
  const LAST_UPDATED_DISPLAY = '6 April 2025';

  const handleCalculate = () => {
    const ftSalary = Number(fullTimeSalary) || 0;
    const ftHours = Number(fullTimeHours) || 0;
    const ptHours = Number(partTimeHours) || 0;

    if (ftSalary <= 0 || ftHours <= 0 || ptHours <= 0) {
      setResults(null);
      setHasCalculated(true);
      return;
    }

    const hourlyRate = ftSalary / (ftHours * 52);
    const proRataAnnual = (ftSalary / ftHours) * ptHours;

    const newResults = {
      proRataAnnual,
      proRataMonthly: proRataAnnual / 12,
      proRataWeekly: proRataAnnual / 52,
      // The original proRataDaily calculation was complex and potentially incorrect,
      // and not directly displayed or required by the outline. Removing to simplify
      // and avoid potential miscalculation if not used. If needed, a more robust
      // calculation based on annual/working days per year should be implemented.
      // proRataDaily: proRataAnnual / (ptHours * 52) * (ptHours / 5), // Assuming 5-day week
      hourlyRate,
      fullTimeSalary: ftSalary,
      fullTimeHours: ftHours,
      partTimeHours: ptHours,
    };

    setResults(newResults);
    setHasCalculated(true);

    const csvExportData = [
      ['Metric', 'Value'],
      ['Pro-Rata Annual Salary', `£${newResults.proRataAnnual.toFixed(2)}`],
      ['Pro-Rata Monthly Salary', `£${newResults.proRataMonthly.toFixed(2)}`],
      ['Pro-Rata Weekly Salary', `£${newResults.proRataWeekly.toFixed(2)}`],
      ['Equivalent Hourly Rate', `£${newResults.hourlyRate.toFixed(2)}`],
      ['Full-Time Equivalent Salary', `£${ftSalary.toFixed(2)}`],
      ['Full-Time Hours', `${ftHours} / week`],
      ['Part-Time Hours', `${ptHours} / week`],
    ];
    setCsvData(csvExportData);
  };

  useEffect(() => {
    setHasCalculated(false);
    setResults(null);
  }, [fullTimeSalary, fullTimeHours, partTimeHours]);

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
      question: 'How is pro-rata salary calculated?',
      answer:
        'We scale the full-time annual salary by your contracted days or hours to estimate the pro-rata amount for part-time or partial-year roles.',
    },
    {
      question: 'Can I compare part-time vs full-time pay?',
      answer:
        'Yes. Adjust hours or days to compare pro-rata pay against the full-time salary equivalent.',
    },
    {
      question: 'Does this show net (after tax) values too?',
      answer:
        'Use our Take-Home Pay or Gross-to-Net calculators to estimate the after-tax impact of your pro-rata salary.',
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJson) }}
      />
      <div className="bg-white dark:bg-gray-900">
        <div className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 non-printable">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Pro-Rata Salary Calculator (UK)
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Calculate your part-time salary based on a full-time equivalent wage. Ensure you're
                getting paid fairly for the hours you work.
              </p>

              {/* Quick links: Hub + sibling */}
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <Link
                  to={createPageUrl('SalaryCalculatorUK')}
                  className="px-4 py-2 rounded-md border border-blue-200 text-blue-700 bg-white hover:bg-blue-50 dark:bg-gray-800 dark:text-blue-300 dark:border-blue-700"
                >
                  Salary Hub
                </Link>
                <Link
                  to={createPageUrl('SalaryCalculatorTakeHomePay')}
                  className="px-4 py-2 rounded-md border border-blue-200 text-blue-700 bg-white hover:bg-blue-50 dark:bg-gray-800 dark:text-blue-300 dark:border-blue-700"
                >
                  Take‑Home Pay
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="print-title hidden">Pro-Rata Salary Calculation</div>
          <div className="grid lg:grid-cols-5 gap-8 printable-grid-cols-1">
            <div className="lg:col-span-2 non-printable">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Enter Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullTimeSalary">Full-Time Annual Salary</Label>
                    <div className="relative">
                      <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="fullTimeSalary"
                        type="number"
                        value={fullTimeSalary}
                        onChange={(e) => setFullTimeSalary(e.target.value)}
                        className="pl-10"
                        placeholder="e.g. 35000"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fullTimeHours">Full-Time Weekly Hours</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="fullTimeHours"
                        type="number"
                        value={fullTimeHours}
                        onChange={(e) => setFullTimeHours(e.target.value)}
                        className="pl-10"
                        placeholder="e.g. 37.5"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="partTimeHours">Your Part-Time Weekly Hours</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="partTimeHours"
                        type="number"
                        value={partTimeHours}
                        onChange={(e) => setPartTimeHours(e.target.value)}
                        className="pl-10"
                        placeholder="e.g. 20"
                      />
                    </div>
                  </div>
                  <Button onClick={handleCalculate} className="w-full text-lg">
                    <Calculator className="w-5 h-5 mr-2" />
                    Calculate
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-3 space-y-6 printable-area">
              {hasCalculated && results ? (
                <>
                  <div className="flex justify-between items-center non-printable">
                    <h2 className="text-2xl font-bold text-gray-800">Your Pro-Rata Salary</h2>
                    <ExportActions
                      csvData={csvData}
                      fileName="pro-rata-salary"
                      title="Pro-Rata Salary"
                    />
                  </div>
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-green-800 mb-2">Pro-Rata Annual Salary</h3>
                      <div className="text-4xl font-bold text-green-900">
                        £
                        {results.proRataAnnual.toLocaleString('en-GB', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Salary Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">Monthly Pay</p>
                        <p className="text-lg font-semibold">
                          £
                          {results.proRataMonthly.toLocaleString('en-GB', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">Weekly Pay</p>
                        <p className="text-lg font-semibold">
                          £
                          {results.proRataWeekly.toLocaleString('en-GB', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg col-span-2">
                        <p className="text-sm text-gray-600">Equivalent Hourly Rate</p>
                        <p className="text-lg font-semibold">
                          £
                          {results.hourlyRate.toLocaleString('en-GB', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card className="flex items-center justify-center h-[400px]">
                  <div className="text-center text-gray-500">
                    <Calculator className="w-12 h-12 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold">Ready for your calculation?</h3>
                    <p>Enter the details to see your pro-rata salary.</p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
        {/* Back to hub link (show if not already present) */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <Link to={createPageUrl('SalaryCalculatorUK')} className="text-blue-600 hover:underline">
            ← Back to Salary & Income Hub
          </Link>
        </div>

        {/* Visible FAQ section aligned with JSON-LD */}
        <div className="bg-gray-50 dark:bg-gray-800/50 py-10 non-printable mt-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <FAQSection faqs={faqs} title="Pro‑Rata Salary FAQs" />
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
            description: 'Primary hub for take‑home pay calculations.',
          },
          {
            name: 'Take-Home Pay Calculator UK (2025/26)',
            url: createPageUrl('SalaryCalculatorTakeHomePay'),
            description: 'See net pay after tax and NI.',
          },
          {
            name: 'Paycheck Calculator UK (After Tax & NI)',
            url: createPageUrl('SalaryCalculatorPaycheck'),
            description: 'Check your paycheck after deductions.',
          },
        ]}
      />
    </>
  );
}
