import React, { useMemo, useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, Briefcase, Clock, Target } from 'lucide-react';

import Heading from '@/components/common/Heading';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/freelancer-day-rate-calculator';

const schemaKeywords = [
  'Freelance Income',
  'Overheads',
  'Utilisation Rate',
  'Annual Income Goal',
  'Pricing Strategy',
];

const faqItems = [
  {
    question: 'What is a utilisation rate?',
    answer:
      'Utilisation rate is the percentage of working days you can bill clients. Holidays, admin, marketing, and sick days reduce the time available for paid work.',
  },
  {
    question: 'Which costs should be included in overheads?',
    answer:
      'Include software subscriptions, insurance, equipment, office space, and other recurring expenses required to run your freelance business.',
  },
  {
    question: 'How do I adjust my contractor pay for non-billable time?',
    answer:
      'Increase your day rate to cover unpaid hours. This ensures annual income goals are met even when spending time on proposals, invoicing, and professional development.',
  },
];

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
});

export default function FreelancerDayRateCalculator() {
  const [inputs, setInputs] = useState({
    annualIncomeGoal: '65000',
    businessOverheads: '9000',
    workingWeeks: '48',
    daysPerWeek: '5',
    utilisationRate: '70',
    profitMargin: '15',
  });

  const handleChange = useCallback((field, value) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  }, []);

  const reset = useCallback(() => {
    setInputs({
      annualIncomeGoal: '65000',
      businessOverheads: '9000',
      workingWeeks: '48',
      daysPerWeek: '5',
      utilisationRate: '70',
      profitMargin: '15',
    });
  }, []);

  const results = useMemo(() => {
    const annualIncomeGoal = Number(inputs.annualIncomeGoal) || 0;
    const businessOverheads = Number(inputs.businessOverheads) || 0;
    const workingWeeks = Number(inputs.workingWeeks) || 0;
    const daysPerWeek = Number(inputs.daysPerWeek) || 0;
    const utilisationRate = Math.min(Math.max(Number(inputs.utilisationRate) || 0, 1), 100);
    const profitMargin = Math.max(Number(inputs.profitMargin) || 0, 0);

    const totalAnnualCost = annualIncomeGoal + businessOverheads;
    const potentialWorkingDays = workingWeeks * daysPerWeek;
    const billableDays = Math.max(
      1,
      Math.round((potentialWorkingDays * utilisationRate) / 100),
    );
    const baseDayRate = totalAnnualCost / billableDays;
    const marginMultiplier = profitMargin > 0 ? 1 + profitMargin / 100 : 1;
    const suggestedDayRate = baseDayRate * marginMultiplier;
    const suggestedHourlyRate = suggestedDayRate / 7.5; // assume 7.5 billable hours per day

    return {
      annualIncomeGoal,
      businessOverheads,
      workingWeeks,
      daysPerWeek,
      utilisationRate,
      profitMargin,
      totalAnnualCost,
      billableDays,
      baseDayRate,
      suggestedDayRate,
      suggestedHourlyRate,
    };
  }, [inputs]);

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>Freelancer Day Rate &amp; Hourly Rate Calculator</title>
        <meta
          name="description"
          content="Freelancer Day Rate Calculator to convert annual income goals into day rates. Factor in billable hours, overheads, and utilisation for contractor pay."
        />
        <meta
          name="keywords"
          content="Day Rate Calculator, Target Salary, Billable Hours"
        />
        <link rel="canonical" href={canonicalUrl} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FinancialProduct',
              name: 'Freelancer Day Rate Calculator',
              description:
                'Pricing strategy tool for freelancers to plan freelance income, overheads, utilisation rate, and annual income goals when setting day rates.',
              url: canonicalUrl,
              keywords: schemaKeywords,
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-slate-900 via-amber-900 to-slate-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Freelancer Day Rate Calculator
          </Heading>
          <p className="text-lg md:text-xl text-amber-100">
            Calculate day rate, plan freelance business pricing, and factor in contractor pay for
            non-billable time when setting rates.
          </p>
        </div>
      </section>

      <CalculatorWrapper className="bg-white dark:bg-gray-950">
        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          <Card className="border border-amber-200 dark:border-amber-900 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Calculator className="h-5 w-5 text-amber-500" />
                Income Targets
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="annualIncomeGoal" className="text-sm font-medium">
                  Annual income goal (GBP)
                </Label>
                <Input
                  id="annualIncomeGoal"
                  inputMode="decimal"
                  value={inputs.annualIncomeGoal}
                  onChange={(event) => handleChange('annualIncomeGoal', event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="businessOverheads" className="text-sm font-medium">
                  Annual business overheads (GBP)
                </Label>
                <Input
                  id="businessOverheads"
                  inputMode="decimal"
                  value={inputs.businessOverheads}
                  onChange={(event) => handleChange('businessOverheads', event.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="workingWeeks" className="text-sm font-medium">
                    Working weeks per year
                  </Label>
                  <Input
                    id="workingWeeks"
                    inputMode="decimal"
                    value={inputs.workingWeeks}
                    onChange={(event) => handleChange('workingWeeks', event.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="daysPerWeek" className="text-sm font-medium">
                    Working days each week
                  </Label>
                  <Input
                    id="daysPerWeek"
                    inputMode="decimal"
                    value={inputs.daysPerWeek}
                    onChange={(event) => handleChange('daysPerWeek', event.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="utilisationRate" className="text-sm font-medium">
                  Utilisation rate (% billable days)
                </Label>
                <Input
                  id="utilisationRate"
                  inputMode="decimal"
                  value={inputs.utilisationRate}
                  onChange={(event) => handleChange('utilisationRate', event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="profitMargin" className="text-sm font-medium">
                  Profit margin uplift (%)
                </Label>
                <Input
                  id="profitMargin"
                  inputMode="decimal"
                  value={inputs.profitMargin}
                  onChange={(event) => handleChange('profitMargin', event.target.value)}
                />
              </div>
              <Button type="button" variant="outline" onClick={reset}>
                Reset inputs
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border border-amber-200 dark:border-amber-900 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <Clock className="h-5 w-5 text-amber-500" />
                  Rate Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-muted-foreground">Billable days per year</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {results.billableDays}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total annual cost</p>
                    <p className="text-lg font-semibold text-amber-600">
                      {currencyFormatter.format(results.totalAnnualCost)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Base day rate</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {currencyFormatter.format(results.baseDayRate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Suggested day rate</p>
                    <p className="text-lg font-semibold text-amber-600">
                      {currencyFormatter.format(results.suggestedDayRate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Suggested hourly rate</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {currencyFormatter.format(results.suggestedHourlyRate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Utilisation (%)</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {results.utilisationRate}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-amber-200 dark:border-amber-900 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <Target className="h-5 w-5 text-amber-500" />
                  Pricing Strategy Notes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  Track non-billable time to keep your freelance business profitable. Marketing,
                  proposals, and admin tasks should be covered through a higher day rate.
                </p>
                <p>
                  Review rates annually to account for inflation, tax changes, and updated annual
                  income goals.
                </p>
                <p>
                  Cross-check day rate with market benchmarks. Offer tiered pricing for different
                  service levels while maintaining your minimum acceptable rate.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <section className="mt-12 space-y-6">
          <Heading as="h2" size="h2" className="text-slate-900 dark:text-slate-100">
            Calculate Day Rate for Freelance Business Success
          </Heading>
          <p className="text-base text-muted-foreground leading-relaxed">
            Establish contractor pay that covers annual income goals, business overheads, and
            non-billable time. Use this calculator as the foundation of your rate setting strategy.
          </p>

          <Heading as="h3" size="h3" className="text-slate-900 dark:text-slate-100">
            Align Freelance Business Plans with Utilisation
          </Heading>
          <p className="text-base text-muted-foreground leading-relaxed">
            Adjust utilisation rates to reflect realistic working patterns. Lower utilisation means
            higher day rates to support the same annual income goal.
          </p>

          <Heading as="h3" size="h3" className="text-slate-900 dark:text-slate-100">
            Consider Non-Billable Time in Contractor Pay
          </Heading>
          <p className="text-base text-muted-foreground leading-relaxed">
            Non-billable activities such as networking, training, and administration need to be
            priced into invoices. Set day rates that ensure long-term financial stability.
          </p>
        </section>

        <section className="mt-12">
          <FAQSection faqs={faqItems} />
        </section>
      </CalculatorWrapper>
    </div>
  );
}
