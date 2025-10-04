import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  PoundSterling,
  Calculator,
  CreditCard,
  Percent,
  Calendar,
  TrendingDown,
  Target,
} from 'lucide-react';
import ExportActions from '../components/calculators/ExportActions';
import FAQSection from '../components/calculators/FAQSection';
import Heading from '@/components/common/Heading';

const ccRepaymentFAQs = [
  {
    question: 'Why does it take so long to pay off credit card debt with minimum payments?',
    answer:
      'Minimum payments are often set as a small percentage of your balance (e.g., 1-3%) or a fixed amount. Because the interest charges are high, most of your minimum payment goes towards interest, with very little reducing the actual debt (principal). This creates a cycle that can take decades to break.',
  },
  {
    question: "What is the 'debt avalanche' vs 'debt snowball' method?",
    answer:
      "The 'debt avalanche' method involves paying off the debt with the highest interest rate first, which saves you the most money on interest. The 'debt snowball' method involves paying off the smallest debt first, which provides psychological wins and motivation. This calculator shows the impact of making fixed payments, which is similar to the avalanche strategy if you only have one card.",
  },
  {
    question: 'Is it a good idea to use a balance transfer card?',
    answer:
      'A 0% balance transfer card can be a great tool. You move your high-interest debt to a new card with a 0% introductory APR for a set period (e.g., 12-24 months). This allows all of your payments to go towards the principal, clearing the debt much faster. However, be aware of transfer fees and make sure you can pay it off before the 0% period ends.',
  },
];

export default function CreditCardRepaymentCalculator() {
  const [balance, setBalance] = useState('5000');
  const [interestRate, setInterestRate] = useState('21.9');
  const [repaymentType, setRepaymentType] = useState('fixed');
  const [repaymentValue, setRepaymentValue] = useState('200'); // For fixed amount
  const [targetMonths, setTargetMonths] = useState('24'); // For target payoff
  const [results, setResults] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [csvData, setCsvData] = useState(null);

  const calculateRepayment = useCallback(() => {
    const bal = Number(balance) || 0;
    const rate = Number(interestRate) / 100 / 12; // Monthly rate

    if (bal <= 0 || rate <= 0) {
      setResults(null);
      setHasCalculated(true);
      return;
    }

    let monthsToPayOff = 0;
    let totalInterestPaid = 0;
    let monthlyPayment = 0;
    let finalMessage = '';

    if (repaymentType === 'fixed') {
      monthlyPayment = Number(repaymentValue) || 0;
      if (monthlyPayment <= bal * rate) {
        finalMessage =
          'Warning: Your payment is too low to cover the interest. The balance will increase.';
        monthsToPayOff = Infinity;
      } else {
        // Using the formula for number of payments (n)
        monthsToPayOff = -Math.log(1 - (bal * rate) / monthlyPayment) / Math.log(1 + rate);
        totalInterestPaid = monthlyPayment * monthsToPayOff - bal;
      }
    } else {
      // target
      const term = Number(targetMonths) || 0;
      if (term <= 0) {
        setResults(null);
        return;
      }
      monthlyPayment = (bal * rate * Math.pow(1 + rate, term)) / (Math.pow(1 + rate, term) - 1);
      monthsToPayOff = term;
      totalInterestPaid = monthlyPayment * term - bal;
    }

    const newResults = {
      monthsToPayOff: Math.ceil(monthsToPayOff),
      years: Math.floor(Math.ceil(monthsToPayOff) / 12),
      remainingMonths: Math.ceil(monthsToPayOff) % 12,
      totalInterestPaid,
      totalRepayment: bal + totalInterestPaid,
      monthlyPayment,
      finalMessage,
    };

    setResults(newResults);
    setHasCalculated(true);

    const csvExportData = [
      ['Metric', 'Value'],
      ['Initial Balance', `£${bal.toFixed(2)}`],
      ['Interest Rate (APR)', `${interestRate}%`],
      [
        'Repayment Goal',
        repaymentType === 'fixed'
          ? `Fixed payment of £${monthlyPayment.toFixed(2)}/month`
          : `Pay off in ${targetMonths} months`,
      ],
      ['Required Monthly Payment', `£${newResults.monthlyPayment.toFixed(2)}`],
      ['Time to Pay Off', `${newResults.years} years, ${newResults.remainingMonths} months`],
      ['Total Interest Paid', `£${newResults.totalInterestPaid.toFixed(2)}`],
      ['Total Amount Repaid', `£${newResults.totalRepayment.toFixed(2)}`],
    ];
    setCsvData(csvExportData);
  }, [balance, interestRate, repaymentType, repaymentValue, targetMonths]);

  useEffect(() => {
    calculateRepayment();
  }, [calculateRepayment]);

  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 non-printable">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <Heading as="h1" size="h1" weight="bold" className="text-gray-900 dark:text-gray-100 mb-4">
              Credit Card Repayment Calculator
            </Heading>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              See how long it will take to pay off your credit card debt and how much interest
              you'll pay. Create a plan to become debt-free faster.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="print-title hidden">Credit Card Repayment Plan</div>
        <div className="grid lg:grid-cols-5 gap-8 printable-grid-cols-1">
          <div className="lg:col-span-2 non-printable">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Your Credit Card Debt</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="balance">Current Balance</Label>
                  <div className="relative">
                    <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="balance"
                      type="number"
                      value={balance}
                      onChange={(e) => setBalance(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="interestRate">Interest Rate (APR)</Label>
                  <div className="relative">
                    <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="interestRate"
                      type="number"
                      value={interestRate}
                      onChange={(e) => setInterestRate(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <RadioGroup
                  value={repaymentType}
                  onValueChange={setRepaymentType}
                  className="space-y-2"
                >
                  <Label>How do you want to repay?</Label>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fixed" id="fixed" />
                    <Label htmlFor="fixed">Pay a fixed amount each month</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="target" id="target" />
                    <Label htmlFor="target">Pay it off in a target time</Label>
                  </div>
                </RadioGroup>

                {repaymentType === 'fixed' ? (
                  <div className="space-y-2">
                    <Label htmlFor="repaymentValue">Monthly Payment</Label>
                    <div className="relative">
                      <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="repaymentValue"
                        type="number"
                        value={repaymentValue}
                        onChange={(e) => setRepaymentValue(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="targetMonths">Pay Off Within (Months)</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="targetMonths"
                        type="number"
                        value={targetMonths}
                        onChange={(e) => setTargetMonths(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3 space-y-6 printable-area">
            {hasCalculated && results ? (
              <>
                <div className="flex justify-between items-center non-printable">
                  <h2 className="text-2xl font-bold text-gray-800">Your Repayment Plan</h2>
                  <ExportActions
                    csvData={csvData}
                    fileName="credit-card-repayment-plan"
                    title="Credit Card Repayment Plan"
                  />
                </div>

                {results.finalMessage && (
                  <Card className="bg-red-100 border-red-300">
                    <CardContent className="p-4 text-red-800 font-medium">
                      {results.finalMessage}
                    </CardContent>
                  </Card>
                )}

                <Card className="bg-blue-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-blue-700" />
                      Payoff Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-gray-600">It will take you</p>
                    <p className="text-4xl font-bold text-blue-800 my-2">
                      {results.years > 0 && `${results.years} year${results.years > 1 ? 's' : ''}`}{' '}
                      {results.years > 0 && results.remainingMonths > 0 && `and`}{' '}
                      {results.remainingMonths > 0 &&
                        `${results.remainingMonths} month${results.remainingMonths > 1 ? 's' : ''}`}
                      {results.years === 0 && results.remainingMonths === 0 && `less than a month`}
                    </p>
                    <p className="text-gray-600">to become debt-free.</p>
                  </CardContent>
                </Card>

                <div className="grid md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Monthly Payment</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-semibold">£{results.monthlyPayment.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">
                        {repaymentType === 'target'
                          ? 'Is required to meet your goal'
                          : 'Your fixed monthly payment'}
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Total Interest Paid</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-semibold text-red-600">
                        £
                        {results.totalInterestPaid.toLocaleString('en-GB', {
                          maximumFractionDigits: 2,
                        })}
                      </p>
                      <p className="text-xs text-gray-500">This is the total cost of borrowing.</p>
                    </CardContent>
                  </Card>
                </div>
                <Card className="bg-gray-50">
                  <CardContent className="p-4">
                    <p className="font-medium">
                      By paying £{results.monthlyPayment.toFixed(0)} per month instead of a typical
                      3% minimum payment (~£{(Number(balance) * 0.03).toFixed(0)}), you could save
                      thousands in interest and be debt-free years sooner.
                    </p>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="flex items-center justify-center h-[400px]">
                <div className="text-center text-gray-500">
                  <Calculator className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold">Ready to clear your debt?</h3>
                  <p>Enter your details to see your personalized repayment plan.</p>
                </div>
              </Card>
            )}
          </div>
        </div>

        <div className="bg-gray-50 py-12 non-printable mt-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <FAQSection faqs={ccRepaymentFAQs} />
          </div>
        </div>
      </div>
    </div>
  );
}
