import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
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
import { PoundSterling, Calculator, Target, TrendingUp, Flame } from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import ExportActions from '../components/calculators/ExportActions';
import FAQSection from '../components/calculators/FAQSection';

const fireCalculatorFAQs = [
  {
    question: 'What does FIRE mean?',
    answer:
      "FIRE stands for Financial Independence, Retire Early. It's a movement focused on extreme saving and investment to enable retirement much earlier than traditional retirement age.",
  },
  {
    question: 'How is the FIRE number calculated?',
    answer:
      'The FIRE number is typically calculated as 25 times your annual expenses, based on the 4% withdrawal rule. This means you can safely withdraw 4% of your portfolio each year in retirement.',
  },
  {
    question: "What's the difference between Lean, Regular, and Fat FIRE?",
    answer:
      'Lean FIRE (~£25k-40k annually), Regular FIRE (~£40k-80k annually), and Fat FIRE (£80k+ annually) represent different lifestyle levels in early retirement, requiring different savings targets.',
  },
  {
    question: 'Is the 4% rule safe for early retirement?',
    answer:
      'The 4% rule is based on historical market performance and assumes a 30-year retirement. For very early retirement (40+ years), some prefer a 3.5% or 3.25% withdrawal rate for extra safety.',
  },
  {
    question: 'How realistic is FIRE in the UK?',
    answer:
      'FIRE is achievable in the UK with high savings rates (50%+ of income), smart investing in ISAs and pensions, and careful expense management. Property costs can make it more challenging in expensive areas.',
  },
  {
    question: 'Should I include my pension in FIRE calculations?',
    answer:
      'Yes, but remember UK pensions have access restrictions. Private pensions can typically be accessed from age 55 (rising to 57 in 2028), while the state pension starts much later.',
  },
];

const CHART_COLORS = {
  currentSavings: '#10b981',
  futureContributions: '#3b82f6',
  investmentGrowth: '#f59e0b',
};

export default function FIRECalculator() {
  const [currentAge, setCurrentAge] = useState('');
  const [currentNetWorth, setCurrentNetWorth] = useState('');
  const [annualExpenses, setAnnualExpenses] = useState('');
  const [monthlySavings, setMonthlySavings] = useState('');
  const [expectedReturn, setExpectedReturn] = useState('7');
  const [withdrawalRate, setWithdrawalRate] = useState('4');
  const [targetAge, setTargetAge] = useState('');

  const [results, setResults] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [csvData, setCsvData] = useState(null);

  const handleCalculate = () => {
    const age = Number(currentAge) || 0;
    const netWorth = Number(currentNetWorth) || 0;
    const expenses = Number(annualExpenses) || 0;
    const savings = Number(monthlySavings) || 0;
    const returnRate = Number(expectedReturn) / 100 || 0.07;
    const withdrawal = Number(withdrawalRate) / 100 || 0.04;
    const target = Number(targetAge) || 0;

    if (expenses <= 0) {
      setResults(null);
      setHasCalculated(true);
      return;
    }

    // Calculate FIRE numbers
    const fireNumber = expenses / withdrawal;
    const leanFireNumber = 35000 / withdrawal; // £35k lean lifestyle
    const fatFireNumber = 80000 / withdrawal; // £80k fat lifestyle

    // Calculate years to FIRE
    const annualSavings = savings * 12;
    let yearsToFire = 0;
    let balance = netWorth;

    if (annualSavings > 0) {
      // Use future value of annuity formula to find time to reach FIRE number
      const monthlyReturn = returnRate / 12;
      const monthlyGoal = fireNumber - netWorth * Math.pow(1 + returnRate, 50); // Assume max 50 years

      if (monthlyReturn > 0) {
        const months =
          Math.log(
            1 + ((fireNumber - netWorth * Math.pow(1 + returnRate, 50)) * monthlyReturn) / savings
          ) / Math.log(1 + monthlyReturn);
        yearsToFire = Math.max(0, months / 12);

        // More precise calculation
        balance = netWorth;
        yearsToFire = 0;
        while (balance < fireNumber && yearsToFire < 50) {
          balance = balance * (1 + returnRate) + annualSavings;
          yearsToFire++;
        }
      } else {
        yearsToFire = Math.max(0, (fireNumber - netWorth) / annualSavings);
      }
    }

    // Calculate final portfolio composition
    const futureValueCurrentSavings = netWorth * Math.pow(1 + returnRate, yearsToFire);
    const futureValueContributions =
      annualSavings > 0
        ? annualSavings * ((Math.pow(1 + returnRate, yearsToFire) - 1) / returnRate)
        : 0;
    const totalPortfolio = futureValueCurrentSavings + futureValueContributions;
    const totalInvestmentGrowth = totalPortfolio - netWorth - annualSavings * yearsToFire;

    // Target age scenarios
    let targetScenario = null;
    if (target > age) {
      const yearsToTarget = target - age;
      const neededAtTarget = fireNumber - netWorth * Math.pow(1 + returnRate, yearsToTarget);
      const monthlyNeededForTarget =
        neededAtTarget > 0
          ? (neededAtTarget * (returnRate / 12)) /
            (Math.pow(1 + returnRate / 12, yearsToTarget * 12) - 1)
          : 0;

      targetScenario = {
        yearsToTarget,
        monthlyNeededForTarget: monthlyNeededForTarget / 12,
        achievable: monthlyNeededForTarget <= savings * 12,
      };
    }

    const newResults = {
      fireNumber,
      leanFireNumber,
      fatFireNumber,
      yearsToFire,
      fireAge: age + yearsToFire,
      currentSavingsRate:
        annualSavings > 0 ? (annualSavings / (expenses + annualSavings)) * 100 : 0,
      totalPortfolio,
      futureValueCurrentSavings,
      futureValueContributions,
      totalInvestmentGrowth,
      targetScenario,
      monthlyIncomeAtFire: (fireNumber * withdrawal) / 12,
    };

    setResults(newResults);
    setHasCalculated(true);

    // Prepare CSV data
    const csvExportData = [
      ['Metric', 'Value'],
      ['Current Age', age.toString()],
      ['Current Net Worth', `£${netWorth.toFixed(2)}`],
      ['Annual Expenses', `£${expenses.toFixed(2)}`],
      ['Monthly Savings', `£${savings.toFixed(2)}`],
      ['Expected Return', `${expectedReturn}%`],
      ['Withdrawal Rate', `${withdrawalRate}%`],
      ['', ''],
      ['FIRE Number', `£${fireNumber.toFixed(2)}`],
      ['Years to FIRE', yearsToFire.toFixed(1)],
      ['FIRE Age', newResults.fireAge.toFixed(1)],
      ['Current Savings Rate', `${newResults.currentSavingsRate.toFixed(1)}%`],
      ['Final Portfolio Value', `£${totalPortfolio.toFixed(2)}`],
      ['Monthly Income at FIRE', `£${newResults.monthlyIncomeAtFire.toFixed(2)}`],
    ];
    setCsvData(csvExportData);
  };

  const prepareChartData = () => {
    if (!results) return { pieData: [], scenarios: [] };

    const pieData = [
      {
        name: 'Current Savings Growth',
        value: results.futureValueCurrentSavings,
        color: CHART_COLORS.currentSavings,
      },
      {
        name: 'Future Contributions',
        value: results.futureValueContributions,
        color: CHART_COLORS.futureContributions,
      },
      {
        name: 'Investment Growth',
        value: results.totalInvestmentGrowth,
        color: CHART_COLORS.investmentGrowth,
      },
    ];

    const scenarios = [
      { name: 'Lean FIRE', value: results.leanFireNumber, color: '#10b981' },
      { name: 'Regular FIRE', value: results.fireNumber, color: '#3b82f6' },
      { name: 'Fat FIRE', value: results.fatFireNumber, color: '#f59e0b' },
    ];

    return { pieData, scenarios };
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 dark:text-gray-100">{data.name}</p>
          <p style={{ color: data.color }}>
            £{data.value.toLocaleString('en-GB', { maximumFractionDigits: 0 })}
          </p>
        </div>
      );
    }
    return null;
  };

  useEffect(() => {
    setHasCalculated(false);
    setResults(null);
  }, [
    currentAge,
    currentNetWorth,
    annualExpenses,
    monthlySavings,
    expectedReturn,
    withdrawalRate,
    targetAge,
  ]);

  return (
    <div className="bg-white dark:bg-gray-900">
      {/* Page Header */}
      <div className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 non-printable">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              🔥 UK FIRE Calculator | Financial Independence Retire Early
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Calculate your path to Financial Independence and Early Retirement. Discover when you
              can retire, how much you need to save, and different FIRE scenarios for your
              lifestyle.
            </p>
          </div>
        </div>
      </div>

      {/* Main Calculator Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="print-title hidden">FIRE Calculator Results</div>

        <div className="grid lg:grid-cols-5 gap-8 printable-grid-cols-1">
          {/* Input Panel */}
          <div className="lg:col-span-2 non-printable">
            <Card className="sticky top-24 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-500" />
                  FIRE Calculator
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Current Age</Label>
                    <Input
                      type="number"
                      value={currentAge}
                      onChange={(e) => setCurrentAge(e.target.value)}
                      placeholder="e.g. 30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Target FIRE Age (optional)</Label>
                    <Input
                      type="number"
                      value={targetAge}
                      onChange={(e) => setTargetAge(e.target.value)}
                      placeholder="e.g. 50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>Current Net Worth</Label>
                    <Link
                      to={createPageUrl('NetWorthCalculator')}
                      className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                      target="_blank"
                    >
                      Calculate <Calculator className="w-3 h-3" />
                    </Link>
                  </div>
                  <div className="relative">
                    <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="number"
                      value={currentNetWorth}
                      onChange={(e) => setCurrentNetWorth(e.target.value)}
                      className="pl-10"
                      placeholder="e.g. 50000"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>Annual Living Expenses</Label>
                    <Link
                      to={createPageUrl('BudgetCalculator')}
                      className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                      target="_blank"
                    >
                      Calculate <Calculator className="w-3 h-3" />
                    </Link>
                  </div>
                  <div className="relative">
                    <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="number"
                      value={annualExpenses}
                      onChange={(e) => setAnnualExpenses(e.target.value)}
                      className="pl-10"
                      placeholder="e.g. 40000"
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    Your total annual spending needs in retirement
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Monthly Savings</Label>
                  <div className="relative">
                    <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="number"
                      value={monthlySavings}
                      onChange={(e) => setMonthlySavings(e.target.value)}
                      className="pl-10"
                      placeholder="e.g. 2000"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Expected Annual Return (%)</Label>
                  <Input
                    type="number"
                    value={expectedReturn}
                    onChange={(e) => setExpectedReturn(e.target.value)}
                    step="0.5"
                  />
                  <p className="text-xs text-gray-500">
                    Typical range: 6-8% for diversified portfolios
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Safe Withdrawal Rate (%)</Label>
                  <Select value={withdrawalRate} onValueChange={setWithdrawalRate}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3.25">3.25% (Ultra Conservative)</SelectItem>
                      <SelectItem value="3.5">3.5% (Conservative)</SelectItem>
                      <SelectItem value="4">4% (Traditional Rule)</SelectItem>
                      <SelectItem value="4.5">4.5% (Aggressive)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleCalculate}
                  className="w-full text-lg bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                >
                  <Calculator className="w-5 h-5 mr-2" />
                  Calculate My FIRE Plan
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-3 space-y-6 printable-area">
            {hasCalculated && results && results.fireNumber ? (
              <>
                <div className="flex justify-between items-center non-printable">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                    Your FIRE Plan
                  </h2>
                  <ExportActions
                    csvData={csvData}
                    fileName="fire-calculation"
                    title="FIRE Calculation Results"
                  />
                </div>

                {/* Main FIRE Summary */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/30 dark:to-red-900/30 border-orange-200 dark:border-orange-800">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-orange-800 dark:text-orange-300">
                            Your FIRE Number
                          </p>
                          <div className="text-3xl font-bold text-orange-900 dark:text-orange-100">
                            £{results.fireNumber.toLocaleString()}
                          </div>
                        </div>
                        <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                          <Target className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <p className="text-sm text-orange-700 dark:text-orange-300 mt-2">
                        Based on £{Number(annualExpenses).toLocaleString()} annual expenses
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border-green-200 dark:border-green-800">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-green-800 dark:text-green-300">
                            Years to FIRE
                          </p>
                          <div className="text-3xl font-bold text-green-900 dark:text-green-100">
                            {results.yearsToFire.toFixed(1)}
                          </div>
                        </div>
                        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                          <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <p className="text-sm text-green-700 dark:text-green-300 mt-2">
                        FIRE at age {results.fireAge.toFixed(0)}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* FIRE Scenarios */}
                <Card>
                  <CardHeader>
                    <CardTitle>FIRE Scenarios</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-lg text-center">
                        <h4 className="font-semibold text-green-800 dark:text-green-300">
                          Lean FIRE
                        </h4>
                        <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                          £{results.leanFireNumber.toLocaleString()}
                        </p>
                        <p className="text-sm text-green-700 dark:text-green-300">
                          ~£35k/year lifestyle
                        </p>
                      </div>
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-center border-2 border-blue-300 dark:border-blue-700">
                        <h4 className="font-semibold text-blue-800 dark:text-blue-300">
                          Your FIRE
                        </h4>
                        <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                          £{results.fireNumber.toLocaleString()}
                        </p>
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          Your target lifestyle
                        </p>
                      </div>
                      <div className="p-4 bg-amber-50 dark:bg-amber-900/30 rounded-lg text-center">
                        <h4 className="font-semibold text-amber-800 dark:text-amber-300">
                          Fat FIRE
                        </h4>
                        <p className="text-2xl font-bold text-amber-900 dark:text-amber-100">
                          £{results.fatFireNumber.toLocaleString()}
                        </p>
                        <p className="text-sm text-amber-700 dark:text-amber-300">
                          ~£80k+/year lifestyle
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Portfolio Breakdown Chart */}
                <div className="grid md:grid-cols-2 gap-6 non-printable">
                  <Card>
                    <CardHeader>
                      <CardTitle>Portfolio Growth Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                          <Pie
                            data={prepareChartData().pieData}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {prepareChartData().pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Key Metrics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between">
                        <span>Current Savings Rate:</span>
                        <span className="font-semibold">
                          {results.currentSavingsRate.toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Monthly Income at FIRE:</span>
                        <span className="font-semibold">
                          £{results.monthlyIncomeAtFire.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Final Portfolio Value:</span>
                        <span className="font-semibold">
                          £{results.totalPortfolio.toLocaleString()}
                        </span>
                      </div>
                      {results.currentSavingsRate < 20 && (
                        <div className="p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg">
                          <p className="text-sm text-yellow-800 dark:text-yellow-300">
                            💡 Consider increasing your savings rate to reach FIRE faster. Most FIRE
                            achievers save 50%+ of income.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Target Age Scenario */}
                {results.targetScenario && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Target Age Scenario</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {results.targetScenario.achievable ? (
                        <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
                          <p className="text-green-800 dark:text-green-300">
                            ✅ Great! You can reach FIRE by age {targetAge} with your current
                            savings plan.
                          </p>
                        </div>
                      ) : (
                        <div className="p-4 bg-red-50 dark:bg-red-900/30 rounded-lg">
                          <p className="text-red-800 dark:text-red-300">
                            ⚠️ To reach FIRE by age {targetAge}, you'd need to save £
                            {results.targetScenario.monthlyNeededForTarget.toLocaleString()} per
                            month (vs your current £{monthlySavings}).
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <Card className="flex items-center justify-center h-[400px]">
                <div className="text-center text-gray-500 dark:text-gray-400">
                  <Flame className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold">Ready to ignite your FIRE journey?</h3>
                  <p>Enter your details to discover your path to financial independence.</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gray-50 dark:bg-gray-800/50 py-12 non-printable">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FAQSection faqs={fireCalculatorFAQs} title="FIRE Calculator FAQ" />
        </div>
      </div>
    </div>
  );
}
