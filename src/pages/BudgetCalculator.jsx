import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  PoundSterling,
  Plus,
  Trash2,
  PieChart,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Target,
  Calculator,
} from 'lucide-react';
import ExportActions from '../components/calculators/ExportActions';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils'; import Heading from '@/components/common/Heading';
// Imported createPageUrl from utils

// Define placeholder data for government budget
const governmentBudget2025 = {
  // Using a realistic estimated value for UK government total revenue, in millions of GBP.
  // ~£1.1 trillion is 1,100,000 million.
  // The display text "£{(governmentBudget2025.totalRevenue / 1000).toFixed(0)}bn" means this value
  // should be in millions, so when divided by 1000, it becomes billions.
  totalRevenue: 1100000,
};

const defaultIncomeCategories = [
  { name: 'Primary Salary', amount: '' },
  { name: 'Secondary Income', amount: '' },
];

const defaultExpenseCategories = [
  { name: 'Housing (Rent/Mortgage)', amount: '', essential: true },
  { name: 'Utilities', amount: '', essential: true },
  { name: 'Groceries', amount: '', essential: true },
  { name: 'Transport', amount: '', essential: true },
  { name: 'Dining Out', amount: '', essential: false },
  { name: 'Entertainment', amount: '', essential: false },
];

export default function BudgetCalculator() {
  const [incomeItems, setIncomeItems] = useState(defaultIncomeCategories);
  const [expenseItems, setExpenseItems] = useState(defaultExpenseCategories);
  const [savingsGoal, setSavingsGoal] = useState('');
  const [csvData, setCsvData] = useState(null);
  const [results, setResults] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);

  const updateIncomeItem = (index, field, value) => {
    const newItems = [...incomeItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setIncomeItems(newItems);
  };

  const updateExpenseItem = (index, field, value) => {
    const newItems = [...expenseItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setExpenseItems(newItems);
  };

  const addIncomeItem = () => {
    setIncomeItems([...incomeItems, { name: '', amount: '' }]);
  };

  const addExpenseItem = () => {
    setExpenseItems([...expenseItems, { name: '', amount: '', essential: false }]);
  };

  const removeIncomeItem = (index) => {
    setIncomeItems(incomeItems.filter((_, i) => i !== index));
  };

  const removeExpenseItem = (index) => {
    setExpenseItems(expenseItems.filter((_, i) => i !== index));
  };

  const handleCalculate = () => {
    const totalIncome = incomeItems.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    const totalExpenses = expenseItems.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    const essentialExpenses = expenseItems
      .filter((item) => item.essential)
      .reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    const nonEssentialExpenses = expenseItems
      .filter((item) => !item.essential)
      .reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    const remaining = totalIncome - totalExpenses;
    const currentSavingsGoal = Number(savingsGoal) || 0;
    const savingsShortfall = currentSavingsGoal - Math.max(0, remaining);

    const newResults = {
      totalIncome,
      totalExpenses,
      essentialExpenses,
      nonEssentialExpenses,
      remaining,
      savingsGoal: currentSavingsGoal,
      savingsShortfall,
    };
    setResults(newResults);
    setHasCalculated(true);

    const csvExportData = [
      ['Type', 'Category', 'Amount'],
      ...incomeItems.map((item) => [
        'Income',
        item.name,
        `£${(Number(item.amount) || 0).toFixed(2)}`,
      ]),
      ['', '', ''],
      ...expenseItems.map((item) => [
        'Expense',
        item.name,
        `£${(Number(item.amount) || 0).toFixed(2)}`,
      ]),
      ['', '', ''],
      ['Summary', 'Total Income', `£${totalIncome.toFixed(2)}`],
      ['Summary', 'Total Expenses', `£${totalExpenses.toFixed(2)}`],
      ['Summary', 'Remaining', `£${remaining.toFixed(2)}`],
      ['Summary', 'Savings Goal', `£${currentSavingsGoal.toFixed(2)}`],
      [
        'Summary',
        'Savings Shortfall',
        savingsShortfall > 0 ? `£${savingsShortfall.toFixed(2)}` : '£0.00',
      ],
    ];
    setCsvData(csvExportData);
  };

  return (
    <div className="bg-white dark:bg-gray-900">
      {/* Page Header */}
      <div className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 non-printable">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <Heading as="h1" size="h1" weight="bold" className="text-gray-900 dark:text-gray-100 mb-4">
              UK Budget Planner
            </Heading>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              A good budget is the foundation of financial freedom. Tell your money where to go,
              instead of wondering where it went.
            </p>
          </div>
        </div>
      </div>

      {/* Main Calculator Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="print-title hidden">Monthly Budget Results</div>

        <div className="grid lg:grid-cols-3 gap-8 printable-grid-cols-1">
          {/* Input Sections */}
          <div className="lg:col-span-2 grid md:grid-cols-2 gap-8 non-printable">
            {/* Income Section */}
            <div className="space-y-6">
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700">
                    <TrendingUp className="w-5 h-5" />
                    Monthly Income
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {incomeItems.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Input
                          value={item.name}
                          onChange={(e) => updateIncomeItem(index, 'name', e.target.value)}
                          className="flex-1"
                          placeholder="e.g. Primary Salary"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeIncomeItem(index)}
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
                          onChange={(e) => updateIncomeItem(index, 'amount', e.target.value)}
                          className="pl-10"
                          placeholder="e.g. 3000"
                        />
                      </div>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={addIncomeItem}
                    className="w-full flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Income Source
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Expenses Section */}
            <div className="space-y-6">
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-700">
                    <TrendingDown className="w-5 h-5" />
                    Monthly Expenses
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {expenseItems.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Input
                          value={item.name}
                          onChange={(e) => updateExpenseItem(index, 'name', e.target.value)}
                          className="flex-1"
                          placeholder="e.g. Rent"
                        />
                        <div className="flex items-center gap-1">
                          <input
                            type="checkbox"
                            checked={item.essential}
                            onChange={(e) =>
                              updateExpenseItem(index, 'essential', e.target.checked)
                            }
                            className="w-4 h-4"
                          />
                          <span className="text-xs text-gray-500">Essential</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeExpenseItem(index)}
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
                          onChange={(e) => updateExpenseItem(index, 'amount', e.target.value)}
                          className={`pl-10 ${item.essential ? 'border-orange-200 bg-orange-50' : ''}`}
                          placeholder="e.g. 1200"
                        />
                      </div>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={addExpenseItem}
                    className="w-full flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Expense
                  </Button>
                </CardContent>
              </Card>
            </div>
            <div className="md:col-span-2">
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <Label>Monthly Savings Target</Label>
                    <div className="relative">
                      <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        type="number"
                        value={savingsGoal}
                        onChange={(e) => setSavingsGoal(e.target.value)}
                        className="pl-10"
                        placeholder="e.g. 500"
                      />
                    </div>
                  </div>
                  <Button onClick={handleCalculate} className="w-full text-lg">
                    <Calculator className="w-5 h-5 mr-2" />
                    Calculate Budget
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Results Panel */}
          <div className="space-y-6 printable-area">
            {hasCalculated && results ? (
              <>
                <div className="non-printable">
                  <Heading as="h2" size="h2" weight="bold" className="text-gray-800 dark:text-gray-200">
                    Your Budget Summary
                  </Heading>
                </div>

                {/* NEW: Government Budget Inspiration Section */}
                <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 border-blue-200 dark:border-blue-800 non-printable">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-2">
                      💡 Budgeting Like the Government
                    </h3>
                    <p className="text-blue-800 dark:text-blue-200 mb-4">
                      Just as the UK government carefully plans its £
                      {(governmentBudget2025.totalRevenue / 1000).toLocaleString(undefined, {
                        maximumFractionDigits: 0,
                      })}
                      bn budget, you should manage your personal finances with the same discipline.
                    </p>
                    <Link to={createPageUrl('UKGovernmentBudget')}>
                      <Button
                        variant="outline"
                        className="border-blue-300 text-blue-700 hover:bg-blue-100 dark:border-blue-600 dark:text-blue-300 dark:hover:bg-blue-900/50"
                      >
                        See How the Government Budgets →
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                {/* Budget Summary */}
                <Card
                  className={`${results.remaining >= 0 ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700' : 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700'}`}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="w-5 h-5" />
                      Budget Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Total Income:</span>
                        <span className="font-semibold text-green-600">
                          £{results.totalIncome.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Expenses:</span>
                        <span className="font-semibold text-red-600">
                          -£{results.totalExpenses.toLocaleString()}
                        </span>
                      </div>
                      <div
                        className={`flex justify-between text-lg font-bold pt-2 border-t ${results.remaining >= 0 ? 'text-green-700' : 'text-red-700'}`}
                      >
                        <span>Remaining:</span>
                        <span>
                          {results.remaining >= 0 ? '£' : '-£'}
                          {Math.abs(results.remaining).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {results.remaining < 0 && (
                      <div className="p-3 bg-red-100 rounded-lg">
                        <p className="text-sm text-red-800">
                          ⚠️ You're overspending by £{Math.abs(results.remaining).toLocaleString()}{' '}
                          per month
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Detailed Income Breakdown */}
                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-700">
                      <TrendingUp className="w-5 h-5" />
                      Income Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {incomeItems
                      .filter((item) => Number(item.amount) > 0)
                      .map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{item.name || 'Unnamed Income'}</span>
                          <span className="font-medium text-green-600">
                            £{(Number(item.amount) || 0).toLocaleString()}
                          </span>
                        </div>
                      ))}
                  </CardContent>
                </Card>

                {/* Detailed Expense Breakdown */}
                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-700">
                      <TrendingDown className="w-5 h-5" />
                      Expense Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {expenseItems
                      .filter((item) => Number(item.amount) > 0)
                      .map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>
                            {item.name || 'Unnamed Expense'}{' '}
                            {item.essential && (
                              <span className="text-xs text-orange-500">(Essential)</span>
                            )}
                          </span>
                          <span className="font-medium text-red-600">
                            -£{(Number(item.amount) || 0).toLocaleString()}
                          </span>
                        </div>
                      ))}
                  </CardContent>
                </Card>

                {/* Savings Goals */}
                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle>Savings Goal</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Savings Goal:</span>
                        <span>£{results.savingsGoal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Available to Save:</span>
                        <span
                          className={results.remaining >= 0 ? 'text-green-600' : 'text-red-600'}
                        >
                          £{Math.max(0, results.remaining).toLocaleString()}
                        </span>
                      </div>
                      {results.savingsShortfall > 0 ? (
                        <div className="p-3 bg-yellow-100 rounded-lg">
                          <p className="text-sm text-yellow-800">
                            💡 You need to save £{results.savingsShortfall.toLocaleString()} more to
                            reach your goal
                          </p>
                        </div>
                      ) : (
                        <div className="p-3 bg-green-100 rounded-lg">
                          <p className="text-sm text-green-800">
                            ✅ You can meet your savings goal with £
                            {(results.remaining - results.savingsGoal).toLocaleString()} left over!
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Budget Tips */}
                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle>Budget Insights</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-blue-800">
                        <strong>50/30/20 Rule:</strong> Aim for 50% needs, 30% wants, 20% savings
                      </p>
                      <div className="mt-2 space-y-1 text-xs">
                        <div>
                          Needs: £{(results.totalIncome * 0.5).toLocaleString()} (Currently: £
                          {results.essentialExpenses.toLocaleString()})
                        </div>
                        <div>
                          Wants: £{(results.totalIncome * 0.3).toLocaleString()} (Currently: £
                          {results.nonEssentialExpenses.toLocaleString()})
                        </div>
                        <div>
                          Savings: £{(results.totalIncome * 0.2).toLocaleString()} (Goal: £
                          {results.savingsGoal.toLocaleString()})
                        </div>
                      </div>
                    </div>

                    {results.nonEssentialExpenses > results.essentialExpenses && (
                      <div className="p-3 bg-orange-50 rounded-lg">
                        <p className="text-orange-800">
                          💰 Your non-essential spending exceeds essential costs. Consider reviewing
                          discretionary expenses.
                        </p>
                      </div>
                    )}

                    {results.essentialExpenses > results.totalIncome * 0.6 && (
                      <div className="p-3 bg-red-50 rounded-lg">
                        <p className="text-red-800">
                          🏠 Essential expenses are high. Consider ways to reduce housing,
                          transport, or utility costs.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <div className="non-printable pt-6">
                  <ExportActions
                    csvData={csvData}
                    fileName="budget-summary"
                    title="Budget Summary"
                  />
                </div>
              </>
            ) : (
              <Card className="flex items-center justify-center h-[400px] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <div className="text-center text-gray-500 dark:text-gray-400">
                  <Calculator className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold">Ready to see your budget?</h3>
                  <p>Fill in your income and expenses, then click "Calculate Budget".</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
