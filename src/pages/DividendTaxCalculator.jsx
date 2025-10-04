import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PoundSterling, Percent, Calculator, TrendingUp } from 'lucide-react';
import FAQSection from '../components/calculators/FAQSection';
import Heading from '@/components/common/Heading';

const dividendTaxFAQs = [
  {
    question: 'What is the Dividend Allowance?',
    answer:
      'The Dividend Allowance is the amount of dividend income you can receive each tax year without paying any tax. For the 2024/25 tax year, this allowance is £500. You do not pay tax on any dividend income that falls within this allowance.',
  },
  {
    question: 'How is dividend tax calculated?',
    answer:
      'Dividend tax is calculated based on your Income Tax band. After using your Personal Allowance and Dividend Allowance, any further dividends are taxed at specific rates for basic, higher, and additional rate taxpayers. Your other income (like a salary) determines which tax band your dividends fall into.',
  },
  {
    question: 'Do I need to file a tax return for dividends?',
    answer:
      'If your dividend income is more than the £500 allowance, you will usually need to declare it to HMRC, typically through a Self Assessment tax return.',
  },
  {
    question: 'A Note on Trustworthiness',
    answer:
      'This calculator is based on the 2024/25 tax rates for England, Wales, and Northern Ireland. Tax laws are complex and can change. This tool is for estimation purposes and should not be considered financial advice. For official guidance, refer to GOV.UK or consult a tax professional.',
  },
];

// 2024/25 Tax Year Rates
const PERSONAL_ALLOWANCE = 12570;
const DIVIDEND_ALLOWANCE = 500;
const BASIC_RATE_LIMIT = 50270;
const HIGHER_RATE_LIMIT = 125140;

const DIVIDEND_TAX_RATES = {
  basic: 0.0875,
  higher: 0.3375,
  additional: 0.3935,
};

export default function DividendTaxCalculator() {
  const [otherIncome, setOtherIncome] = useState('50000');
  const [dividendIncome, setDividendIncome] = useState('5000');
  const [results, setResults] = useState(null);

  const handleCalculate = useCallback(() => {
    const otherInc = Number(otherIncome) || 0;
    const dividendInc = Number(dividendIncome) || 0;

    let personalAllowance = PERSONAL_ALLOWANCE;
    if (otherInc > 100000) {
      personalAllowance = Math.max(0, PERSONAL_ALLOWANCE - (otherInc - 100000) / 2);
    }

    const incomeAfterPA = Math.max(0, otherInc - personalAllowance);

    let taxableDividends = Math.max(0, dividendInc - DIVIDEND_ALLOWANCE);
    let tax = 0;
    let breakdown = [];
    let remainingTaxableDividends = taxableDividends;

    const basicRateBandAvailable = Math.max(
      0,
      BASIC_RATE_LIMIT - personalAllowance - incomeAfterPA
    );
    const higherRateBandAvailable = Math.max(0, HIGHER_RATE_LIMIT - BASIC_RATE_LIMIT);

    // Tax in basic rate band
    if (remainingTaxableDividends > 0 && basicRateBandAvailable > 0) {
      const amountInBand = Math.min(remainingTaxableDividends, basicRateBandAvailable);
      const taxInBand = amountInBand * DIVIDEND_TAX_RATES.basic;
      tax += taxInBand;
      remainingTaxableDividends -= amountInBand;
      if (taxInBand > 0)
        breakdown.push({
          name: 'Basic Rate',
          amount: taxInBand,
          taxableAmount: amountInBand,
          rate: DIVIDEND_TAX_RATES.basic * 100,
        });
    }

    // Tax in higher rate band
    if (remainingTaxableDividends > 0 && higherRateBandAvailable > 0) {
      const amountInBand = Math.min(remainingTaxableDividends, higherRateBandAvailable);
      const taxInBand = amountInBand * DIVIDEND_TAX_RATES.higher;
      tax += taxInBand;
      remainingTaxableDividends -= amountInBand;
      if (taxInBand > 0)
        breakdown.push({
          name: 'Higher Rate',
          amount: taxInBand,
          taxableAmount: amountInBand,
          rate: DIVIDEND_TAX_RATES.higher * 100,
        });
    }

    // Tax in additional rate band
    if (remainingTaxableDividends > 0) {
      const taxInBand = remainingTaxableDividends * DIVIDEND_TAX_RATES.additional;
      tax += taxInBand;
      if (taxInBand > 0)
        breakdown.push({
          name: 'Additional Rate',
          amount: taxInBand,
          taxableAmount: remainingTaxableDividends,
          rate: DIVIDEND_TAX_RATES.additional * 100,
        });
    }

    setResults({ taxPayable: tax, breakdown });
  }, [otherIncome, dividendIncome]);

  useEffect(() => {
    handleCalculate();
  }, [handleCalculate]);

  return (
    <div className="bg-white">
      <div className="bg-gray-50 border-b border-gray-200 non-printable">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <Heading as="h1" size="h1" weight="bold" className="text-gray-900 mb-4">
              UK Dividend Tax Calculator
            </Heading>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Estimate the tax you'll owe on your dividend income for the 2024/25 tax year.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="non-printable">
            <Card>
              <CardHeader>
                <CardTitle>Your Income Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="otherIncome">Other Annual Income (e.g. Salary) (£)</Label>
                  <Input
                    id="otherIncome"
                    type="number"
                    value={otherIncome}
                    onChange={(e) => setOtherIncome(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="dividendIncome">Total Annual Dividend Income (£)</Label>
                  <Input
                    id="dividendIncome"
                    type="number"
                    value={dividendIncome}
                    onChange={(e) => setDividendIncome(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            {results ? (
              <div className="space-y-6">
                <Card className="bg-red-50 border-red-200">
                  <CardHeader>
                    <CardTitle className="text-red-900">Estimated Dividend Tax</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-5xl font-bold text-red-900">
                      £
                      {results.taxPayable.toLocaleString('en-GB', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                    <p className="text-sm text-red-700 mt-2">
                      Based on your total income and dividend allowance.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Tax Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span>Within £{DIVIDEND_ALLOWANCE} Dividend Allowance:</span>
                      <span className="font-semibold text-green-700">£0.00 tax</span>
                    </div>
                    {results.breakdown.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded-md"
                      >
                        <div>
                          <span>
                            Tax on £{item.taxableAmount.toLocaleString()} at {item.rate.toFixed(2)}%
                            ({item.name})
                          </span>
                        </div>
                        <span className="font-semibold">
                          -£{item.amount.toLocaleString('en-GB', { maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    ))}
                    {results.taxPayable === 0 && (
                      <p className="text-sm text-gray-600">
                        Your dividend income is within your tax-free allowances.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="flex items-center justify-center h-full">
                <p className="text-gray-500">Enter details to calculate tax.</p>
              </Card>
            )}
          </div>
        </div>

        <div className="mt-12 non-printable">
          <FAQSection faqs={dividendTaxFAQs} />
        </div>
      </div>
    </div>
  );
}
