import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, Sigma, TrendingUp, Layers3 } from 'lucide-react';

import Heading from '@/components/common/Heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';

const keywords = [
  'time value of money calculator',
  'present value calculator',
  'future value calculator',
  'npv calculator',
  'pv calculator',
];

const metaDescription =
  'Use our time value of money calculator with present value calculator and future value calculator tools to discount, grow, and compare cash flows.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/time-value-of-money-calculator';
const schemaKeywords = keywords;

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 0,
});

const percentFormatter = new Intl.NumberFormat('en-GB', {
  style: 'percent',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const defaultInputs = {
  presentValue: 15000,
  futureValue: 22000,
  rate: 5.5,
  years: 6,
  compoundsPerYear: 12,
  paymentPerPeriod: 0,
  paymentTiming: 'end',
};

const timeValueFaqs = [
  {
    question: 'How does compounding frequency affect the calculation?',
    answer:
      'Increasing the compounding frequency boosts the effective annual rate, so future values grow faster and present values shrink. Switch between annual, monthly, and daily settings to understand the sensitivity.',
  },
  {
    question: 'Can I compare multiple cash flows?',
    answer:
      'Yes. Adjust the payment per period and timing to mimic an annuity. For more complex projects, run the calculator twice—once for each scenario—and compare the net present value of the cash flows.',
  },
  {
    question: 'What rate should I use for discounting?',
    answer:
      'Pick a rate that reflects opportunity cost or hurdle rate. Corporations often use WACC, while individuals may choose expected investment returns. The npv calculator interpretation hinges on selecting a realistic rate.',
  },
];

const calculateTimeValue = ({
  presentValue,
  futureValue,
  rate,
  years,
  compoundsPerYear,
  paymentPerPeriod,
  paymentTiming,
}) => {
  const periodsPerYear = Math.max(compoundsPerYear, 1);
  const totalPeriods = Math.max(Math.round(years * periodsPerYear), 0);
  const periodicRate = Math.max(rate, 0) / 100 / periodsPerYear;
  const payment = Number(paymentPerPeriod) || 0;
  const isDue = paymentTiming === 'beginning';

  let pv = Number(presentValue) || 0;
  let fv = Number(futureValue) || 0;
  let rateComputed = periodicRate;
  let periodsComputed = totalPeriods;
  let paymentComputed = payment;

  if (!pv && fv && rateComputed >= 0) {
    const factor = (1 + periodicRate) ** totalPeriods;
    const paymentFactor =
      periodicRate === 0
        ? totalPeriods
        : ((1 + periodicRate) ** totalPeriods - 1) / periodicRate;
    const dueAdjustment = isDue ? 1 + periodicRate : 1;
    pv = fv / factor - payment * dueAdjustment * paymentFactor / factor;
  } else if (!fv && pv && rateComputed >= 0) {
    const factor = (1 + periodicRate) ** totalPeriods;
    const paymentFactor =
      periodicRate === 0
        ? totalPeriods
        : ((1 + periodicRate) ** totalPeriods - 1) / periodicRate;
    const dueAdjustment = isDue ? 1 + periodicRate : 1;
    fv = pv * factor + payment * dueAdjustment * paymentFactor;
  } else if (!rate && pv && fv) {
    rateComputed =
      totalPeriods > 0 ? (fv / Math.max(pv, 1e-9)) ** (1 / totalPeriods) - 1 : 0;
  } else if (!years && pv && fv && rateComputed >= 0) {
    periodsComputed =
      rateComputed > -1 && rateComputed !== 0
        ? Math.log(fv / Math.max(pv, 1e-9)) / Math.log(1 + rateComputed)
        : 0;
  } else if (payment && !fv && !pv) {
    const paymentFactor =
      periodicRate === 0
        ? totalPeriods
        : ((1 + periodicRate) ** totalPeriods - 1) / periodicRate;
    const dueAdjustment = isDue ? 1 + periodicRate : 1;
    fv = payment * dueAdjustment * paymentFactor;
  }

  const effectiveAnnualRate =
    rateComputed > -1 ? (1 + rateComputed) ** periodsPerYear - 1 : rateComputed;

  return {
    presentValue: pv,
    futureValue: fv,
    periodicRate: rateComputed,
    totalPeriods: periodsComputed,
    paymentPerPeriod: paymentComputed,
    effectiveAnnualRate,
  };
};

export default function TimeValueOfMoneyCalculatorPage() {
  const [inputs, setInputs] = useState(defaultInputs);

  const results = useMemo(
    () =>
      calculateTimeValue({
        presentValue: Number(inputs.presentValue) || 0,
        futureValue: Number(inputs.futureValue) || 0,
        rate: Number(inputs.rate) || 0,
        years: Number(inputs.years) || 0,
        compoundsPerYear: Number(inputs.compoundsPerYear) || 1,
        paymentPerPeriod: Number(inputs.paymentPerPeriod) || 0,
        paymentTiming: inputs.paymentTiming,
      }),
    [inputs]
  );

  const resetAll = () => setInputs(defaultInputs);

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>Time Value of Money Calculator | Present Value Calculator</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Time Value of Money Calculator | Present Value Calculator" />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Calc My Money" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Time Value of Money Calculator | Present Value Calculator" />
        <meta name="twitter:description" content={metaDescription} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: 'Time Value of Money Calculator',
              url: canonicalUrl,
              description: metaDescription,
              keywords: schemaKeywords,
              inLanguage: 'en-GB',
              potentialAction: {
                '@type': 'Action',
                name: 'Analyse cash flows with a time value of money calculator',
                target: canonicalUrl,
              },
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-900 py-16 text-white">
        <div className="mx-auto max-w-4xl space-y-6 px-4 text-center sm:px-6 lg:px-8">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Time Value of Money Calculator
          </Heading>
          <p className="text-lg md:text-xl text-indigo-100">
            Discount, project, and compare cash flows instantly. Switch between present value, future
            value, and annuity modes with one intuitive dashboard.
          </p>
        </div>
      </section>

      <CalculatorWrapper>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <div className="space-y-6">
            <Card className="border border-indigo-200 bg-white text-slate-900 shadow-md dark:border-indigo-900 dark:bg-slate-950 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Calculator className="h-5 w-5 text-indigo-600 dark:text-indigo-300" />
                  Cash flow inputs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="presentValue">Present value (£)</Label>
                    <Input
                      id="presentValue"
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="100"
                      value={inputs.presentValue}
                      onChange={(event) =>
                        setInputs((prev) => ({
                          ...prev,
                          presentValue: Number(event.target.value),
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="futureValue">Future value (£)</Label>
                    <Input
                      id="futureValue"
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="100"
                      value={inputs.futureValue}
                      onChange={(event) =>
                        setInputs((prev) => ({
                          ...prev,
                          futureValue: Number(event.target.value),
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rate">Annual rate (% p.a.)</Label>
                    <Slider
                      id="rate"
                      className="mt-3"
                      value={[Number(inputs.rate)]}
                      onValueChange={(value) =>
                        setInputs((prev) => ({
                          ...prev,
                          rate: Number(value[0].toFixed(2)),
                        }))
                      }
                      min={-5}
                      max={20}
                      step={0.1}
                    />
                    <div className="flex justify-between text-sm text-indigo-700 dark:text-indigo-200">
                      <span>-5%</span>
                      <span>{inputs.rate.toFixed(2)}%</span>
                      <span>20%</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="years">Time horizon (years)</Label>
                    <Slider
                      id="years"
                      className="mt-3"
                      value={[Number(inputs.years)]}
                      onValueChange={(value) =>
                        setInputs((prev) => ({
                          ...prev,
                          years: Number(value[0].toFixed(1)),
                        }))
                      }
                      min={0.5}
                      max={40}
                      step={0.5}
                    />
                    <div className="flex justify-between text-sm text-indigo-700 dark:text-indigo-200">
                      <span>0.5</span>
                      <span>{inputs.years.toFixed(1)}</span>
                      <span>40</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-indigo-200 bg-indigo-50 text-slate-900 shadow-md dark:border-indigo-900 dark:bg-indigo-900/30 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Sigma className="h-5 w-5 text-indigo-700 dark:text-indigo-300" />
                  Payment and compounding
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="compoundsPerYear">Compounds per year</Label>
                  <select
                    id="compoundsPerYear"
                    className="w-full rounded-md border border-indigo-200 bg-white p-2 text-sm font-medium text-slate-700 shadow-sm focus:outline-none dark:border-indigo-800 dark:bg-slate-900 dark:text-slate-100"
                    value={inputs.compoundsPerYear}
                    onChange={(event) =>
                      setInputs((prev) => ({
                        ...prev,
                        compoundsPerYear: Number(event.target.value) || 1,
                      }))
                    }
                  >
                    <option value={1}>Annually</option>
                    <option value={2}>Semi-annually</option>
                    <option value={4}>Quarterly</option>
                    <option value={12}>Monthly</option>
                    <option value={52}>Weekly</option>
                    <option value={365}>Daily</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paymentPerPeriod">Payment per period (£)</Label>
                  <Input
                    id="paymentPerPeriod"
                    type="number"
                    inputMode="decimal"
                    step="10"
                    value={inputs.paymentPerPeriod}
                    onChange={(event) =>
                      setInputs((prev) => ({
                        ...prev,
                        paymentPerPeriod: Number(event.target.value),
                      }))
                    }
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="paymentTiming">Payment timing</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={inputs.paymentTiming === 'end' ? 'default' : 'outline'}
                      onClick={() =>
                        setInputs((prev) => ({
                          ...prev,
                          paymentTiming: 'end',
                        }))
                      }
                    >
                      End of period
                    </Button>
                    <Button
                      type="button"
                      variant={inputs.paymentTiming === 'beginning' ? 'default' : 'outline'}
                      onClick={() =>
                        setInputs((prev) => ({
                          ...prev,
                          paymentTiming: 'beginning',
                        }))
                      }
                    >
                      Beginning of period
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button variant="outline" className="w-full" onClick={resetAll}>
              Reset to example scenario
            </Button>
          </div>

          <div className="space-y-6">
            <Card className="border border-slate-200 bg-white shadow-md dark:border-slate-800 dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <TrendingUp className="h-5 w-5 text-indigo-600 dark:text-indigo-300" />
                  Future and present value summary
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-700 dark:bg-slate-800">
                  <p className="text-sm text-slate-600 dark:text-slate-300">Present value</p>
                  <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    {currencyFormatter.format(results.presentValue)}
                  </p>
                </div>
                <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-700 dark:bg-slate-800">
                  <p className="text-sm text-slate-600 dark:text-slate-300">Future value</p>
                  <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    {currencyFormatter.format(results.futureValue)}
                  </p>
                </div>
                <div className="rounded-md border border-indigo-200 bg-indigo-50 p-4 text-center dark:border-indigo-800 dark:bg-indigo-900/30">
                  <p className="text-sm text-indigo-700 dark:text-indigo-200">Effective annual rate</p>
                  <p className="text-2xl font-semibold text-indigo-900 dark:text-indigo-100">
                    {percentFormatter.format(results.effectiveAnnualRate)}
                  </p>
                </div>
                <div className="rounded-md border border-indigo-200 bg-indigo-50 p-4 text-center dark:border-indigo-800 dark:bg-indigo-900/30">
                  <p className="text-sm text-indigo-700 dark:text-indigo-200">Periodic rate</p>
                  <p className="text-2xl font-semibold text-indigo-900 dark:text-indigo-100">
                    {percentFormatter.format(results.periodicRate)}
                  </p>
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
                PV calculator and FV calculator workflow
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Switch between the present value calculator and future value calculator perspectives by
                clearing the input you want to solve for. The time value of money calculator dynamically
                fills the missing variable so you can interrogate every scenario.
              </p>
              <Heading
                as="h3"
                size="h3"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                NPV calculator and PV calculator planning
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Treat the tool like an npv calculator by entering cash flows as payments and toggling the
                timing. The pv calculator view ensures you discount future inflows back to today before you
                sign off on big commitments.
              </p>
            </section>

            <section className="rounded-md border border-slate-200 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-900">
              <FAQSection faqs={timeValueFaqs} />
            </section>
          </div>
        </div>
      </CalculatorWrapper>
    </div>
  );
}
