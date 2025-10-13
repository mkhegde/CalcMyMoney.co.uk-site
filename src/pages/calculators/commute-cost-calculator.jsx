import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, Car, Train, Bus, Bike, Fuel, PiggyBank } from 'lucide-react';

import Heading from '@/components/common/Heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';

const commuteKeywords = ['commute cost calculator'];
const metaDescription =
  'Use our commute cost calculator to estimate how much your commute costs each week, track petrol, tickets, and parking, and compare travel choices before switching routes.';
const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/commute-cost-calculator';

const faqItems = [
  {
    question: 'Which expenses should I include in commute budgeting?',
    answer:
      'Include fuel, parking, congestion or clean air charges, public transport tickets, cycling maintenance, and any tolls. For accuracy, factor in seasonal price changes and the value of occasional remote-working days.',
  },
  {
    question: 'How do I compare public transport against driving?',
    answer:
      'Model each option separately in the commute cost calculator by changing the travel mode. Adjust days in the office, monthly passes, and parking so you can see the annual impact of taking the train, bus, or car.',
  },
  {
    question: 'Can I add remote working or car sharing?',
    answer:
      'Yes. Reduce the number of commute days per week to reflect work-from-home patterns, or split daily fuel/parking costs when car sharing. The calculator updates instantly so you can experiment with different scenarios.',
  },
];

const GALLON_TO_LITRE = 4.546;

const defaultState = {
  mode: 'car',
  daysPerWeek: 4,
  weeksPerYear: 46,
  carDistance: 24,
  mpg: 38,
  fuelPrice: 1.62,
  maintenancePerMile: 0.12,
  parkingPerDay: 8,
  ticketPerDay: 15,
  monthlyPass: 280,
  monthlyExtras: 25,
  remoteDays: 1,
};

const modeOptions = [
  { value: 'car', label: 'Car', icon: <Car className="h-4 w-4" /> },
  { value: 'train', label: 'Train', icon: <Train className="h-4 w-4" /> },
  { value: 'bus', label: 'Bus', icon: <Bus className="h-4 w-4" /> },
  { value: 'bike', label: 'Bike', icon: <Bike className="h-4 w-4" /> },
];

const calculateCarCosts = ({ carDistance, mpg, fuelPrice, maintenancePerMile, parkingPerDay }) => {
  const fuelCostPerMile = mpg > 0 ? (fuelPrice * GALLON_TO_LITRE) / mpg : 0;
  const variableCostPerMile = fuelCostPerMile + maintenancePerMile;
  const dailyFuelCost = carDistance * variableCostPerMile;
  const dailyParking = parkingPerDay;
  const dailyTotal = dailyFuelCost + dailyParking;

  return {
    dailyTotal,
    dailyFuelCost,
    dailyParking,
    costPerMile: variableCostPerMile,
  };
};

const calculateTransitCosts = ({ ticketPerDay, monthlyPass, daysWorkingPerMonth }) => {
  const monthlyTicketCost = monthlyPass > 0 ? monthlyPass : ticketPerDay * daysWorkingPerMonth;
  const dailyCost =
    daysWorkingPerMonth > 0 ? monthlyTicketCost / daysWorkingPerMonth : ticketPerDay;

  return {
    dailyCost,
    monthlyTicketCost,
  };
};

export default function CommuteCostCalculatorPage() {
  const [state, setState] = useState(defaultState);

  const effectiveDaysPerWeek = Math.max(state.daysPerWeek - state.remoteDays, 0);
  const daysPerYear = effectiveDaysPerWeek * state.weeksPerYear;
  const daysPerMonth = daysPerYear / 12;

  const carCosts = useMemo(
    () =>
      calculateCarCosts({
        carDistance: state.carDistance,
        mpg: state.mpg,
        fuelPrice: state.fuelPrice,
        maintenancePerMile: state.maintenancePerMile,
        parkingPerDay: state.parkingPerDay,
      }),
    [state.carDistance, state.mpg, state.fuelPrice, state.maintenancePerMile, state.parkingPerDay]
  );

  const transitCosts = useMemo(
    () =>
      calculateTransitCosts({
        ticketPerDay: state.ticketPerDay,
        monthlyPass: state.monthlyPass,
        daysWorkingPerMonth: daysPerMonth,
      }),
    [state.ticketPerDay, state.monthlyPass, daysPerMonth]
  );

  const results = useMemo(() => {
    const baseDailyCost =
      state.mode === 'car'
        ? carCosts.dailyTotal
        : state.mode === 'bike'
          ? (state.ticketPerDay || 0) + state.monthlyExtras / Math.max(daysPerMonth, 1)
          : transitCosts.dailyCost;

    const dailyExtras =
      state.mode === 'car'
        ? state.monthlyExtras / Math.max(daysPerMonth, 1)
        : state.monthlyExtras / Math.max(daysPerMonth, 1);

    const totalDailyCost = baseDailyCost + dailyExtras;
    const weeklyCost = totalDailyCost * effectiveDaysPerWeek;
    const monthlyCost = weeklyCost * (state.weeksPerYear / 12);
    const annualCost = totalDailyCost * daysPerYear;

    return {
      totalDailyCost,
      weeklyCost,
      monthlyCost,
      annualCost,
      baseDailyCost,
      dailyExtras,
      carBreakdown: carCosts,
      transitBreakdown: transitCosts,
    };
  }, [
    state.mode,
    state.ticketPerDay,
    carCosts,
    transitCosts,
    state.monthlyExtras,
    daysPerMonth,
    effectiveDaysPerWeek,
    state.weeksPerYear,
    daysPerYear,
  ]);

  const updateState = (field, value) => {
    setState((prev) => ({ ...prev, [field]: value }));
  };

  const resetState = () => setState(defaultState);

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>Commute Cost Calculator | Commute Cost Calculator</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Commute Cost Calculator | Commute Cost Calculator" />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Calc My Money" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Commute Cost Calculator | Commute Cost Calculator" />
        <meta name="twitter:description" content={metaDescription} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: 'Commute Cost Calculator',
              description: metaDescription,
              keywords: commuteKeywords,
              url: canonicalUrl,
              inLanguage: 'en-GB',
              potentialAction: {
                '@type': 'Action',
                name: 'Estimate commute costs',
                target: canonicalUrl,
              },
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Commute Cost Calculator
          </Heading>
          <p className="text-lg md:text-xl text-slate-200">
            Discover your true commuting costs with instant projections for daily, monthly, and
            annual spending across car, train, bus, or bike travel.
          </p>
        </div>
      </section>

      <CalculatorWrapper className="bg-white dark:bg-gray-950">
        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Calculator className="h-5 w-5 text-blue-500" />
                Commute Inputs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-sm font-medium mb-2 block">Travel mode</Label>
                <Select value={state.mode} onValueChange={(value) => updateState('mode', value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {modeOptions.map((mode) => (
                      <SelectItem key={mode.value} value={mode.value}>
                        <span className="flex items-center gap-2">
                          {mode.icon}
                          {mode.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium flex justify-between items-center">
                    Days in office per week
                    <span className="text-blue-600 font-semibold">{state.daysPerWeek}</span>
                  </Label>
                  <Slider
                    value={[state.daysPerWeek]}
                    onValueChange={(value) => updateState('daysPerWeek', value[0])}
                    min={0}
                    max={7}
                    step={1}
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium flex justify-between items-center">
                    Remote days per week
                    <span className="text-blue-600 font-semibold">{state.remoteDays}</span>
                  </Label>
                  <Slider
                    value={[state.remoteDays]}
                    onValueChange={(value) => updateState('remoteDays', value[0])}
                    min={0}
                    max={state.daysPerWeek}
                    step={1}
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium flex justify-between items-center">
                  Working weeks per year
                  <span className="text-blue-600 font-semibold">{state.weeksPerYear}</span>
                </Label>
                <Slider
                  value={[state.weeksPerYear]}
                  onValueChange={(value) => updateState('weeksPerYear', value[0])}
                  min={10}
                  max={52}
                  step={1}
                />
              </div>

              {state.mode === 'car' ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="carDistance" className="text-sm font-medium">
                        Daily round trip (miles)
                      </Label>
                      <Input
                        id="carDistance"
                        type="number"
                        inputMode="decimal"
                        min={0}
                        value={state.carDistance}
                        onChange={(event) => updateState('carDistance', Number(event.target.value))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="mpg" className="text-sm font-medium">
                        Vehicle MPG (UK)
                      </Label>
                      <Input
                        id="mpg"
                        type="number"
                        inputMode="decimal"
                        min={1}
                        value={state.mpg}
                        onChange={(event) => updateState('mpg', Number(event.target.value))}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fuelPrice" className="text-sm font-medium">
                        Fuel price (£/litre)
                      </Label>
                      <Input
                        id="fuelPrice"
                        type="number"
                        inputMode="decimal"
                        min={0}
                        step="0.01"
                        value={state.fuelPrice}
                        onChange={(event) => updateState('fuelPrice', Number(event.target.value))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="maintenancePerMile" className="text-sm font-medium">
                        Maintenance (£/mile)
                      </Label>
                      <Input
                        id="maintenancePerMile"
                        type="number"
                        inputMode="decimal"
                        min={0}
                        step="0.01"
                        value={state.maintenancePerMile}
                        onChange={(event) =>
                          updateState('maintenancePerMile', Number(event.target.value))
                        }
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="parkingPerDay" className="text-sm font-medium">
                        Parking (£/day)
                      </Label>
                      <Input
                        id="parkingPerDay"
                        type="number"
                        inputMode="decimal"
                        min={0}
                        value={state.parkingPerDay}
                        onChange={(event) =>
                          updateState('parkingPerDay', Number(event.target.value))
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="monthlyExtras" className="text-sm font-medium">
                        Other commute extras (£/month)
                      </Label>
                      <Input
                        id="monthlyExtras"
                        type="number"
                        inputMode="decimal"
                        min={0}
                        value={state.monthlyExtras}
                        onChange={(event) =>
                          updateState('monthlyExtras', Number(event.target.value))
                        }
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="ticketPerDay" className="text-sm font-medium">
                        Ticket cost (£/day)
                      </Label>
                      <Input
                        id="ticketPerDay"
                        type="number"
                        inputMode="decimal"
                        min={0}
                        value={state.ticketPerDay}
                        onChange={(event) =>
                          updateState('ticketPerDay', Number(event.target.value))
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="monthlyPass" className="text-sm font-medium">
                        Monthly pass (£)
                      </Label>
                      <Input
                        id="monthlyPass"
                        type="number"
                        inputMode="decimal"
                        min={0}
                        value={state.monthlyPass}
                        onChange={(event) => updateState('monthlyPass', Number(event.target.value))}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="monthlyExtrasAlt" className="text-sm font-medium">
                      Additional extras (£/month)
                    </Label>
                    <Input
                      id="monthlyExtrasAlt"
                      type="number"
                      inputMode="decimal"
                      min={0}
                      value={state.monthlyExtras}
                      onChange={(event) => updateState('monthlyExtras', Number(event.target.value))}
                    />
                  </div>
                </div>
              )}

              <Button onClick={resetState} variant="outline" className="w-full">
                Reset inputs
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-900/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-blue-900 dark:text-blue-100">
                  <PiggyBank className="h-5 w-5" />
                  Commute Cost Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-4 gap-4 text-center">
                <div className="rounded-md bg-white/70 dark:bg-blue-900/60 p-4 border border-blue-100 dark:border-blue-800">
                  <p className="text-sm text-blue-700 dark:text-blue-200">Daily</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    £{results.totalDailyCost.toFixed(2)}
                  </p>
                </div>
                <div className="rounded-md bg-white/70 dark:bg-blue-900/60 p-4 border border-blue-100 dark:border-blue-800">
                  <p className="text-sm text-blue-700 dark:text-blue-200">Weekly</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    £{results.weeklyCost.toFixed(2)}
                  </p>
                </div>
                <div className="rounded-md bg-white/70 dark:bg-blue-900/60 p-4 border border-blue-100 dark:border-blue-800">
                  <p className="text-sm text-blue-700 dark:text-blue-200">Monthly</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    £{results.monthlyCost.toFixed(2)}
                  </p>
                </div>
                <div className="rounded-md bg-white/70 dark:bg-blue-900/60 p-4 border border-blue-100 dark:border-blue-800">
                  <p className="text-sm text-blue-700 dark:text-blue-200">Annual</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    £{results.annualCost.toFixed(2)}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <Fuel className="h-5 w-5 text-slate-600" />
                  Cost Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wide mb-2">
                    Base commute
                  </h3>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    £{results.baseDailyCost.toFixed(2)}{' '}
                    <span className="text-base text-slate-500">per day</span>
                  </p>
                  {state.mode === 'car' ? (
                    <ul className="mt-3 text-sm text-slate-600 dark:text-slate-300 space-y-2">
                      <li>
                        Fuel: £{results.carBreakdown.dailyFuelCost.toFixed(2)}{' '}
                        <span className="text-xs">
                          (£{results.carBreakdown.costPerMile.toFixed(2)} per mile)
                        </span>
                      </li>
                      <li>Parking: £{results.carBreakdown.dailyParking.toFixed(2)}</li>
                    </ul>
                  ) : (
                    <ul className="mt-3 text-sm text-slate-600 dark:text-slate-300 space-y-2">
                      <li>
                        Ticket cost: £{results.transitBreakdown.dailyCost.toFixed(2)} per office day
                      </li>
                      <li>
                        Monthly ticket: £{results.transitBreakdown.monthlyTicketCost.toFixed(2)}
                      </li>
                    </ul>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wide mb-2">
                    Extras
                  </h3>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    £{results.dailyExtras.toFixed(2)}{' '}
                    <span className="text-base text-slate-500">per day</span>
                  </p>
                  <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                    Includes monthly extras of £{state.monthlyExtras.toFixed(2)} spread across your
                    commuting days. Track coffees, tolls, or bike servicing here.
                  </p>
                </div>
              </CardContent>
            </Card>

            <section className="space-y-6">
              <Heading
                as="h2"
                size="h2"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                Using the Commute Cost Calculator to optimise spending
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Adjust office days, fuel prices, or ticket costs to see how quickly commute expenses
                add up. Even small changes like a cheaper parking space or an extra remote day can
                reduce annual costs by hundreds of pounds.
              </p>
              <Heading
                as="h3"
                size="h3"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                Scenario planning inside the commute cost calculator
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Compare driving with public transport or cycling by switching travel modes. Record
                your assumptions so you can revisit the commute cost calculator when fuel prices or
                ticket offers change.
              </p>
            </section>
          </div>
        </div>
      </CalculatorWrapper>

      <section className="bg-white dark:bg-gray-950 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FAQSection faqs={faqItems} />
        </div>
      </section>
    </div>
  );
}
