import React, { useState, useMemo, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calculator, Briefcase, PiggyBank, AlertTriangle } from 'lucide-react';
import Breadcrumbs from '../components/general/Breadcrumbs';
import CalculatorWrapper from '../components/calculators/CalculatorWrapper';
import FAQSection from '../components/calculators/FAQSection';
import RelatedCalculators from '../components/calculators/RelatedCalculators';
import AnimatedNumber from '../components/general/AnimatedNumber';
import { createPageUrl } from '@/utils';
import Heading from '@/components/common/Heading';

const MAX_WEEKLY_PAY = 700; // Statutory cap 2024/25 (England, Scotland, Wales)
const MAX_SERVICE_YEARS = 20;
const TAX_FREE_LIMIT = 30000;
const DEFAULT_WORKING_DAYS = 5;

const severanceFaqs = [
  {
    question: 'What counts as severance pay in the UK?',
    answer:
      'Severance packages usually combine statutory redundancy pay with contractual enhancements such as extra weeks of pay, payment in lieu of notice, and any outstanding holiday pay. Our calculator covers all of these elements so you can build a realistic payout estimate.',
  },
  {
    question: 'Is all severance pay tax free?',
    answer:
      'The first £30,000 of a genuine redundancy or severance payment is normally free from Income Tax and National Insurance. Any amount above that threshold is taxable as earnings. Holiday pay and pay in lieu of notice are also taxable in the usual way.',
  },
  {
    question: 'How are statutory redundancy weeks calculated?',
    answer:
      'Statutory redundancy pay awards 0.5, 1 or 1.5 weeks of capped pay for each full year of service depending on your age at the time of each year worked. Service is capped at 20 years and weekly pay is capped by law. Our calculation mirrors the official government formula.',
  },
];

const relatedCalculators = [
  {
    name: 'Redundancy Pay Calculator',
    url: createPageUrl('RedundancyPayCalculator'),
    description: 'Work out the statutory redundancy you are entitled to receive.',
  },
  {
    name: 'Emergency Fund Calculator',
    url: createPageUrl('EmergencyFundCalculator'),
    description: 'See how much cash buffer you should keep after leaving a job.',
  },
  {
    name: 'Budget Planner',
    url: createPageUrl('BudgetCalculator'),
    description: 'Plan your monthly spending once your income changes.',
  },
];

const calculateStatutoryRedundancy = (age, yearsOfService, weeklyPay) => {
  const cappedWeeklyPay = Math.min(weeklyPay, MAX_WEEKLY_PAY);
  const serviceYears = Math.min(Math.max(Math.floor(yearsOfService), 0), MAX_SERVICE_YEARS);

  let totalWeeks = 0;
  for (let i = 0; i < serviceYears; i += 1) {
    const ageAtServiceYear = age - i;
    if (ageAtServiceYear >= 41) {
      totalWeeks += 1.5;
    } else if (ageAtServiceYear >= 22) {
      totalWeeks += 1;
    } else {
      totalWeeks += 0.5;
    }
  }

  return {
    totalWeeks,
    cappedWeeklyPay,
    statutoryPay: totalWeeks * cappedWeeklyPay,
  };
};

const calculateNoticeWeeks = (yearsOfService) => {
  if (yearsOfService <= 0) return 0;
  if (yearsOfService < 2) return 1;
  return Math.min(Math.floor(yearsOfService), 12);
};

const calculateHolidayPay = (unusedDays, weeklyPay, workingDays) => {
  if (unusedDays <= 0 || weeklyPay <= 0 || workingDays <= 0) {
    return { holidayPay: 0, dailyRate: 0 };
  }
  const days = Math.max(workingDays, 1);
  const dailyRate = weeklyPay / days;
  return {
    dailyRate,
    holidayPay: dailyRate * unusedDays,
  };
};

export default function SeverancePayCalculator() {
  const [age, setAge] = useState('');
  const [yearsOfService, setYearsOfService] = useState('');
  const [weeklyPay, setWeeklyPay] = useState('');
  const [additionalWeeks, setAdditionalWeeks] = useState('0');
  const [extraLumpSum, setExtraLumpSum] = useState('');
  const [unusedHolidayDays, setUnusedHolidayDays] = useState('');
  const [workingDaysPerWeek, setWorkingDaysPerWeek] = useState(`${DEFAULT_WORKING_DAYS}`);

  const [results, setResults] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);

  const breadcrumbPath = useMemo(
    () => [
      { name: 'Home', url: createPageUrl('Home') },
      { name: 'Income & Employment', url: `${createPageUrl('Home')}#income-employment` },
      { name: 'Severance Pay Calculator' },
    ],
    []
  );

  const canonicalUrl = `https://www.calcmymoney.co.uk${createPageUrl('SeverancePayCalculator')}`;

  const performCalculation = () => {
    const ageNum = Number(age) || 0;
    const serviceNum = Number(yearsOfService) || 0;
    const weeklyPayNum = Number(weeklyPay) || 0;
    const additionalWeeksNum = Math.max(Number(additionalWeeks) || 0, 0);
    const extraLumpSumNum = Math.max(Number(extraLumpSum) || 0, 0);
    const unusedHolidayDaysNum = Math.max(Number(unusedHolidayDays) || 0, 0);
    const workingDaysNum = Math.max(Number(workingDaysPerWeek) || DEFAULT_WORKING_DAYS, 1);

    if (ageNum <= 0 || serviceNum <= 0 || weeklyPayNum <= 0) {
      return null;
    }

    const statutory = calculateStatutoryRedundancy(ageNum, serviceNum, weeklyPayNum);
    const noticeWeeks = calculateNoticeWeeks(serviceNum);
    const noticePay = noticeWeeks * weeklyPayNum;

    const { holidayPay, dailyRate } = calculateHolidayPay(
      unusedHolidayDaysNum,
      weeklyPayNum,
      workingDaysNum
    );

    const enhancementPay = additionalWeeksNum * weeklyPayNum;

    const totalBeforeTax =
      statutory.statutoryPay + noticePay + holidayPay + enhancementPay + extraLumpSumNum;
    const taxFreeAmount = Math.min(totalBeforeTax, TAX_FREE_LIMIT);
    const taxableAmount = Math.max(totalBeforeTax - TAX_FREE_LIMIT, 0);

    return {
      statutory,
      noticeWeeks,
      noticePay,
      holidayPay,
      dailyRate,
      enhancementPay,
      extraLumpSum: extraLumpSumNum,
      totalBeforeTax,
      taxFreeAmount,
      taxableAmount,
    };
  };

  const handleCalculate = () => {
    const calcResults = performCalculation();
    setResults(calcResults);
    setHasCalculated(true);
  };

  useEffect(() => {
    setHasCalculated(false);
  }, [
    age,
    yearsOfService,
    weeklyPay,
    additionalWeeks,
    extraLumpSum,
    unusedHolidayDays,
    workingDaysPerWeek,
  ]);

  return (
    <div className="bg-white dark:bg-gray-900">
      <Helmet>
        <title>UK Severance Pay Calculator | Estimate Redundancy & Exit Packages</title>
        <meta
          name="description"
          content="Estimate your UK severance package, including statutory redundancy, notice pay, unused holiday pay and contractual enhancements."
        />
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>

      <div className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 non-printable">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Breadcrumbs path={breadcrumbPath} />
          <div className="text-center">
            <Heading as="h1" size="h1" weight="bold" className="text-gray-900 dark:text-gray-100 mb-4">
              UK Severance Pay Calculator
            </Heading>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Model your potential payout when leaving a job. Combine statutory redundancy,
              contractual enhancements, pay in lieu of notice and unused holiday pay.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6 non-printable">
            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle>Your employment details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="age">Age (years)</Label>
                  <Input
                    id="age"
                    type="number"
                    min="16"
                    value={age}
                    onChange={(event) => setAge(event.target.value)}
                    placeholder="e.g. 45"
                    className="dark:bg-gray-700"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="service">Full years of continuous service</Label>
                  <Input
                    id="service"
                    type="number"
                    min="0"
                    value={yearsOfService}
                    onChange={(event) => setYearsOfService(event.target.value)}
                    placeholder="e.g. 12"
                    className="dark:bg-gray-700"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Statutory redundancy pay is capped at 20 full years of service.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weeklyPay">Average weekly pay before tax (£)</Label>
                  <Input
                    id="weeklyPay"
                    type="number"
                    min="0"
                    value={weeklyPay}
                    onChange={(event) => setWeeklyPay(event.target.value)}
                    placeholder="e.g. 720"
                    className="dark:bg-gray-700"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    For statutory redundancy the weekly amount is capped at £
                    {MAX_WEEKLY_PAY.toLocaleString()}.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle>Enhancements &amp; unused leave</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="additionalWeeks">Extra contractual weeks of pay</Label>
                  <Input
                    id="additionalWeeks"
                    type="number"
                    min="0"
                    step="0.5"
                    value={additionalWeeks}
                    onChange={(event) => setAdditionalWeeks(event.target.value)}
                    placeholder="e.g. 4"
                    className="dark:bg-gray-700"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Enter additional weeks offered by your employer (e.g. 2 weeks per year of
                    service).
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lumpSum">Extra lump sum (£)</Label>
                  <Input
                    id="lumpSum"
                    type="number"
                    min="0"
                    value={extraLumpSum}
                    onChange={(event) => setExtraLumpSum(event.target.value)}
                    placeholder="e.g. 5000"
                    className="dark:bg-gray-700"
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="holidayDays">Unused holiday days</Label>
                    <Input
                      id="holidayDays"
                      type="number"
                      min="0"
                      value={unusedHolidayDays}
                      onChange={(event) => setUnusedHolidayDays(event.target.value)}
                      placeholder="e.g. 8"
                      className="dark:bg-gray-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="workingDays">Working days per week</Label>
                    <Input
                      id="workingDays"
                      type="number"
                      min="1"
                      max="7"
                      value={workingDaysPerWeek}
                      onChange={(event) => setWorkingDaysPerWeek(event.target.value)}
                      placeholder={`${DEFAULT_WORKING_DAYS}`}
                      className="dark:bg-gray-700"
                    />
                  </div>
                </div>
                <Button onClick={handleCalculate} className="w-full text-lg">
                  <Calculator className="w-5 h-5 mr-2" />
                  Calculate severance package
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6 printable-area">
            {hasCalculated && results ? (
              <>
                <Card className="bg-blue-50 dark:bg-blue-900/40 border-blue-200 dark:border-blue-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
                      <Briefcase className="w-6 h-6" />
                      Estimated severance package
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center space-y-3">
                    <div className="text-sm uppercase tracking-wide text-blue-700 dark:text-blue-200">
                      Total before tax
                    </div>
                    <div className="text-4xl font-bold text-blue-900 dark:text-blue-100">
                      £<AnimatedNumber value={results.totalBeforeTax} />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Includes statutory redundancy, notice pay, unused holiday pay and contractual
                      enhancements.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-white dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle>Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
                    <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          Statutory redundancy pay
                        </span>
                        <span className="font-semibold">
                          £
                          {results.statutory.statutoryPay.toLocaleString('en-GB', {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {results.statutory.totalWeeks.toFixed(1)} weeks at £
                        {results.statutory.cappedWeeklyPay.toLocaleString('en-GB', {
                          minimumFractionDigits: 2,
                        })}{' '}
                        per week (capped).
                      </p>
                    </div>

                    <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          Notice pay
                        </span>
                        <span className="font-semibold">
                          £{results.noticePay.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {results.noticeWeeks} week{results.noticeWeeks === 1 ? '' : 's'} of pay in
                        lieu of notice.
                      </p>
                    </div>

                    {results.holidayPay > 0 && (
                      <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            Unused holiday pay
                          </span>
                          <span className="font-semibold">
                            £
                            {results.holidayPay.toLocaleString('en-GB', {
                              minimumFractionDigits: 2,
                            })}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Based on £
                          {results.dailyRate.toLocaleString('en-GB', { minimumFractionDigits: 2 })}{' '}
                          per day and your unused leave.
                        </p>
                      </div>
                    )}

                    {(results.enhancementPay > 0 || results.extraLumpSum > 0) && (
                      <div className="grid gap-4">
                        {results.enhancementPay > 0 && (
                          <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-gray-900 dark:text-gray-100">
                                Extra contractual weeks
                              </span>
                              <span className="font-semibold">
                                £
                                {results.enhancementPay.toLocaleString('en-GB', {
                                  minimumFractionDigits: 2,
                                })}
                              </span>
                            </div>
                          </div>
                        )}
                        {results.extraLumpSum > 0 && (
                          <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-gray-900 dark:text-gray-100">
                                Additional lump sum
                              </span>
                              <span className="font-semibold">
                                £
                                {results.extraLumpSum.toLocaleString('en-GB', {
                                  minimumFractionDigits: 2,
                                })}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-900 dark:text-green-100">
                      <PiggyBank className="w-5 h-5" />
                      Tax treatment summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid sm:grid-cols-2 gap-4 text-sm">
                    <div className="p-4 bg-white/70 dark:bg-gray-900/40 rounded-lg border border-green-200 dark:border-green-700">
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Tax-free element
                      </p>
                      <p className="text-2xl font-semibold text-green-800 dark:text-green-100">
                        £
                        {results.taxFreeAmount.toLocaleString('en-GB', {
                          minimumFractionDigits: 2,
                        })}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        First £{TAX_FREE_LIMIT.toLocaleString()} of qualifying severance is usually
                        tax free.
                      </p>
                    </div>
                    <div className="p-4 bg-white/70 dark:bg-gray-900/40 rounded-lg border border-green-200 dark:border-green-700">
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Taxable amount
                      </p>
                      <p className="text-2xl font-semibold text-green-800 dark:text-green-100">
                        £
                        {results.taxableAmount.toLocaleString('en-GB', {
                          minimumFractionDigits: 2,
                        })}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Income tax and National Insurance are due on this portion.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-700">
                  <CardContent className="flex gap-3 items-start text-sm text-yellow-800 dark:text-yellow-100">
                    <AlertTriangle className="w-5 h-5 mt-0.5" />
                    <p>
                      This tool provides an indicative estimate. Always confirm figures with your
                      employer, consult the ACAS guidance and seek professional advice for complex
                      contractual arrangements.
                    </p>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="flex items-center justify-center h-full min-h-[320px] bg-white dark:bg-gray-800">
                <div className="text-center text-gray-500 dark:text-gray-400 space-y-2">
                  <Briefcase className="w-12 h-12 mx-auto" />
                  <h2 className="text-xl font-semibold">Work out your severance package</h2>
                  <p>Enter your details and employer terms to see a full breakdown.</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      <CalculatorWrapper>
        <div className="space-y-6 text-gray-700 dark:text-gray-300">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            How the calculator works
          </h2>
          <p>
            Severance packages vary widely between employers. We combine the statutory redundancy
            calculation with common contractual elements so you can stress test different scenarios.
            Adjust the extra contractual weeks and lump sum to mirror the deal on the table.
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>Statutory redundancy pay:</strong> Based on age, full years of service (capped
              at 20) and a weekly pay cap of £{MAX_WEEKLY_PAY.toLocaleString()}.
            </li>
            <li>
              <strong>Notice pay:</strong> Automatically assumes one week per full year of service
              (capped at 12). You can mirror an enhanced notice period by adding extra contractual
              weeks.
            </li>
            <li>
              <strong>Holiday pay:</strong> Converts unused holiday into cash using your weekly pay
              and working pattern.
            </li>
          </ul>
        </div>
      </CalculatorWrapper>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 space-y-10">
        <FAQSection faqs={severanceFaqs} />
        <RelatedCalculators calculators={relatedCalculators} />
      </div>
    </div>
  );
}
