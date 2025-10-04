import React, { useState, useMemo, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Baby, Calculator, AlertCircle, Percent } from 'lucide-react';
import Breadcrumbs from '../components/general/Breadcrumbs';
import CalculatorWrapper from '../components/calculators/CalculatorWrapper';
import FAQSection from '../components/calculators/FAQSection';
import RelatedCalculators from '../components/calculators/RelatedCalculators';
import AnimatedNumber from '../components/general/AnimatedNumber';
import { createPageUrl } from '@/utils';

import Heading from '@/components/common/Heading';
const FIRST_CHILD_WEEKLY = 25.6;
const ADDITIONAL_CHILD_WEEKLY = 16.95;
const LOWER_THRESHOLD = 50000;
const UPPER_THRESHOLD = 60000;

const childBenefitFaqs = [
  {
    question: 'How much Child Benefit will I receive?',
    answer:
      'For 2024/25 the weekly rate is £25.60 for your eldest or only child and £16.95 for each additional child. Multiply the weekly figure by 52 to get the annual amount. Our calculator automatically applies these rates and shows the monthly value too.',
  },
  {
    question: 'What is the High Income Child Benefit Charge?',
    answer:
      'If either partner has adjusted net income above £50,000 the government claws back 1% of your Child Benefit for every £100 over the threshold. Once income hits £60,000 the charge equals 100% of the benefit, effectively cancelling it out. Only the higher earner pays the charge.',
  },
  {
    question: 'Should I still claim if my income is above £60,000?',
    answer:
      'Yes — registering keeps your National Insurance credits and protects your State Pension record. You can claim, then opt out of receiving the payments, or receive them and repay the charge through self-assessment.',
  },
];

const relatedCalculators = [
  {
    name: 'Childcare Cost Calculator',
    url: createPageUrl('ChildcareCostCalculator'),
    description: 'Work out how much nursery or childcare support you need each month.',
  },
  {
    name: 'Budget Planner',
    url: createPageUrl('BudgetCalculator'),
    description: 'Plan family spending alongside your benefit entitlement.',
  },
  {
    name: 'Income Tax Calculator',
    url: createPageUrl('IncomeTaxCalculator'),
    description: 'Check how salary changes alter your adjusted net income.',
  },
];

const formatCurrency = (value) =>
  value.toLocaleString('en-GB', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export default function ChildBenefitCalculator() {
  const [children, setChildren] = useState('1');
  const [income, setIncome] = useState('');
  const [partnerIncome, setPartnerIncome] = useState('');

  const [results, setResults] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);

  const breadcrumbPath = useMemo(
    () => [
      { name: 'Home', url: createPageUrl('Home') },
      { name: 'Family & Benefits', url: `${createPageUrl('Home')}#family-benefits` },
      { name: 'Child Benefit Calculator' },
    ],
    []
  );

  const canonicalUrl = `https://www.calcmymoney.co.uk${createPageUrl('ChildBenefitCalculator')}`;

  const performCalculation = () => {
    const childrenNum = Math.max(Number(children) || 0, 0);
    const incomeNum = Math.max(Number(income) || 0, 0);
    const partnerIncomeNum = Math.max(Number(partnerIncome) || 0, 0);

    if (childrenNum === 0) {
      return {
        weeklyBenefit: 0,
        monthlyBenefit: 0,
        annualBenefit: 0,
        charge: 0,
        netAnnual: 0,
        netMonthly: 0,
        netWeekly: 0,
        chargeRate: 0,
        highestIncome: Math.max(incomeNum, partnerIncomeNum),
      };
    }

    const weeklyBenefit =
      FIRST_CHILD_WEEKLY + Math.max(childrenNum - 1, 0) * ADDITIONAL_CHILD_WEEKLY;
    const annualBenefit = weeklyBenefit * 52;
    const monthlyBenefit = annualBenefit / 12;

    const highestIncome = Math.max(incomeNum, partnerIncomeNum);
    let chargeRate = 0;
    if (highestIncome > LOWER_THRESHOLD) {
      chargeRate = (highestIncome - LOWER_THRESHOLD) / (UPPER_THRESHOLD - LOWER_THRESHOLD);
      chargeRate = Math.min(Math.max(chargeRate, 0), 1);
    }

    const charge = annualBenefit * chargeRate;
    const netAnnual = Math.max(annualBenefit - charge, 0);

    return {
      weeklyBenefit,
      monthlyBenefit,
      annualBenefit,
      charge,
      netAnnual,
      netMonthly: netAnnual / 12,
      netWeekly: netAnnual / 52,
      chargeRate,
      highestIncome,
    };
  };

  const handleCalculate = () => {
    const calc = performCalculation();
    setResults(calc);
    setHasCalculated(true);
  };

  useEffect(() => {
    setHasCalculated(false);
  }, [children, income, partnerIncome]);

  const incomeMessage = useMemo(() => {
    if (!results) return '';
    if (results.highestIncome <= LOWER_THRESHOLD) {
      return 'No High Income Child Benefit Charge applies.';
    }
    if (results.highestIncome >= UPPER_THRESHOLD) {
      return 'Charge equals 100% of the Child Benefit received. Consider opting out of payments to avoid repayments.';
    }
    const percent = (results.chargeRate * 100).toFixed(1);
    return `Charge claws back ${percent}% of your Child Benefit.`;
  }, [results]);

  return (
    <div className="bg-white dark:bg-gray-900">
      <Helmet>
        <title>Child Benefit Calculator UK | Check Entitlement & High Income Charge</title>
        <meta
          name="description"
          content="Estimate your weekly Child Benefit, understand the High Income Child Benefit Charge and see how much you keep after repayments."
        />
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>

      <div className="bg-blue-50 dark:bg-blue-900/30 border-b border-blue-200 dark:border-blue-800/60 non-printable">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Breadcrumbs path={breadcrumbPath} />
          <div className="text-center">
            <Heading as="h1" size="h1" weight="bold" className="text-blue-900 dark:text-blue-100 mb-4">
              UK Child Benefit Calculator
            </Heading>
            <p className="text-lg text-blue-800/80 dark:text-blue-100/80 max-w-3xl mx-auto">
              Enter your family size and household incomes to see how much Child Benefit you can
              claim and whether the High Income Charge will claw it back.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6 non-printable">
            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle>Your household</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="children">Number of eligible children</Label>
                  <Input
                    id="children"
                    type="number"
                    min="0"
                    value={children}
                    onChange={(event) => setChildren(event.target.value)}
                    placeholder="e.g. 2"
                    className="dark:bg-gray-700"
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="income">Your adjusted net income (£)</Label>
                    <Input
                      id="income"
                      type="number"
                      min="0"
                      value={income}
                      onChange={(event) => setIncome(event.target.value)}
                      placeholder="e.g. 48000"
                      className="dark:bg-gray-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="partnerIncome">Partner's adjusted net income (£)</Label>
                    <Input
                      id="partnerIncome"
                      type="number"
                      min="0"
                      value={partnerIncome}
                      onChange={(event) => setPartnerIncome(event.target.value)}
                      placeholder="e.g. 52000"
                      className="dark:bg-gray-700"
                    />
                  </div>
                </div>
                <Button onClick={handleCalculate} className="w-full text-lg">
                  <Calculator className="w-5 h-5 mr-2" />
                  Calculate Child Benefit
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle>About the charge</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                <p>
                  The High Income Child Benefit Charge is calculated using the higher earner's
                  adjusted net income. If the higher earner crosses £50,000 the charge applies, even
                  if the other partner earns much less.
                </p>
                <p>
                  Adjusted net income is your total taxable income minus specific deductions such as
                  pension contributions and Gift Aid. Reducing it can lower the charge, so consider
                  salary sacrifice or pension top ups if appropriate.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6 printable-area">
            {hasCalculated && results ? (
              <>
                <Card className="bg-blue-100 dark:bg-blue-900/50 border-blue-200 dark:border-blue-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
                      <Baby className="w-6 h-6" />
                      Your Child Benefit summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid sm:grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-blue-700 dark:text-blue-200">
                        Weekly
                      </p>
                      <p className="text-3xl font-semibold text-blue-900 dark:text-blue-100">
                        £{formatCurrency(results.weeklyBenefit)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-blue-700 dark:text-blue-200">
                        Monthly
                      </p>
                      <p className="text-3xl font-semibold text-blue-900 dark:text-blue-100">
                        £{formatCurrency(results.monthlyBenefit)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-blue-700 dark:text-blue-200">
                        Annual
                      </p>
                      <p className="text-3xl font-semibold text-blue-900 dark:text-blue-100">
                        £{formatCurrency(results.annualBenefit)}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle>High Income Charge impact</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                          Charge to repay
                        </p>
                        <p className="text-2xl font-semibold text-red-600 dark:text-red-300">
                          £{formatCurrency(results.charge)}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Due via self-assessment.
                        </p>
                      </div>
                      <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                          Effective reduction
                        </p>
                        <p className="text-2xl font-semibold text-blue-900 dark:text-blue-100 flex items-center justify-center gap-1">
                          <Percent className="w-5 h-5" />
                          {(results.chargeRate * 100).toFixed(1)}%
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {incomeMessage}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-green-50 dark:bg-green-900/30">
                      <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Amount kept after charge
                      </p>
                      <p className="text-3xl font-semibold text-green-800 dark:text-green-100">
                        £<AnimatedNumber value={results.netAnnual} /> per year
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                        Equivalent to £{formatCurrency(results.netMonthly)} per month or £
                        {formatCurrency(results.netWeekly)}
                        per week.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-yellow-50 dark:bg-yellow-900/40 border-yellow-200 dark:border-yellow-700">
                  <CardContent className="flex gap-3 items-start text-sm text-yellow-800 dark:text-yellow-100">
                    <AlertCircle className="w-5 h-5 mt-0.5" />
                    <p>
                      Keep HMRC updated when your income changes. If you expect to exceed £60,000
                      you can opt out of payments but remain registered to preserve National
                      Insurance credits for State Pension entitlement.
                    </p>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="flex items-center justify-center h-full min-h-[320px] bg-white dark:bg-gray-800">
                <div className="text-center text-gray-500 dark:text-gray-400 space-y-2">
                  <Baby className="w-12 h-12 mx-auto" />
                  <Heading as="h2" size="h2">Calculate your Child Benefit</Heading>
                  <p>Enter your details to see the annual value and any High Income Charge.</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      <CalculatorWrapper>
        <div className="space-y-6 text-gray-700 dark:text-gray-300">
          <Heading as="h2" size="h2" weight="bold" className="text-gray-900 dark:text-gray-100">
            Understanding Child Benefit
          </Heading>
          <p>
            Child Benefit is a universal payment, but the High Income Charge means higher earners
            may have to repay some or all of it. Use pension contributions or salary sacrifice to
            reduce adjusted net income if you want to keep more of the benefit.
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>
              Payments continue until your child is 16, or 20 if they stay in approved education or
              training.
            </li>
            <li>
              Only one parent can receive the payments, but you can switch who claims to manage the
              High Income Charge.
            </li>
            <li>
              Registering keeps your National Insurance credits even if you opt out of receiving the
              money.
            </li>
          </ul>
        </div>
      </CalculatorWrapper>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 space-y-10">
        <FAQSection faqs={childBenefitFaqs} />
        <RelatedCalculators calculators={relatedCalculators} />
      </div>
    </div>
  );
}
