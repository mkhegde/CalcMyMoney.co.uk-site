import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, Gauge, Fuel, Users } from 'lucide-react';

import Heading from '@/components/common/Heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';
import EmotionalHook from '@/components/calculators/EmotionalHook';
import DirectoryLinks from '@/components/calculators/DirectoryLinks';
import RelatedCalculators from '@/components/calculators/RelatedCalculators';
import ExportActions from '@/components/calculators/ExportActions';
import ResultBreakdownChart from '@/components/calculators/ResultBreakdownChart';
import { JsonLd, faqSchema } from '@/components/seo/JsonLd.jsx';
import { getCalculatorKeywords } from '@/components/data/calculatorKeywords.js';
import { createCalculatorWebPageSchema, createCalculatorBreadcrumbs } from '@/utils/calculatorSchema.js';
import { sanitiseNumber } from '@/utils/sanitiseNumber.js';

const CALCULATOR_NAME = 'Fuel Cost Calculator';
const canonicalUrl = 'https://www.calcmymoney.co.uk/fuel-cost-calculator';
const keywords = getCalculatorKeywords(CALCULATOR_NAME);

const metaDescription =
  'Estimate UK road trip fuel spend by combining journey distance, fuel economy, and current pump prices. Split the total between passengers in seconds.';

const defaultInputs = {
  distance: '250',
  distanceUnit: 'miles',
  fuelPrice: '151.9',
  fuelPriceUnit: 'per-litre',
  economyValue: '42',
  economyUnit: 'mpg',
  passengers: '2',
};

const fuelFaqs = [
  {
    question: 'Should I calculate in miles per gallon or litres per 100km?',
    answer:
      'Whichever unit matches your vehicle. Toggle the fuel economy unit and the calculator converts automatically, using UK (imperial) miles per gallon when selected.',
  },
  {
    question: 'How do I reflect fluctuating pump prices?',
    answer:
      'Update the price field with the latest rate from your preferred station. You can switch between pence per litre and pounds per gallon depending on how prices are displayed.',
  },
  {
    question: 'Can we split the cost for a car share?',
    answer:
      'Yes. Enter the number of passengers and the per-person share updates instantly, perfect for work travel, festivals, or weekend getaways.',
  },
];

const directoryLinks = [
  {
    label: 'Browse the full calculator directory',
    url: '/#calculator-directory',
    description: 'See every UK finance calculator in a single place.',
  },
  {
    label: 'Utilities & household tools',
    url: '/#utilities-tools',
    description: 'Compare energy, transport, and living costs side by side.',
  },
  {
    label: 'Travel budget calculator',
    url: '/travel-budget-calculator',
    description: 'Plan accommodation, food, and activities alongside your fuel costs.',
  },
];

const relatedCalculators = [
  {
    name: 'Commute Cost Calculator',
    url: '/commute-cost-calculator',
    description: 'Compare driving, public transport, and cycling for weekday commutes.',
  },
  {
    name: 'Fuel Cost Splitter',
    url: '/fuel-cost-splitter',
    description: 'Divide fuel and tolls across passengers for shared journeys.',
  },
  {
    name: 'Energy Bill Calculator',
    url: '/energy-bill-calculator',
    description: 'Balance travel spending with household utility bills.',
  },
];

const webPageSchema = createCalculatorWebPageSchema({
  name: CALCULATOR_NAME,
  description: metaDescription,
  url: canonicalUrl,
  keywords,
});

const breadcrumbSchema = createCalculatorBreadcrumbs({
  name: CALCULATOR_NAME,
  url: canonicalUrl,
});

const faqStructuredData = faqSchema(fuelFaqs);

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const formatLitres = (value) =>
  `${value.toLocaleString('en-GB', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} L`;

const convertToMpg = (economyValue, economyUnit) => {
  if (economyUnit === 'mpg') {
    return Math.max(economyValue, 0.01);
  }
  return economyValue > 0 ? 282.481 / economyValue : 0;
};

const normaliseDistance = (distance, distanceUnit) =>
  distanceUnit === 'miles' ? distance : distance * 0.621371;

const normalisePricePerLitre = (fuelPrice, fuelPriceUnit) =>
  fuelPriceUnit === 'per-litre' ? fuelPrice : fuelPrice / 4.54609;

const calculateFuelCost = ({
  distance,
  distanceUnit,
  fuelPrice,
  fuelPriceUnit,
  economyValue,
  economyUnit,
  passengers,
}) => {
  const miles = normaliseDistance(distance, distanceUnit);
  const mpg = convertToMpg(economyValue, economyUnit);
  if (miles <= 0 || mpg <= 0) {
    return {
      valid: false,
      message: 'Enter a journey distance and positive fuel economy to estimate costs.',
    };
  }

  const gallonsRequired = miles / mpg;
  const litresRequired = gallonsRequired * 4.54609;
  const pricePerLitre = normalisePricePerLitre(fuelPrice, fuelPriceUnit);
  const totalCost = litresRequired * pricePerLitre;
  const people = Math.max(passengers, 1);
  const costPerPassenger = totalCost / people;
  const costPerMile = totalCost / miles;

  return {
    valid: true,
    miles,
    litresRequired,
    gallonsRequired,
    pricePerLitre,
    totalCost,
    costPerPassenger,
    costPerMile,
    passengers: people,
  };
};

export default function FuelCostCalculatorPage() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [results, setResults] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);

  const handleInputChange = (field) => (event) => {
    setInputs((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const setUnit = (field, value) => () => {
    setInputs((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleReset = () => {
    setInputs(defaultInputs);
    setResults(null);
    setHasCalculated(false);
  };

  const handleCalculate = (event) => {
    event.preventDefault();
    const payload = {
      distance: sanitiseNumber(inputs.distance),
      distanceUnit: inputs.distanceUnit,
      fuelPrice: sanitiseNumber(inputs.fuelPrice),
      fuelPriceUnit: inputs.fuelPriceUnit,
      economyValue: sanitiseNumber(inputs.economyValue),
      economyUnit: inputs.economyUnit,
      passengers: sanitiseNumber(inputs.passengers),
    };
    const outcome = calculateFuelCost(payload);
    setResults(outcome);
    setHasCalculated(true);
  };

  const chartData = useMemo(() => {
    if (!results?.valid) return [];
    const data = Array.from({ length: results.passengers }).map((_, index) => ({
      name: `Passenger ${index + 1}`,
      value: results.costPerPassenger,
      color: ['#0ea5e9', '#f97316', '#22c55e', '#a855f7', '#14b8a6', '#facc15'][index % 6],
    }));
    return data;
  }, [results]);

  const csvData = useMemo(() => {
    if (!results?.valid) return null;
    return [
      ['Metric', 'Value'],
      ['Distance (miles)', results.miles.toFixed(2)],
      ['Fuel required (litres)', results.litresRequired.toFixed(2)],
      ['Fuel required (gallons)', results.gallonsRequired.toFixed(2)],
      ['Price per litre (£)', results.pricePerLitre.toFixed(4)],
      ['Total fuel cost (£)', results.totalCost.toFixed(2)],
      ['Cost per passenger (£)', results.costPerPassenger.toFixed(2)],
      ['Cost per mile (£)', results.costPerMile.toFixed(4)],
      ['Passengers', results.passengers],
    ];
  }, [results]);

  const showResults = hasCalculated && results?.valid;

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>{`${CALCULATOR_NAME} | Trip Fuel Planner`}</title>
        <meta name="description" content={metaDescription} />
        {keywords.length ? <meta name="keywords" content={keywords.join(', ')} /> : null}
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>
      <JsonLd data={webPageSchema} />
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={faqStructuredData} />

      <section className="bg-gradient-to-r from-amber-900 via-slate-900 to-amber-900 py-16 text-white">
        <div className="mx-auto max-w-4xl space-y-6 px-4 text-center sm:px-6 lg:px-8">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Fuel Cost Calculator
          </Heading>
          <p className="text-lg md:text-xl text-amber-100">
            Estimate real-world fuel spend before you set off and split the bill fairly with passengers.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <EmotionalHook
          title="No more surprises at the pump"
          message="When you price every journey, even the daily commute becomes a conscious choice. Use the numbers to decide when to car share, take the train, or plan that road trip."
          quote="A budget is telling your money where to go instead of wondering where it went."
          author="Dave Ramsey"
        />
      </div>

      <CalculatorWrapper>
        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          <Card className="border border-amber-200 bg-white text-slate-900 shadow-sm dark:border-amber-900 dark:bg-slate-950 dark:text-slate-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Calculator className="h-5 w-5 text-amber-600 dark:text-amber-300" />
                Journey inputs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-5" onSubmit={handleCalculate}>
                <div>
                  <Label htmlFor="distance" className="text-sm font-medium">
                    Distance
                  </Label>
                  <Input
                    id="distance"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="1"
                    value={inputs.distance}
                    onChange={handleInputChange('distance')}
                    placeholder="e.g., 250"
                  />
                  <div className="mt-2 flex gap-2">
                    <Button type="button" variant={inputs.distanceUnit === 'miles' ? 'default' : 'outline'} onClick={setUnit('distanceUnit', 'miles')}>
                      Miles
                    </Button>
                    <Button type="button" variant={inputs.distanceUnit === 'km' ? 'default' : 'outline'} onClick={setUnit('distanceUnit', 'km')}>
                      Kilometres
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="fuelPrice" className="text-sm font-medium">
                    Fuel price
                  </Label>
                  <Input
                    id="fuelPrice"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="0.1"
                    value={inputs.fuelPrice}
                    onChange={handleInputChange('fuelPrice')}
                    placeholder="e.g., 151.9"
                  />
                  <div className="mt-2 flex gap-2">
                    <Button type="button" variant={inputs.fuelPriceUnit === 'per-litre' ? 'default' : 'outline'} onClick={setUnit('fuelPriceUnit', 'per-litre')}>
                      pence / litre
                    </Button>
                    <Button type="button" variant={inputs.fuelPriceUnit === 'per-gallon' ? 'default' : 'outline'} onClick={setUnit('fuelPriceUnit', 'per-gallon')}>
                      £ / gallon
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="economyValue" className="text-sm font-medium">
                    Fuel economy
                  </Label>
                  <Input
                    id="economyValue"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="0.1"
                    value={inputs.economyValue}
                    onChange={handleInputChange('economyValue')}
                    placeholder="e.g., 42"
                  />
                  <div className="mt-2 flex gap-2">
                    <Button type="button" variant={inputs.economyUnit === 'mpg' ? 'default' : 'outline'} onClick={setUnit('economyUnit', 'mpg')}>
                      MPG (UK)
                    </Button>
                    <Button type="button" variant={inputs.economyUnit === 'l_per_100km' ? 'default' : 'outline'} onClick={setUnit('economyUnit', 'l_per_100km')}>
                      L / 100km
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="passengers" className="text-sm font-medium">
                    Passengers
                  </Label>
                  <Input
                    id="passengers"
                    type="number"
                    inputMode="numeric"
                    min="1"
                    step="1"
                    value={inputs.passengers}
                    onChange={handleInputChange('passengers')}
                    placeholder="e.g., 2"
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    Include the driver so the cost split reflects the full car.
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button type="submit" className="flex-1">
                    Calculate
                  </Button>
                  <Button type="button" variant="outline" className="flex-1" onClick={handleReset}>
                    Reset
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {showResults ? (
            <div className="space-y-6">
              <Card className="border border-amber-200 bg-amber-50 text-slate-900 shadow-sm dark:border-amber-900 dark:bg-amber-900/20 dark:text-amber-100">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                    <Fuel className="h-5 w-5 text-amber-600 dark:text-amber-200" />
                    Trip fuel cost summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-md bg-white/80 dark:bg-amber-900/40 p-4 border border-amber-100 dark:border-amber-800">
                      <p className="text-xs uppercase tracking-wide text-amber-700 dark:text-amber-200">
                        Total fuel required
                      </p>
                      <p className="text-2xl font-bold text-amber-900 dark:text-amber-100">
                        {formatLitres(results.litresRequired)}
                      </p>
                    </div>
                    <div className="rounded-md bg-white/80 dark:bg-amber-900/40 p-4 border border-amber-100 dark:border-amber-800">
                      <p className="text-xs uppercase tracking-wide text-amber-700 dark:text-amber-200">
                        Total journey cost
                      </p>
                      <p className="text-2xl font-bold text-amber-900 dark:text-amber-100">
                        {currencyFormatter.format(results.totalCost)}
                      </p>
                    </div>
                    <div className="rounded-md bg-white/80 dark:bg-amber-900/40 p-4 border border-amber-100 dark:border-amber-800">
                      <p className="text-xs uppercase tracking-wide text-amber-700 dark:text-amber-200">
                        Cost per passenger
                      </p>
                      <p className="text-2xl font-bold text-amber-900 dark:text-amber-100">
                        {currencyFormatter.format(results.costPerPassenger)}
                      </p>
                      <p className="text-xs text-amber-700 dark:text-amber-200">
                        {results.passengers} people sharing the trip
                      </p>
                    </div>
                    <div className="rounded-md bg-white/80 dark:bg-amber-900/40 p-4 border border-amber-100 dark:border-amber-800">
                      <p className="text-xs uppercase tracking-wide text-amber-700 dark:text-amber-200">
                        Cost per mile
                      </p>
                      <p className="text-2xl font-bold text-amber-900 dark:text-amber-100">
                        {currencyFormatter.format(results.costPerMile)}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-md bg-white dark:bg-slate-900 border border-amber-100 dark:border-amber-900 p-4">
                    <h3 className="text-base font-semibold text-amber-900 dark:text-amber-100 mb-4">
                      Passenger cost split
                    </h3>
                    <ResultBreakdownChart data={chartData} title="Fuel cost split by passenger" />
                  </div>

                  <ExportActions
                    csvData={csvData}
                    fileName="fuel-cost-calculator-results"
                    title="Fuel cost breakdown"
                  />
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="space-y-6">
              <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <CardContent className="flex items-center gap-3 text-slate-700 dark:text-slate-200 py-6">
                  <Users className="h-5 w-5 text-amber-500" aria-hidden="true" />
                  <p className="text-sm">
                    {hasCalculated && results?.message ? (
                      results.message
                    ) : (
                      <>
                        Add your distance, fuel economy, and current pump prices, then press{' '}
                        <strong>Calculate</strong> to plan the trip budget.
                      </>
                    )}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </CalculatorWrapper>

      <section className="bg-white dark:bg-gray-950 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FAQSection faqs={fuelFaqs} />
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 pb-16">
        <DirectoryLinks links={directoryLinks} />
        <RelatedCalculators calculators={relatedCalculators} />
      </div>
    </div>
  );
}
