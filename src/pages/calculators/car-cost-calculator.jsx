import React, { Suspense, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calculator, Gauge, Car, Wallet, Quote, BookOpen } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

import SeoHead from '@/components/seo/SeoHead';
import useCalculatorSchema from '@/components/seo/useCalculatorSchema';
import Heading from '@/components/common/Heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';
import ExportActions from '@/components/calculators/ExportActions';
import RelatedCalculators from '@/components/calculators/RelatedCalculators';
import { getRelatedCalculators } from '@/utils/getRelatedCalculators';

const ResultBreakdownChart = React.lazy(() => import('@/components/calculators/ResultBreakdownChart.jsx'));

const keywords = ['car cost calculator'];

const metaDescription =
  'Reveal the true monthly cost of running your car. Calculate finance, fuel, insurance, tax, and maintenance with the UK car cost calculator.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/car-cost-calculator';
const pagePath = '/calculators/car-cost-calculator';
const pageTitle = 'Car Cost Calculator | UK Car Running Costs';

const defaultInputs = {
  purchasePrice: '22,000',
  depositPercent: '10',
  interestRate: '5.9',
  termYears: '4',
  expectedDepreciation: '3,000',
  annualMileage: '9,000',
  mpg: '42',
  fuelPrice: '1.65',
  insuranceAnnual: '650',
  taxAnnual: '180',
  maintenanceAnnual: '500',
  tyresAnnual: '250',
  parkingMonthly: '40',
  breakdownCoverAnnual: '90',
};

const faqItems = [
  {
    question: 'Which running costs should I include?',
    answer:
      'Cover finance payments, insurance, road tax, fuel, servicing, tyres, breakdown cover, parking, and expected depreciation. Including each element shows the true monthly obligation.',
  },
  {
    question: 'How accurate is the car cost calculator?',
    answer:
      'It reflects your inputs. Update mileage, MPG, and fuel price when conditions change to keep the projection realistic. Real receipts are the best way to validate the forecast.',
  },
  {
    question: 'Can I compare several vehicles?',
    answer:
      'Yes. Run separate calculations for each car and export the CSV results. Comparing side-by-side helps you choose the vehicle that fits your monthly budget.',
  },
];

const emotionalMessage =
  'Owning a car should support your lifestyle rather than strain it. Understand every pound so you can drive with confidence and plan for the adventures ahead.';

const emotionalQuote = {
  text: 'The cars we drive say a lot about us.',
  author: 'Alexandra Paul',
};

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

function parseNumber(value) {
  if (value == null) return 0;
  const cleaned = String(value).replace(/,/g, '').trim();
  const numeric = Number.parseFloat(cleaned);
  return Number.isFinite(numeric) ? numeric : 0;
}

function formatCurrency(value) {
  return currencyFormatter.format(Number.isFinite(value) ? value : 0);
}

function calculateMonthlyPayment(principal, annualRate, termYears) {
  if (principal <= 0 || termYears <= 0) return 0;
  const monthlyRate = annualRate / 100 / 12;
  const totalMonths = termYears * 12;
  if (monthlyRate === 0) return principal / totalMonths;
  return (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -totalMonths));
}

function calculateCarCosts(inputs) {
  const purchasePrice = parseNumber(inputs.purchasePrice);
  const depositPercent = parseNumber(inputs.depositPercent);
  const interestRate = parseNumber(inputs.interestRate);
  const termYears = parseNumber(inputs.termYears);
  const expectedDepreciation = parseNumber(inputs.expectedDepreciation);
  const annualMileage = parseNumber(inputs.annualMileage);
  const mpg = parseNumber(inputs.mpg);
  const fuelPrice = parseNumber(inputs.fuelPrice);
  const insuranceAnnual = parseNumber(inputs.insuranceAnnual);
  const taxAnnual = parseNumber(inputs.taxAnnual);
  const maintenanceAnnual = parseNumber(inputs.maintenanceAnnual);
  const tyresAnnual = parseNumber(inputs.tyresAnnual);
  const parkingMonthly = parseNumber(inputs.parkingMonthly);
  const breakdownCoverAnnual = parseNumber(inputs.breakdownCoverAnnual);

  if (purchasePrice <= 0 || termYears <= 0 || mpg <= 0 || annualMileage < 0) {
    return null;
  }

  const depositAmount = purchasePrice * (depositPercent / 100);
  const financedAmount = Math.max(purchasePrice - depositAmount, 0);
  const financePayment = calculateMonthlyPayment(financedAmount, interestRate, termYears);

  const litresPerYear = (annualMileage / mpg) * 4.546; // UK gallons to litres
  const totalAnnualFuel = litresPerYear * fuelPrice;
  const monthlyFuel = totalAnnualFuel / 12;
  const monthlyInsurance = insuranceAnnual / 12;
  const monthlyTax = taxAnnual / 12;
  const monthlyMaintenance = maintenanceAnnual / 12;
  const monthlyTyres = tyresAnnual / 12;
  const monthlyBreakdown = breakdownCoverAnnual / 12;
  const monthsForDepreciation = termYears * 12;
  const monthlyDepreciation = monthsForDepreciation > 0 ? expectedDepreciation / monthsForDepreciation : 0;

  const totalMonthlyCost =
    financePayment +
    monthlyFuel +
    monthlyInsurance +
    monthlyTax +
    monthlyMaintenance +
    monthlyTyres +
    monthlyBreakdown +
    parkingMonthly +
    monthlyDepreciation;

  return {
    purchasePrice,
    depositPercent,
    interestRate,
    termYears,
    expectedDepreciation,
    annualMileage,
    mpg,
    fuelPrice,
    insuranceAnnual,
    taxAnnual,
    maintenanceAnnual,
    tyresAnnual,
    parkingMonthly,
    breakdownCoverAnnual,
    depositAmount,
    financedAmount,
    financePayment,
    monthlyFuel,
    monthlyInsurance,
    monthlyTax,
    monthlyMaintenance,
    monthlyTyres,
    monthlyBreakdown,
    monthlyDepreciation,
    totalMonthlyCost,
  };
}

export default function CarCostCalculatorPage() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [calculation, setCalculation] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [csvData, setCsvData] = useState(null);

  const relatedCalculators = useMemo(() => getRelatedCalculators(pagePath), []);

  const schema = useCalculatorSchema({
    origin: 'https://www.calcmymoney.co.uk',
    path: pagePath,
    name: 'Car Cost Calculator',
    description: metaDescription,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Transport & Motoring', url: '/calculators#transport' },
      { name: 'Car Cost Calculator', url: pagePath },
    ],
    faq: faqItems,
  });

  const barChartData = useMemo(() => {
    if (!calculation || !hasCalculated) return [];
    return [
      {
        name: 'Monthly costs',
        Finance: calculation.financePayment,
        Fuel: calculation.monthlyFuel,
        Insurance: calculation.monthlyInsurance,
        Tax: calculation.monthlyTax,
        Maintenance: calculation.monthlyMaintenance,
        Tyres: calculation.monthlyTyres,
        Breakdown: calculation.monthlyBreakdown,
        Parking: calculation.parkingMonthly,
        Depreciation: calculation.monthlyDepreciation,
      },
    ];
  }, [calculation, hasCalculated]);

  const pieChartData = useMemo(() => {
    if (!calculation || !hasCalculated) return [];
    return [
      { name: 'Finance', value: calculation.financePayment, color: '#2563eb' },
      { name: 'Fuel', value: calculation.monthlyFuel, color: '#0ea5e9' },
      { name: 'Insurance', value: calculation.monthlyInsurance, color: '#22d3ee' },
      { name: 'Tax', value: calculation.monthlyTax, color: '#14b8a6' },
      { name: 'Maintenance', value: calculation.monthlyMaintenance, color: '#8b5cf6' },
      { name: 'Tyres', value: calculation.monthlyTyres, color: '#f97316' },
      { name: 'Breakdown cover', value: calculation.monthlyBreakdown, color: '#facc15' },
      { name: 'Parking', value: calculation.parkingMonthly, color: '#6366f1' },
      { name: 'Depreciation', value: calculation.monthlyDepreciation, color: '#ef4444' },
    ].filter((item) => item.value > 0);
  }, [calculation, hasCalculated]);

  const handleInputChange = (field) => (event) => {
    const { value } = event.target;
    setInputs((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const result = calculateCarCosts(inputs);
    setHasCalculated(true);

    if (!result) {
      setCalculation(null);
      setCsvData(null);
      return;
    }

    setCalculation(result);

    const csvRows = [
      ['Cost component', 'Monthly amount (£)'],
      ['Finance payment', formatCurrency(result.financePayment)],
      ['Fuel', formatCurrency(result.monthlyFuel)],
      ['Insurance', formatCurrency(result.monthlyInsurance)],
      ['Road tax', formatCurrency(result.monthlyTax)],
      ['Maintenance', formatCurrency(result.monthlyMaintenance)],
      ['Tyres', formatCurrency(result.monthlyTyres)],
      ['Breakdown cover', formatCurrency(result.monthlyBreakdown)],
      ['Parking', formatCurrency(result.parkingMonthly)],
      ['Depreciation', formatCurrency(result.monthlyDepreciation)],
      [],
      ['Total monthly running cost', formatCurrency(result.totalMonthlyCost)],
      ['Financed amount', formatCurrency(result.financedAmount)],
      ['Deposit paid', formatCurrency(result.depositAmount)],
    ];
    setCsvData(csvRows);
  };

  const handleReset = () => {
    setInputs(defaultInputs);
    setCalculation(null);
    setCsvData(null);
    setHasCalculated(false);
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900">
      <SeoHead
        title={pageTitle}
        description={metaDescription}
        canonical={canonicalUrl}
        ogTitle={pageTitle}
        ogDescription={metaDescription}
        ogUrl={canonicalUrl}
        ogSiteName="CalcMyMoney UK"
        ogLocale="en_GB"
        twitterTitle={pageTitle}
        twitterDescription={metaDescription}
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
                Car Cost Calculator
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Understand the full cost of running your vehicle, from finance payments to fuel and maintenance.
              Tweak the assumptions to see how mileage or fuel prices change the monthly bill.
            </p>
          </header>

          <section className="rounded-xl border border-indigo-100 bg-white p-6 shadow-sm dark:border-indigo-900/40 dark:bg-slate-950/40">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2 max-w-2xl">
                <Heading as="h2" size="h3" className="text-slate-900 dark:text-slate-100 !mb-0">
                  Keep motoring costs predictable
                </Heading>
                <p className="text-sm text-slate-600 dark:text-slate-300">{emotionalMessage}</p>
              </div>
              <blockquote className="max-w-sm rounded-lg border border-indigo-200 bg-indigo-50/70 p-4 text-sm text-indigo-900 shadow-sm dark:border-indigo-800/60 dark:bg-indigo-950/40 dark:text-indigo-100">
                <div className="flex items-start gap-2">
                  <Quote className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <p className="italic leading-relaxed">“{emotionalQuote.text}”</p>
                </div>
                <footer className="mt-3 text-right text-xs font-medium uppercase tracking-wide text-indigo-700 dark:text-indigo-300">
                  — {emotionalQuote.author}
                </footer>
              </blockquote>
            </div>
          </section>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
            <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Car className="h-5 w-5 text-indigo-600 dark:text-indigo-300" aria-hidden="true" />
                  Vehicle inputs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="purchasePrice">Purchase price (£)</Label>
                      <Input
                        id="purchasePrice"
                        inputMode="decimal"
                        value={inputs.purchasePrice}
                        onChange={handleInputChange('purchasePrice')}
                        placeholder="e.g. 22,000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="depositPercent">Deposit (%)</Label>
                      <Input
                        id="depositPercent"
                        inputMode="decimal"
                        value={inputs.depositPercent}
                        onChange={handleInputChange('depositPercent')}
                        placeholder="e.g. 10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="interestRate">Finance rate (% APR)</Label>
                      <Input
                        id="interestRate"
                        inputMode="decimal"
                        value={inputs.interestRate}
                        onChange={handleInputChange('interestRate')}
                        placeholder="e.g. 5.9"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="termYears">Finance term (years)</Label>
                      <Input
                        id="termYears"
                        inputMode="decimal"
                        value={inputs.termYears}
                        onChange={handleInputChange('termYears')}
                        placeholder="e.g. 4"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expectedDepreciation">Expected depreciation (£ total)</Label>
                      <Input
                        id="expectedDepreciation"
                        inputMode="decimal"
                        value={inputs.expectedDepreciation}
                        onChange={handleInputChange('expectedDepreciation')}
                        placeholder="e.g. 3,000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="annualMileage">Annual mileage (miles)</Label>
                      <Input
                        id="annualMileage"
                        inputMode="decimal"
                        value={inputs.annualMileage}
                        onChange={handleInputChange('annualMileage')}
                        placeholder="e.g. 9,000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mpg">Fuel efficiency (MPG)</Label>
                      <Input
                        id="mpg"
                        inputMode="decimal"
                        value={inputs.mpg}
                        onChange={handleInputChange('mpg')}
                        placeholder="e.g. 42"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fuelPrice">Fuel price (£ per litre)</Label>
                      <Input
                        id="fuelPrice"
                        inputMode="decimal"
                        value={inputs.fuelPrice}
                        onChange={handleInputChange('fuelPrice')}
                        placeholder="e.g. 1.65"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="insuranceAnnual">Insurance (£ per year)</Label>
                      <Input
                        id="insuranceAnnual"
                        inputMode="decimal"
                        value={inputs.insuranceAnnual}
                        onChange={handleInputChange('insuranceAnnual')}
                        placeholder="e.g. 650"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="taxAnnual">Road tax (£ per year)</Label>
                      <Input
                        id="taxAnnual"
                        inputMode="decimal"
                        value={inputs.taxAnnual}
                        onChange={handleInputChange('taxAnnual')}
                        placeholder="e.g. 180"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maintenanceAnnual">Maintenance & servicing (£ per year)</Label>
                      <Input
                        id="maintenanceAnnual"
                        inputMode="decimal"
                        value={inputs.maintenanceAnnual}
                        onChange={handleInputChange('maintenanceAnnual')}
                        placeholder="e.g. 500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tyresAnnual">Tyres (£ per year)</Label>
                      <Input
                        id="tyresAnnual"
                        inputMode="decimal"
                        value={inputs.tyresAnnual}
                        onChange={handleInputChange('tyresAnnual')}
                        placeholder="e.g. 250"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="parkingMonthly">Parking permits (£ per month)</Label>
                      <Input
                        id="parkingMonthly"
                        inputMode="decimal"
                        value={inputs.parkingMonthly}
                        onChange={handleInputChange('parkingMonthly')}
                        placeholder="e.g. 40"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="breakdownCoverAnnual">Breakdown cover (£ per year)</Label>
                      <Input
                        id="breakdownCoverAnnual"
                        inputMode="decimal"
                        value={inputs.breakdownCoverAnnual}
                        onChange={handleInputChange('breakdownCoverAnnual')}
                        placeholder="e.g. 90"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button type="submit" className="flex-1">
                      Calculate car costs
                    </Button>
                    <Button type="button" variant="outline" onClick={handleReset} className="flex-1">
                      Reset
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-6">
              {!hasCalculated && (
                <Card className="border border-dashed border-slate-300 bg-white/50 text-slate-700 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-200">
                  <CardContent className="py-10 text-center text-sm leading-relaxed">
                    Enter your vehicle, finance, and running cost details, then press{' '}
                    <span className="font-semibold">Calculate car costs</span> to see a full monthly cost
                    breakdown with download options.
                  </CardContent>
                </Card>
              )}

              {hasCalculated && !calculation && (
                <Card className="border border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950/40 dark:text-red-200">
                  <CardContent className="py-6 text-sm">
                    Please review the inputs. The calculator needs a purchase price above zero, a finance term, and
                    positive MPG to estimate running costs.
                  </CardContent>
                </Card>
              )}

              {hasCalculated && calculation && (
                <>
                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Wallet className="h-5 w-5 text-indigo-600 dark:text-indigo-300" aria-hidden="true" />
                        Monthly budget summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                        <p className="text-sm text-slate-600 dark:text-slate-300">Total monthly cost</p>
                        <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                          {formatCurrency(calculation.totalMonthlyCost)}
                        </p>
                      </div>
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                        <p className="text-sm text-slate-600 dark:text-slate-300">Finance payment</p>
                        <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                          {formatCurrency(calculation.financePayment)}
                        </p>
                      </div>
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                        <p className="text-sm text-slate-600 dark:text-slate-300">Fuel each month</p>
                        <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                          {formatCurrency(calculation.monthlyFuel)}
                        </p>
                      </div>
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                        <p className="text-sm text-slate-600 dark:text-slate-300">Insurance per month</p>
                        <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                          {formatCurrency(calculation.monthlyInsurance)}
                        </p>
                      </div>
                      <div className="sm:col-span-2">
                        <ExportActions
                          csvData={csvData}
                          fileName="car-cost-calculator-results"
                          title="Car cost calculator results"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Gauge className="h-5 w-5 text-indigo-600 dark:text-indigo-300" aria-hidden="true" />
                        Cost spread
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
                        <ResultBreakdownChart data={pieChartData} title="Monthly running cost split" />
                      </Suspense>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Gauge className="h-5 w-5 text-indigo-600 dark:text-indigo-300" aria-hidden="true" />
                        Monthly components
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barChartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis tickFormatter={(value) => formatCurrency(value)} />
                          <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                          <Legend />
                          <Bar dataKey="Finance" stackId="a" fill="#2563eb" />
                          <Bar dataKey="Fuel" stackId="a" fill="#0ea5e9" />
                          <Bar dataKey="Insurance" stackId="a" fill="#22d3ee" />
                          <Bar dataKey="Tax" stackId="a" fill="#14b8a6" />
                          <Bar dataKey="Maintenance" stackId="a" fill="#8b5cf6" />
                          <Bar dataKey="Tyres" stackId="a" fill="#f97316" />
                          <Bar dataKey="Breakdown" stackId="a" fill="#facc15" />
                          <Bar dataKey="Parking" stackId="a" fill="#6366f1" />
                          <Bar dataKey="Depreciation" stackId="a" fill="#ef4444" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </div>

          <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
              <BookOpen className="h-5 w-5 text-indigo-600 dark:text-indigo-300" aria-hidden="true" />
              <Heading as="h2" size="h3" className="!mb-0">
                Motoring money tips
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Lock in cheaper fuel prices with supermarket loyalty schemes, service the car on schedule to avoid
              costly repairs, and keep a sinking fund for tyres and unexpected bills. Re-running this calculator
              each renewal keeps your budget realistic.
            </p>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <FAQSection faqs={faqItems} />
          </section>

          <RelatedCalculators calculators={relatedCalculators} />

          <div className="flex flex-col items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 md:flex-row">
            <span>Plan other motoring costs with our transport tools.</span>
            <Link
              to="/calculators"
              className="inline-flex items-center rounded-lg border border-indigo-200 px-4 py-2 font-medium text-indigo-700 transition hover:border-indigo-400 hover:text-indigo-900 dark:border-indigo-800 dark:text-indigo-300 dark:hover:border-indigo-600 dark:hover:text-indigo-100"
            >
              Browse calculator directory
            </Link>
          </div>
        </div>
      </CalculatorWrapper>
    </div>
  );
}

