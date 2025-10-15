import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, Gauge, Fuel, Users } from 'lucide-react';

import Heading from '@/components/common/Heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';

const keywords = [
  'fuel cost calculator',
  'fuel consumption calculator',
  'trip fuel cost calculator',
  'fuel price calculator',
  'fuel economy calculator',
];

const metaDescription =
  'Use our fuel cost calculator and fuel consumption calculator to plan trips, compare fuel price calculator scenarios, and check fuel economy calculator savings per passenger.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/fuel-cost-calculator';
const schemaKeywords = keywords.slice(0, 5);

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
});

const fuelFaqs = [
  {
    question: 'Should I enter MPG or L/100km?',
    answer:
      'Pick the unit that matches your vehicle. Toggle the economy units and the fuel consumption calculator converts automatically. For UK cars, miles per gallon (imperial) is common.',
  },
  {
    question: 'How do I include fuel price fluctuations?',
    answer:
      'Adjust the fuel price slider for different stations or regions. The trip fuel cost calculator updates in real time so you can decide whether to fill up before or after a long drive.',
  },
  {
    question: 'Can I split costs between passengers?',
    answer:
      'Yes. Enter the number of travellers to calculate per-person costs. The fuel economy calculator will show total and individual contributions, perfect for car shares.',
  },
];

const convertToMpg = ({ economyValue, economyUnit }) => {
  if (economyUnit === 'mpg') return Math.max(economyValue, 0.01);
  // L/100km to MPG (imperial)
  return economyValue > 0 ? 282.481 / economyValue : 0;
};

const calculateFuelCost = ({
  distance,
  distanceUnit,
  fuelPrice,
  fuelPriceUnit,
  economyValue,
  economyUnit,
  passengers,
}) => {
  const miles = distanceUnit === 'miles' ? Math.max(distance, 0) : Math.max(distance, 0) * 0.621371;
  const mpg = convertToMpg({ economyValue, economyUnit });

  const gallonsRequired = mpg > 0 ? miles / mpg : 0;
  const litresRequired = gallonsRequired * 4.54609;

  const pricePerLitre =
    fuelPriceUnit === 'per-litre' ? Math.max(fuelPrice, 0) : Math.max(fuelPrice, 0) / 4.54609;

  const totalCost = litresRequired * pricePerLitre;
  const perPassenger = Math.max(passengers, 1) > 0 ? totalCost / Math.max(passengers, 1) : totalCost;
  const costPerMile = miles > 0 ? totalCost / miles : 0;

  return {
    miles,
    litresRequired,
    gallonsRequired,
    pricePerLitre,
    totalCost,
    perPassenger,
    costPerMile,
  };
};

export default function FuelCostCalculatorPage() {
  const [inputs, setInputs] = useState({
    distance: 250,
    distanceUnit: 'miles',
    fuelPrice: 151.9,
    fuelPriceUnit: 'per-litre',
    economyValue: 42,
    economyUnit: 'mpg',
    passengers: 2,
  });

  const results = useMemo(
    () =>
      calculateFuelCost({
        distance: Number(inputs.distance) || 0,
        distanceUnit: inputs.distanceUnit,
        fuelPrice: Number(inputs.fuelPrice) || 0,
        fuelPriceUnit: inputs.fuelPriceUnit,
        economyValue: Number(inputs.economyValue) || 0,
        economyUnit: inputs.economyUnit,
        passengers: Number(inputs.passengers) || 1,
      }),
    [inputs]
  );

  const resetAll = () =>
    setInputs({
      distance: 250,
      distanceUnit: 'miles',
      fuelPrice: 151.9,
      fuelPriceUnit: 'per-litre',
      economyValue: 42,
      economyUnit: 'mpg',
      passengers: 2,
    });

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>Fuel Cost Calculator | Fuel Consumption Calculator</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Fuel Cost Calculator | Fuel Consumption Calculator" />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Calc My Money" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Fuel Cost Calculator | Fuel Consumption Calculator" />
        <meta name="twitter:description" content={metaDescription} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: 'Fuel Cost Calculator',
              url: canonicalUrl,
              description: metaDescription,
              keywords: schemaKeywords,
              inLanguage: 'en-GB',
              potentialAction: {
                '@type': 'Action',
                name: 'Estimate trip costs with a fuel cost calculator',
                target: canonicalUrl,
              },
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-amber-900 via-slate-900 to-amber-900 py-16 text-white">
        <div className="mx-auto max-w-4xl space-y-6 px-4 text-center sm:px-6 lg:px-8">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Fuel Cost Calculator
          </Heading>
          <p className="text-lg md:text-xl text-amber-100">
            Plan road trips, car shares, and commutes with accurate fuel consumption estimates tailored to
            your vehicle.
          </p>
        </div>
      </section>

      <CalculatorWrapper>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <div className="space-y-6">
            <Card className="border border-amber-200 bg-white text-slate-900 shadow-md dark:border-amber-900 dark:bg-slate-950 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Calculator className="h-5 w-5 text-amber-600 dark:text-amber-300" />
                  Trip details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="distance">Distance</Label>
                  <Input
                    id="distance"
                    type="number"
                    min="0"
                    step="1"
                    inputMode="decimal"
                    value={inputs.distance}
                    onChange={(event) =>
                      setInputs((prev) => ({
                        ...prev,
                        distance: Number(event.target.value) || 0,
                      }))
                    }
                  />
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={inputs.distanceUnit === 'miles' ? 'default' : 'outline'}
                      onClick={() =>
                        setInputs((prev) => ({
                          ...prev,
                          distanceUnit: 'miles',
                        }))
                      }
                    >
                      Miles
                    </Button>
                    <Button
                      type="button"
                      variant={inputs.distanceUnit === 'km' ? 'default' : 'outline'}
                      onClick={() =>
                        setInputs((prev) => ({
                          ...prev,
                          distanceUnit: 'km',
                        }))
                      }
                    >
                      Kilometres
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fuelPrice">Fuel price</Label>
                  <Input
                    id="fuelPrice"
                    type="number"
                    min="0"
                    step="0.1"
                    inputMode="decimal"
                    value={inputs.fuelPrice}
                    onChange={(event) =>
                      setInputs((prev) => ({
                        ...prev,
                        fuelPrice: Number(event.target.value) || 0,
                      }))
                    }
                  />
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={inputs.fuelPriceUnit === 'per-litre' ? 'default' : 'outline'}
                      onClick={() =>
                        setInputs((prev) => ({
                          ...prev,
                          fuelPriceUnit: 'per-litre',
                        }))
                      }
                    >
                      £/L
                    </Button>
                    <Button
                      type="button"
                      variant={inputs.fuelPriceUnit === 'per-gallon' ? 'default' : 'outline'}
                      onClick={() =>
                        setInputs((prev) => ({
                          ...prev,
                          fuelPriceUnit: 'per-gallon',
                        }))
                      }
                    >
                      £/Gal
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-amber-200 bg-white text-slate-900 shadow-md dark:border-amber-900 dark:bg-slate-950 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Gauge className="h-5 w-5 text-amber-600 dark:text-amber-300" />
                  Fuel economy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="economyValue">Fuel economy</Label>
                  <Input
                    id="economyValue"
                    type="number"
                    min="0"
                    step="0.1"
                    inputMode="decimal"
                    value={inputs.economyValue}
                    onChange={(event) =>
                      setInputs((prev) => ({
                        ...prev,
                        economyValue: Number(event.target.value) || 0,
                      }))
                    }
                  />
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={inputs.economyUnit === 'mpg' ? 'default' : 'outline'}
                      onClick={() =>
                        setInputs((prev) => ({
                          ...prev,
                          economyUnit: 'mpg',
                        }))
                      }
                    >
                      MPG (UK)
                    </Button>
                    <Button
                      type="button"
                      variant={inputs.economyUnit === 'l_per_100km' ? 'default' : 'outline'}
                      onClick={() =>
                        setInputs((prev) => ({
                          ...prev,
                          economyUnit: 'l_per_100km',
                        }))
                      }
                    >
                      L/100km
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="passengers">Passengers</Label>
                  <Slider
                    id="passengers"
                    className="mt-3"
                    value={[Number(inputs.passengers)]}
                    onValueChange={(value) =>
                      setInputs((prev) => ({
                        ...prev,
                        passengers: Number(value[0].toFixed(0)),
                      }))
                    }
                    min={1}
                    max={8}
                    step={1}
                  />
                  <div className="flex justify-between text-sm text-amber-700 dark:text-amber-200">
                    <span>1</span>
                    <span>{inputs.passengers}</span>
                    <span>8</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button variant="outline" className="w-full" onClick={resetAll}>
              Reset calculator
            </Button>
          </div>

          <div className="space-y-6">
            <Card className="border border-slate-200 bg-white shadow-md dark:border-slate-800 dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Fuel className="h-5 w-5 text-amber-600 dark:text-amber-300" />
                  Trip fuel cost calculator summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <div className="flex items-center justify-between">
                  <span>Total fuel needed</span>
                  <span>{results.litresRequired.toFixed(2)} L</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Total trip cost</span>
                  <span>{currencyFormatter.format(results.totalCost)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Cost per mile</span>
                  <span>{currencyFormatter.format(results.costPerMile)}</span>
                </div>
                <div className="flex items-center justify-between font-semibold text-slate-700 dark:text-slate-200">
                  <span>Per passenger ({inputs.passengers})</span>
                  <span>{currencyFormatter.format(results.perPassenger)}</span>
                </div>
              </CardContent>
            </Card>

            <section className="space-y-6 rounded-md border border-slate-200 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-900">
              <Heading
                as="h2"
                size="h2"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                Fuel price calculator reminders
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Fuel prices fluctuate daily. Update the fuel price calculator inputs with live pump data
                before you leave so budgeting stays accurate.
              </p>
              <Heading
                as="h3"
                size="h3"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                Fuel economy calculator insights
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Compare manufacturer MPG with real-world figures. The fuel economy calculator shows how
                improvements—like tyre pressure or reducing weight—shave pounds off every journey.
              </p>
            </section>

            <section className="rounded-md border border-slate-200 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-900">
              <FAQSection faqs={fuelFaqs} />
            </section>
          </div>
        </div>
      </CalculatorWrapper>
    </div>
  );
}
