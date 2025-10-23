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
import { Calculator, FileSignature, ClipboardList, Coins, BookOpen } from 'lucide-react';

const ResultBreakdownChart = React.lazy(
  () => import('@/components/calculators/ResultBreakdownChart.jsx')
);

const pagePath = '/calculators/self-assessment-calculator';
const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/self-assessment-calculator';
const pageTitle = 'Self Assessment Tax Calculator UK | Freelance & Sole Trader Estimate';
const metaDescription =
  'Estimate your UK self assessment tax bill. Include trading income, allowable expenses, Class 2 and Class 4 National Insurance, and payments on account.';
const keywords = getMappedKeywords('Self Assessment Calculator');

const faqItems = [
  {
    question: 'Who needs to file a Self Assessment tax return?',
    answer:
      'Self-employed sole traders earning over £1,000, partners in a business partnership, and individuals with untaxed income usually need to file. HMRC will confirm your obligations when you register.',
  },
  {
    question: 'Which expenses can I deduct?',
    answer:
      'Allowable expenses must be wholly and exclusively for business. Keep accurate records for things like office costs, travel, marketing, and professional fees to reduce your taxable profit.',
  },
  {
    question: 'How are Class 2 and Class 4 National Insurance calculated?',
    answer:
      'Class 2 NI is a flat weekly amount when profits exceed the small profits threshold. Class 4 NI is calculated on profits within specific bands at 9% and 2%. This calculator estimates both.',
  },
];

const emotionalMessage =
  'Know your bill before HMRC asks for it. A clear estimate means you can set aside the right amount, avoid surprises, and focus on growing your business.';
const emotionalQuote = {
  text: 'Beware of little expenses; a small leak will sink a great ship.',
  author: 'Benjamin Franklin',
};

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
});

const PERSONAL_ALLOWANCE = 12570;
const BASIC_RATE_LIMIT = 50270;
const HIGHER_RATE_LIMIT = 125140;

const CLASS2_WEEKLY = 3.45;
const CLASS2_THRESHOLD = 12570;
const CLASS4_LOWER_LIMIT = 12570;
const CLASS4_UPPER_LIMIT = 50270;
const CLASS4_MAIN_RATE = 0.09;
const CLASS4_UPPER_RATE = 0.02;

const parseNumber = (value) => {
  if (value === null || value === undefined) return 0;
  const cleaned = String(value).replace(/,/g, '').trim();
  const numeric = Number.parseFloat(cleaned);
  return Number.isFinite(numeric) ? numeric : 0;
};

const computeIncomeTax = (profits) => {
  let personalAllowance = PERSONAL_ALLOWANCE;
  if (profits > 100000) {
    const reduction = Math.floor((profits - 100000) / 2);
    personalAllowance = Math.max(0, PERSONAL_ALLOWANCE - reduction);
  }

  const taxable = Math.max(0, profits - personalAllowance);
  let tax = 0;

  const basicBand = Math.min(taxable, BASIC_RATE_LIMIT - personalAllowance);
  tax += basicBand * 0.2;

  const higherBand = Math.min(
    Math.max(0, taxable - basicBand),
    HIGHER_RATE_LIMIT - BASIC_RATE_LIMIT,
  );
  tax += higherBand * 0.4;

  const additionalBand = Math.max(0, taxable - basicBand - higherBand);
  tax += additionalBand * 0.45;

  return { tax, personalAllowance };
};

const computeClass2NI = (profits) => {
  if (profits <= CLASS2_THRESHOLD) return 0;
  return CLASS2_WEEKLY * 52;
};

const computeClass4NI = (profits) => {
  const band1 = Math.max(0, Math.min(profits, CLASS4_UPPER_LIMIT) - CLASS4_LOWER_LIMIT);
  const band2 = Math.max(0, profits - CLASS4_UPPER_LIMIT);
  return band1 * CLASS4_MAIN_RATE + band2 * CLASS4_UPPER_RATE;
};

const calculateSelfAssessment = (inputs) => {
  const tradingIncome = Math.max(parseNumber(inputs.tradingIncome), 0);
  const allowableExpenses = Math.min(tradingIncome, Math.max(parseNumber(inputs.allowableExpenses), 0));
  const otherIncome = Math.max(parseNumber(inputs.otherIncome), 0);
  const paymentsOnAccount = Math.max(parseNumber(inputs.paymentsOnAccount), 0);

  const profits = Math.max(0, tradingIncome - allowableExpenses);
  const totalIncome = profits + otherIncome;

  const { tax, personalAllowance } = computeIncomeTax(totalIncome);
  const class2 = computeClass2NI(profits);
  const class4 = computeClass4NI(profits);
  const totalLiability = tax + class2 + class4;
  const remainingBill = Math.max(0, totalLiability - paymentsOnAccount);

  return {
    tradingIncome,
    allowableExpenses,
    profits,
    otherIncome,
    totalIncome,
    personalAllowance,
    tax,
    class2,
    class4,
    totalLiability,
    paymentsOnAccount,
    remainingBill,
  };
};

const buildCsvData = (results, inputs) => {
  if (!results) return null;
  return [
    ['Input', 'Value'],
    ['Trading income (£)', inputs.tradingIncome],
    ['Allowable expenses (£)', inputs.allowableExpenses],
    ['Other income (£)', inputs.otherIncome],
    ['Payments on account (£)', inputs.paymentsOnAccount],
    [],
    ['Output', 'Value'],
    ['Profits (£)', currencyFormatter.format(results.profits)],
    ['Taxable income (£)', currencyFormatter.format(results.totalIncome)],
    ['Personal allowance (£)', currencyFormatter.format(results.personalAllowance)],
    ['Income tax (£)', currencyFormatter.format(results.tax)],
    ['Class 2 NI (£)', currencyFormatter.format(results.class2)],
    ['Class 4 NI (£)', currencyFormatter.format(results.class4)],
    ['Total liability (£)', currencyFormatter.format(results.totalLiability)],
    ['Payments on account (£)', currencyFormatter.format(results.paymentsOnAccount)],
    ['Remaining bill (£)', currencyFormatter.format(results.remainingBill)],
  ];
};

const buildChartData = (results) => {
  if (!results) return [];
  return [
    { name: 'Income tax', value: results.tax, color: '#0ea5e9' },
    { name: 'Class 2 NI', value: results.class2, color: '#22c55e' },
    { name: 'Class 4 NI', value: results.class4, color: '#6366f1' },
  ].filter((segment) => segment.value > 0);
};

export default function SelfAssessmentCalculatorPage() {
  const [inputs, setInputs] = useState({
    tradingIncome: '42,000',
    allowableExpenses: '8,000',
    otherIncome: '0',
    paymentsOnAccount: '1,500',
  });
  const [hasCalculated, setHasCalculated] = useState(false);
  const [results, setResults] = useState(null);
  const [csvData, setCsvData] = useState(null);

  const relatedCalculators = useMemo(() => getRelatedCalculators(pagePath), []);

  const schema = useCalculatorSchema({
    origin: 'https://www.calcmymoney.co.uk',
    path: pagePath,
    name: 'Self Assessment Calculator',
    description: metaDescription,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Income & Tax Calculators', url: '/calculators#income-tax' },
      { name: 'Self Assessment Calculator', url: pagePath },
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
      const computed = calculateSelfAssessment(inputs);
      setResults(computed);
      setHasCalculated(true);
      setCsvData(buildCsvData(computed, inputs));
    },
    [inputs]
  );

  const handleReset = useCallback(() => {
    setInputs({
      tradingIncome: '42,000',
      allowableExpenses: '8,000',
      otherIncome: '0',
      paymentsOnAccount: '1,500',
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
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-rose-600/10 text-rose-700 dark:bg-rose-500/20 dark:text-rose-200">
                <Calculator className="h-6 w-6" aria-hidden="true" />
              </span>
              <Heading as="h1" size="h1" className="!mb-0">
                Self Assessment Calculator UK
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Estimate income tax, National Insurance, and your remaining bill before submitting your
              self assessment tax return.
            </p>
          </header>

          <EmotionalHook
            message={emotionalMessage}
            quote={emotionalQuote}
            icon={<FileSignature className="h-4 w-4 shrink-0" aria-hidden="true" />}
            iconColor="text-rose-600 dark:text-rose-300"
            borderColor="border-rose-200 dark:border-rose-800/60"
            bgColor="bg-rose-50/70 dark:bg-rose-900/40"
            textColor="text-rose-900 dark:text-rose-100"
            footerColor="text-rose-700 dark:text-rose-300"
          />

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
            <Card className="border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ClipboardList className="h-5 w-5 text-rose-600 dark:text-rose-300" aria-hidden="true" />
                  Income & expenses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="tradingIncome">Trading income (£)</Label>
                      <Input
                        id="tradingIncome"
                        inputMode="decimal"
                        value={inputs.tradingIncome}
                        onChange={handleInputChange('tradingIncome')}
                        placeholder="e.g. 42,000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="allowableExpenses">Allowable expenses (£)</Label>
                      <Input
                        id="allowableExpenses"
                        inputMode="decimal"
                        value={inputs.allowableExpenses}
                        onChange={handleInputChange('allowableExpenses')}
                        placeholder="e.g. 8,000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="otherIncome">Other taxable income (£)</Label>
                      <Input
                        id="otherIncome"
                        inputMode="decimal"
                        value={inputs.otherIncome}
                        onChange={handleInputChange('otherIncome')}
                        placeholder="e.g. 0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="paymentsOnAccount">Payments on account (£)</Label>
                      <Input
                        id="paymentsOnAccount"
                        inputMode="decimal"
                        value={inputs.paymentsOnAccount}
                        onChange={handleInputChange('paymentsOnAccount')}
                        placeholder="e.g. 1,500"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button type="submit" className="flex-1">
                      Calculate self assessment
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
                    Enter your trading income and expenses, then press
                    <span className="font-semibold"> Calculate self assessment</span> to see tax, NI,
                    and the remaining bill.
                  </CardContent>
                </Card>
              )}

              {hasCalculated && results && (
                <>
                  <Card className="border border-rose-200 bg-white shadow-sm dark:border-rose-900 dark:bg-rose-900/30 dark:text-rose-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <FileSignature className="h-5 w-5 text-rose-600 dark:text-rose-200" aria-hidden="true" />
                        Tax summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm text-rose-900 dark:text-rose-200">Profits after expenses</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.profits)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-rose-900 dark:text-rose-200">Total liability</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.totalLiability)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-rose-900 dark:text-rose-200">Payments on account</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.paymentsOnAccount)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-rose-900 dark:text-rose-200">Remaining bill</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.remainingBill)}
                        </p>
                      </div>
                      <div className="sm:col-span-2">
                        <ExportActions
                          csvData={csvData}
                          fileName="self-assessment-results"
                          title="Self Assessment Calculator Results"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Coins className="h-5 w-5 text-rose-600 dark:text-rose-300" aria-hidden="true" />
                        Liability breakdown
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                      <div className="flex items-center justify-between">
                        <span>Income tax</span>
                        <span>{currencyFormatter.format(results.tax)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Class 2 National Insurance</span>
                        <span>{currencyFormatter.format(results.class2)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Class 4 National Insurance</span>
                        <span>{currencyFormatter.format(results.class4)}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Coins className="h-5 w-5 text-rose-600 dark:text-rose-300" aria-hidden="true" />
                        Liability mix visual
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
                        <ResultBreakdownChart data={chartData} title="Self assessment liability breakdown" />
                      </Suspense>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <BookOpen className="h-5 w-5 text-rose-600 dark:text-rose-300" aria-hidden="true" />
                        Important notes
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                      <p>
                        Keep records of every invoice and expense receipt for at least five years after the
                        submission deadline. HMRC may request evidence during a compliance check.
                      </p>
                      <p>
                        Payments on account assume your tax bill will be similar next year. If profits fall,
                        submit form SA303 to reduce the instalments and improve cash flow.
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
