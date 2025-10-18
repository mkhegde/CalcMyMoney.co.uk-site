import React, { useMemo, useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, Baby, CalendarRange, Heart } from 'lucide-react';

import Heading from '@/components/common/Heading';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/maternity-pay-calculator';

const schemaKeywords = [
  'Average Weekly Earnings',
  'Pay Schedule',
  'Qualifying Week',
  'Employment Rights',
  'Paternity Pay',
];

const faqItems = [
  {
    question: 'Who qualifies for Statutory Maternity Pay (SMP)?',
    answer:
      'You must have been employed continuously for at least 26 weeks up to the 15th week before the week the baby is due and earn on average at least the lower earnings limit (LEL).',
  },
  {
    question: 'How is SMP paid?',
    answer:
      'SMP is paid for up to 39 weeks. The first six weeks are 90% of average weekly earnings, followed by 33 weeks at the lower of 90% AWE or the standard SMP rate.',
  },
  {
    question: 'What if I am not eligible for SMP?',
    answer:
      'You may qualify for Maternity Allowance from Jobcentre Plus. Eligibility depends on your work history and earnings over the previous 66 weeks.',
  },
];

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
});

const SMP_STANDARD_RATE = 184.03; // 2025/26 example rate
const SMP_DURATION_WEEKS = 39;
const SMP_HIGH_RATE_WEEKS = 6;

export default function MaternityPayCalculator() {
  const [inputs, setInputs] = useState({
    averageWeeklyEarnings: '520',
    qualifyingWeekDate: '',
    additionalEmployersTopUp: '0',
  });

  const handleChange = useCallback((field, value) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  }, []);

  const reset = useCallback(() => {
    setInputs({
      averageWeeklyEarnings: '520',
      qualifyingWeekDate: '',
      additionalEmployersTopUp: '0',
    });
  }, []);

  const results = useMemo(() => {
    const awe = Number(inputs.averageWeeklyEarnings) || 0;
    const employerTopUp = Number(inputs.additionalEmployersTopUp) || 0;

    const firstSixWeeksPay = SMP_HIGH_RATE_WEEKS * Math.min(awe * 0.9 + employerTopUp, awe * 0.9 + employerTopUp);

    const remainingWeeks = SMP_DURATION_WEEKS - SMP_HIGH_RATE_WEEKS;
    const standardWeeklyPay = Math.min(awe * 0.9, SMP_STANDARD_RATE) + employerTopUp;
    const remainingPay = remainingWeeks * standardWeeklyPay;

    const totalSMP = firstSixWeeksPay + remainingPay;
    const totalWeeks = SMP_DURATION_WEEKS;
    const averageWeeklySMP = totalSMP / totalWeeks;
    const monthlyEquivalent = (totalSMP / SMP_DURATION_WEEKS) * 4.34524;

    return {
      awe,
      employerTopUp,
      firstSixWeeksPay,
      standardWeeklyPay,
      remainingPay,
      totalSMP,
      averageWeeklySMP,
      monthlyEquivalent,
      totalWeeks,
    };
  }, [inputs]);

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>Maternity Pay Calculator &amp; SMP Entitlement Planner</title>
        <meta
          name="description"
          content="Maternity Pay Calculator for UK employees. Estimate Statutory Maternity Pay, maternity allowance, and maternity benefits at each pay period."
        />
        <meta
          name="keywords"
          content="Maternity Pay Calculator, Statutory Maternity Pay, Maternity Leave"
        />
        <link rel="canonical" href={canonicalUrl} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'GovernmentService',
              name: 'Maternity Pay Calculator',
              description:
                'Estimate Statutory Maternity Pay (SMP) based on average weekly earnings, pay schedule, qualifying week, and employment rights for UK parents.',
              areaServed: 'GB',
              url: canonicalUrl,
              keywords: schemaKeywords,
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-slate-900 via-rose-900 to-slate-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Maternity Pay Calculator
          </Heading>
          <p className="text-lg md:text-xl text-rose-100">
            Calculate maternity pay, confirm SMP eligibility, and explore maternity benefits across
            each pay period for informed planning.
          </p>
        </div>
      </section>

      <CalculatorWrapper className="bg-white dark:bg-gray-950">
        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          <Card className="border border-rose-200 dark:border-rose-900 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Calculator className="h-5 w-5 text-rose-500" />
                SMP Inputs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="averageWeeklyEarnings" className="text-sm font-medium">
                  Average weekly earnings (GBP)
                </Label>
                <Input
                  id="averageWeeklyEarnings"
                  inputMode="decimal"
                  value={inputs.averageWeeklyEarnings}
                  onChange={(event) =>
                    handleChange('averageWeeklyEarnings', event.target.value)
                  }
                />
              </div>
              <div>
                <Label htmlFor="qualifyingWeekDate" className="text-sm font-medium">
                  Qualifying week (optional)
                </Label>
                <Input
                  id="qualifyingWeekDate"
                  type="date"
                  value={inputs.qualifyingWeekDate}
                  onChange={(event) => handleChange('qualifyingWeekDate', event.target.value)}
                />
                <p className="caption text-muted-foreground">
                  Used to discuss timelines with HR; not required for calculations.
                </p>
              </div>
              <div>
                <Label htmlFor="additionalEmployersTopUp" className="text-sm font-medium">
                  Employer top-up per week (GBP)
                </Label>
                <Input
                  id="additionalEmployersTopUp"
                  inputMode="decimal"
                  value={inputs.additionalEmployersTopUp}
                  onChange={(event) =>
                    handleChange('additionalEmployersTopUp', event.target.value)
                  }
                />
              </div>
              <Button type="button" variant="outline" onClick={reset}>
                Reset inputs
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border border-rose-200 dark:border-rose-900 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <Baby className="h-5 w-5 text-rose-500" />
                  Maternity Pay Schedule
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-muted-foreground">First 6 weeks total</p>
                    <p className="text-lg font-semibold text-rose-600">
                      {currencyFormatter.format(results.firstSixWeeksPay)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Weeks 7-39 total</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {currencyFormatter.format(results.remainingPay)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Average weekly SMP</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {currencyFormatter.format(results.averageWeeklySMP)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Monthly equivalent</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {currencyFormatter.format(results.monthlyEquivalent)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total SMP (39 weeks)</p>
                    <p className="text-lg font-semibold text-rose-600">
                      {currencyFormatter.format(results.totalSMP)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Weeks covered</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {results.totalWeeks}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-rose-200 dark;border-rose-900 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <Heart className="h-5 w-5 text-rose-500" />
                  Maternity Benefits Notes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  Check SMP eligibility early in pregnancy to confirm qualifying week and average
                  weekly earnings meet statutory thresholds.
                </p>
                <p>
                  Review maternity allowance options if SMP is not available. Self-employed parents
                  can also qualify based on National Insurance contributions.
                </p>
                <p>
                  Coordinate maternity benefits with shared parental leave and paternity pay plans to
                  maximise family flexibility.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <section className="mt-12 space-y-6">
          <Heading as="h2" size="h2" className="text-slate-900 dark:text-slate-100">
            Calculate Maternity Pay for Comprehensive Planning
          </Heading>
          <p className="text-base text-muted-foreground leading-relaxed">
            Understand Statutory Maternity Pay entitlements to build maternity allowance strategies.
            Accurately anticipating pay periods keeps household budgets stable during maternity leave.
          </p>

          <Heading as="h3" size="h3" className="text-slate-900 dark:text-slate-100">
            Confirm SMP Eligibility and Pay Period Structure
          </Heading>
          <p className="text-base text-muted-foreground leading-relaxed">
            SMP eligibility depends on employment rights and average weekly earnings. Use this tool to
            model pay schedules before discussing maternity benefits with HR teams.
          </p>

          <Heading as="h3" size="h3" className="text-slate-900 dark:text-slate-100">
            Coordinate Maternity Allowance with Family Plans
          </Heading>
          <p className="text-base text-muted-foreground leading-relaxed">
            Align maternity allowance, shared parental leave, and partner pay period to balance cash
            flow and support during early parenthood.
          </p>
        </section>

        <section className="mt-12">
          <FAQSection faqs={faqItems} />
        </section>
      </CalculatorWrapper>
    </div>
  );
}
