import React, { useCallback, useMemo, useState, Suspense } from 'react';
import SeoHead from '@/components/seo/SeoHead';
import useCalculatorSchema from '@/components/seo/useCalculatorSchema';
import { getMappedKeywords } from '@/components/seo/keywordMappings';
import Heading from '@/components/common/Heading';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';
import ExportActions from '@/components/calculators/ExportActions';
import RelatedCalculators from '@/components/calculators/RelatedCalculators';
import EmotionalHook from '@/components/calculators/EmotionalHook';
import { getRelatedCalculators } from '@/utils/getRelatedCalculators';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calculator, Briefcase, Shield, HandCoins, BookOpen } from 'lucide-react';

const ResultBreakdownChart = React.lazy(
  () => import('@/components/calculators/ResultBreakdownChart.jsx')
);

const pagePath = '/calculators/severance-pay-calculator';
const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/severance-pay-calculator';
const pageTitle = 'Severance Pay Calculator UK | Exit Package Breakdown';
const metaDescription =
  'Estimate your UK severance package including salary continuation, bonuses, holiday pay, and taxable amounts. Understand how much of your package may be tax-free.';
const keywords = getMappedKeywords('Severance Pay Calculator');

const faqItems = [
  {
    question: 'What is usually included in a severance package?',
    answer:
      'Packages can include salary continuation, payments in lieu of notice, accrued holiday, bonuses, and compensation for loss of office. Contract terms and negotiation determine the final mix.',
  },
  {
    question: 'How is severance pay taxed?',
    answer:
      'The first £30,000 of non-statutory severance can usually be paid tax-free. Statutory redundancy, holiday pay, and payments in lieu of notice remain taxable. Always confirm with payroll or a tax adviser.',
  },
  {
    question: 'How can I negotiate a better severance deal?',
    answer:
      'Document your achievements, understand contractual obligations, and seek professional advice if needed. Negotiations can cover salary continuation, garden leave, and the treatment of bonuses or share awards.',
  },
];

const emotionalMessage =
  'A well-understood severance package turns a difficult moment into an opportunity to plan your next chapter with clarity and confidence.';
const emotionalQuote = {
  text: 'The future depends on what you do today.',
  author: 'Mahatma Gandhi',
};

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
});

const parseNumber = (value) => {
  if (value === null || value === undefined) return 0;
  const cleaned = String(value).replace(/,/g, '').trim();
  const numeric = Number.parseFloat(cleaned);
  return Number.isFinite(numeric) ? numeric : 0;
};

const TAX_FREE_ALLOWANCE = 30000;

const calculateSeverance = (inputs) => {
  const baseSalary = Math.max(parseNumber(inputs.baseSalary), 0);
  const monthsOfSeverance = Math.max(parseNumber(inputs.monthsOfSeverance), 0);
  const bonusAmount = Math.max(parseNumber(inputs.bonusAmount), 0);
  const holidayPay = Math.max(parseNumber(inputs.holidayPay), 0);
  const noticePay = Math.max(parseNumber(inputs.noticePay), 0);
  const otherCompensation = Math.max(parseNumber(inputs.otherCompensation), 0);

  const monthlySalary = baseSalary / 12;
  const severancePay = monthlySalary * monthsOfSeverance;
  const nonStatutoryPay = severancePay + otherCompensation;
  const taxablePortion = Math.max(0, nonStatutoryPay - TAX_FREE_ALLOWANCE);
  const taxFreeAllowance = Math.min(nonStatutoryPay, TAX_FREE_ALLOWANCE);

  const totalPackage =
    severancePay + bonusAmount + holidayPay + noticePay + otherCompensation;

  return {
    monthlySalary,
    severancePay,
    bonusAmount,
    holidayPay,
    noticePay,
    otherCompensation,
    taxablePortion,
    totalPackage,
    taxFreeAllowance,
  };
};

const buildCsvData = (results, inputs) => {
  if (!results) return null;
  return [
    ['Input', 'Value'],
    ['Base salary (£ per year)', inputs.baseSalary],
    ['Months of severance', inputs.monthsOfSeverance],
    ['Bonus (£)', inputs.bonusAmount],
    ['Holiday pay (£)', inputs.holidayPay],
    ['Notice pay (£)', inputs.noticePay],
    ['Other compensation (£)', inputs.otherCompensation],
    [],
    ['Output', 'Value'],
    ['Monthly salary (£)', currencyFormatter.format(results.monthlySalary)],
    ['Severance pay (£)', currencyFormatter.format(results.severancePay)],
    ['Bonus (£)', currencyFormatter.format(results.bonusAmount)],
    ['Holiday pay (£)', currencyFormatter.format(results.holidayPay)],
    ['Notice pay (£)', currencyFormatter.format(results.noticePay)],
    ['Other compensation (£)', currencyFormatter.format(results.otherCompensation)],
    ['Tax-free allowance used (£)', currencyFormatter.format(results.taxFreeAllowance)],
    ['Taxable portion (£)', currencyFormatter.format(results.taxablePortion)],
    ['Total package (£)', currencyFormatter.format(results.totalPackage)],
  ];
};

const buildChartData = (results) => {
  if (!results) return [];
  return [
    { name: 'Severance pay', value: results.severancePay, color: '#0ea5e9' },
    { name: 'Bonus', value: results.bonusAmount, color: '#22c55e' },
    { name: 'Holiday pay', value: results.holidayPay, color: '#6366f1' },
    { name: 'Notice pay', value: results.noticePay, color: '#f97316' },
    { name: 'Other compensation', value: results.otherCompensation, color: '#ef4444' },
  ].filter((segment) => segment.value > 0);
};

export default function SeverancePayCalculatorPage() {
  const [inputs, setInputs] = useState({
    baseSalary: '48,000',
    monthsOfSeverance: '3',
    bonusAmount: '4,000',
    holidayPay: '1,500',
    noticePay: '2,500',
    otherCompensation: '0',
  });
  const [hasCalculated, setHasCalculated] = useState(false);
  const [results, setResults] = useState(null);
  const [csvData, setCsvData] = useState(null);

  const relatedCalculators = useMemo(() => getRelatedCalculators(pagePath), []);

  const schema = useCalculatorSchema({
    origin: 'https://www.calcmymoney.co.uk',
    path: pagePath,
    name: 'Severance Pay Calculator',
    description: metaDescription,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Income & Employment Calculators', url: '/calculators#income-tax' },
      { name: 'Severance Pay Calculator', url: pagePath },
    ],
    faq: faqItems,
  });

  const handleInputChange = useCallback(
    (field) => (event) => {
      const { value } = event.target;
      setInputs((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      const computed = calculateSeverance(inputs);
      setResults(computed);
      setHasCalculated(true);
      setCsvData(buildCsvData(computed, inputs));
    },
    [inputs]
  );

  const handleReset = useCallback(() => {
    setInputs({
      baseSalary: '48,000',
      monthsOfSeverance: '3',
      bonusAmount: '4,000',
      holidayPay: '1,500',
      noticePay: '2,500',
      otherCompensation: '0',
    });
    setHasCalculated(false);
    setResults(null);
    setCsvData(null);
  }, []);

  const chartData = useMemo(() => buildChartData(results), [results]);

  return (
    <div className="bg-slate-50 dark:bg-slate-900">
      <SeoHead
        title={pageTitle}
        description={metaDescription}
        canonical={canonicalUrl}
        ogTitle={pageTitle}
        ogDescription={metaDescription}
        ogUrl={canonicalUrl}
        ogType="website"
        ogSiteName="CalcMyMoney UK"
        ogLocale="en_GB"
        twitterTitle={pageTitle}
        twitterDescription={metaDescription}
        keywords={keywords}
        articleTags={keywords}
        jsonLd={schema}
      />

      <CalculatorWrapper>
        <div className="space-y-10">
          <header className="space-y-6 text-slate-900 dark:text-slate-100">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600/10 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-200">
                <Calculator className="h-6 w-6" aria-hidden="true" />
              </span>
              <Heading as="h1" size="h1" className="!mb-0">
                Severance Pay Calculator UK
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Break down your severance package and understand how much may be tax-free before
              finalising an exit agreement.
            </p>
          </header>

          <EmotionalHook
            message={emotionalMessage}
            quote={emotionalQuote}
            icon={<Briefcase className="h-4 w-4 shrink-0" aria-hidden="true" />}
            iconColor="text-indigo-600 dark:text-indigo-300"
            borderColor="border-indigo-200 dark:border-indigo-800/60"
            bgColor="bg-indigo-50/70 dark:bg-indigo-900/40"
            textColor="text-indigo-900 dark:text-indigo-100"
            footerColor="text-indigo-700 dark:text-indigo-300"
          />

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
            <Card className="border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Shield className="h-5 w-5 text-indigo-600 dark:text-indigo-300" aria-hidden="true" />
                  Severance inputs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="baseSalary">Base salary (£ per year)</Label>
                      <Input
                        id="baseSalary"
                        inputMode="decimal"
                        value={inputs.baseSalary}
                        onChange={handleInputChange('baseSalary')}
                        placeholder="e.g. 48,000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="monthsOfSeverance">Months of severance</Label>
                      <Input
                        id="monthsOfSeverance"
                        inputMode="decimal"
                        value={inputs.monthsOfSeverance}
                        onChange={handleInputChange('monthsOfSeverance')}
                        placeholder="e.g. 3"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bonusAmount">Bonus or performance payment (£)</Label>
                      <Input
                        id="bonusAmount"
                        inputMode="decimal"
                        value={inputs.bonusAmount}
                        onChange={handleInputChange('bonusAmount')}
                        placeholder="e.g. 4,000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="holidayPay">Accrued holiday pay (£)</Label>
                      <Input
                        id="holidayPay"
                        inputMode="decimal"
                        value={inputs.holidayPay}
                        onChange={handleInputChange('holidayPay')}
                        placeholder="e.g. 1,500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="noticePay">Payment in lieu of notice (£)</Label>
                      <Input
                        id="noticePay"
                        inputMode="decimal"
                        value={inputs.noticePay}
                        onChange={handleInputChange('noticePay')}
                        placeholder="e.g. 2,500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="otherCompensation">Other compensation (£)</Label>
                      <Input
                        id="otherCompensation"
                        inputMode="decimal"
                        value={inputs.otherCompensation}
                        onChange={handleInputChange('otherCompensation')}
                        placeholder="e.g. 0"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button type="submit" className="flex-1">
                      Calculate severance package
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleReset}
                      className="flex-1"
                    >
                      Reset inputs
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-6">
              {!hasCalculated && (
                <Card className="border border-dashed border-slate-300 bg-white/70 text-slate-700 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200">
                  <CardContent className="py-10 text-center text-sm leading-relaxed">
                    Share the severance terms you have been offered and press
                    <span className="font-semibold"> Calculate severance package</span> to view the breakdown
                    and tax status of each component.
                  </CardContent>
                </Card>
              )}

              {hasCalculated && results && (
                <>
                  <Card className="border border-indigo-200 bg-white shadow-sm dark:border-indigo-900 dark:bg-indigo-900/30 dark:text-indigo-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <HandCoins className="h-5 w-5 text-indigo-600 dark:text-indigo-200" aria-hidden="true" />
                        Package summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-200">Monthly salary</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.monthlySalary)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-200">Total package</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.totalPackage)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-200">Tax-free allowance used</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.taxFreeAllowance)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-200">Taxable portion</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.taxablePortion)}
                        </p>
                      </div>
                      <div className="sm:col-span-2">
                        <ExportActions
                          csvData={csvData}
                          fileName="severance-pay-results"
                          title="Severance Pay Calculator Results"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Shield className="h-5 w-5 text-indigo-600 dark:text-indigo-300" aria-hidden="true" />
                        Component breakdown
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                      <div className="flex items-center justify-between">
                        <span>Severance pay</span>
                        <span>{currencyFormatter.format(results.severancePay)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Bonus</span>
                        <span>{currencyFormatter.format(results.bonusAmount)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Holiday pay</span>
                        <span>{currencyFormatter.format(results.holidayPay)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Payment in lieu of notice</span>
                        <span>{currencyFormatter.format(results.noticePay)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Other compensation</span>
                        <span>{currencyFormatter.format(results.otherCompensation)}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Briefcase className="h-5 w-5 text-indigo-600 dark:text-indigo-300" aria-hidden="true" />
                        Package composition
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Suspense
                        fallback={
                          <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-slate-300 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                            Loading chart…
                          </div>
                        }
                      >
                        <ResultBreakdownChart data={chartData} title="Severance package breakdown" />
                      </Suspense>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <BookOpen className="h-5 w-5 text-indigo-600 dark:text-indigo-300" aria-hidden="true" />
                        Important notes
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                      <p>
                        Confirm any non-compete clauses, garden leave arrangements, or share awards in writing
                        before signing. These terms can materially change the value of your exit package.
                      </p>
                      <p>
                        Seek personalised advice if your package includes shares, options, or complex benefits.
                        Specialist guidance ensures you understand tax implications before accepting the offer.
                      </p>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </div>

          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <FAQSection faqs={faqItems} />
          </section>

          <RelatedCalculators calculators={relatedCalculators} />
</div>
      </CalculatorWrapper>
    </div>
  );
}
