import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { PoundSterling, Home, User, Percent, Calculator } from 'lucide-react';
import FAQSection from '../components/calculators/FAQSection';

import Heading from '@/components/common/Heading';
const ftbFAQs = [
  {
    question: 'What is Loan-to-Income (LTI)?',
    answer:
      "Lenders use LTI as a key affordability measure. It's a multiple of your annual gross income. Most lenders cap borrowing at 4.5x your income, though some may offer more under specific circumstances.",
  },
  {
    question: 'What is First-Time Buyer Stamp Duty relief?',
    answer:
      "In England & NI, first-time buyers pay 0% SDLT on the first £425,000 of a property's value, and 5% on the portion between £425,001 and £625,000. No relief is available if the property costs more than £625,000.",
  },
  {
    question: 'What other costs are involved?',
    answer:
      "Besides the deposit, you'll need to budget for solicitor's fees, mortgage arrangement fees, valuation fees, and moving costs. These can add several thousand pounds to your total upfront cost.",
  },
];

export default function FirstTimeBuyerCalculator() {
  const [propertyPrice, setPropertyPrice] = useState('');
  const [deposit, setDeposit] = useState('');
  const [income, setIncome] = useState('');
  const [results, setResults] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);

  const handleCalculate = useCallback(() => {
    const price = Number(propertyPrice) || 0;
    const dep = Number(deposit) || 0;
    const inc = Number(income) || 0;
    if (price <= 0 || inc <= 0) {
      setResults(null);
      setHasCalculated(true);
      return;
    }

    const mortgageNeeded = price - dep;
    const maxBorrowing = inc * 4.5;
    const lti = mortgageNeeded / inc;
    const depositPercent = (dep / price) * 100;
    const affordable = mortgageNeeded <= maxBorrowing;

    // Simplified FTB Stamp Duty
    let sdlt = 0;
    if (price > 425000 && price <= 625000) {
      sdlt = (price - 425000) * 0.05;
    } else if (price > 625000) {
      // No relief
      const standardThreshold1 = 250000;
      const standardThreshold2 = 925000;
      const standardThreshold3 = 1500000; // Added for completeness, although not used in this simplified calculation

      // Re-evaluating standard SDLT based on typical UK rates for general properties
      // (assuming 0% up to 250k, 5% up to 925k, 10% up to 1.5m, 12% above)
      if (price > standardThreshold1) {
        sdlt += (Math.min(price, standardThreshold2) - standardThreshold1) * 0.05;
      }
      if (price > standardThreshold2) {
        sdlt += (Math.min(price, standardThreshold3) - standardThreshold2) * 0.1;
      }
      if (price > standardThreshold3) {
        sdlt += (price - standardThreshold3) * 0.12;
      }
    }

    setResults({ mortgageNeeded, maxBorrowing, lti, depositPercent, affordable, sdlt });
    setHasCalculated(true);
  }, [propertyPrice, deposit, income]);

  return (
    <div className="bg-white">
      <div className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <Heading as="h1" size="h1" weight="bold" className="text-center">First-Time Buyer Calculator</Heading>
        </div>
      </div>
      <div className="max-w-4xl mx-auto p-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Your Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Property Price (£)</Label>
                <Input
                  type="number"
                  value={propertyPrice}
                  onChange={(e) => setPropertyPrice(e.target.value)}
                  placeholder="e.g. 280000"
                />
              </div>
              <div>
                <Label>Deposit Amount (£)</Label>
                <Input
                  type="number"
                  value={deposit}
                  onChange={(e) => setDeposit(e.target.value)}
                  placeholder="e.g. 30000"
                />
              </div>
              <div>
                <Label>Gross Annual Income (£)</Label>
                <Input
                  type="number"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  placeholder="e.g. 55000"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleCalculate} className="w-full text-lg">
                <Calculator className="w-5 h-5 mr-2" />
                Check Affordability
              </Button>
            </CardFooter>
          </Card>
          <div>
            {hasCalculated && results ? (
              <Card>
                <CardHeader>
                  <CardTitle>Affordability Check</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div
                    className={`p-4 rounded-lg ${results.affordable ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}
                  >
                    <p className="font-bold">
                      {results.affordable ? 'Looking Good!' : 'May Be a Stretch'}
                    </p>
                    <p className="text-sm">
                      {results.affordable
                        ? 'The mortgage required is within the typical 4.5x income multiple.'
                        : 'The mortgage required may exceed what lenders typically offer.'}
                    </p>
                  </div>
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span>Mortgage Needed:</span>{' '}
                      <strong>£{results.mortgageNeeded.toLocaleString()}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Max Borrowing (est.):</span>{' '}
                      <strong>£{results.maxBorrowing.toLocaleString()}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Loan-to-Income Ratio:</span> <strong>{results.lti.toFixed(2)}x</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Deposit Percentage:</span>{' '}
                      <strong>{results.depositPercent.toFixed(1)}%</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Stamp Duty (FTB rate):</span>{' '}
                      <strong>£{results.sdlt.toLocaleString()}</strong>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="flex items-center justify-center h-full min-h-[220px]">
                <div className="text-center text-gray-500">
                  <Home className="w-10 h-10 mx-auto mb-2" />
                  <p>See if you can afford your first home.</p>
                </div>
              </Card>
            )}
          </div>
        </div>
        <div className="mt-12">
          <FAQSection faqs={ftbFAQs} />
        </div>
      </div>
    </div>
  );
}
