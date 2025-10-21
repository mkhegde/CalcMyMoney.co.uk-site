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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calculator, Home, Wallet, LineChart } from 'lucide-react';

const ResultBreakdownChart = React.lazy(
  () => import('@/components/calculators/ResultBreakdownChart.jsx')
);

const pagePath = '/calculators/remortgage-calculator';
const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/remortgage-calculator';
const pageTitle = 'Remortgage Calculator UK | Compare Monthly & Lifetime Savings';
const metaDescription =
  'Compare your current UK mortgage with a new deal, including monthly payments, fees, ERCs, and the break-even point to see if remortgaging saves money.';
const keywords = getMappedKeywords('Remortgage Calculator');

const faqItems = [
  {
    question: 'When is remortgaging worthwhile?',
    answer:
      'Remortgaging helps when the new deal lowers monthly repayments enough to offset lender fees and any early repayment charge. Compare the total cost over the remaining term before switching.',
  },
  {
    question: 'What costs should I include?',
    answer:
      'Factor in arrangement fees, valuation costs, legal fees, and any early repayment charge. These affect both the upfront outlay and the number of months before you break even.',
  },
  {
    question: 'Can I shorten the mortgage term when remortgaging?',
    answer:
      'Yes. Many borrowers align the new term with financial goals. Shorter terms increase monthly payments but reduce overall interest, which the calculator highlights.',
  },
];

const emotionalMessage =
  'Map the journey from your current mortgage to a better deal. See instant savings, payback periods, and how quickly lower rates could boost your household budget.';
const emotionalQuote = {
  text: 'A budget is telling your money where to go instead of wondering where it went.',
  author: 'Dave Ramsey',
};

const directoryLinks = [
  {
    url: '/#property-mortgage',
    label: 'See all mortgage tools',
    description: 'Explore affordability, overpayment, and property investment calculators.',
  },
  {
    url: '/mortgage-repayment-calculator',
    label: 'Mortgage Repayment Calculator',
    description: 'Check repayments and interest costs at your current or future rate.',
  },
  {
    url: '/mortgage-affordability-calculator',
    label: 'Mortgage Affordability Calculator',
    description: 'Estimate how much you can borrow before agreeing to a new deal.',
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

const monthlyPayment = (balance, annualRate, termYears) => {
  const months = termYears * 12;
  if (months <= 0 || balance <= 0) return 0;
  const monthlyRate = annualRate / 100 / 12;
  if (monthlyRate === 0) return balance / months;
  const factor = (1 + monthlyRate) ** months;
  return (balance * monthlyRate * factor) / (factor - 1);
};

const calculateRemortgage = (inputs) => {
  const currentBalance = Math.max(parseNumber(inputs.currentBalance), 0);
  const remainingTermYears = Math.max(parseNumber(inputs.remainingTermYears), 0);
  const currentInterestRate = Math.max(parseNumber(inputs.currentInterestRate), 0);
  const newInterestRate = Math.max(parseNumber(inputs.newInterestRate), 0);
  const newTermYears = Math.max(parseNumber(inputs.newTermYears), 0);
  const newArrangementFees = Math.max(parseNumber(inputs.newArrangementFees), 0);
  const earlyRepaymentCharge = Math.max(parseNumber(inputs.earlyRepaymentCharge), 0);
  const otherFees = Math.max(parseNumber(inputs.otherFees), 0);

  const currentMonthly = monthlyPayment(
    currentBalance,
    currentInterestRate,
    remainingTermYears
  );
  const newMonthly = monthlyPayment(currentBalance, newInterestRate, newTermYears);

  const currentTotalCost = currentMonthly * remainingTermYears * 12;
  const newTotalCost = newMonthly * newTermYears * 12 + newArrangementFees + earlyRepaymentCharge + otherFees;
  const monthlySavings = currentMonthly - newMonthly;
  const totalSavings = currentTotalCost - newTotalCost;
  const upfrontCosts = newArrangementFees + earlyRepaymentCharge + otherFees;
  const paybackMonths = monthlySavings > 0 ? Math.ceil(upfrontCosts / monthlySavings) : null;

  return {
    currentBalance,
    remainingTermYears,
    currentInterestRate,
    newInterestRate,
    newTermYears,
    currentMonthly,
    newMonthly,
    currentTotalCost,
    newTotalCost,
    monthlySavings,
    totalSavings,
    upfrontCosts,
    paybackMonths,
  };
};

const buildCsvData = (results, inputs) => {
  if (!results) return null;
  return [
    ['Input', 'Value'],
    ['Current mortgage balance (£)', inputs.currentBalance],
    ['Remaining term (years)', inputs.remainingTermYears],
    ['Current interest rate (%)', inputs.currentInterestRate],
    ['New interest rate (%)', inputs.newInterestRate],
    ['New term (years)', inputs.newTermYears],
    ['New arrangement fees (£)', inputs.newArrangementFees],
    ['Early repayment charge (£)', inputs.earlyRepaymentCharge],
    ['Other fees (£)', inputs.otherFees],
    [],
    ['Output', 'Value'],
    ['Current monthly payment (£)', currencyFormatter.format(results.currentMonthly)],
    ['New monthly payment (£)', currencyFormatter.format(results.newMonthly)],
    ['Monthly saving (£)', currencyFormatter.format(results.monthlySavings)],
    ['Upfront costs (£)', currencyFormatter.format(results.upfrontCosts)],
    ['Total cost - current deal (£)', currencyFormatter.format(results.currentTotalCost)],
    ['Total cost - new deal (£)', currencyFormatter.format(results.newTotalCost)],
    ['Lifetime saving (£)', currencyFormatter.format(results.totalSavings)],
    [
      'Payback period (months)',
      results.paybackMonths ? results.paybackMonths : 'Not recovered',
    ],
  ];
};

const chartPalette = ['#3b82f6', '#10b981', '#f97316'];

const buildChartData = (results) => {
  if (!results) return [];
  const diffLabel = results.totalSavings >= 0 ? 'Lifetime saving' : 'Additional cost';
  return [
    { name: 'Current lifetime cost', value: Math.max(results.currentTotalCost, 0), color: chartPalette[0] },
    { name: 'New lifetime cost', value: Math.max(results.newTotalCost, 0), color: chartPalette[1] },
    { name: diffLabel, value: Math.abs(results.totalSavings), color: results.totalSavings >= 0 ? '#22c55e' : '#ef4444' },
  ].filter((segment) => segment.value > 0);
};

const defaultInputs = {
  currentBalance: '210,000',
  remainingTermYears: '18',
  currentInterestRate: '5.2',
  newInterestRate: '3.9',
  newTermYears: '18',
  newArrangementFees: '995',
  earlyRepaymentCharge: '2,500',
  otherFees: '350',
};

export default function RemortgageCalculatorPage() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [results, setResults] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [csvData, setCsvData] = useState(null);

  const relatedCalculators = useMemo(() => getRelatedCalculators(pagePath), []);

  const schema = useCalculatorSchema({
    origin: 'https://www.calcmymoney.co.uk',
    path: pagePath,
    name: 'Remortgage Calculator',
    description: metaDescription,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Property & Mortgage Calculators', url: '/calculators#property-mortgage' },
      { name: 'Remortgage Calculator', url: pagePath },
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
      const computed = calculateRemortgage(inputs);
      setResults(computed);
      setHasCalculated(true);
      setCsvData(buildCsvData(computed, inputs));
    },
    [inputs]
  );

  const handleReset = useCallback(() => {
    setInputs(defaultInputs);
    setResults(null);
    setHasCalculated(false);
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
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-600/10 text-blue-700 dark:bg-blue-500/20 dark:text-blue-200">
                <Calculator className="h-6 w-6" aria-hidden="true" />
              </span>
              <Heading as="h1" size="h1" className="!mb-0">
                Remortgage Calculator UK
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Compare your current mortgage against a new offer, including fees and ERCs, to see monthly savings and the number of months to break even.
            </p>
          </header>

          <EmotionalHook
            message={emotionalMessage}
            quote={emotionalQuote}
            icon={<Home className="h-4 w-4 shrink-0" aria-hidden="true" />}
            iconColor="text-blue-600 dark:text-blue-300"
            borderColor="border-blue-200 dark:border-blue-800/60"
            bgColor="bg-blue-50/70 dark:bg-blue-950/40"
            textColor="text-blue-900 dark:text-blue-100"
            footerColor="text-blue-700 dark:text-blue-300"
          />

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
            <Card className="border border-blue-200 dark:border-blue-900 bg-white dark:bg-slate-950">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Home className="h-5 w-5 text-blue-600 dark:text-blue-300" aria-hidden="true" />
                  Mortgage details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="currentBalance">Current mortgage balance (£)</Label>
                      <Input
                        id="currentBalance"
                        inputMode="decimal"
                        value={inputs.currentBalance}
                        onChange={handleInputChange('currentBalance')}
                        placeholder="e.g. 210,000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="remainingTermYears">Remaining term (years)</Label>
                      <Input
                        id="remainingTermYears"
                        inputMode="decimal"
                        value={inputs.remainingTermYears}
                        onChange={handleInputChange('remainingTermYears')}
                        placeholder="e.g. 18"
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="currentInterestRate">Current interest rate (%)</Label>
                      <Input
                        id="currentInterestRate"
                        inputMode="decimal"
                        value={inputs.currentInterestRate}
                        onChange={handleInputChange('currentInterestRate')}
                        placeholder="e.g. 5.2"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newInterestRate">New interest rate (%)</Label>
                      <Input
                        id="newInterestRate"
                        inputMode="decimal"
                        value={inputs.newInterestRate}
                        onChange={handleInputChange('newInterestRate')}
                        placeholder="e.g. 3.9"
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="newTermYears">New mortgage term (years)</Label>
                      <Input
                        id="newTermYears"
                        inputMode="decimal"
                        value={inputs.newTermYears}
                        onChange={handleInputChange('newTermYears')}
                        placeholder="e.g. 18"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newArrangementFees">New lender arrangement fees (£)</Label>
                      <Input
                        id="newArrangementFees"
                        inputMode="decimal"
                        value={inputs.newArrangementFees}
                        onChange={handleInputChange('newArrangementFees')}
                        placeholder="e.g. 995"
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="earlyRepaymentCharge">Early repayment charge (£)</Label>
                      <Input
                        id="earlyRepaymentCharge"
                        inputMode="decimal"
                        value={inputs.earlyRepaymentCharge}
                        onChange={handleInputChange('earlyRepaymentCharge')}
                        placeholder="e.g. 2,500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="otherFees">Other fees (valuation, legal) (£)</Label>
                      <Input
                        id="otherFees"
                        inputMode="decimal"
                        value={inputs.otherFees}
                        onChange={handleInputChange('otherFees')}
                        placeholder="e.g. 350"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button type="submit" className="flex-1">
                      Calculate remortgage savings
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
                    Add your current and proposed deal, then press <span className="font-semibold">Calculate remortgage savings</span> to reveal the monthly saving, lifetime saving, and break-even point.
                  </CardContent>
                </Card>
              )}

              {hasCalculated && results && (
                <>
                  <Card className="border border-blue-200 bg-white shadow-sm dark:border-blue-900 dark:bg-blue-900/30 dark:text-blue-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Wallet className="h-5 w-5 text-blue-600 dark:text-blue-200" aria-hidden="true" />
                        Savings summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm text-blue-900 dark:text-blue-200">Current monthly payment</p>
                        <p className="text-2xl font-semibold">{currencyFormatter.format(results.currentMonthly)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-blue-900 dark:text-blue-200">New monthly payment</p>
                        <p className="text-2xl font-semibold">{currencyFormatter.format(results.newMonthly)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-blue-900 dark:text-blue-200">Monthly saving</p>
                        <p
                          className={`text-2xl font-semibold ${
                            results.monthlySavings >= 0 ? 'text-emerald-300' : 'text-rose-300'
                          }`}
                        >
                          {currencyFormatter.format(results.monthlySavings)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-blue-900 dark:text-blue-200">Upfront costs</p>
                        <p className="text-2xl font-semibold">{currencyFormatter.format(results.upfrontCosts)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-blue-900 dark:text-blue-200">Lifetime saving</p>
                        <p
                          className={`text-2xl font-semibold ${
                            results.totalSavings >= 0 ? 'text-emerald-300' : 'text-rose-300'
                          }`}
                        >
                          {currencyFormatter.format(results.totalSavings)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-blue-900 dark:text-blue-200">Payback period</p>
                        <p className="text-2xl font-semibold">
                          {results.paybackMonths ? `${results.paybackMonths} months` : 'Not recovered'}
                        </p>
                      </div>
                      <div className="sm:col-span-2">
                        <ExportActions
                          csvData={csvData}
                          fileName="remortgage-calculation"
                          title="Remortgage Calculator Results"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <LineChart className="h-5 w-5 text-blue-600 dark:text-blue-300" aria-hidden="true" />
                        Cost comparison
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
                        <ResultBreakdownChart data={chartData} title="Remortgage cost comparison" />
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
