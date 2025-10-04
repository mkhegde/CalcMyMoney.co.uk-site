import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PoundSterling, Calculator, Percent } from 'lucide-react';
import ExportActions from '../components/calculators/ExportActions';
import FAQSection from '../components/calculators/FAQSection';
import Heading from '@/components/common/Heading';

const vatFAQs = [
  {
    question: 'What are the current VAT rates in the UK?',
    answer:
      "The standard VAT rate is 20%. There is a reduced rate of 5% for items like home energy and children's car seats, and a zero rate (0%) for most food and children's clothes.",
  },
  {
    question: 'How do I calculate VAT?',
    answer:
      'To add 20% VAT to a price, you multiply the net amount by 1.20. To find the VAT amount from a gross price (inclusive of VAT), you divide the gross amount by 6.',
  },
  {
    question: 'What is the difference between net and gross price?',
    answer:
      'The net price is the price before VAT is added. The gross price is the final price including VAT that a consumer pays.',
  },
];

export default function VATCalculator() {
  const [amount, setAmount] = useState('');
  const [vatRate, setVatRate] = useState('20');
  const [calculationType, setCalculationType] = useState('add');
  const [results, setResults] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [csvData, setCsvData] = useState(null);

  const handleCalculate = () => {
    const numAmount = Number(amount) || 0;
    const rate = Number(vatRate) / 100;
    if (numAmount <= 0) {
      setResults(null);
      setHasCalculated(true);
      return;
    }

    let netAmount, vatAmount, grossAmount;

    if (calculationType === 'add') {
      netAmount = numAmount;
      vatAmount = netAmount * rate;
      grossAmount = netAmount + vatAmount;
    } else {
      // remove
      grossAmount = numAmount;
      vatAmount = grossAmount - grossAmount / (1 + rate);
      netAmount = grossAmount - vatAmount;
    }

    const newResults = { netAmount, vatAmount, grossAmount, vatRate: Number(vatRate) };
    setResults(newResults);
    setHasCalculated(true);

    const csvExportData = [
      ['Metric', 'Value'],
      ['Net Amount (excl. VAT)', `£${newResults.netAmount.toFixed(2)}`],
      [`VAT @ ${newResults.vatRate}%`, `£${newResults.vatAmount.toFixed(2)}`],
      ['Gross Amount (incl. VAT)', `£${newResults.grossAmount.toFixed(2)}`],
    ];
    setCsvData(csvExportData);
  };

  useEffect(() => {
    setHasCalculated(false);
    setResults(null);
  }, [amount, vatRate, calculationType]);

  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 non-printable">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <Heading as="h1" size="h1" weight="bold" className="text-gray-900 dark:text-gray-100 mb-4">
              UK VAT Calculator
            </Heading>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Quickly add or remove VAT from any amount. Perfect for business owners, freelancers,
              and shoppers.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="print-title hidden">VAT Calculation</div>
        <div className="grid lg:grid-cols-5 gap-8 printable-grid-cols-1">
          <div className="lg:col-span-2 non-printable">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Enter Calculation Details</CardTitle>
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
                      className="pl-10"
                      placeholder="e.g. 100"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>VAT Rate</Label>
                  <Select value={vatRate} onValueChange={setVatRate}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="20">Standard Rate (20%)</SelectItem>
                      <SelectItem value="5">Reduced Rate (5%)</SelectItem>
                      <SelectItem value="0">Zero Rate (0%)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Calculation</Label>
                  <RadioGroup
                    value={calculationType}
                    onValueChange={setCalculationType}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="add" id="add" />
                      <Label htmlFor="add">Add VAT</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="remove" id="remove" />
                      <Label htmlFor="remove">Remove VAT</Label>
                    </div>
                  </RadioGroup>
                </div>
                <Button onClick={handleCalculate} className="w-full text-lg">
                  <Calculator className="w-5 h-5 mr-2" />
                  Calculate VAT
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3 space-y-6 printable-area">
            {hasCalculated && results ? (
              <>
                <div className="flex justify-between items-center non-printable">
                  <h2 className="text-2xl font-bold text-gray-800">VAT Calculation Results</h2>
                  <ExportActions
                    csvData={csvData}
                    fileName="vat-calculation"
                    title="VAT Calculation"
                  />
                </div>
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-blue-800 mb-2">Gross Amount (inc. VAT)</h3>
                    <div className="text-4xl font-bold text-blue-900">
                      £
                      {results.grossAmount.toLocaleString('en-GB', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>VAT Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-lg">
                    <div className="flex justify-between p-4 bg-gray-50 rounded-lg">
                      <span className="text-gray-600">Net Amount</span>
                      <span className="font-semibold">
                        £
                        {results.netAmount.toLocaleString('en-GB', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between p-4 bg-gray-50 rounded-lg">
                      <span className="text-gray-600">VAT @ {results.vatRate}%</span>
                      <span className="font-semibold">
                        £
                        {results.vatAmount.toLocaleString('en-GB', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="flex items-center justify-center h-[400px]">
                <div className="text-center text-gray-500">
                  <Calculator className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold">Ready to calculate VAT?</h3>
                  <p>Enter an amount and choose your options to see the results.</p>
                </div>
              </Card>
            )}
          </div>
        </div>

        <div className="bg-gray-50 py-12 non-printable mt-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <FAQSection faqs={vatFAQs} />
          </div>
        </div>
      </div>
    </div>
  );
}
