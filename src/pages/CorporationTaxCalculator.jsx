import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { PoundSterling, Calculator, Building2 } from 'lucide-react';
import ExportActions from '../components/calculators/ExportActions';
import FAQSection from '../components/calculators/FAQSection';

const corpTaxFAQs = [
  {
    question: 'What is Corporation Tax?',
    answer:
      'Corporation Tax is a tax that limited companies and some other organisations in the UK pay on their annual profits. If your company is based in the UK, it pays Corporation Tax on all its profits from the UK and abroad.',
  },
  {
    question: 'What are the current Corporation Tax rates?',
    answer:
      'From 1 April 2023, the main rate of Corporation Tax is 25% for companies with profits over £250,000. A Small Profits Rate of 19% applies to companies with profits of £50,000 or less. Companies with profits between these two thresholds pay tax at the main rate but can claim Marginal Relief.',
  },
  {
    question: 'What is Marginal Relief?',
    answer:
      'Marginal Relief is a form of tax relief that provides a gradual increase in the Corporation Tax rate for companies with profits between £50,000 and £250,000. This avoids a sudden jump from the 19% rate to the 25% rate.',
  },
];

const SMALL_PROFITS_RATE = 0.19;
const MAIN_RATE = 0.25;
const SMALL_PROFITS_THRESHOLD = 50000;
const MAIN_RATE_THRESHOLD = 250000;
const MARGINAL_RELIEF_FRACTION =
  (MAIN_RATE - SMALL_PROFITS_RATE) / (MAIN_RATE_THRESHOLD - SMALL_PROFITS_THRESHOLD); // 3/200 simplified

export default function CorporationTaxCalculator() {
  const [companyProfit, setCompanyProfit] = useState('');
  const [results, setResults] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [csvData, setCsvData] = useState(null);

  const handleCalculate = () => {
    const profit = Number(companyProfit) || 0;
    if (profit <= 0) {
      setResults(null);
      setHasCalculated(true);
      return;
    }

    let taxDue = 0;
    let effectiveRate = 0;
    let relief = 0;

    if (profit <= SMALL_PROFITS_THRESHOLD) {
      taxDue = profit * SMALL_PROFITS_RATE;
    } else if (profit > MAIN_RATE_THRESHOLD) {
      taxDue = profit * MAIN_RATE;
    } else {
      // Marginal Relief
      const mainRateTax = profit * MAIN_RATE;
      relief = ((MAIN_RATE_THRESHOLD - profit) * MARGINAL_RELIEF_FRACTION * profit) / profit; // Standard formula simplified
      taxDue = mainRateTax - relief;
    }

    effectiveRate = (taxDue / profit) * 100;

    const newResults = {
      profit,
      taxDue,
      effectiveRate,
      relief,
    };

    setResults(newResults);
    setHasCalculated(true);

    const csvExportData = [
      ['Metric', 'Value'],
      ['Company Profit', `£${newResults.profit.toFixed(2)}`],
      ['Corporation Tax Due', `£${newResults.taxDue.toFixed(2)}`],
      ['Effective Tax Rate', `${newResults.effectiveRate.toFixed(2)}%`],
      ['Marginal Relief Applied', `£${newResults.relief.toFixed(2)}`],
    ];
    setCsvData(csvExportData);
  };

  useEffect(() => {
    setHasCalculated(false);
    setResults(null);
  }, [companyProfit]);

  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 non-printable">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              UK Corporation Tax Calculator
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Calculate the Corporation Tax liability for a UK limited company based on its annual
              profits.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="print-title hidden">Corporation Tax Calculation</div>
        <div className="grid lg:grid-cols-5 gap-8 printable-grid-cols-1">
          <div className="lg:col-span-2 non-printable">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Company Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="companyProfit">Annual Taxable Profit</Label>
                  <div className="relative">
                    <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="companyProfit"
                      type="number"
                      value={companyProfit}
                      onChange={(e) => setCompanyProfit(e.target.value)}
                      className="pl-10"
                      placeholder="e.g. 150000"
                    />
                  </div>
                </div>
                <Button onClick={handleCalculate} className="w-full text-lg">
                  <Calculator className="w-5 h-5 mr-2" />
                  Calculate Tax
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3 space-y-6 printable-area">
            {hasCalculated && results ? (
              <>
                <div className="flex justify-between items-center non-printable">
                  <h2 className="text-2xl font-bold text-gray-800">Corporation Tax Estimate</h2>
                  <ExportActions
                    csvData={csvData}
                    fileName="corporation-tax"
                    title="Corporation Tax"
                  />
                </div>
                <Card className="bg-red-50 border-red-200">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-red-800 mb-2">Corporation Tax Due</h3>
                    <div className="text-4xl font-bold text-red-900">
                      £
                      {results.taxDue.toLocaleString('en-GB', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Calculation Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Company Profit</p>
                      <p className="text-lg font-semibold">£{results.profit.toLocaleString()}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Effective Tax Rate</p>
                      <p className="text-lg font-semibold">{results.effectiveRate.toFixed(2)}%</p>
                    </div>
                    {results.relief > 0 && (
                      <div className="p-4 bg-green-50 rounded-lg">
                        <p className="text-sm text-gray-600">Marginal Relief Applied</p>
                        <p className="text-lg font-semibold text-green-700">
                          £
                          {results.relief.toLocaleString('en-GB', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="flex items-center justify-center h-[400px]">
                <div className="text-center text-gray-500">
                  <Calculator className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold">Ready to calculate tax?</h3>
                  <p>Enter your company's profit to see the tax liability.</p>
                </div>
              </Card>
            )}
          </div>
        </div>

        <div className="bg-gray-50 py-12 non-printable mt-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <FAQSection faqs={corpTaxFAQs} />
          </div>
        </div>
      </div>
    </div>
  );
}
