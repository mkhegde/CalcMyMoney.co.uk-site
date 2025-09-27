import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { PoundSterling, Calculator, Baby } from 'lucide-react';
import CalculatorWrapper from '../components/calculators/CalculatorWrapper';
import FAQSection from '../components/calculators/FAQSection';
import RelatedCalculators from '../components/calculators/RelatedCalculators';
import AnimatedNumber from '../components/general/AnimatedNumber';
import Breadcrumbs from '../components/general/Breadcrumbs';
import { createPageUrl } from '@/utils';

const SMP_WEEKS_90_PERCENT = 6;
const SMP_WEEKS_FLAT_RATE = 33;
const SMP_FLAT_RATE_WEEKLY = 184.03; // For 2024/25, assumed for 2025/26

const maternityPayFAQs = [
  {
    question: 'Who is eligible for Statutory Maternity Pay (SMP)?',
    answer:
      "To be eligible for SMP, you must be an employee who has worked for your employer continuously for at least 26 weeks up to the 'qualifying week' (the 15th week before the expected week of childbirth). You must also earn, on average, at least £123 a week.",
  },
  {
    question: 'What is the difference between Maternity Pay and Maternity Allowance?',
    answer:
      "Statutory Maternity Pay (SMP) is paid by your employer. Maternity Allowance (MA) is paid by the government if you don't qualify for SMP, for example, if you're self-employed or haven't been with your employer long enough. MA is a standard flat rate.",
  },
  {
    question: 'Can my employer offer more than the statutory amount?',
    answer:
      "Yes. Many employers offer 'enhanced' or 'contractual' maternity pay, which can be more generous than the statutory minimum. Check your employment contract or company handbook for details. Our calculator shows the statutory minimum you are entitled to.",
  },
  {
    question: 'When does Statutory Maternity Pay start and end?',
    answer:
      'You can start your maternity leave and pay any time from 11 weeks before the expected week of childbirth. The pay lasts for up to 39 weeks.',
  },
];

export default function MaternityPayCalculator() {
  const [averageWeeklyEarnings, setAverageWeeklyEarnings] = useState('');
  const [results, setResults] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);

  const breadcrumbPath = [
    { name: 'Home', url: createPageUrl('Home') },
    { name: 'Life & Events', url: `${createPageUrl('Home')}#life-events` },
    { name: 'Maternity Pay Calculator' },
  ];

  const handleCalculate = () => {
    const awe = Number(averageWeeklyEarnings) || 0;
    if (awe === 0) {
      setResults(null);
      setHasCalculated(true);
      return;
    }

    const first6WeeksPay = awe * 0.9 * SMP_WEEKS_90_PERCENT;
    const flatRatePay = Math.min(awe * 0.9, SMP_FLAT_RATE_WEEKLY);
    const remaining33WeeksPay = flatRatePay * SMP_WEEKS_FLAT_RATE;
    const totalSMP = first6WeeksPay + remaining33WeeksPay;

    const newResults = {
      first6WeeksTotal: first6WeeksPay,
      first6WeeksWeekly: awe * 0.9,
      remaining33WeeksTotal: remaining33WeeksPay,
      remaining33WeeksWeekly: flatRatePay,
      totalSMP: totalSMP,
    };

    setResults(newResults);
    setHasCalculated(true);
  };

  useEffect(() => {
    setHasCalculated(false);
  }, [averageWeeklyEarnings]);

  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 non-printable">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Breadcrumbs path={breadcrumbPath} />
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              UK Statutory Maternity Pay (SMP) Calculator
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Planning for a new arrival? Estimate your statutory maternity pay to help you budget
              during your maternity leave.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="non-printable">
            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle>Your Earnings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="awe">Average Weekly Earnings (before tax)</Label>
                  <div className="relative">
                    <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="awe"
                      type="number"
                      value={averageWeeklyEarnings}
                      onChange={(e) => setAverageWeeklyEarnings(e.target.value)}
                      className="pl-10 dark:bg-gray-700"
                      placeholder="e.g. 500"
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    This is your average gross pay over the 8 weeks before your qualifying week.
                  </p>
                </div>
                <Button onClick={handleCalculate} className="w-full text-lg">
                  <Calculator className="w-5 h-5 mr-2" />
                  Calculate SMP
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {hasCalculated && results ? (
              <>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                  Your SMP Estimate
                </h2>
                <Card className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/50 dark:to-pink-800/50 border-pink-200 dark:border-pink-700">
                  <CardHeader>
                    <CardTitle className="text-pink-900 dark:text-pink-200">
                      Total Estimated SMP (39 weeks)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-4xl font-bold text-pink-800 dark:text-pink-100">
                      £<AnimatedNumber value={results.totalSMP} />
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-white dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle>Payment Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
                      <p className="font-bold text-green-800 dark:text-green-200">First 6 Weeks</p>
                      <p className="text-lg font-semibold text-green-900 dark:text-green-100">
                        £{results.first6WeeksWeekly.toFixed(2)} per week
                      </p>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        (90% of your average weekly earnings)
                      </p>
                    </div>
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                      <p className="font-bold text-purple-800 dark:text-purple-200">
                        Remaining 33 Weeks
                      </p>
                      <p className="text-lg font-semibold text-purple-900 dark:text-purple-100">
                        £{results.remaining33WeeksWeekly.toFixed(2)} per week
                      </p>
                      <p className="text-sm text-purple-700 dark:text-purple-300">
                        (Statutory flat rate or 90% of earnings, whichever is lower)
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="flex items-center justify-center h-full min-h-[300px] bg-white dark:bg-gray-800">
                <div className="text-center text-gray-500 dark:text-gray-400">
                  <Baby className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold">Plan your maternity leave finances</h3>
                  <p>Enter your earnings to estimate your pay.</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      <CalculatorWrapper>
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Understanding Statutory Maternity Pay
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            Statutory Maternity Pay (SMP) is the legal minimum your employer must pay you while
            you're on maternity leave, provided you meet the eligibility criteria. It's designed to
            provide financial support during the 39 weeks of your leave. Understanding your
            entitlement is a crucial first step in budgeting for your growing family.
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            The payment structure is split into two parts. For the first 6 weeks, you receive 90% of
            your average weekly earnings (with no upper limit). For the following 33 weeks, you
            receive a flat statutory rate (currently £{SMP_FLAT_RATE_WEEKLY} per week for 2024/25)
            or 90% of your average weekly earnings, whichever amount is lower.
          </p>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            When to Use This Calculator
          </h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li>
              <b>When you've just found out you're expecting:</b> To get an early idea of your
              financial situation during leave.
            </li>
            <li>
              <b>When planning your household budget:</b> To accurately forecast your income for the
              months you'll be on leave.
            </li>
            <li>
              <b>When discussing leave with your employer:</b> To understand the baseline statutory
              amount before finding out if your company offers enhanced pay.
            </li>
          </ul>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Example Use Case
          </h3>
          <p className="text-gray-700 dark:text-gray-300">
            Imagine your average weekly earnings are £600 before tax. For the first 6 weeks of your
            maternity leave, you would receive 90% of this, which is £540 per week. For the next 33
            weeks, since 90% of your earnings (£540) is higher than the statutory flat rate (£
            {SMP_FLAT_RATE_WEEKLY}), you would receive the flat rate of £{SMP_FLAT_RATE_WEEKLY} per
            week. Our calculator totals this up to give you a full 39-week projection, helping you
            plan with confidence.
          </p>
        </div>
      </CalculatorWrapper>

      <div className="bg-gray-50 dark:bg-gray-800/50 py-12 non-printable">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FAQSection faqs={maternityPayFAQs} />
        </div>
      </div>

      <RelatedCalculators
        calculators={[
          {
            name: 'Salary Calculator',
            url: '/SalaryCalculator',
            description: 'See how maternity pay affects your annual take-home projections.',
          },
          {
            name: 'Childcare Cost Calculator',
            url: '/ChildcareCostCalculator',
            description: 'Plan for future childcare expenses.',
          },
          {
            name: 'Budget Planner',
            url: '/BudgetCalculator',
            description: 'Create a detailed budget for your growing family.',
          },
        ]}
      />
    </div>
  );
}
