import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Banknote, Repeat, CheckCircle2, XCircle } from 'lucide-react';
import FAQSection from '../components/calculators/FAQSection';

import Heading from '@/components/common/Heading';
const loanComparisonFAQs = [
  {
    question: 'What is APR?',
    answer:
      "APR stands for Annual Percentage Rate. It represents the yearly cost of a loan, including the interest rate and any extra fees. It's the most reliable way to compare the true cost of different loan offers.",
  },
  {
    question: 'Why is the total cost important?',
    answer:
      'While a lower monthly payment might seem attractive, a longer loan term can mean you pay significantly more in total interest over the life of the loan. The total cost gives you the complete picture.',
  },
  {
    question: 'What else should I consider besides the numbers?',
    answer:
      "Always check for early repayment charges (ERCs), flexibility in making overpayments, and the lender's customer service reputation. The 'best' loan isn't always the one with the lowest APR.",
  },
];

const LoanInput = ({ id, loan, setLoan, title }) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-lg">{title}</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div>
        <Label htmlFor={`amount-${id}`}>Loan Amount (£)</Label>
        <Input
          id={`amount-${id}`}
          type="number"
          value={loan.amount}
          onChange={(e) => setLoan({ ...loan, amount: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor={`apr-${id}`}>APR (%)</Label>
        <Input
          id={`apr-${id}`}
          type="number"
          value={loan.apr}
          onChange={(e) => setLoan({ ...loan, apr: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor={`term-${id}`}>Term (Years)</Label>
        <Input
          id={`term-${id}`}
          type="number"
          value={loan.term}
          onChange={(e) => setLoan({ ...loan, term: e.target.value })}
        />
      </div>
    </CardContent>
  </Card>
);

const calculateLoanDetails = (loan) => {
  const P = Number(loan.amount) || 0;
  const r = Number(loan.apr) / 100 / 12;
  const n = (Number(loan.term) || 0) * 12;

  if (P <= 0 || r <= 0 || n <= 0) return null;

  const M = (P * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1);
  const totalPaid = M * n;
  const totalInterest = totalPaid - P;

  return { monthlyPayment: M, totalPaid, totalInterest };
};

export default function LoanComparisonCalculator() {
  const [loan1, setLoan1] = useState({ amount: '10000', apr: '7.5', term: '5' });
  const [loan2, setLoan2] = useState({ amount: '10000', apr: '8.0', term: '4' });
  const [results1, setResults1] = useState(null);
  const [results2, setResults2] = useState(null);

  const handleCompare = () => {
    setResults1(calculateLoanDetails(loan1));
    setResults2(calculateLoanDetails(loan2));
  };

  // Initial calculation on load
  useState(() => {
    handleCompare();
  }, []);

  const betterMonthly = results1 && results2 && results1.monthlyPayment < results2.monthlyPayment;
  const betterTotal = results1 && results2 && results1.totalPaid < results2.totalPaid;

  return (
    <div className="bg-white">
      <div className="bg-gray-50 border-b border-gray-200 non-printable">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <Heading as="h1" size="h1" weight="bold" className="text-gray-900 mb-4">
              Loan Comparison Calculator
            </Heading>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Compare two loan offers side-by-side to see which one is truly the better deal for
              you.
            </p>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <LoanInput id="1" loan={loan1} setLoan={setLoan1} title="Loan Offer 1" />
          <LoanInput id="2" loan={loan2} setLoan={setLoan2} title="Loan Offer 2" />
        </div>
        <div className="text-center mb-8">
          <Button size="lg" onClick={handleCompare}>
            <Repeat className="w-5 h-5 mr-2" />
            Compare Loans
          </Button>
        </div>
        {results1 && results2 && (
          <Card>
            <CardHeader>
              <CardTitle>Comparison Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4">
                  <h3 className="font-semibold text-lg">Metric</h3>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-lg">Loan 1</h3>
                </div>
                <div className="p-4 bg-indigo-50 rounded-lg">
                  <h3 className="font-semibold text-lg">Loan 2</h3>
                </div>

                <div className="p-4 font-medium self-center">Monthly Payment</div>
                <div className="p-4 bg-blue-50 rounded-lg flex items-center justify-center">
                  <span className="text-2xl font-bold">£{results1.monthlyPayment.toFixed(2)}</span>
                  {betterMonthly && <CheckCircle2 className="w-6 h-6 text-green-600 ml-2" />}
                  {!betterMonthly && <XCircle className="w-6 h-6 text-red-500 ml-2" />}
                </div>
                <div className="p-4 bg-indigo-50 rounded-lg flex items-center justify-center">
                  <span className="text-2xl font-bold">£{results2.monthlyPayment.toFixed(2)}</span>
                  {!betterMonthly && <CheckCircle2 className="w-6 h-6 text-green-600 ml-2" />}
                  {betterMonthly && <XCircle className="w-6 h-6 text-red-500 ml-2" />}
                </div>

                <div className="p-4 font-medium self-center">Total Interest Paid</div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <span className="text-xl font-bold">£{results1.totalInterest.toFixed(2)}</span>
                </div>
                <div className="p-4 bg-indigo-50 rounded-lg">
                  <span className="text-xl font-bold">£{results2.totalInterest.toFixed(2)}</span>
                </div>

                <div className="p-4 font-medium self-center">Total Amount Paid</div>
                <div className="p-4 bg-blue-50 rounded-lg flex items-center justify-center">
                  <span className="text-2xl font-bold">£{results1.totalPaid.toFixed(2)}</span>
                  {betterTotal && <CheckCircle2 className="w-6 h-6 text-green-600 ml-2" />}
                  {!betterTotal && <XCircle className="w-6 h-6 text-red-500 ml-2" />}
                </div>
                <div className="p-4 bg-indigo-50 rounded-lg flex items-center justify-center">
                  <span className="text-2xl font-bold">£{results2.totalPaid.toFixed(2)}</span>
                  {!betterTotal && <CheckCircle2 className="w-6 h-6 text-green-600 ml-2" />}
                  {betterTotal && <XCircle className="w-6 h-6 text-red-500 ml-2" />}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        <div className="mt-12 non-printable">
          <FAQSection faqs={loanComparisonFAQs} />
        </div>
      </div>
    </div>
  );
}
