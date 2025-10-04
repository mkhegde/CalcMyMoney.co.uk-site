import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { PoundSterling, Calculator, TrendingUp, Calendar, Percent } from 'lucide-react';
import FAQSection from '../components/calculators/FAQSection';
import Heading from '@/components/common/Heading';

const annuityFAQs = [
  {
    question: 'What is an annuity?',
    answer:
      'An annuity is a financial product, typically sold by insurance companies, that you purchase with a lump sum (often from your pension pot). In return, it provides you with a guaranteed regular income for a set period or for the rest of your life.',
  },
  {
    question: "What's the difference between a lifetime and fixed-term annuity?",
    answer:
      "A lifetime annuity pays out for the rest of your life, providing certainty that you won't outlive your savings. A fixed-term annuity pays out for a specific number of years, after which you may receive a lump sum. This calculator models a fixed-term annuity payout.",
  },
  {
    question: 'How are annuity rates determined?',
    answer:
      'Annuity rates are influenced by several factors, including your age, your health, the size of your pension pot, prevailing interest rates (including government bond yields), and the type of annuity you choose (e.g., whether it increases with inflation or provides for a spouse after your death).',
  },
  {
    question: 'A Note on Trustworthiness',
    answer:
      'This calculator uses standard financial formulas to estimate annuity payouts. The results are for illustrative purposes only. The actual annuity rate you are offered will depend on the provider and market conditions at the time of purchase. For precise quotes and financial advice, please consult a regulated financial advisor and compare offerings from multiple providers.',
  },
];

export default function AnnuityCalculator() {
  const [annuityPot, setAnnuityPot] = useState('');
  const [interestRate, setInterestRate] = useState('5');
  const [annuityTerm, setAnnuityTerm] = useState('20');
  const [results, setResults] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);

  const handleCalculate = useCallback(() => {
    const pot = Number(annuityPot) || 0;
    const rate = Number(interestRate) / 100;
    const term = Number(annuityTerm) || 0;

    if (pot <= 0 || rate <= 0 || term <= 0) {
      setResults(null);
      setHasCalculated(true); // Indicate that a calculation attempt was made, even if invalid
      return;
    }

    const monthlyRate = rate / 12;
    const numberOfPayments = term * 12;

    // Formula for Present Value of an Ordinary Annuity, solved for Payment (PMT)
    const monthlyPayout = pot / ((1 - Math.pow(1 + monthlyRate, -numberOfPayments)) / monthlyRate);
    const totalPayout = monthlyPayout * numberOfPayments;
    const totalInterest = totalPayout - pot;

    setResults({
      monthlyPayout,
      annualPayout: monthlyPayout * 12,
      totalPayout,
      totalInterest,
    });
    setHasCalculated(true);
  }, [annuityPot, interestRate, annuityTerm]);

  // Removed: useEffect for auto-calculation

  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 non-printable">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <Heading as="h1" size="h1" weight="bold" className="text-gray-900 dark:text-gray-100 mb-4">
              Annuity Calculator UK
            </Heading>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Estimate the regular income you could receive from your pension pot with an annuity.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 non-printable">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Annuity Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="annuityPot">Annuity Pot (£)</Label>
                  <div className="relative mt-1">
                    <PoundSterling className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="annuityPot"
                      type="number"
                      value={annuityPot}
                      onChange={(e) => setAnnuityPot(e.target.value)}
                      className="pl-10"
                      placeholder="e.g. 100000"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="interestRate">Estimated Annual Rate (%)</Label>
                  <div className="flex items-center gap-4 mt-1">
                    <Slider
                      id="interestRate"
                      value={[parseFloat(interestRate)]}
                      onValueChange={([val]) => setInterestRate(val.toString())}
                      max={10}
                      step={0.1}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={interestRate}
                      onChange={(e) => setInterestRate(e.target.value)}
                      className="w-24 text-center"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="annuityTerm">Annuity Term (Years)</Label>
                  <div className="flex items-center gap-4 mt-1">
                    <Slider
                      id="annuityTerm"
                      value={[parseFloat(annuityTerm)]}
                      onValueChange={([val]) => setAnnuityTerm(val.toString())}
                      max={40}
                      step={1}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={annuityTerm}
                      onChange={(e) => setAnnuityTerm(e.target.value)}
                      className="w-24 text-center"
                    />
                  </div>
                </div>
                <Button onClick={handleCalculate} className="w-full text-lg">
                  <Calculator className="w-5 h-5 mr-2" />
                  Calculate
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            {hasCalculated && results ? (
              <div className="space-y-6">
                <Card className="bg-blue-50 border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-blue-900">Estimated Annual Income</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-5xl font-bold text-blue-900">
                      £{results.annualPayout.toLocaleString('en-GB', { maximumFractionDigits: 0 })}
                    </p>
                    <p className="text-sm text-blue-700 mt-1">per year</p>
                  </CardContent>
                </Card>
                <div className="grid md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">Monthly Payout</CardTitle>
                      <Calendar className="w-4 h-4 text-gray-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        £
                        {results.monthlyPayout.toLocaleString('en-GB', {
                          maximumFractionDigits: 2,
                        })}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">Total Payout</CardTitle>
                      <TrendingUp className="w-4 h-4 text-gray-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        £{results.totalPayout.toLocaleString('en-GB', { maximumFractionDigits: 0 })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="text-sm text-gray-600 p-4 bg-gray-50 rounded-lg">
                  Based on a pot of £{Number(annuityPot).toLocaleString()} and an estimated rate of{' '}
                  {interestRate}%, you could receive £
                  {results.annualPayout.toLocaleString('en-GB', { maximumFractionDigits: 0 })} per
                  year for {annuityTerm} years. The total interest portion of this payout would be £
                  {results.totalInterest.toLocaleString('en-GB', { maximumFractionDigits: 0 })}.
                </div>
              </div>
            ) : (
              <Card className="flex items-center justify-center h-full min-h-[400px]">
                <div className="text-center text-gray-500">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold">Estimate your annuity income</h3>
                  <p className="text-gray-500">Enter your pot details to get started.</p>
                </div>
              </Card>
            )}
          </div>
        </div>

        <div className="mt-12 non-printable">
          <FAQSection faqs={annuityFAQs} />
        </div>
      </div>
    </div>
  );
}
