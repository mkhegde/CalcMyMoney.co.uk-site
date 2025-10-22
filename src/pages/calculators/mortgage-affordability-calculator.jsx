import React, { useMemo, useState, useCallback, Suspense } from 'react';
import SeoHead from '@/components/seo/SeoHead';
import useCalculatorSchema from '@/components/seo/useCalculatorSchema';
import { getMappedKeywords } from '@/components/seo/keywordMappings';
import Heading from '@/components/common/Heading';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';
import ExportActions from '@/components/calculators/ExportActions';
import DirectoryLinks from '@/components/calculators/DirectoryLinks';
import RelatedCalculators from '@/components/calculators/RelatedCalculators';
import EmotionalHook from '@/components/calculators/EmotionalHook';
import { getRelatedCalculators } from '@/utils/getRelatedCalculators';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calculator, Home, PiggyBank, Quote, BookOpen, Scale } from 'lucide-react';

const ResultBreakdownChart = React.lazy(
  () => import('@/components/calculators/ResultBreakdownChart.jsx')
);

const pagePath = '/calculators/mortgage-affordability-calculator';
const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/mortgage-affordability-calculator';
const pageTitle = 'Mortgage Affordability Calculator UK | How Much Mortgage Can I Afford';
const metaDescription =
  'Use our UK mortgage affordability calculator to see how much mortgage you can afford, balance mortgage affordability against debts, and plan your deposit strategy.';
const keywords = getMappedKeywords('Mortgage Affordability Calculator');

const faqItems = [
  {
    question: 'What income multiple do lenders use?',
    answer:
      'Most lenders cap borrowing between 4x and 4.75x joint income, though the multiple can vary based on credit score and loan-to-value. Adjust the income multiple to match your lender’s policy.',
  },
  {
    question: 'Do lenders consider monthly debts?',
    answer:
      'Yes. Car finance, credit cards, and childcare costs reduce the mortgage you can borrow. Enter monthly debts so the calculator reflects a realistic stress test.',
  },
  {
    question: 'How should I treat bonuses or overtime?',
    answer:
      'Many lenders only count a proportion of variable pay. Add the part that lenders will accept to reduce surprises when you receive a mortgage offer.',
  },
];

const emotionalMessage =
  'Finding your dream home starts with knowing what you can comfortably afford. Plan your mortgage with confidence, ensuring your future home brings joy, not financial strain.';
const emotionalQuote = {
  text: 'The ache for home lives in all of us, the safe place where we can go as we are and not be questioned.',
  author: 'Maya Angelou',
};

const directoryLinks = [
  {
    url: '/#property-mortgage',
    label: 'Explore all property & mortgage calculators',
    description: 'From stamp duty to rental yield, plan your property investments.',
  },
  {
    url: '/mortgage-calculator',
    label: 'Plan your mortgage repayments',
    description: 'Stress test UK mortgage deals and understand combined loan commitments.',
  },
  {
    url: '/first-time-buyer-calculator',
    label: 'First-time buyer calculator',
    description: 'Understand costs and savings for your first home purchase.',
  },
];

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

function calculateMortgageAffordability({
  applicantIncome,
  partnerIncome,
  bonusIncome,
  incomeMultiple,
  monthlyDebts,
  deposit,
  interestRate,
  termYears,
}) {
  const annualDebt = monthlyDebts * 12;
  const totalIncome = applicantIncome + partnerIncome + bonusIncome;
  const maxLoanByIncome = Math.max(totalIncome * incomeMultiple - annualDebt, 0);
  const totalBuyingPower = maxLoanByIncome + deposit;

  // Stress test payment using repayment mortgage formula
  const monthlyRate = interestRate / 100 / 12;
  const months = termYears * 12;

  const stressMonthlyPayment =
    monthlyRate === 0
      ? maxLoanByIncome / months
      : (maxLoanByIncome * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));

  const loanToValue = totalBuyingPower > 0 ? (maxLoanByIncome / totalBuyingPower) * 100 : 0;

  return {
    totalIncome,
    maxLoanByIncome,
    totalBuyingPower,
    stressMonthlyPayment,
    loanToValue,
  };
}

function buildCsvData(results, inputs) {
  return [
    ['Metric', 'Value'],
    ['Your Annual Income (£)', currencyFormatter.format(inputs.applicantIncome)],
    ['Partner Annual Income (£)', currencyFormatter.format(inputs.partnerIncome)],
    ['Bonus or Variable Pay (£)', currencyFormatter.format(inputs.bonusIncome)],
    ['Income Multiple (x)', inputs.incomeMultiple],
    ['Monthly Credit Commitments (£)', currencyFormatter.format(inputs.monthlyDebts)],
    ['Deposit / Equity (£)', currencyFormatter.format(inputs.deposit)],
    ['Stress Rate (%)', inputs.interestRate],
    ['Stress Term (years)', inputs.termYears],
    [],
    ['Total Income (£)', currencyFormatter.format(results.totalIncome)],
    ['Maximum Loan by Income (£)', currencyFormatter.format(results.maxLoanByIncome)],
    ['Total Buying Power (£)', currencyFormatter.format(results.totalBuyingPower)],
    ['Stress-Tested Monthly Payment (£)', currencyFormatter.format(results.stressMonthlyPayment)],
    ['Loan-to-Value (%)', `${results.loanToValue.toFixed(1)}%`],
  ];
}

function buildChartData(results) {
  if (!results) return [];
  return [
    { name: 'Max Loan by Income', value: results.maxLoanByIncome, color: '#10b981' },
    { name: 'Deposit / Equity', value: results.deposit, color: '#3b82f6' },
  ].filter((segment) => segment.value > 0);
}

export default function MortgageAffordabilityCalculatorPage() {
  const [inputs, setInputs] = useState({
    applicantIncome: '45,000',
    partnerIncome: '28,000',
    bonusIncome: '5,000',
    incomeMultiple: '4.5',
    monthlyDebts: '350',
    deposit: '60,000',
    interestRate: '6',
    termYears: '30',
  });
  const [hasCalculated, setHasCalculated] = useState(false);
  const [results, setResults] = useState(null);
  const [csvData, setCsvData] = useState(null);

  const relatedCalculators = useMemo(() => getRelatedCalculators(pagePath), []);

  const schema = useCalculatorSchema({
    origin: 'https://www.calcmymoney.co.uk',
    path: pagePath,
    name: 'Mortgage Affordability Calculator',
    description: metaDescription,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Property & Mortgage Calculators', url: '/calculators#property-mortgage' },
      { name: 'Mortgage Affordability Calculator', url: pagePath },
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
      const parsedInputs = {
        applicantIncome: parseNumber(inputs.applicantIncome),
        partnerIncome: parseNumber(inputs.partnerIncome),
        bonusIncome: parseNumber(inputs.bonusIncome),
        incomeMultiple: parseNumber(inputs.incomeMultiple),
        monthlyDebts: parseNumber(inputs.monthlyDebts),
        deposit: parseNumber(inputs.deposit),
        interestRate: parseNumber(inputs.interestRate),
        termYears: parseNumber(inputs.termYears),
      };
      const computedResults = calculateMortgageAffordability(parsedInputs);
      setResults({ ...computedResults, deposit: parsedInputs.deposit }); // Add deposit to results for chart
      setHasCalculated(true);
      setCsvData(buildCsvData({ ...computedResults, deposit: parsedInputs.deposit }, parsedInputs));
    },
    [inputs]
  );

  const handleReset = useCallback(() => {
    setInputs({
      applicantIncome: '45,000',
      partnerIncome: '28,000',
      bonusIncome: '5,000',
      incomeMultiple: '4.5',
      monthlyDebts: '350',
      deposit: '60,000',
      interestRate: '6',
      termYears: '30',
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
        jsonLd={schema}
        keywords={keywords}
        articleTags={keywords}
      />

      <CalculatorWrapper>
        <div className="space-y-10">
          <header className="space-y-6 text-slate-900 dark:text-slate-100">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200">
                <Calculator className="h-6 w-6" aria-hidden="true" />
              </span>
              <Heading as="h1" size="h1" className="!mb-0">
                Mortgage Affordability Calculator UK
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              See how much mortgage you can afford based on income, debts, deposit, and lender
              stress testing. Enter your financial details to plan your home purchase with
              confidence.
            </p>
          </header>

          <EmotionalHook
            message={emotionalMessage}
            quote={emotionalQuote}
            icon={<Home className="h-4 w-4 shrink-0" aria-hidden="true" />}
            iconColor="text-emerald-600 dark:text-emerald-300"
            borderColor="border-emerald-200 dark:border-emerald-800/60"
            bgColor="bg-emerald-50/70 dark:bg-emerald-950/40"
            textColor="text-emerald-900 dark:text-emerald-100"
            footerColor="text-emerald-700 dark:text-emerald-300"
          />

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
            <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Scale
                    className="h-5 w-5 text-emerald-600 dark:text-emerald-300"
                    aria-hidden="true"
                  />
                  Affordability Inputs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid gap-4 sm:grid-cols-1">
                    <div className="space-y-2">
                      <Label htmlFor="applicantIncome">Your annual income (£)</Label>
                      <Input
                        id="applicantIncome"
                        inputMode="decimal"
                        value={inputs.applicantIncome}
                        onChange={handleInputChange('applicantIncome')}
                        placeholder="e.g. 45,000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="partnerIncome">Partner annual income (£)</Label>
                      <Input
                        id="partnerIncome"
                        inputMode="decimal"
                        value={inputs.partnerIncome}
                        onChange={handleInputChange('partnerIncome')}
                        placeholder="e.g. 28,000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bonusIncome">Bonus or variable pay (£)</Label>
                      <Input
                        id="bonusIncome"
                        inputMode="decimal"
                        value={inputs.bonusIncome}
                        onChange={handleInputChange('bonusIncome')}
                        placeholder="e.g. 5,000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="incomeMultiple">Income multiple (x)</Label>
                      <Input
                        id="incomeMultiple"
                        inputMode="decimal"
                        value={inputs.incomeMultiple}
                        onChange={handleInputChange('incomeMultiple')}
                        placeholder="e.g. 4.5"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="monthlyDebts">Monthly credit commitments (£)</Label>
                      <Input
                        id="monthlyDebts"
                        inputMode="decimal"
                        value={inputs.monthlyDebts}
                        onChange={handleInputChange('monthlyDebts')}
                        placeholder="e.g. 350"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="deposit">Deposit / equity (£)</Label>
                      <Input
                        id="deposit"
                        inputMode="decimal"
                        value={inputs.deposit}
                        onChange={handleInputChange('deposit')}
                        placeholder="e.g. 60,000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="interestRate">Stress rate (%)</Label>
                      <Input
                        id="interestRate"
                        inputMode="decimal"
                        value={inputs.interestRate}
                        onChange={handleInputChange('interestRate')}
                        placeholder="e.g. 6"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="termYears">Stress term (years)</Label>
                      <Input
                        id="termYears"
                        inputMode="numeric"
                        value={inputs.termYears}
                        onChange={handleInputChange('termYears')}
                        placeholder="e.g. 30"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button type="submit" className="flex-1">
                      Calculate Affordability
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleReset}
                      className="flex-1"
                    >
                      Reset
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-6">
              {!hasCalculated && (
                <Card className="border border-dashed border-slate-300 bg-white/70 text-slate-700 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200">
                  <CardContent className="py-10 text-center text-sm leading-relaxed">
                    Enter your financial details and press{' '}
                    <span className="font-semibold">Calculate Affordability</span> to see how much
                    mortgage you can afford and your estimated monthly payments.
                  </CardContent>
                </Card>
              )}

              {hasCalculated && results && (
                <>
                  <Card className="border border-emerald-200 bg-white shadow-sm dark:border-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Home
                          className="h-5 w-5 text-emerald-600 dark:text-emerald-200"
                          aria-hidden="true"
                        />
                        Affordability Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-200">
                          Total income
                        </p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.totalIncome)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-200">Max loan</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.maxLoanByIncome)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-200">
                          Buying power
                        </p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.totalBuyingPower)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-200">
                          Loan-to-value
                        </p>
                        <p className="text-2xl font-semibold">{results.loanToValue.toFixed(1)}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-200">
                          Stress-tested monthly payment
                        </p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.stressMonthlyPayment)}
                        </p>
                      </div>
                      <div className="sm:col-span-2">
                        <ExportActions
                          csvData={csvData}
                          fileName="mortgage-affordability-projection"
                          title="Mortgage Affordability Calculator Results"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <PiggyBank
                          className="h-5 w-5 text-emerald-600 dark:text-emerald-300"
                          aria-hidden="true"
                        />
                        Buying Power Breakdown
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
                        <ResultBreakdownChart data={chartData} title="Mortgage Buying Power" />
                      </Suspense>
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
          <DirectoryLinks links={directoryLinks} />
        </div>
      </CalculatorWrapper>
    </div>
  );
}
