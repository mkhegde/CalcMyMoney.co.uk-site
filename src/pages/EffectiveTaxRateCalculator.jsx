import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { PoundSterling, Calculator, Percent, PieChart } from 'lucide-react';
import FAQSection from '../components/calculators/FAQSection';

import Heading from '@/components/common/Heading';
const effectiveTaxRateFAQs = [
  {
    question: 'What is the difference between effective tax rate and marginal tax rate?',
    answer:
      "Your 'marginal tax rate' is the rate you pay on your *last* pound of earnings (e.g., 20%, 40%, 45%). Your 'effective tax rate' is the *average* rate you pay across all your earnings after accounting for your tax-free personal allowance. It's a truer reflection of your overall tax burden.",
  },
  {
    question: "Why isn't my effective rate simply 20% or 40%?",
    answer:
      'The UK has a progressive tax system. You only pay the higher rates on the portion of your income that falls into those specific brackets. Your first £12,570 (for most people) is tax-free, which significantly lowers your overall average tax rate.',
  },
  {
    question: 'Does this calculator include National Insurance?',
    answer:
      'Yes, this calculator includes both Income Tax and National Insurance (Class 1 for employees) to give you a comprehensive view of your total deductions and your true effective tax rate.',
  },
  {
    question: 'A Note on Trustworthiness',
    answer:
      'The calculations are based on the 2024/2025 tax and National Insurance rates for England, Wales, and Northern Ireland. Scottish tax rates are different. This tool does not account for other deductions like student loans or pension contributions. For official guidance, refer to GOV.UK or consult a tax professional.',
  },
];

// Calculation Functions
const calculateIncomeTax = (income) => {
  let tax = 0;
  let personalAllowance = 12570;
  if (income > 100000) {
    personalAllowance = Math.max(0, 12570 - (income - 100000) / 2);
  }

  const taxableIncome = Math.max(0, income - personalAllowance);

  if (taxableIncome > 0) {
    if (taxableIncome <= 37700) {
      // Basic rate band
      tax += taxableIncome * 0.2;
    } else {
      tax += 37700 * 0.2; // Tax on basic rate band
      if (taxableIncome <= 125140) {
        // Higher rate band
        tax += (taxableIncome - 37700) * 0.4;
      } else {
        tax += (125140 - 37700) * 0.4; // Tax on higher rate band
        tax += (taxableIncome - 125140) * 0.45; // Tax on additional rate band
      }
    }
  }
  return tax;
};

const calculateNI = (income) => {
  let ni = 0;
  if (income > 12570) {
    if (income <= 50270) {
      ni += (income - 12570) * 0.08;
    } else {
      ni += (50270 - 12570) * 0.08;
      ni += (income - 50270) * 0.02;
    }
  }
  return ni;
};

export default function EffectiveTaxRateCalculator() {
  const [grossIncome, setGrossIncome] = useState('50000');
  const [results, setResults] = useState(null);

  const handleCalculate = useCallback(() => {
    const income = Number(grossIncome) || 0;
    if (income <= 0) {
      setResults(null);
      return;
    }

    const totalTax = calculateIncomeTax(income);
    const totalNI = calculateNI(income);
    const totalDeductions = totalTax + totalNI;
    const netIncome = income - totalDeductions;
    const effectiveRate = income > 0 ? (totalDeductions / income) * 100 : 0;

    setResults({
      grossIncome: income,
      totalTax,
      totalNI,
      totalDeductions,
      netIncome,
      effectiveRate,
    });
  }, [grossIncome]);

  useEffect(() => {
    handleCalculate();
  }, [handleCalculate]);

  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 non-printable">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <Heading as="h1" size="h1" weight="bold" className="text-gray-900 dark:text-gray-100 mb-4">
              Effective Tax Rate Calculator UK
            </Heading>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Find out your true tax burden by calculating the average tax rate you pay on your
              total income.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="non-printable">
            <Card>
              <CardHeader>
                <CardTitle>Your Income</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="grossIncome">Annual Gross Income (£)</Label>
                  <div className="relative mt-1">
                    <PoundSterling className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="grossIncome"
                      type="number"
                      value={grossIncome}
                      onChange={(e) => setGrossIncome(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            {results ? (
              <div className="space-y-6">
                <Card className="bg-blue-50 border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-blue-900">Your Effective Tax Rate</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-5xl font-bold text-blue-900">
                      {results.effectiveRate.toFixed(2)}%
                    </p>
                    <p className="text-sm text-blue-700 mt-1">
                      This is the average rate you pay across all your income.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span>Gross Income:</span>{' '}
                      <span className="font-semibold">£{results.grossIncome.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-red-600">
                      <span>Income Tax:</span>{' '}
                      <span className="font-semibold">
                        -£{results.totalTax.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex justify-between text-red-600">
                      <span>National Insurance:</span>{' '}
                      <span className="font-semibold">
                        -£{results.totalNI.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex justify-between border-t pt-2 font-bold">
                      <span>Total Deductions:</span>{' '}
                      <span>
                        -£
                        {results.totalDeductions.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between border-t pt-2 font-bold text-lg text-green-700">
                      <span>Net Income (Take-Home):</span>{' '}
                      <span>
                        £{results.netIncome.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="flex items-center justify-center h-full">
                <p className="text-gray-500">Enter your income to calculate.</p>
              </Card>
            )}
          </div>
        </div>

        <div className="mt-12 non-printable">
          <FAQSection faqs={effectiveTaxRateFAQs} />
        </div>
      </div>
    </div>
  );
}
