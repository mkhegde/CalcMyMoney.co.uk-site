import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  PoundSterling,
  Plus,
  Trash2,
  TrendingUp,
  TrendingDown,
  Calculator,
  Home,
  Car,
  Banknote,
} from 'lucide-react';
import ExportActions from '../components/calculators/ExportActions';

const defaultAssets = [
  { name: 'Primary Property', amount: '', category: 'property' },
  { name: 'Savings Account', amount: '', category: 'cash' },
  { name: 'Investment Portfolio', amount: '', category: 'investments' },
  { name: 'Pension Fund', amount: '', category: 'pension' },
];

const defaultLiabilities = [
  { name: 'Mortgage', amount: '', category: 'property' },
  { name: 'Credit Cards', amount: '', category: 'debt' },
  { name: 'Personal Loan', amount: '', category: 'debt' },
];

export default function NetWorthCalculator() {
  const [assets, setAssets] = useState(defaultAssets);
  const [liabilities, setLiabilities] = useState(defaultLiabilities);
  const [results, setResults] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [csvData, setCsvData] = useState(null);

  const updateAsset = (index, field, value) => {
    const newAssets = [...assets];
    newAssets[index] = { ...newAssets[index], [field]: value };
    setAssets(newAssets);
  };

  const updateLiability = (index, field, value) => {
    const newLiabilities = [...liabilities];
    newLiabilities[index] = { ...newLiabilities[index], [field]: value };
    setLiabilities(newLiabilities);
  };

  const addAsset = () => {
    setAssets([...assets, { name: '', amount: '', category: 'other' }]);
  };

  const addLiability = () => {
    setLiabilities([...liabilities, { name: '', amount: '', category: 'debt' }]);
  };

  const removeAsset = (index) => {
    setAssets(assets.filter((_, i) => i !== index));
  };

  const removeLiability = (index) => {
    setLiabilities(liabilities.filter((_, i) => i !== index));
  };

  const handleCalculate = () => {
    const totalAssets = assets.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    const totalLiabilities = liabilities.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    const netWorth = totalAssets - totalLiabilities;

    // Categorize assets
    const assetCategories = {
      property: assets
        .filter((a) => a.category === 'property')
        .reduce((sum, a) => sum + (Number(a.amount) || 0), 0),
      cash: assets
        .filter((a) => a.category === 'cash')
        .reduce((sum, a) => sum + (Number(a.amount) || 0), 0),
      investments: assets
        .filter((a) => a.category === 'investments')
        .reduce((sum, a) => sum + (Number(a.amount) || 0), 0),
      pension: assets
        .filter((a) => a.category === 'pension')
        .reduce((sum, a) => sum + (Number(a.amount) || 0), 0),
      other: assets
        .filter((a) => a.category === 'other')
        .reduce((sum, a) => sum + (Number(a.amount) || 0), 0),
    };

    const newResults = {
      totalAssets,
      totalLiabilities,
      netWorth,
      assetCategories,
    };

    setResults(newResults);
    setHasCalculated(true);

    const csvExportData = [
      ['Type', 'Item', 'Amount'],
      ['', 'ASSETS', ''],
      ...assets
        .filter((asset) => Number(asset.amount) > 0)
        .map((asset) => [
          'Asset',
          asset.name || 'Unnamed Asset',
          `£${(Number(asset.amount) || 0).toFixed(2)}`,
        ]),
      ['', '', ''],
      ['', 'LIABILITIES', ''],
      ...liabilities
        .filter((liability) => Number(liability.amount) > 0)
        .map((liability) => [
          'Liability',
          liability.name || 'Unnamed Liability',
          `£${(Number(liability.amount) || 0).toFixed(2)}`,
        ]),
      ['', '', ''],
      ['Summary', 'Total Assets', `£${totalAssets.toFixed(2)}`],
      ['Summary', 'Total Liabilities', `£${totalLiabilities.toFixed(2)}`],
      ['Summary', 'Net Worth', `£${netWorth.toFixed(2)}`],
    ];
    setCsvData(csvExportData);
  };

  useEffect(() => {
    setHasCalculated(false);
    setResults(null);
  }, [assets, liabilities]);

  return (
    <div className="bg-white dark:bg-gray-900">
      {/* Page Header */}
      <div className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 non-printable">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Net Worth Calculator
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Your net worth is your financial scorecard. Calculate the difference between what you
              own and what you owe.
            </p>
          </div>
        </div>
      </div>

      {/* Main Calculator Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="print-title hidden">Net Worth Calculation Results</div>

        <div className="grid lg:grid-cols-3 gap-8 printable-grid-cols-1">
          {/* Input Sections */}
          <div className="lg:col-span-2 grid md:grid-cols-2 gap-8 non-printable">
            {/* Assets Section */}
            <div className="space-y-6">
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700">
                    <TrendingUp className="w-5 h-5" />
                    Assets (What You Own)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {assets.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Input
                          value={item.name}
                          onChange={(e) => updateAsset(index, 'name', e.target.value)}
                          className="flex-1"
                          placeholder="e.g. Primary Property"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeAsset(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="relative">
                        <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          type="number"
                          value={item.amount}
                          onChange={(e) => updateAsset(index, 'amount', e.target.value)}
                          className="pl-10"
                          placeholder="e.g. 250000"
                        />
                      </div>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={addAsset}
                    className="w-full flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Asset
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Liabilities Section */}
            <div className="space-y-6">
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-700">
                    <TrendingDown className="w-5 h-5" />
                    Liabilities (What You Owe)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {liabilities.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Input
                          value={item.name}
                          onChange={(e) => updateLiability(index, 'name', e.target.value)}
                          className="flex-1"
                          placeholder="e.g. Mortgage"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeLiability(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="relative">
                        <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          type="number"
                          value={item.amount}
                          onChange={(e) => updateLiability(index, 'amount', e.target.value)}
                          className="pl-10"
                          placeholder="e.g. 180000"
                        />
                      </div>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={addLiability}
                    className="w-full flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Liability
                  </Button>
                </CardContent>
              </Card>

              <div>
                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <CardContent className="p-6">
                    <Button onClick={handleCalculate} className="w-full text-lg">
                      <Calculator className="w-5 h-5 mr-2" />
                      Calculate Net Worth
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="space-y-6 printable-area">
            {hasCalculated && results ? (
              <>
                <div className="flex justify-between items-center non-printable">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                    Your Net Worth
                  </h2>
                  <ExportActions
                    csvData={csvData}
                    fileName="net-worth-calculation"
                    title="Net Worth Calculation"
                  />
                </div>

                {/* Net Worth Summary */}
                <Card
                  className={`${results.netWorth >= 0 ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700' : 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700'}`}
                >
                  <CardHeader>
                    <CardTitle className="text-center">Your Net Worth</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center p-6">
                      <p
                        className={`text-5xl font-bold ${results.netWorth >= 0 ? 'text-green-700' : 'text-red-700'}`}
                      >
                        {results.netWorth >= 0 ? '£' : '-£'}
                        {Math.abs(results.netWorth).toLocaleString()}
                      </p>
                      {results.netWorth < 0 && (
                        <p className="text-sm text-red-600 mt-2">
                          Negative net worth means you owe more than you own
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Assets vs Liabilities Comparison */}
                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle>Assets vs Liabilities</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
                      <span className="font-semibold text-green-800 dark:text-green-200">
                        Total Assets:
                      </span>
                      <span className="font-bold text-green-900 dark:text-green-100 text-xl">
                        £{results.totalAssets.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-red-50 dark:bg-red-900/30 rounded-lg">
                      <span className="font-semibold text-red-800 dark:text-red-200">
                        Total Liabilities:
                      </span>
                      <span className="font-bold text-red-900 dark:text-red-100 text-xl">
                        -£{results.totalLiabilities.toLocaleString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Detailed Assets Breakdown */}
                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-700">
                      <TrendingUp className="w-5 h-5" />
                      Assets Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {assets
                      .filter((asset) => Number(asset.amount) > 0)
                      .map((asset, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg"
                        >
                          <div className="flex items-center gap-2">
                            {asset.category === 'property' && (
                              <Home className="w-4 h-4 text-green-600" />
                            )}
                            {asset.category === 'cash' && (
                              <Banknote className="w-4 h-4 text-green-600" />
                            )}
                            {asset.category === 'investments' && (
                              <TrendingUp className="w-4 h-4 text-green-600" />
                            )}
                            {asset.category === 'pension' && (
                              <Calculator className="w-4 h-4 text-green-600" />
                            )}
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              {asset.name}
                            </span>
                          </div>
                          <span className="font-semibold text-green-700 dark:text-green-300">
                            £{(Number(asset.amount) || 0).toLocaleString()}
                          </span>
                        </div>
                      ))}
                  </CardContent>
                </Card>

                {/* Detailed Liabilities Breakdown */}
                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-700">
                      <TrendingDown className="w-5 h-5" />
                      Liabilities Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {liabilities
                      .filter((liability) => Number(liability.amount) > 0)
                      .map((liability, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg"
                        >
                          <div className="flex items-center gap-2">
                            {liability.category === 'property' && (
                              <Home className="w-4 h-4 text-red-600" />
                            )}
                            {liability.category === 'debt' && (
                              <TrendingDown className="w-4 h-4 text-red-600" />
                            )}
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              {liability.name}
                            </span>
                          </div>
                          <span className="font-semibold text-red-700 dark:text-red-300">
                            -£{(Number(liability.amount) || 0).toLocaleString()}
                          </span>
                        </div>
                      ))}
                  </CardContent>
                </Card>

                {/* Net Worth Insights */}
                <Card className="bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700">
                  <CardHeader>
                    <CardTitle>Net Worth Insights</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    {results.netWorth > 0 ? (
                      <div className="p-3 bg-green-100 dark:bg-green-900/40 rounded-lg">
                        <p className="text-green-800 dark:text-green-200">
                          <strong>Positive Net Worth:</strong> You own more than you owe. Great
                          foundation for building wealth!
                        </p>
                      </div>
                    ) : (
                      <div className="p-3 bg-orange-100 dark:bg-orange-900/40 rounded-lg">
                        <p className="text-orange-800 dark:text-orange-200">
                          <strong>Negative Net Worth:</strong> Focus on paying down debt and
                          building assets to improve your financial position.
                        </p>
                      </div>
                    )}

                    <div className="p-3 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                      <p className="text-blue-800 dark:text-blue-200">
                        <strong>Tip:</strong> Track your net worth quarterly to monitor your
                        financial progress over time.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="flex items-center justify-center h-[400px] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <div className="text-center text-gray-500 dark:text-gray-400">
                  <Calculator className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold">Ready to calculate your net worth?</h3>
                  <p>Add your assets and liabilities, then click "Calculate Net Worth".</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
