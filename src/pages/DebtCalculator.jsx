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
import {
  PoundSterling,
  Plus,
  Trash2,
  CreditCard,
  Calendar,
  TrendingDown,
  AlertCircle,
  Zap,
  Target,
  Calculator,
} from 'lucide-react';
import ExportActions from '../components/calculators/ExportActions';
import FAQSection from '../components/calculators/FAQSection';
import RelatedCalculators from '../components/calculators/RelatedCalculators'; import Heading from '@/components/common/Heading';
// NEW IMPORT

const debtCalculatorFAQs = [
  {
    question: "What's the difference between debt avalanche and debt snowball?",
    answer:
      'Debt avalanche focuses on paying off the highest interest rate debts first, saving you the most money overall. Debt snowball targets the smallest balances first, providing quicker psychological wins to build momentum.',
  },
  {
    question: 'Should I pay off debt or build savings first?',
    answer:
      'Generally, pay off high-interest debt (above 6-8%) before building large savings. However, maintain a small emergency fund (£1,000) first, then focus on debt, then build a full 3-6 month emergency fund.',
  },
  {
    question: 'How can I find extra money to pay off debt faster?',
    answer:
      'Review your budget for unnecessary expenses, consider a side hustle, sell unused items, negotiate lower bills, use windfalls (tax refunds, bonuses), or temporarily reduce retirement contributions to focus on high-interest debt.',
  },
  {
    question: 'Should I consolidate my debts?',
    answer:
      "Debt consolidation can help if you qualify for a lower interest rate than your current average. Consider personal loans, balance transfer cards, or remortgaging. However, ensure you don't just extend the repayment period without saving on interest.",
  },
  {
    question: 'Will paying off debt early hurt my credit score?',
    answer:
      'No, paying off debt early generally improves your credit score by reducing your credit utilization ratio. The only minor impact might be from closing very old credit accounts, but the benefits of being debt-free outweigh this.',
  },
  {
    question: "What if I can't afford my minimum payments?",
    answer:
      'Contact your creditors immediately to discuss hardship options like payment holidays, reduced payments, or interest freezes. Consider free debt advice from charities like StepChange, Citizens Advice, or National Debtline.',
  },
];

export default function DebtCalculator() {
  const [debts, setDebts] = useState([]); // Initial state is empty
  const [strategy, setStrategy] = useState('avalanche');
  const [extraPayment, setExtraPayment] = useState(''); // Initial state is empty string
  const [results, setResults] = useState(null); // Initial state is null
  const [csvData, setCsvData] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false); // New state variable

  // Helper function to create page URLs based on component name
  const createPageUrl = (componentName) => {
    // This function assumes a specific URL structure, e.g., /calculators/budget-calculator
    // You might need to adjust this based on your actual routing implementation.
    const slug = componentName.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
    return `/calculators/${slug}`;
  };

  const addDebt = () => {
    setDebts([
      ...debts,
      {
        name: '', // Changed to empty string
        balance: '', // Changed to empty string
        apr: '', // Changed to empty string
        minimumPayment: '', // Changed to empty string
        type: 'credit_card',
      },
    ]);
  };

  const updateDebt = (index, field, value) => {
    const newDebts = [...debts];
    newDebts[index] = { ...newDebts[index], [field]: value };
    setDebts(newDebts);
  };

  const removeDebt = (index) => {
    setDebts(debts.filter((_, i) => i !== index));
  };

  const handleCalculate = () => {
    // Convert string inputs to numbers, defaulting to 0 for empty/invalid
    const currentDebts = debts
      .map((d) => ({
        ...d,
        balance: Number(d.balance) || 0,
        apr: Number(d.apr) || 0,
        minimumPayment: Number(d.minimumPayment) || 0,
      }))
      .filter((d) => d.balance > 0); // Filter out debts with 0 balance for calculation

    const currentExtraPayment = Number(extraPayment) || 0;

    // Only proceed if there are debts to calculate
    if (currentDebts.length === 0) {
      setResults(null);
      setHasCalculated(false);
      setCsvData(null);
      return;
    }

    const newResults = calculatePayoffSchedule(currentDebts, strategy, currentExtraPayment);
    const finalInterestSavings = calculateInterestSavings(currentDebts, newResults); // Pass original debts for min payment scenario
    const finalResults = { ...newResults, interestSavings: finalInterestSavings };
    setResults(finalResults);
    setHasCalculated(true);

    if (finalResults && finalResults.totalBalance !== undefined) {
      const csvExportData = [
        ['Metric', 'Value', 'Unit'],
        [
          'Payoff Time',
          `${Math.floor(finalResults.totalMonths / 12)}y ${finalResults.totalMonths % 12}m`,
          '',
        ],
        ['Total Interest Paid', finalResults.totalInterestPaid.toFixed(2), 'GBP'],
        ['Interest Saved', finalInterestSavings.toFixed(2), 'GBP'],
        ['Total Debt', finalResults.totalBalance.toFixed(2), 'GBP'],
        ['Total Monthly Payment', finalResults.totalPayment.toFixed(2), 'GBP'],
        ['Strategy', strategy, ''],
        ['Extra Monthly Payment', currentExtraPayment.toFixed(2), 'GBP'],
        ['', '', ''],
        ['Payoff Schedule', 'Payoff Month', 'Payoff Date (Years from now)', 'Original Balance'],
        ...(finalResults.payoffOrder || []).map((debt) => [
          debt.name,
          debt.month,
          `${Math.floor(debt.month / 12)}y ${debt.month % 12}m`,
          debt.originalBalance.toFixed(2),
        ]),
      ];
      setCsvData(csvExportData);
    }
  };

  // Modified to be a pure function, taking arguments instead of relying on state
  const calculatePayoffSchedule = (debtsToCalculate, strategyToUse, extraPaymentAmount) => {
    if (debtsToCalculate.length === 0) {
      return {
        totalMonths: 0,
        totalInterestPaid: 0,
        totalBalance: 0,
        totalPayment: 0,
        payoffOrder: [],
        interestSavings: 0,
      };
    }

    let debtsCopy = debtsToCalculate.map((debt) => ({ ...debt }));
    const initialTotalBalance = debtsCopy.reduce((sum, debt) => sum + debt.balance, 0);
    const initialTotalMinimum = debtsCopy.reduce((sum, debt) => sum + debt.minimumPayment, 0);
    const totalMonthlyPaymentInitial = initialTotalMinimum + extraPaymentAmount;

    // Sort debts based on strategy initially for consistent workingDebts creation order
    if (strategyToUse === 'avalanche') {
      debtsCopy.sort((a, b) => b.apr - a.apr);
    } else {
      // snowball
      debtsCopy.sort((a, b) => a.balance - b.balance);
    }

    let month = 0;
    let totalInterestPaid = 0;
    let payoffOrder = [];
    let remainingExtraPaymentFunds = extraPaymentAmount; // This is the amount that 'snowballs'

    // Create a working copy of debts with unique IDs and original balances
    const workingDebts = debtsCopy.map((debt, idx) => ({
      ...debt,
      id: idx,
      originalBalance: debt.balance,
    }));
    const paidOffDebtIds = new Set();

    while (workingDebts.some((debt) => debt.balance > 0) && month < 600) {
      // Max 50 years to prevent infinite loops
      month++;

      // 1. Apply interest and minimum payments
      workingDebts.forEach((debt) => {
        if (debt.balance > 0) {
          const monthlyInterest = (debt.balance * debt.apr) / (100 * 12);
          totalInterestPaid += monthlyInterest;
          debt.balance += monthlyInterest;

          // Apply minimum payment for current month
          const payment = Math.min(debt.minimumPayment, debt.balance);
          debt.balance -= payment;
        }
      });

      // 2. Sort debts again based on strategy to target the `remainingExtraPaymentFunds`
      const currentSortedDebts = [...workingDebts].filter(
        (debt) => debt.balance > 0 && !paidOffDebtIds.has(debt.id)
      );

      if (strategyToUse === 'avalanche') {
        currentSortedDebts.sort((a, b) => b.apr - a.apr);
      } else {
        // snowball
        currentSortedDebts.sort((a, b) => a.balance - b.balance);
      }

      // 3. Distribute the `remainingExtraPaymentFunds`
      for (const debt of currentSortedDebts) {
        if (remainingExtraPaymentFunds <= 0) break; // No more extra funds to distribute

        const amountToPay = Math.min(remainingExtraPaymentFunds, debt.balance);
        debt.balance -= amountToPay;
        remainingExtraPaymentFunds -= amountToPay;
      }

      // 4. Check for newly paid-off debts and reallocate their minimum payments
      workingDebts.forEach((debt) => {
        if (debt.balance <= 0 && !paidOffDebtIds.has(debt.id)) {
          payoffOrder.push({
            name: debt.name,
            month: month,
            originalBalance: debt.originalBalance,
          });
          paidOffDebtIds.add(debt.id);
          // Add this debt's minimum payment to the pool for the next month's extra payment
          remainingExtraPaymentFunds += debt.minimumPayment;
        }
      });

      // If no debts left, break early
      if (workingDebts.every((debt) => debt.balance <= 0)) {
        break;
      }
    }

    return {
      totalMonths: month,
      totalInterestPaid,
      totalBalance: initialTotalBalance, // Total initial debt
      totalPayment: totalMonthlyPaymentInitial, // Total initial monthly payment (min + extra)
      payoffOrder: payoffOrder,
      interestSavings: 0, // Will be calculated by calculateInterestSavings
    };
  };

  // Modified to be a pure function, taking arguments
  const calculateInterestSavings = (debtsForMinPayment, currentResults) => {
    if (!currentResults || !currentResults.totalInterestPaid || debtsForMinPayment.length === 0)
      return 0;

    // Calculate minimum payment scenario
    let minPaymentInterest = 0;
    let debtsCopyMin = debtsForMinPayment.map((debt) => ({ ...debt })); // Use provided debts
    let monthMin = 0;

    while (debtsCopyMin.some((debt) => debt.balance > 0) && monthMin < 600) {
      monthMin++;
      debtsCopyMin.forEach((debt) => {
        if (debt.balance > 0) {
          const monthlyInterest = (debt.balance * debt.apr) / (100 * 12);
          minPaymentInterest += monthlyInterest;
          debt.balance += monthlyInterest;

          // Ensure payment doesn't exceed remaining balance
          const payment = Math.min(debt.minimumPayment, debt.balance);
          debt.balance -= payment;
        }
      });
    }

    return Math.max(0, minPaymentInterest - currentResults.totalInterestPaid);
  };

  // Modified useEffect to reset results when inputs change
  useEffect(() => {
    setHasCalculated(false);
    setResults(null);
    setCsvData(null);
  }, [debts, strategy, extraPayment]);

  return (
    <div className="bg-white dark:bg-gray-900">
      {/* Page Header */}
      <div className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 non-printable">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <Heading as="h1" size="h1" weight="bold" className="text-gray-900">
              UK Debt Repayment Calculator
            </Heading>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              The best way out is always through. Create a clear debt-free plan and see how much
              interest you can save with a focused strategy.
            </p>
          </div>
        </div>
      </div>

      {/* Main Calculator Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="print-title hidden">Debt Repayment Plan</div>

        <div className="grid lg:grid-cols-3 gap-8 printable-grid-cols-1">
          {/* Input Panel */}
          <div className="lg:col-span-1 space-y-6 non-printable">
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Your Debts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {debts.map((debt, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <Input
                        value={debt.name}
                        onChange={(e) => updateDebt(index, 'name', e.target.value)}
                        placeholder="e.g. Credit Card"
                        className="flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeDebt(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">Balance</Label>
                        <div className="relative">
                          <PoundSterling className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
                          <Input
                            type="number"
                            value={debt.balance}
                            onChange={(e) => updateDebt(index, 'balance', e.target.value)}
                            className="pl-7 text-sm"
                            placeholder="e.g. 5000"
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs">APR (%)</Label>
                        <Input
                          type="number"
                          value={debt.apr}
                          onChange={(e) => updateDebt(index, 'apr', e.target.value)}
                          step="0.1"
                          className="text-sm"
                          placeholder="e.g. 18.9"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs">Minimum Payment</Label>
                      <div className="relative">
                        <PoundSterling className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
                        <Input
                          type="number"
                          value={debt.minimumPayment}
                          onChange={(e) => updateDebt(index, 'minimumPayment', e.target.value)}
                          className="pl-7 text-sm"
                          placeholder="e.g. 125"
                        />
                      </div>
                    </div>

                    <Select
                      value={debt.type}
                      onValueChange={(value) => updateDebt(index, 'type', value)}
                    >
                      <SelectTrigger className="text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="credit_card">Credit Card</SelectItem>
                        <SelectItem value="personal_loan">Personal Loan</SelectItem>
                        <SelectItem value="car_loan">Car Loan</SelectItem>
                        <SelectItem value="student_loan">Student Loan</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ))}

                <Button
                  variant="outline"
                  onClick={addDebt}
                  className="w-full flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Debt
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle>Repayment Strategy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Strategy</Label>
                  <Select value={strategy} onValueChange={setStrategy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="avalanche">
                        Debt Avalanche (Highest Interest First)
                      </SelectItem>
                      <SelectItem value="snowball">
                        Debt Snowball (Smallest Balance First)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Extra Monthly Payment</Label>
                  <div className="relative">
                    <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="number"
                      value={extraPayment}
                      onChange={(e) => setExtraPayment(e.target.value)}
                      className="pl-10"
                      placeholder="e.g. 200"
                    />
                  </div>
                </div>

                <Button onClick={handleCalculate} className="w-full text-lg">
                  <Calculator className="w-5 h-5 mr-2" />
                  Calculate Plan
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2 space-y-6 printable-area">
            {hasCalculated && results ? (
              <>
                <div className="flex justify-between items-center non-printable">
                  <Heading as="h2" size="h2" weight="bold" className="text-gray-800 dark:text-gray-100">
                    Your Repayment Plan
                  </Heading>
                  <ExportActions
                    csvData={csvData}
                    fileName="debt-repayment-plan"
                    title="Debt Repayment Plan"
                  />
                </div>
                {/* Summary Cards */}
                <div className="grid md:grid-cols-3 gap-4">
                  <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50 border-blue-200 dark:border-blue-700">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                            Payoff Time
                          </p>
                          <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                            {Math.floor(results.totalMonths / 12)}y {results.totalMonths % 12}m
                          </p>
                        </div>
                        <Calendar className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/50 dark:to-red-800/50 border-red-200 dark:border-red-700">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-red-800 dark:text-red-200">
                            Total Interest
                          </p>
                          <p className="text-2xl font-bold text-red-900 dark:text-red-100">
                            £
                            {results.totalInterestPaid?.toLocaleString('en-GB', {
                              maximumFractionDigits: 0,
                            })}
                          </p>
                        </div>
                        <TrendingDown className="w-8 h-8 text-red-600 dark:text-red-400" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/50 dark:to-green-800/50 border-green-200 dark:border-green-700">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-green-800 dark:text-green-200">
                            Interest Saved
                          </p>
                          <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                            £
                            {results.interestSavings?.toLocaleString('en-GB', {
                              maximumFractionDigits: 0,
                            })}
                          </p>
                        </div>
                        <PoundSterling className="w-8 h-8 text-green-600 dark:text-green-400" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Debt Overview */}
                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle>Current Debt Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {debts.map((debt, index) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold">{debt.name || 'Unnamed Debt'}</h4>
                            <span className="text-lg font-bold">
                              £{(Number(debt.balance) || 0).toLocaleString()}
                            </span>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <div>
                              <span>APR: </span>
                              <span className="font-medium">{Number(debt.apr) || 0}%</span>
                            </div>
                            <div>
                              <span>Min Payment: </span>
                              <span className="font-medium">
                                £{Number(debt.minimumPayment) || 0}
                              </span>
                            </div>
                            <div>
                              <span>Type: </span>
                              <span className="font-medium capitalize">
                                {debt.type.replace('_', ' ')}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}

                      <div className="border-t pt-4">
                        <div className="flex justify-between items-center text-lg font-semibold">
                          <span>Total Debt:</span>
                          <span className="text-red-600">
                            £{results.totalBalance?.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400 mt-1">
                          <span>Total Monthly Payment:</span>
                          <span>£{results.totalPayment?.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Payoff Order */}
                {results.payoffOrder && results.payoffOrder.length > 0 && (
                  <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <CardHeader>
                      <CardTitle>
                        Payoff Schedule (
                        {strategy === 'avalanche' ? 'Debt Avalanche' : 'Debt Snowball'})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {results.payoffOrder.map((debt, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                          >
                            <div>
                              <span className="font-medium">{debt.name || 'Unnamed Debt'}</span>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Original balance: £{debt.originalBalance?.toLocaleString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold">Month {debt.month}</div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                {Math.floor(debt.month / 12)}y {debt.month % 12}m
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Strategy Comparison */}
                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle>Strategy Benefits</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                          Debt Avalanche
                        </h4>
                        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                          <li>• Saves the most money in interest</li>
                          <li>• Mathematically optimal</li>
                          <li>• Focus on highest interest rates</li>
                          <li>• May take longer to see progress</li>
                        </ul>
                      </div>
                      <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
                        <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                          Debt Snowball
                        </h4>
                        <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
                          <li>• Quick psychological wins</li>
                          <li>• Builds momentum</li>
                          <li>• Focus on smallest balances</li>
                          <li>• May cost slightly more in interest</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Tips */}
                <Card className="bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-700">
                  <CardHeader>
                    <CardTitle className="text-yellow-800 dark:text-yellow-200">
                      Debt Repayment Tips
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-yellow-800 dark:text-yellow-200">
                    <ul className="space-y-2">
                      <li>
                        💰 <strong>Find extra money:</strong> Review your budget for areas to cut
                        spending
                      </li>
                      <li>
                        📞 <strong>Call creditors:</strong> Ask about hardship programs or lower
                        interest rates
                      </li>
                      <li>
                        💳 <strong>Stop using credit:</strong> Avoid adding to your debt while
                        paying it off
                      </li>
                      <li>
                        🎯 <strong>Stay motivated:</strong> Celebrate milestones and track your
                        progress
                      </li>
                      <li>
                        ⚖️ <strong>Consider consolidation:</strong> Lower interest loans might help
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="lg:col-span-2 flex items-center justify-center h-[400px] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <div className="text-center text-gray-500 dark:text-gray-400">
                  <Calculator className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold">Ready to see your plan?</h3>
                  <p>Add your debts and click "Calculate Plan" to become debt-free.</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gray-50 dark:bg-gray-800/50 py-12 non-printable">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FAQSection faqs={debtCalculatorFAQs} />
        </div>
      </div>

      {/* NEW: Related calculators block for contextual interlinking */}
      <RelatedCalculators
        calculators={[
          {
            name: 'Budget Planner',
            url: createPageUrl('BudgetCalculator'),
            description: 'Find money for debt payoff by optimising your monthly budget.',
          },
          {
            name: 'Credit Card Repayment Calculator',
            url: createPageUrl('CreditCardRepaymentCalculator'),
            description: 'See how long it takes to clear your credit card.',
          },
          {
            name: 'Loan Repayment Calculator',
            url: createPageUrl('LoanRepaymentCalculator'),
            description: 'Estimate payments for personal or car loans.',
          },
        ]}
      />
    </div>
  );
}
