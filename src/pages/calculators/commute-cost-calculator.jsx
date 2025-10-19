import React, { Suspense, useMemo, useState } from 'react';
import { Calculator, Car, Train, Bus, Bike, Fuel, PiggyBank, Quote, BookOpen } from 'lucide-react';

import SeoHead from '@/components/seo/SeoHead';
import useCalculatorSchema from '@/components/seo/useCalculatorSchema';
import Heading from '@/components/common/Heading';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';
import ExportActions from '@/components/calculators/ExportActions';
import RelatedCalculators from '@/components/calculators/RelatedCalculators';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getRelatedCalculators } from '@/utils/getRelatedCalculators';

const ResultBreakdownChart = React.lazy(() => import('@/components/calculators/ResultBreakdownChart.jsx'));

const keywords = ['commute cost calculator'];

const metaDescription =
  'Estimate your UK commute cost by car, train, bus, or bike. Compare daily, monthly, and yearly travel expenses including parking, fuel, and extras.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/commute-cost-calculator';
const pagePath = '/calculators/commute-cost-calculator';
const pageTitle = 'Commute Cost Calculator | UK Travel Expense Planner';

const faqItems = [
  {
    question: 'What costs should I include for driving?',
    answer:
      'Add fuel, parking, tolls, congestion charges, and maintenance. Enter the round-trip distance and MPG so the calculator can estimate fuel accurately.',
  },
  {
    question: 'How do I compare public transport with driving?',
    answer:
      'Run the calculation for each travel mode. For public transport you can enter daily ticket prices or a monthly pass. Comparing the annual totals helps you choose the best option.',
  },
  {
    question: 'Can I factor in remote working or car sharing?',
    answer:
      'Yes. Reduce the commuting days per week to reflect remote working and divide parking or fuel in the parking/fuel inputs if costs are shared.',
  },
];

const emotionalMessage =
  'Your commute is part of your real salary. Keep the maths on your side so you can decide whether a new job, remote day, or travel pass actually pays off.';

const emotionalQuote = {
  text: 'The secret of getting ahead is getting started.',
  author: 'Mark Twain',
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

const GALLON_TO_LITRE = 4.546;

const modeOptions = [
  { value: 'car', label: 'Car', icon: Car },
  { value: 'train', label: 'Train', icon: Train },
  { value: 'bus', label: 'Bus', icon: Bus },
  { value: 'bike', label: 'Bike', icon: Bike },
];

const defaultInputs = {
  mode: 'car',
  daysPerWeek: '4',
  remoteDays: '1',
  weeksPerYear: '46',
  // Car specific
  roundTripMiles: '24',
  mpg: '38',
  fuelPrice: '1.62',
  maintenancePerMile: '0.12',
  parkingPerDay: '8',
  // Public transport
  ticketPerDay: '15',
  monthlyPass: '280',
  // Bike
  bikeMaintenancePerMonth: '25',
  // Extras
  monthlyExtras: '25',
};

function calculateCommute(inputs) {
  const mode = inputs.mode;
  const daysPerWeek = Math.max(parseNumber(inputs.daysPerWeek), 0);
  const remoteDays = Math.min(Math.max(parseNumber(inputs.remoteDays), 0), daysPerWeek);
  const weeksPerYear = Math.max(parseNumber(inputs.weeksPerYear), 0);

  const commuteDaysPerWeek = Math.max(daysPerWeek - remoteDays, 0);
  const commuteDaysPerYear = commuteDaysPerWeek * weeksPerYear;
  const commuteDaysPerMonth = commuteDaysPerYear / 12 || 0;

  let baseDailyCost = 0;
  const breakdown = {};

  if (mode === 'car') {
    const miles = Math.max(parseNumber(inputs.roundTripMiles), 0);
    const mpg = Math.max(parseNumber(inputs.mpg), 1);
    const fuelPrice = Math.max(parseNumber(inputs.fuelPrice), 0);
    const maintenancePerMile = Math.max(parseNumber(inputs.maintenancePerMile), 0);
    const parkingPerDay = Math.max(parseNumber(inputs.parkingPerDay), 0);

    const fuelCostPerMile = (fuelPrice * GALLON_TO_LITRE) / mpg;
    const fuelCostPerDay = fuelCostPerMile * miles;
    const maintenanceCostPerDay = maintenancePerMile * miles;
    baseDailyCost = fuelCostPerDay + maintenanceCostPerDay + parkingPerDay;
    breakdown.fuel = fuelCostPerDay;
    breakdown.maintenance = maintenanceCostPerDay;
    breakdown.parking = parkingPerDay;
  } else if (mode === 'train' || mode === 'bus') {
    const ticketPerDay = Math.max(parseNumber(inputs.ticketPerDay), 0);
    const monthlyPass = Math.max(parseNumber(inputs.monthlyPass), 0);
    const days = Math.max(commuteDaysPerMonth, 1);
    const passDailyCost = monthlyPass > 0 ? monthlyPass / days : Infinity;
    baseDailyCost = Math.min(ticketPerDay, passDailyCost);
    breakdown.tickets = ticketPerDay;
    breakdown.monthlyPass = passDailyCost === Infinity ? 0 : passDailyCost;
  } else if (mode === 'bike') {
    const bikeMaintenancePerMonth = Math.max(parseNumber(inputs.bikeMaintenancePerMonth), 0);
    const days = Math.max(commuteDaysPerMonth, 1);
    baseDailyCost = bikeMaintenancePerMonth / days;
    breakdown.maintenance = baseDailyCost;
  }

  const monthlyExtras = Math.max(parseNumber(inputs.monthlyExtras), 0);
  const extrasPerDay = commuteDaysPerMonth > 0 ? monthlyExtras / commuteDaysPerMonth : 0;
  breakdown.extras = extrasPerDay;

  const totalDailyCost = baseDailyCost + extrasPerDay;
  const weeklyCost = totalDailyCost * commuteDaysPerWeek;
  const monthlyCost = commuteDaysPerMonth > 0 ? totalDailyCost * commuteDaysPerMonth : weeklyCost * 4;
  const annualCost = totalDailyCost * commuteDaysPerYear;

  return {
    mode,
    totalDailyCost,
    weeklyCost,
    monthlyCost,
    annualCost,
    commuteDaysPerWeek,
    commuteDaysPerYear,
    breakdown,
  };
}

export default function CommuteCostCalculatorPage() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [results, setResults] = useState(null);
  const [csvData, setCsvData] = useState(null);

  const relatedCalculators = useMemo(() => getRelatedCalculators(pagePath), []);

  const schema = useCalculatorSchema({
    origin: 'https://www.calcmymoney.co.uk',
    path: pagePath,
    name: 'Commute Cost Calculator',
    description: metaDescription,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Transport & Motoring Calculators', url: '/calculators#transport' },
      { name: 'Commute Cost Calculator', url: pagePath },
    ],
    faq: faqItems,
  });

  const chartData = useMemo(() => {
    if (!results || !hasCalculated) return [];
    return Object.entries(results.breakdown)
      .filter(([, value]) => value > 0)
      .map(([name, value]) => ({
        name: name.replace(/^\w/, (c) => c.toUpperCase()),
        value,
      }));
  }, [results, hasCalculated]);

  const handleInputChange = (field) => (event) => {
    const { value } = event.target;
    setInputs((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const computed = calculateCommute(inputs);
    setHasCalculated(true);
    setResults(computed);

    setCsvData([
      ['Commute mode', computed.mode],
      ['Commute days per week', computed.commuteDaysPerWeek],
      ['Commute days per year', computed.commuteDaysPerYear],
      ['Daily cost', currencyFormatter.format(computed.totalDailyCost)],
      ['Weekly cost', currencyFormatter.format(computed.weeklyCost)],
      ['Monthly cost', currencyFormatter.format(computed.monthlyCost)],
      ['Annual cost', currencyFormatter.format(computed.annualCost)],
      [],
      ['Cost component', 'Daily amount (£)'],
      ...Object.entries(computed.breakdown).map(([key, value]) => [
        key.replace(/^\w/, (c) => c.toUpperCase()),
        currencyFormatter.format(value),
      ]),
    ]);
  };

  const handleReset = () => {
    setInputs(defaultInputs);
    setHasCalculated(false);
    setResults(null);
    setCsvData(null);
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
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-600/10 text-blue-700 dark:bg-blue-500/20 dark:text-blue-200">
                <Calculator className="h-6 w-6" aria-hidden="true" />
              </span>
              <Heading as="h1" size="h1" className="!mb-0">
                Commute Cost Calculator
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Compare the real cost of getting to work by car, train, bus, or bike. Adjust commute days,
              ticket prices, parking, and extras to see how the total changes over the year.
            </p>
          </header>

          <section className="rounded-xl border border-blue-100 bg-white p-6 shadow-sm dark:border-blue-900/40 dark:bg-slate-950/40">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2 max-w-2xl">
                <Heading as="h2" size="h3" className="text-slate-900 dark:text-slate-100 !mb-0">
                  See the cost of every commute
                </Heading>
                <p className="text-sm text-slate-600 dark:text-slate-300">{emotionalMessage}</p>
              </div>
              <blockquote className="max-w-sm rounded-lg border border-blue-200 bg-blue-50/70 p-4 text-sm text-blue-900 shadow-sm dark:border-blue-800/60 dark:bg-blue-950/40 dark:text-blue-100">
                <div className="flex items-start gap-2">
                  <Quote className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <p className="italic leading-relaxed">“{emotionalQuote.text}”</p>
                </div>
                <footer className="mt-3 text-right text-xs font-medium uppercase tracking-wide text-blue-700 dark:text-blue-300">
                  — {emotionalQuote.author}
                </footer>
              </blockquote>
            </div>
          </section>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
            <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Fuel className="h-5 w-5 text-blue-600 dark:text-blue-300" aria-hidden="true" />
                  Commute inputs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <Label>Travel mode</Label>
                    <Select value={inputs.mode} onValueChange={(value) => setInputs((prev) => ({ ...prev, mode: value }))}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select travel mode" />
                      </SelectTrigger>
                      <SelectContent>
                        {modeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <span className="flex items-center gap-2">
                              <option.icon className="h-4 w-4" />
                              {option.label}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="daysPerWeek">Days in office per week</Label>
                      <Input
                        id="daysPerWeek"
                        inputMode="numeric"
                        value={inputs.daysPerWeek}
                        onChange={handleInputChange('daysPerWeek')}
                        placeholder="e.g. 4"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="remoteDays">Remote days per week</Label>
                      <Input
                        id="remoteDays"
                        inputMode="numeric"
                        value={inputs.remoteDays}
                        onChange={handleInputChange('remoteDays')}
                        placeholder="e.g. 1"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weeksPerYear">Working weeks per year</Label>
                      <Input
                        id="weeksPerYear"
                        inputMode="numeric"
                        value={inputs.weeksPerYear}
                        onChange={handleInputChange('weeksPerYear')}
                        placeholder="e.g. 46"
                      />
                    </div>
                  </div>

                  {inputs.mode === 'car' && (
                    <div className="space-y-4">
                      <Heading as="h3" size="h4" className="text-slate-900 dark:text-slate-100 !mb-0">
                        Driving costs
                      </Heading>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="roundTripMiles">Daily round trip (miles)</Label>
                          <Input
                            id="roundTripMiles"
                            inputMode="decimal"
                            value={inputs.roundTripMiles}
                            onChange={handleInputChange('roundTripMiles')}
                            placeholder="e.g. 24"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="mpg">Vehicle MPG (UK)</Label>
                          <Input
                            id="mpg"
                            inputMode="decimal"
                            value={inputs.mpg}
                            onChange={handleInputChange('mpg')}
                            placeholder="e.g. 38"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="fuelPrice">Fuel price (£ per litre)</Label>
                          <Input
                            id="fuelPrice"
                            inputMode="decimal"
                            value={inputs.fuelPrice}
                            onChange={handleInputChange('fuelPrice')}
                            placeholder="e.g. 1.62"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="maintenancePerMile">Maintenance per mile (£)</Label>
                          <Input
                            id="maintenancePerMile"
                            inputMode="decimal"
                            value={inputs.maintenancePerMile}
                            onChange={handleInputChange('maintenancePerMile')}
                            placeholder="e.g. 0.12"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="parkingPerDay">Parking per day (£)</Label>
                          <Input
                            id="parkingPerDay"
                            inputMode="decimal"
                            value={inputs.parkingPerDay}
                            onChange={handleInputChange('parkingPerDay')}
                            placeholder="e.g. 8"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {(inputs.mode === 'train' || inputs.mode === 'bus') && (
                    <div className="space-y-4">
                      <Heading as="h3" size="h4" className="text-slate-900 dark:text-slate-100 !mb-0">
                        Public transport costs
                      </Heading>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="ticketPerDay">Ticket per day (£)</Label>
                          <Input
                            id="ticketPerDay"
                            inputMode="decimal"
                            value={inputs.ticketPerDay}
                            onChange={handleInputChange('ticketPerDay')}
                            placeholder="e.g. 15"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="monthlyPass">Monthly pass (£)</Label>
                          <Input
                            id="monthlyPass"
                            inputMode="decimal"
                            value={inputs.monthlyPass}
                            onChange={handleInputChange('monthlyPass')}
                            placeholder="e.g. 280"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {inputs.mode === 'bike' && (
                    <div className="space-y-4">
                      <Heading as="h3" size="h4" className="text-slate-900 dark:text-slate-100 !mb-0">
                        Cycling costs
                      </Heading>
                      <div className="space-y-2">
                        <Label htmlFor="bikeMaintenancePerMonth">Bike maintenance per month (£)</Label>
                        <Input
                          id="bikeMaintenancePerMonth"
                          inputMode="decimal"
                          value={inputs.bikeMaintenancePerMonth}
                          onChange={handleInputChange('bikeMaintenancePerMonth')}
                          placeholder="e.g. 25"
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="monthlyExtras">Monthly extras (£)</Label>
                    <Input
                      id="monthlyExtras"
                      inputMode="decimal"
                      value={inputs.monthlyExtras}
                      onChange={handleInputChange('monthlyExtras')}
                      placeholder="e.g. 25"
                    />
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Coffee, tolls, congestion charges, or other regular commute extras.
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button type="submit" className="flex-1">
                      Calculate commute costs
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
                <Card className="border border-dashed border-slate-300 bg-white/70 text-slate-700 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200">
                  <CardContent className="py-10 text-center text-sm leading-relaxed">
                    Enter your commute details and press <span className="font-semibold">Calculate commute costs</span>{' '}
                    to see daily, monthly, and annual totals for your travel.
                  </CardContent>
                </Card>
              )}

              {hasCalculated && results && (
                <>
                  <Card className="border border-blue-200 bg-white shadow-sm dark:border-blue-900 dark:bg-blue-900/30 dark:text-blue-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <PiggyBank className="h-5 w-5 text-blue-600 dark:text-blue-200" aria-hidden="true" />
                        Commute summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm text-blue-900 dark:text-blue-200">Daily cost</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.totalDailyCost)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-blue-900 dark:text-blue-200">Weekly cost</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.weeklyCost)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-blue-900 dark:text-blue-200">Monthly cost</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.monthlyCost)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-blue-900 dark:text-blue-200">Annual cost</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.annualCost)}
                        </p>
                      </div>
                      <div className="sm:col-span-2">
                        <ExportActions
                          csvData={csvData}
                          fileName="commute-cost-results"
                          title="Commute cost calculator results"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {chartData.length > 0 && (
                    <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <Fuel className="h-5 w-5 text-blue-600 dark:text-blue-300" aria-hidden="true" />
                          Daily cost breakdown
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
                          <ResultBreakdownChart data={chartData} title="Commute cost breakdown" />
                        </Suspense>
                      </CardContent>
                    </Card>
                  )}
                </>
              )}
            </div>
          </div>

          <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
              <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-300" aria-hidden="true" />
              <Heading as="h2" size="h3" className="!mb-0">
                Optimise your commute budget
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Check if hybrid working, cycling part of the route, or switching to a season ticket cuts
              your annual cost. Revisit the calculator whenever prices rise or your travel pattern
              changes.
            </p>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <FAQSection faqs={faqItems} />
          </section>

          <RelatedCalculators calculators={relatedCalculators} />
        </div>
      </CalculatorWrapper>
    </div>
  );
}

