import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PoundSterling, Calculator, User } from 'lucide-react';
import FAQSection from '../components/calculators/FAQSection';

const loanPlans = {
  plan1: { threshold: 24990, rate: 0.09 },
  plan2: { threshold: 27295, rate: 0.09 },
  plan4: { threshold: 31395, rate: 0.09 },
  plan5: { threshold: 25000, rate: 0.09 },
  postgraduate: { threshold: 21000, rate: 0.06 },
};

const studentLoanFAQs = [
  {
    question: 'Which student loan plan am I on?',
    answer:
      "It generally depends on when and where you took out your loan. Plan 1 is for English/Welsh students who started before 2012. Plan 2 is for English/Welsh students who started after 2012. Plan 4 is for Scottish students. Plan 5 is for students who started courses from 1 August 2023 onwards. Postgraduate loans are separate. Always check with the Student Loans Company (SLC) if you're unsure.",
  },
  {
    question: 'How is the repayment amount calculated?',
    answer:
      "You repay a percentage of your income *above* a certain threshold. For most plans (1, 2, 4, 5), this is 9% of your income over the threshold. For Postgraduate loans, it's 6%. If your income drops below the threshold, you stop making repayments.",
  },
  {
    question: 'When is my student loan written off?',
    answer:
      "The loan is cancelled after a certain period, even if you haven't paid it all back. This varies by plan: Plan 1 is written off when you're 65 or 25-30 years after you were first due to repay. Plan 2 is written off 30 years after. Plan 5 is written off 40 years after. This means many people will never repay the full amount.",
  },
  {
    question: 'Does the interest rate matter?',
    answer:
      'While interest is added, for many people the total amount they repay is determined by their earnings over the repayment period, not the total loan balance. Because the debt is written off after a set time, you may never repay the full amount plus interest. Higher earners are more likely to be affected by the interest rate.',
  },
  {
    question: 'Does this calculator account for the full loan balance and interest?',
    answer:
      'No, this is a simplified calculator designed to show you your estimated *monthly repayment* based on your current salary. It does not forecast the total interest or the full payoff journey, as that depends on future salary changes and fluctuating interest rates.',
  },
];

export default function StudentLoanCalculator() {
  const [loanPlan, setLoanPlan] = useState('plan1');
  const [annualSalary, setAnnualSalary] = useState('');
  const [results, setResults] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);

  const handleCalculate = () => {
    const salary = Number(annualSalary) || 0;
    const plan = loanPlans[loanPlan];

    if (salary <= plan.threshold) {
      setResults({
        monthlyRepayment: 0,
        annualRepayment: 0,
      });
      setHasCalculated(true);
      return;
    }

    const annualRepayment = (salary - plan.threshold) * plan.rate;
    const monthlyRepayment = annualRepayment / 12;

    const newResults = {
      monthlyRepayment,
      annualRepayment,
    };

    setResults(newResults);
    setHasCalculated(true);
  };

  useEffect(() => {
    setHasCalculated(false);
    setResults(null);
  }, [loanPlan, annualSalary]);

  return (
    <div className="bg-white">
      <div className="bg-gray-50 border-b border-gray-200 non-printable">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Student Loan Repayment Calculator
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Understand the true cost of your education and plan your path to being loan-free.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="non-printable">
            <Card>
              <CardHeader>
                <CardTitle>Your Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Student Loan Plan</Label>
                  <Select value={loanPlan} onValueChange={setLoanPlan}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="plan1">Plan 1</SelectItem>
                      <SelectItem value="plan2">Plan 2</SelectItem>
                      <SelectItem value="plan4">Plan 4 (Scotland)</SelectItem>
                      <SelectItem value="plan5">Plan 5</SelectItem>
                      <SelectItem value="postgraduate">Postgraduate Loan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="annualSalary">Your Annual Salary</Label>
                  <div className="relative">
                    <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="annualSalary"
                      type="number"
                      value={annualSalary}
                      onChange={(e) => setAnnualSalary(e.target.value)}
                      className="pl-10"
                      placeholder="e.g. 35000"
                    />
                  </div>
                </div>
                <Button onClick={handleCalculate} className="w-full text-lg">
                  <Calculator className="w-5 h-5 mr-2" />
                  Calculate Repayment
                </Button>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6 printable-area">
            {hasCalculated && results ? (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Your Estimated Repayments</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center text-lg p-4 bg-blue-50 rounded-lg">
                      <span>Monthly Repayment:</span>
                      <span className="font-bold text-blue-800">
                        £
                        {results.monthlyRepayment.toLocaleString('en-GB', {
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-lg">
                      <span>Annual Repayment:</span>
                      <span className="font-semibold">
                        £
                        {results.annualRepayment.toLocaleString('en-GB', {
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 pt-4 border-t">
                      <p>
                        <strong>Note:</strong> This is a simplified calculation based on your
                        current salary and does not account for interest accumulation or salary
                        changes. Your repayments are taken from income over the threshold for your
                        plan.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="flex items-center justify-center h-full min-h-[300px]">
                <div className="text-center text-gray-500">
                  <User className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold">See your estimated repayments</h3>
                  <p>Enter your details to calculate your repayment schedule.</p>
                </div>
              </Card>
            )}
          </div>
        </div>
        <div className="mt-12 non-printable">
          <FAQSection faqs={studentLoanFAQs} />
        </div>
      </div>
    </div>
  );
}
