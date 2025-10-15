import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, Car, PiggyBank, Percent } from 'lucide-react';

import Heading from '@/components/common/Heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';

const keywords = [
  'car finance calculator',
  'car finance payment calculator',
  'car finance repayments',
  'auto finance calculator',
  'car finance',
];

const metaDescription =
  'Use our car finance calculator and car finance payment calculator to model car finance repayments, compare auto finance calculator deals, and plan your next car finance purchase.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/car-finance-calculator';
const schemaKeywords = keywords.slice(0, 5);

const currencyFormatter = (value) =>
  Number.isFinite(value)
    ? value.toLocaleString('en-GB', {
        style: 'currency',
        currency: 'GBP',
        minimumFractionDigits: 0,
      })
    : '£0';

const carFinanceFaqs = [
  {
    question: 'What deposit should I enter?',
    answer:
      'Include cash you plan to pay upfront plus the value of any trade-in after settlement of outstanding finance. The larger the deposit, the lower your car finance repayments.',
  },
  {
    question: 'How do I model a balloon or GMFV?',
    answer:
      'Enter the balloon value in the optional field. The auto finance calculator deducts the balloon from the amortised balance, showing you lower monthly payments plus the final lump sum.',
  },
  {
    question: 'Can I compare offers with different APRs?',
    answer:
      'Yes. Adjust the APR slider or use two browser tabs to compare dealer finance vs bank loans. Focus on total payable and monthly repayment to see which car finance payment calculator scenario suits you best.',
  },
];

const calculateMonthlyPayment = ({ loanAmount, apr, termMonths, balloonValue }) => {
  const principal = Math.max(loanAmount, 0);
  const months = Math.max(termMonths, 1);
  const balloon = Math.min(Math.max(balloonValue, 0), principal);
  const monthlyRate = Math.max(apr, 0) / 100 / 12;

  let payment = 0;
  if (monthlyRate === 0) {
    payment = (principal - balloon) / months;
  } else {
    const discountFactor = (1 + monthlyRate) ** months;
    payment =
      (principal - balloon / discountFactor) *
      (monthlyRate / (1 - 1 / discountFactor));
  }

  const totalPaid = payment * months + balloon;
  const interestPaid = totalPaid - principal;

  return {
    payment,
    totalPaid,
    interestPaid,
    monthlyRate,
  };
};

export default function CarFinanceCalculatorPage() {
  const [inputs, setInputs] = useState({
    carPrice: 24500,
    deposit: 3500,
    termMonths: 48,
    apr: 7.9,
    balloon: 6000,
    includeBalloon: true,
  });

  const loanAmount = useMemo(
    () => Math.max(inputs.carPrice - inputs.deposit, 0),
    [inputs.carPrice, inputs.deposit]
  );

  const results = useMemo(
    () =>
      calculateMonthlyPayment({
        loanAmount,
        apr: Number(inputs.apr) || 0,
        termMonths: Number(inputs.termMonths) || 0,
        balloonValue: inputs.includeBalloon ? Number(inputs.balloon) || 0 : 0,
      }),
    [inputs.apr, inputs.balloon, inputs.includeBalloon, inputs.termMonths, loanAmount]
  );

  const resetAll = () =>
    setInputs({
      carPrice: 24500,
      deposit: 3500,
      termMonths: 48,
      apr: 7.9,
      balloon: 6000,
      includeBalloon: true,
    });

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>Car Finance Calculator | Car Finance Payment Calculator</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Car Finance Calculator | Car Finance Payment Calculator" />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Calc My Money" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Car Finance Calculator | Car Finance Payment Calculator" />
        <meta name="twitter:description" content={metaDescription} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: 'Car Finance Calculator',
              url: canonicalUrl,
              description: metaDescription,
              keywords: schemaKeywords,
              inLanguage: 'en-GB',
              potentialAction: {
                '@type': 'Action',
                name: 'Plan repayments with a car finance calculator',
                target: canonicalUrl,
              },
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-sky-900 via-slate-900 to-sky-900 py-16 text-white">
        <div className="mx-auto max-w-4xl space-y-6 px-4 text-center sm:px-6 lg:px-8">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Car Finance Calculator
          </Heading>
          <p className="text-lg md:text-xl text-sky-100">
            Estimate monthly repayments, compare APRs, and see how deposit or balloon changes affect your
            car finance repayments before signing.
          </p>
        </div>
      </section>

      <CalculatorWrapper>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <div className="space-y-6">
            <Card className="border border-sky-200 bg-white text-slate-900 shadow-md dark:border-sky-900 dark:bg-slate-950 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Car className="h-5 w-5 text-sky-600 dark:text-sky-300" />
                  Vehicle cost
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="carPrice">On-the-road price (£)</Label>
                  <Input
                    id="carPrice"
                    type="number"
                    min="0"
                    step="100"
                    inputMode="decimal"
                    value={inputs.carPrice}
                    onChange={(event) =>
                      setInputs((prev) => ({
                        ...prev,
                        carPrice: Number(event.target.value) || 0,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deposit">Deposit (£)</Label>
                  <Input
                    id="deposit"
                    type="number"
                    min="0"
                    step="100"
                    inputMode="decimal"
                    value={inputs.deposit}
                    onChange={(event) =>
                      setInputs((prev) => ({
                        ...prev,
                        deposit: Number(event.target.value) || 0,
                      }))
                    }
                  />
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Borrowing {currencyFormatter(loanAmount)} after deposit.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-sky-200 bg-white text-slate-900 shadow-md dark:border-sky-900 dark:bg-slate-950 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Percent className="h-5 w-5 text-sky-600 dark:text-sky-300" />
                  Finance terms
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="termMonths">Term (months)</Label>
                  <Slider
                    id="termMonths"
                    className="mt-3"
                    value={[Number(inputs.termMonths)]}
                    onValueChange={(value) =>
                      setInputs((prev) => ({
                        ...prev,
                        termMonths: Number(value[0].toFixed(0)),
                      }))
                    }
                    min={12}
                    max={60}
                    step={1}
                  />
                  <div className="flex justify-between text-sm text-sky-700 dark:text-sky-200">
                    <span>12</span>
                    <span>{inputs.termMonths} months</span>
                    <span>60</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apr">APR (%)</Label>
                  <Slider
                    id="apr"
                    className="mt-3"
                    value={[Number(inputs.apr)]}
                    onValueChange={(value) =>
                      setInputs((prev) => ({
                        ...prev,
                        apr: Number(value[0].toFixed(1)),
                      }))
                    }
                    min={0}
                    max={20}
                    step={0.1}
                  />
                  <div className="flex justify-between text-sm text-sky-700 dark:text-sky-200">
                    <span>0%</span>
                    <span>{inputs.apr.toFixed(1)}%</span>
                    <span>20%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="balloon">Balloon / GMFV (£)</Label>
                  <Input
                    id="balloon"
                    type="number"
                    min="0"
                    step="100"
                    inputMode="decimal"
                    value={inputs.balloon}
                    onChange={(event) =>
                      setInputs((prev) => ({
                        ...prev,
                        balloon: Number(event.target.value) || 0,
                      }))
                    }
                    disabled={!inputs.includeBalloon}
                  />
                  <Button
                    type="button"
                    variant={inputs.includeBalloon ? 'default' : 'outline'}
                    onClick={() =>
                      setInputs((prev) => ({
                        ...prev,
                        includeBalloon: !prev.includeBalloon,
                      }))
                    }
                  >
                    {inputs.includeBalloon ? 'Balloon included' : 'No balloon'}
                  </Button>
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
                  <PiggyBank className="h-5 w-5 text-sky-600 dark:text-sky-300" />
                  Monthly repayments
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <div className="flex items-center justify-between">
                  <span>Monthly payment</span>
                  <span>{currencyFormatter(results.payment)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Total payable</span>
                  <span>{currencyFormatter(results.totalPaid)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Total interest</span>
                  <span>{currencyFormatter(results.interestPaid)}</span>
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
                Car finance repayments and auto finance calculator tips
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Increase your deposit or reduce the term if car finance repayments feel high. The auto
                finance calculator shows how small APR reductions shave hundreds off the total cost.
              </p>
              <Heading
                as="h3"
                size="h3"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                Comparing car finance offers
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Request the total amount payable from each lender. Enter the APR, term, and balloon to
                see which car finance payment calculator scenario aligns with your budget.
              </p>
              <Heading
                as="h3"
                size="h3"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                Planning your next car finance move
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Revisit this car finance calculator when renewing PCP, switching to HP, or evaluating bank
                loans. The more scenarios you test, the easier it is to secure the best car finance deal.
              </p>
            </section>

            <section className="rounded-md border border-slate-200 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-900">
              <FAQSection faqs={carFinanceFaqs} />
            </section>
          </div>
        </div>
      </CalculatorWrapper>
    </div>
  );
}
