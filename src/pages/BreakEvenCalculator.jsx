import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { PoundSterling, Calculator, Target, TrendingUp } from 'lucide-react';
import ExportActions from '../components/calculators/ExportActions';
import FAQSection from '../components/calculators/FAQSection';
import Heading from '@/components/common/Heading';

const breakEvenFAQs = [
  {
    question: 'What is a break-even point?',
    answer:
      "The break-even point is where your total revenue equals your total costs, meaning you're making neither a profit nor a loss. It's a critical metric for business planning and pricing decisions.",
  },
  {
    question: "What's the difference between fixed and variable costs?",
    answer:
      'Fixed costs remain constant regardless of sales volume (e.g., rent, insurance, salaries). Variable costs change with production or sales volume (e.g., materials, commission, delivery costs).',
  },
  {
    question: 'How can I use break-even analysis for pricing?',
    answer:
      'Break-even analysis helps you set minimum prices to cover costs. You can also use it to evaluate the impact of price changes, cost reductions, or volume increases on profitability.',
  },
];

export default function BreakEvenCalculator() {
  const [fixedCosts, setFixedCosts] = useState('');
  const [pricePerUnit, setPricePerUnit] = useState('');
  const [variableCostPerUnit, setVariableCostPerUnit] = useState('');
  const [results, setResults] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [csvData, setCsvData] = useState(null);

  const handleCalculate = () => {
    const fixed = Number(fixedCosts) || 0;
    const price = Number(pricePerUnit) || 0;
    const variableCost = Number(variableCostPerUnit) || 0;

    if (fixed <= 0 || price <= 0 || variableCost < 0 || price <= variableCost) {
      setResults(null);
      setHasCalculated(true);
      return;
    }

    const contributionMargin = price - variableCost;
    const contributionMarginPercent = (contributionMargin / price) * 100;
    const breakEvenUnits = Math.ceil(fixed / contributionMargin);
    const breakEvenRevenue = breakEvenUnits * price;

    // Calculate scenarios
    const scenarios = [
      { units: breakEvenUnits * 0.5, revenue: breakEvenUnits * 0.5 * price },
      { units: breakEvenUnits, revenue: breakEvenRevenue },
      { units: breakEvenUnits * 1.5, revenue: breakEvenUnits * 1.5 * price },
      { units: breakEvenUnits * 2, revenue: breakEvenUnits * 2 * price },
    ].map((scenario) => {
      const totalVariableCosts = scenario.units * variableCost;
      const totalCosts = fixed + totalVariableCosts;
      const profit = scenario.revenue - totalCosts;
      return { ...scenario, profit, totalCosts };
    });

    const newResults = {
      breakEvenUnits,
      breakEvenRevenue,
      contributionMargin,
      contributionMarginPercent,
      scenarios,
    };

    setResults(newResults);
    setHasCalculated(true);

    const csvExportData = [
      ['Metric', 'Value'],
      ['Break-Even Units', `${newResults.breakEvenUnits}`],
      ['Break-Even Revenue', `£${newResults.breakEvenRevenue.toFixed(2)}`],
      ['Contribution Margin per Unit', `£${newResults.contributionMargin.toFixed(2)}`],
      ['Contribution Margin %', `${newResults.contributionMarginPercent.toFixed(1)}%`],
    ];
    setCsvData(csvExportData);
  };

  useEffect(() => {
    setHasCalculated(false);
    setResults(null);
  }, [fixedCosts, pricePerUnit, variableCostPerUnit]);

  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 non-printable">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <Heading as="h1" size="h1" weight="bold" className="text-gray-900 dark:text-gray-100 mb-4">
              Business Break-Even Calculator
            </Heading>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Calculate how many units you need to sell to break even and start making profit.
              Essential for pricing and business planning.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="print-title hidden">Break-Even Analysis</div>
        <div className="grid lg:grid-cols-5 gap-8 printable-grid-cols-1">
          <div className="lg:col-span-2 non-printable">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Business Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="fixedCosts">Monthly Fixed Costs</Label>
                  <div className="relative">
                    <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="fixedCosts"
                      type="number"
                      value={fixedCosts}
                      onChange={(e) => setFixedCosts(e.target.value)}
                      className="pl-10"
                      placeholder="e.g. 5000"
                    />
                  </div>
                  <p className="text-xs text-gray-500">Rent, salaries, insurance, etc.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pricePerUnit">Price per Unit/Service</Label>
                  <div className="relative">
                    <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="pricePerUnit"
                      type="number"
                      value={pricePerUnit}
                      onChange={(e) => setPricePerUnit(e.target.value)}
                      className="pl-10"
                      placeholder="e.g. 50"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="variableCostPerUnit">Variable Cost per Unit</Label>
                  <div className="relative">
                    <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="variableCostPerUnit"
                      type="number"
                      value={variableCostPerUnit}
                      onChange={(e) => setVariableCostPerUnit(e.target.value)}
                      className="pl-10"
                      placeholder="e.g. 20"
                    />
                  </div>
                  <p className="text-xs text-gray-500">Materials, commission, delivery, etc.</p>
                </div>
                <Button onClick={handleCalculate} className="w-full text-lg">
                  <Calculator className="w-5 h-5 mr-2" />
                  Calculate Break-Even
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3 space-y-6 printable-area">
            {hasCalculated && results ? (
              <>
                <div className="flex justify-between items-center non-printable">
                  <h2 className="text-2xl font-bold text-gray-800">Break-Even Analysis</h2>
                  <ExportActions
                    csvData={csvData}
                    fileName="break-even-analysis"
                    title="Break-Even Analysis"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="bg-orange-50 border-orange-200">
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-orange-800 mb-2">Break-Even Units</h3>
                      <div className="text-4xl font-bold text-orange-900">
                        {results.breakEvenUnits.toLocaleString()}
                      </div>
                      <p className="text-sm text-orange-700">Units per month</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-green-800 mb-2">Break-Even Revenue</h3>
                      <div className="text-4xl font-bold text-green-900">
                        £
                        {results.breakEvenRevenue.toLocaleString('en-GB', {
                          maximumFractionDigits: 0,
                        })}
                      </div>
                      <p className="text-sm text-green-700">Monthly revenue needed</p>
                    </CardContent>
                  </Card>
                </div>
                <Card>
                  <CardHeader>
                    <CardTitle>Contribution Analysis</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-600">Contribution Margin per Unit</p>
                      <p className="text-lg font-semibold">
                        £{results.contributionMargin.toFixed(2)} (
                        {results.contributionMarginPercent.toFixed(1)}%)
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Profit Scenarios</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {results.scenarios.map((scenario, index) => (
                        <div
                          key={index}
                          className={`flex justify-between p-3 rounded ${scenario.profit >= 0 ? 'bg-green-50' : 'bg-red-50'}`}
                        >
                          <span>
                            {scenario.units.toLocaleString()} units (£
                            {scenario.revenue.toLocaleString()})
                          </span>
                          <span
                            className={`font-semibold ${scenario.profit >= 0 ? 'text-green-800' : 'text-red-800'}`}
                          >
                            {scenario.profit >= 0 ? '+' : ''}£{scenario.profit.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="flex items-center justify-center h-[400px]">
                <div className="text-center text-gray-500">
                  <Calculator className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold">Ready for your break-even analysis?</h3>
                  <p>Enter your business costs and pricing to get started.</p>
                </div>
              </Card>
            )}
          </div>
        </div>

        <div className="bg-gray-50 py-12 non-printable mt-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <FAQSection faqs={breakEvenFAQs} />
          </div>
        </div>
      </div>
    </div>
  );
}
