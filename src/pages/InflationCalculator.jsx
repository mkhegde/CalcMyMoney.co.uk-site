import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Heading from '@/components/common/Heading';
import { PoundSterling, Calculator, TrendingUp } from 'lucide-react';
import CalculatorWrapper from '../components/calculators/CalculatorWrapper';
import FAQSection from '../components/calculators/FAQSection';
import RelatedCalculators from '../components/calculators/RelatedCalculators';
import AnimatedNumber from '../components/general/AnimatedNumber';
import Breadcrumbs from '../components/general/Breadcrumbs';
import { createPageUrl } from '@/utils';

// Simplified historical inflation data (CPI index, rebased to 2015=100)
// In a real app, this would come from an API or a more extensive dataset.
const historicalCPI = {
  1990: 55.6,
  2000: 72.0,
  2010: 91.7,
  2015: 100.0,
  2020: 108.7,
  2024: 133.2,
};

const inflationFAQs = [
  {
    question: 'What is inflation and how is it measured in the UK?',
    answer:
      "Inflation is the rate at which the general level of prices for goods and services is rising, and subsequently, purchasing power is falling. In the UK, the most common measure is the Consumer Prices Index (CPI), which tracks the price of a 'basket' of common goods and services over time.",
  },
  {
    question: 'Why is some inflation considered good for the economy?',
    answer:
      'A small, stable amount of inflation (typically around 2%) is often seen as a sign of a healthy economy. It can encourage people and businesses to spend and invest rather than hoard cash (which loses value), and it makes it easier for wages and prices to adjust.',
  },
  {
    question: 'How can I protect my savings from inflation?',
    answer:
      'To prevent your savings from losing value, you need to earn a rate of return that is higher than the rate of inflation. This can involve investing in assets like stocks and shares, putting money into high-interest savings accounts, or using tax-efficient wrappers like ISAs and pensions.',
  },
  {
    question: 'Does this calculator use official data?',
    answer:
      'This calculator uses a simplified model based on historical CPI data for demonstration purposes. While it provides a good estimate of the effects of inflation, for precise financial decisions, you should refer to official sources like the Office for National Statistics (ONS).',
  },
];

export default function InflationCalculator() {
  const [amount, setAmount] = useState('');
  const [startYear, setStartYear] = useState('2000');
  const [endYear, setEndYear] = useState('2024');
  const [results, setResults] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);

  const breadcrumbPath = [
    { name: 'Home', url: createPageUrl('Home') },
    {
      name: 'Personal Finance & Budgeting',
      url: `${createPageUrl('Home')}#personal-finance-budgeting`,
    },
    { name: 'Inflation Calculator' },
  ];

  const handleCalculate = () => {
    const startAmount = Number(amount) || 0;
    const startIndex = historicalCPI[startYear];
    const endIndex = historicalCPI[endYear];

    if (startAmount === 0 || !startIndex || !endIndex) {
      setResults(null);
      setHasCalculated(true);
      return;
    }

    const inflationMultiplier = endIndex / startIndex;
    const futureValue = startAmount * inflationMultiplier;
    const changeInValue = futureValue - startAmount;
    const percentageChange = ((futureValue - startAmount) / startAmount) * 100;

    const newResults = {
      futureValue,
      startAmount,
      startYear,
      endYear,
      changeInValue,
      percentageChange,
    };

    setResults(newResults);
    setHasCalculated(true);
  };

  useEffect(() => {
    setHasCalculated(false);
  }, [amount, startYear, endYear]);

  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 non-printable">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Breadcrumbs path={breadcrumbPath} />
          <div className="text-center">
            <Heading as="h1" size="h1" weight="bold" className="text-gray-900 dark:text-gray-100 mb-4">
              UK Inflation Calculator
            </Heading>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Discover the changing value of the pound over time. See how inflation affects
              purchasing power between different years.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="non-printable">
            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle>Calculate Value</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <div className="relative">
                    <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="amount"
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="pl-10 dark:bg-gray-700"
                      placeholder="e.g. 1000"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startYear">Start Year</Label>
                    <select
                      id="startYear"
                      value={startYear}
                      onChange={(e) => setStartYear(e.target.value)}
                      className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600"
                    >
                      {Object.keys(historicalCPI).map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endYear">End Year</Label>
                    <select
                      id="endYear"
                      value={endYear}
                      onChange={(e) => setEndYear(e.target.value)}
                      className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600"
                    >
                      {Object.keys(historicalCPI).map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <Button onClick={handleCalculate} className="w-full text-lg">
                  <Calculator className="w-5 h-5 mr-2" />
                  Calculate
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {hasCalculated && results ? (
              <>
                <Heading as="h2" size="h2" weight="bold" className="text-gray-800 dark:text-gray-200">
                  Results
                </Heading>
                <Card className="bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/50 dark:to-teal-800/50 border-teal-200 dark:border-teal-700">
                  <CardContent className="p-6">
                    <p className="text-center text-gray-700 dark:text-gray-300">
                      <span className="font-bold text-lg text-teal-800 dark:text-teal-200">
                        £{results.startAmount.toLocaleString()}
                      </span>{' '}
                      in {results.startYear} has the same buying power as...
                    </p>
                    <p className="text-center text-5xl font-bold text-teal-800 dark:text-teal-100 mt-2">
                      £<AnimatedNumber value={results.futureValue} />
                    </p>
                    <p className="text-center text-lg font-semibold text-teal-800 dark:text-teal-200 mt-2">
                      in {results.endYear}
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-white dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle>Change in Value</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-lg">
                      <span className="font-medium text-gray-800 dark:text-gray-200">
                        Total Change:
                      </span>
                      <span
                        className={`font-bold ${results.changeInValue >= 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}
                      >
                        £
                        {results.changeInValue.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between text-lg">
                      <span className="font-medium text-gray-800 dark:text-gray-200">
                        Percentage Change:
                      </span>
                      <span
                        className={`font-bold ${results.percentageChange >= 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}
                      >
                        {results.percentageChange.toFixed(2)}%
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="flex items-center justify-center h-full min-h-[300px] bg-white dark:bg-gray-800">
                <div className="text-center text-gray-500 dark:text-gray-400">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold">See the power of inflation</h3>
                  <p>Enter an amount and years to see how its value has changed.</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      <CalculatorWrapper>
        <div className="space-y-6">
          <Heading as="h2" size="h2" weight="bold" className="text-gray-900 dark:text-gray-100">
            What This Calculator Shows
          </Heading>
          <p className="text-gray-700 dark:text-gray-300">
            The Inflation Calculator is a tool that demonstrates the concept of "purchasing power."
            It shows how the value of money erodes over time due to inflation. By inputting an
            amount and selecting two different years, you can see how much money you would need in
            the second year to buy the same goods and services you could afford in the first year.
            It's a powerful way to visualize the real-world impact of economic changes on your
            personal finances.
          </p>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            When to Use This Calculator
          </h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li>
              <b>Understanding History:</b> To find out what a historical amount of money (like an
              inheritance or a salary from decades ago) would be worth today.
            </li>
            <li>
              <b>Financial Planning:</b> To understand how the value of your savings might decrease
              over time if they are not growing at a rate higher than inflation.
            </li>
            <li>
              <b>Setting Savings Goals:</b> When planning for a long-term goal like retirement, it
              helps to think about the future value of money you'll need, not just the nominal
              amount.
            </li>
            <li>
              <b>General Knowledge:</b> Simply out of curiosity to see how much prices have changed
              over your lifetime.
            </li>
          </ul>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Example Use Case
          </h3>
          <p className="text-gray-700 dark:text-gray-300">
            Suppose your parents bought their first house in 1990 for £50,000. You might wonder what
            that amount is equivalent to today. You can enter £50,000 as the amount, set the start
            year to 1990, and the end year to 2024. The calculator would show you that, due to
            cumulative inflation over those 34 years, you would need over £119,000 in 2024 to have
            the same purchasing power as £50,000 did back in 1990. This illustrates just how
            significantly inflation can impact value over the long term.
          </p>
        </div>
      </CalculatorWrapper>

      <div className="bg-gray-50 dark:bg-gray-800/50 py-12 non-printable">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FAQSection faqs={inflationFAQs} />
        </div>
      </div>

      <RelatedCalculators
        calculators={[
          {
            name: 'Compound Interest Calculator',
            url: '/CompoundInterestCalculator',
            description: 'See how your savings can grow to beat inflation.',
          },
          {
            name: 'Savings Goal Calculator',
            url: '/SavingsGoalCalculator',
            description: 'Plan for future goals with inflation in mind.',
          },
          {
            name: 'Pension Calculator',
            url: '/PensionCalculator',
            description: "Project your retirement pot's future value.",
          },
        ]}
      />
    </div>
  );
}
