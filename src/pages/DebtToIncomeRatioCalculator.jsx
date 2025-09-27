import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { PoundSterling, Calculator, TrendingDown, Plus, Trash2, Percent } from 'lucide-react';
import ExportActions from '../components/calculators/ExportActions';
import FAQSection from '../components/calculators/FAQSection';

const dtiFAQs = [
  {
    question: 'What is a Debt-to-Income (DTI) ratio?',
    answer:
      'Your DTI ratio is the percentage of your gross monthly income that goes towards paying your monthly debt payments. Lenders use it to assess your ability to manage monthly payments and repay debts.',
  },
  {
    question: 'What is a good DTI ratio?',
    answer:
      'Lenders generally prefer a DTI ratio of 36% or less. A ratio above 43% is often considered too high, making it difficult to get approved for a mortgage or other loans.',
  },
  {
    question: 'How can I lower my DTI ratio?',
    answer:
      'You can lower your DTI by either increasing your income or reducing your monthly debt payments. Focus on paying down high-interest loans or credit card balances first. Avoid taking on new debt before applying for a major loan.',
  },
];

export default function DebtToIncomeRatioCalculator() {
  const [grossIncome, setGrossIncome] = useState('');
  const [debtItems, setDebtItems] = useState([
    { name: 'Mortgage/Rent', amount: '' },
    { name: 'Car Loan', amount: '' },
  ]);
  const [results, setResults] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [csvData, setCsvData] = useState(null);

  const updateDebtItem = (index, field, value) => {
    const newItems = [...debtItems];
    newItems[index][field] = value;
    setDebtItems(newItems);
  };

  const addDebtItem = () => setDebtItems([...debtItems, { name: '', amount: '' }]);
  const removeDebtItem = (index) => setDebtItems(debtItems.filter((_, i) => i !== index));

  const handleCalculate = () => {
    const income = Number(grossIncome) || 0;
    const totalDebts = debtItems.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

    if (income <= 0) {
      setResults(null);
      setHasCalculated(true);
      return;
    }

    const dtiRatio = (totalDebts / income) * 100;

    let status = 'Healthy';
    let statusColor = 'text-green-600';
    if (dtiRatio > 43) {
      status = 'High Risk';
      statusColor = 'text-red-600';
    } else if (dtiRatio > 36) {
      status = 'Needs Improvement';
      statusColor = 'text-amber-600';
    }

    const newResults = { dtiRatio, totalDebts, grossIncome: income, status, statusColor };
    setResults(newResults);
    setHasCalculated(true);

    const csvExportData = [
      ['Metric', 'Value'],
      ['Gross Monthly Income', `£${income.toFixed(2)}`],
      ...debtItems.map((item) => [
        `Monthly Debt: ${item.name}`,
        `£${(Number(item.amount) || 0).toFixed(2)}`,
      ]),
      ['Total Monthly Debts', `£${totalDebts.toFixed(2)}`],
      ['DTI Ratio', `${dtiRatio.toFixed(2)}%`],
      ['Status', status],
    ];
    setCsvData(csvExportData);
  };

  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 non-printable">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Debt-to-Income (DTI) Ratio Calculator
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Understand a key metric lenders use to assess your financial health before approving
              you for a loan or mortgage.
            </p>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 non-printable">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Your Monthly Finances</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="grossIncome">Gross Monthly Income</Label>
                  <div className="relative">
                    <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="grossIncome"
                      type="number"
                      value={grossIncome}
                      onChange={(e) => setGrossIncome(e.target.value)}
                      className="pl-10"
                      placeholder="e.g. 4000"
                    />
                  </div>
                </div>

                <div>
                  <Label>Monthly Debt Payments</Label>
                  <div className="space-y-2 mt-2">
                    {debtItems.map((item, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <Input
                          value={item.name}
                          onChange={(e) => updateDebtItem(index, 'name', e.target.value)}
                          placeholder="e.g. Credit Card"
                        />
                        <div className="relative">
                          <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            type="number"
                            value={item.amount}
                            onChange={(e) => updateDebtItem(index, 'amount', e.target.value)}
                            className="pl-10 w-32"
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeDebtItem(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" onClick={addDebtItem} className="w-full mt-2">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Debt
                  </Button>
                </div>

                <Button onClick={handleCalculate} className="w-full text-lg">
                  <Calculator className="w-5 h-5 mr-2" />
                  Calculate DTI
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3 space-y-6 printable-area">
            {hasCalculated && results ? (
              <>
                <div className="flex justify-between items-center non-printable">
                  <h2 className="text-2xl font-bold text-gray-800">Your DTI Ratio Result</h2>
                  <ExportActions
                    csvData={csvData}
                    fileName="dti-ratio-summary"
                    title="DTI Ratio Summary"
                  />
                </div>

                <Card className="text-center">
                  <CardHeader>
                    <CardTitle className="flex justify-center items-center gap-2">
                      <Percent className="w-6 h-6" />
                      Your DTI Ratio
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className={`text-6xl font-bold ${results.statusColor}`}>
                      {results.dtiRatio.toFixed(1)}%
                    </p>
                    <p className={`text-xl font-semibold mt-2 ${results.statusColor}`}>
                      ({results.status})
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Financial Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span>Gross Monthly Income:</span>{' '}
                      <span className="font-semibold">£{results.grossIncome.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Monthly Debts:</span>{' '}
                      <span className="font-semibold text-red-600">
                        £{results.totalDebts.toLocaleString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>What This Means</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm">
                    <div className="flex items-start gap-4 p-3 bg-green-50 rounded-lg">
                      <div className="font-bold text-green-700 w-24">0-36%</div>
                      <p className="text-green-800">
                        <strong>Healthy:</strong> You likely have a good balance between debt and
                        income and should be able to get new credit easily.
                      </p>
                    </div>
                    <div className="flex items-start gap-4 p-3 bg-amber-50 rounded-lg">
                      <div className="font-bold text-amber-700 w-24">37-43%</div>
                      <p className="text-amber-800">
                        <strong>Needs Improvement:</strong> You may have less room in your budget
                        for unexpected costs. Lenders may see you as a higher risk.
                      </p>
                    </div>
                    <div className="flex items-start gap-4 p-3 bg-red-50 rounded-lg">
                      <div className="font-bold text-red-700 w-24">44%+</div>
                      <p className="text-red-800">
                        <strong>High Risk:</strong> You have a limited amount of income available
                        for new credit. It will be difficult to get approved for new loans.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="flex items-center justify-center h-[400px] bg-gray-50">
                <div className="text-center text-gray-500">
                  <TrendingDown className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold">Discover your DTI ratio</h3>
                  <p>Enter your income and debts to see where you stand.</p>
                </div>
              </Card>
            )}
          </div>
        </div>
        <div className="mt-12 non-printable">
          <FAQSection faqs={dtiFAQs} />
        </div>
      </div>
    </div>
  );
}
