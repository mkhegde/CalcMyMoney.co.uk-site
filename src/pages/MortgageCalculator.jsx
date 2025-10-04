import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PoundSterling, Home, Calculator, TrendingUp, Percent } from 'lucide-react';
import ExportActions from '../components/calculators/ExportActions';
import { Button } from '@/components/ui/button'; // Added Button import
import FAQSection from '../components/calculators/FAQSection';
import CalculatorWrapper from '../components/calculators/CalculatorWrapper';
import RelatedCalculators from '../components/calculators/RelatedCalculators';
import Breadcrumbs from '../components/general/Breadcrumbs';
import { createPageUrl } from '@/utils';
import Heading from '@/components/common/Heading';

const mortgageCalculatorJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'UK Mortgage Calculator 2025/26',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web Browser',
  description:
    'Free UK mortgage calculator with stamp duty. Calculate monthly payments, affordability, and total costs for UK property purchases.',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'GBP',
  },
};

const mortgageCalculatorFAQs = [
  {
    question: 'How much can I borrow for a mortgage?',
    answer:
      'UK lenders typically offer 4-4.5 times your annual income, but this depends on affordability assessments including your monthly expenses, credit score, and existing debts. Some lenders may offer up to 5-6 times income in certain circumstances.',
  },
  {
    question: 'What is Loan-to-Value (LTV) and why does it matter?',
    answer:
      "LTV is the percentage of the property value you're borrowing. A lower LTV (higher deposit) typically gets you better interest rates. For example, 90% LTV means a 10% deposit, while 75% LTV means a 25% deposit.",
  },
  {
    question: 'What is stamp duty and how much will I pay?',
    answer:
      'Stamp duty is a tax on property purchases in England and Wales. For 2025/26, you pay 5% on the portion between £250k-£925k, 10% on £925k-£1.5m, and 12% above £1.5m. First-time buyers get relief up to £425k.',
  },
  {
    question: 'Should I choose a fixed or variable rate mortgage?',
    answer:
      'Fixed rates provide payment certainty but may be higher initially. Variable rates can go up or down but offer potential savings if rates fall. Consider your risk tolerance and how long you plan to stay in the property.',
  },
  {
    question: "What's the difference between capital repayment and interest-only mortgages?",
    answer:
      'Capital repayment mortgages pay off both the loan and interest, so you own the property outright at the end. Interest-only mortgages have lower monthly payments but you still owe the full loan amount at the end of the term.',
  },
  {
    question: 'What additional costs should I budget for when buying a home?',
    answer:
      'Beyond the deposit and stamp duty, budget for: legal fees (£1,000-£2,000), survey costs (£400-£1,200), mortgage arrangement fees (£0-£2,000), buildings insurance, and moving costs. Allow 3-5% of purchase price for total costs.',
  },
];

export default function MortgageCalculator() {
  const [propertyValue, setPropertyValue] = useState('');
  const [deposit, setDeposit] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [term, setTerm] = useState(25);
  const [repaymentType, setRepaymentType] = useState('repayment');
  const [income, setIncome] = useState('');
  const [monthlyExpenses, setMonthlyExpenses] = useState('');
  const [results, setResults] = useState(null);
  const [csvData, setCsvData] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false); // New state for tracking calculation attempt

  const location = useLocation(); // Get location object

  const breadcrumbPath = [
    { name: 'Home', url: createPageUrl('Home') },
    { name: 'Property & Mortgages', url: `${createPageUrl('Home')}#property-mortgages` },
    { name: 'Mortgage Calculator' },
  ];

  // Effect to scroll to section from URL hash
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.substring(1); // remove #
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100); // Small delay to ensure page has rendered
    }
  }, [location]);

  const handleCalculate = () => {
    // Renamed from calculateMortgage
    const currentPropertyValue = Number(propertyValue) || 0;
    const currentDeposit = Number(deposit) || 0;
    const currentInterestRate = Number(interestRate) || 0;
    const currentTerm = Number(term) || 0;
    const currentIncome = Number(income) || 0;
    const currentMonthlyExpenses = Number(monthlyExpenses) || 0;

    const loanAmount = currentPropertyValue - currentDeposit;

    // Validate inputs for meaningful calculation
    if (
      currentPropertyValue <= 0 ||
      currentDeposit < 0 ||
      loanAmount <= 0 ||
      currentInterestRate <= 0 ||
      currentTerm <= 0
    ) {
      setResults(null);
      setHasCalculated(true); // Indicate calculation was attempted but inputs were invalid
      return;
    }

    const monthlyRate = currentInterestRate / 100 / 12;
    const numPayments = currentTerm * 12;
    const depositPercentage = (currentDeposit / currentPropertyValue) * 100;

    let monthlyPayment = 0;
    let totalInterest = 0;
    let totalPayable = 0;

    if (repaymentType === 'repayment') {
      // Capital and Interest
      if (monthlyRate > 0) {
        monthlyPayment =
          (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /
          (Math.pow(1 + monthlyRate, numPayments) - 1);
      } else {
        monthlyPayment = loanAmount / numPayments;
      }
      totalPayable = monthlyPayment * numPayments;
      totalInterest = totalPayable - loanAmount;
    } else {
      // Interest Only
      monthlyPayment = (loanAmount * currentInterestRate) / 100 / 12;
      totalInterest = monthlyPayment * numPayments;
      totalPayable = totalInterest + loanAmount;
    }

    // Affordability calculations
    const maxAffordableMortgage = currentIncome * 4.5; // Common UK multiplier
    const monthlyIncome = currentIncome / 12;
    const disposableIncome = monthlyIncome - currentMonthlyExpenses;
    const loanToValue = (loanAmount / currentPropertyValue) * 100;

    // Stamp duty calculation (England & Wales) - Updated tiers based on outline
    let stampDuty = 0;
    if (currentPropertyValue > 250000) {
      stampDuty += Math.min(currentPropertyValue - 250000, 925000 - 250000) * 0.05;
    }
    if (currentPropertyValue > 925000) {
      stampDuty += Math.min(currentPropertyValue - 925000, 1500000 - 925000) * 0.1;
    }
    if (currentPropertyValue > 1500000) {
      stampDuty += (currentPropertyValue - 1500000) * 0.12;
    }

    // Additional costs
    const legalFees = 1500; // Average
    const surveyFees = 600; // Average
    const totalUpfrontCosts = currentDeposit + stampDuty + legalFees + surveyFees;

    const newResults = {
      loanAmount,
      monthlyPayment,
      totalInterest,
      totalPayable,
      depositPercentage,
      loanToValue,
      maxAffordableMortgage,
      disposableIncome,
      stampDuty,
      totalUpfrontCosts,
      affordabilityRatio: (monthlyPayment / monthlyIncome) * 100,
    };

    setResults(newResults);
    setHasCalculated(true); // Set to true after a successful calculation

    const csvExportData = [
      ['Metric', 'Value'],
      ['Property Value', `£${currentPropertyValue.toFixed(2)}`],
      ['Deposit Amount', `£${currentDeposit.toFixed(2)}`],
      ['Loan Amount', `£${newResults.loanAmount.toFixed(2)}`],
      ['Interest Rate', `${currentInterestRate.toFixed(2)}%`],
      ['Mortgage Term', `${currentTerm} years`],
      ['', ''],
      ['Monthly Payment', `£${newResults.monthlyPayment.toFixed(2)}`],
      ['Total Interest Paid', `£${newResults.totalInterest.toFixed(2)}`],
      ['Total Payable', `£${newResults.totalPayable.toFixed(2)}`],
      ['', ''],
      ['Stamp Duty', `£${newResults.stampDuty.toFixed(2)}`],
      ['Estimated Legal & Survey Fees', `£2100.00`],
      ['Total Upfront Costs', `£${newResults.totalUpfrontCosts.toFixed(2)}`],
    ];
    setCsvData(csvExportData);
  };

  useEffect(() => {
    // Clear results and reset calculation status when any input changes
    setHasCalculated(false);
    setResults(null);
    setCsvData(null);
  }, [propertyValue, deposit, interestRate, term, repaymentType, income, monthlyExpenses]);

  return (
    <>
      <script type="application/ld+json">{JSON.stringify(mortgageCalculatorJsonLd)}</script>

      <div className="bg-white dark:bg-gray-900">
        {/* Page Header */}
        <div className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 non-printable">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Breadcrumbs path={breadcrumbPath} />
            <div className="text-center">
              <Heading as="h1" size="h1" weight="bold" className="text-gray-900 dark:text-gray-100 mb-4">
                UK Mortgage Calculator
              </Heading>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Calculate UK mortgage payments, affordability, and stamp duty costs. Free mortgage
                calculator for England, Wales, Scotland & Northern Ireland property purchases.
              </p>
              <div className="mt-6 text-sm text-gray-500 dark:text-gray-400 max-w-4xl mx-auto">
                <p>
                  Includes stamp duty calculator • Affordability assessment • Interest-only &
                  repayment mortgages • Updated 2025/26 rates
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Calculator Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="print-title hidden">Mortgage Calculation Results</div>

          <div className="grid lg:grid-cols-3 gap-8 printable-grid-cols-1">
            {/* Input Panel */}
            <div className="lg:col-span-1 space-y-6 non-printable">
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="w-5 h-5" />
                    Property Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="propertyValue">Property Value</Label>
                    <div className="relative">
                      <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="propertyValue"
                        type="number"
                        value={propertyValue}
                        onChange={(e) => setPropertyValue(e.target.value)}
                        className="pl-10"
                        placeholder="e.g. 300000"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deposit">Deposit Amount</Label>
                    <div className="relative">
                      <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="deposit"
                        type="number"
                        value={deposit}
                        onChange={(e) => setDeposit(e.target.value)}
                        className="pl-10"
                        placeholder="e.g. 60000"
                      />
                    </div>
                    <p className="text-xs text-gray-500 h-4">
                      {propertyValue && deposit && Number(propertyValue) > 0
                        ? `${((Number(deposit) / Number(propertyValue)) * 100).toFixed(1)}% of property value`
                        : ''}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="w-5 h-5" />
                    Mortgage Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="interestRate">Interest Rate (%)</Label>
                    <div className="relative">
                      <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="interestRate"
                        type="number"
                        value={interestRate}
                        onChange={(e) => setInterestRate(e.target.value)}
                        className="pl-10"
                        step="0.1"
                        placeholder="e.g. 4.5"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="term">Mortgage Term (Years)</Label>
                    <Select
                      value={term.toString()}
                      onValueChange={(value) => setTerm(Number(value))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 years</SelectItem>
                        <SelectItem value="20">20 years</SelectItem>
                        <SelectItem value="25">25 years</SelectItem>
                        <SelectItem value="30">30 years</SelectItem>
                        <SelectItem value="35">35 years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="repaymentType">Repayment Type</Label>
                    <Select value={repaymentType} onValueChange={setRepaymentType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="repayment">Capital & Interest</SelectItem>
                        <SelectItem value="interest_only">Interest Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Affordability Check
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="income">Annual Gross Income</Label>
                    <div className="relative">
                      <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="income"
                        type="number"
                        value={income}
                        onChange={(e) => setIncome(e.target.value)}
                        className="pl-10"
                        placeholder="e.g. 50000"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="monthlyExpenses">Monthly Expenses</Label>
                    <div className="relative">
                      <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="monthlyExpenses"
                        type="number"
                        value={monthlyExpenses}
                        onChange={(e) => setMonthlyExpenses(e.target.value)}
                        className="pl-10"
                        placeholder="e.g. 1500"
                      />
                    </div>
                  </div>
                  <Button onClick={handleCalculate} className="w-full text-lg !mt-6">
                    <Calculator className="w-5 h-5 mr-2" />
                    Calculate Mortgage
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Results Panel */}
            <div className="lg:col-span-2 space-y-6 printable-area">
              {hasCalculated && results ? ( // Conditionally render results
                <>
                  <div className="flex justify-between items-center non-printable">
                    <h2 className="text-2xl font-bold text-gray-800">Your Mortgage Summary</h2>
                  </div>
                  {/* Summary Cards */}
                  <div className="grid md:grid-cols-3 gap-4">
                    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50 border-blue-200 dark:border-blue-700">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-blue-800">Monthly Payment</p>
                            <p className="text-2xl font-bold text-blue-900">
                              £
                              {results.monthlyPayment?.toLocaleString('en-GB', {
                                maximumFractionDigits: 0,
                              })}
                            </p>
                          </div>
                          <Home className="w-8 h-8 text-blue-600" />
                        </div>
                        <p className="text-xs text-blue-700 mt-1">
                          {repaymentType === 'repayment' ? 'Capital & Interest' : 'Interest Only'}
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/50 dark:to-green-800/50 border-green-200 dark:border-green-700">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-green-800">Loan Amount</p>
                            <p className="text-2xl font-bold text-green-900">
                              £
                              {results.loanAmount?.toLocaleString('en-GB', {
                                maximumFractionDigits: 0,
                              })}
                            </p>
                          </div>
                          <Calculator className="w-8 h-8 text-green-600" />
                        </div>
                        <p className="text-xs text-green-700 mt-1">
                          {results.loanToValue?.toFixed(1)}% Loan-to-Value
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/50 dark:to-purple-800/50 border-purple-200 dark:border-purple-700">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-purple-800">Total Interest</p>
                            <p className="text-2xl font-bold text-purple-900">
                              £
                              {results.totalInterest?.toLocaleString('en-GB', {
                                maximumFractionDigits: 0,
                              })}
                            </p>
                          </div>
                          <Percent className="w-8 h-8 text-purple-600" />
                        </div>
                        <p className="text-xs text-purple-700 mt-1">Over {term} years</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Affordability Assessment */}
                  <Card
                    id="affordability-assessment"
                    className={`${results.affordabilityRatio > 45 ? 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700' : results.affordabilityRatio > 35 ? 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-700' : 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700'}`}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        Affordability Assessment
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span>Monthly Income:</span>
                            <span className="font-semibold">
                              £{(income / 12).toLocaleString('en-GB', { maximumFractionDigits: 0 })}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Monthly Expenses:</span>
                            <span className="font-semibold">
                              -£
                              {monthlyExpenses.toLocaleString('en-GB', {
                                maximumFractionDigits: 0,
                              })}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Mortgage Payment:</span>
                            <span className="font-semibold">
                              -£
                              {results.monthlyPayment?.toLocaleString('en-GB', {
                                maximumFractionDigits: 0,
                              })}
                            </span>
                          </div>
                          <div className="flex justify-between border-t pt-2">
                            <span>Remaining:</span>
                            <span
                              className={`font-bold ${results.disposableIncome - results.monthlyPayment >= 0 ? 'text-green-600' : 'text-red-600'}`}
                            >
                              £
                              {(results.disposableIncome - results.monthlyPayment)?.toLocaleString(
                                'en-GB',
                                { maximumFractionDigits: 0 }
                              )}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span>Payment-to-Income Ratio:</span>
                            <span
                              className={`font-semibold ${results.affordabilityRatio > 45 ? 'text-red-600' : results.affordabilityRatio > 35 ? 'text-yellow-600' : 'text-green-600'}`}
                            >
                              {results.affordabilityRatio?.toFixed(1)}%
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Max Affordable Loan:</span>
                            <span className="font-semibold">
                              £
                              {results.maxAffordableMortgage?.toLocaleString('en-GB', {
                                maximumFractionDigits: 0,
                              })}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Current Loan Amount:</span>
                            <span
                              className={`font-semibold ${results.loanAmount > results.maxAffordableMortgage ? 'text-red-600' : 'text-green-600'}`}
                            >
                              £
                              {results.loanAmount?.toLocaleString('en-GB', {
                                maximumFractionDigits: 0,
                              })}
                            </span>
                          </div>

                          {results.affordabilityRatio > 45 && (
                            <div className="p-3 bg-red-100 rounded-lg mt-3">
                              <p className="text-sm text-red-800">
                                ⚠️ Payment ratio exceeds recommended 45% - consider a lower loan
                                amount
                              </p>
                            </div>
                          )}

                          {results.loanAmount > results.maxAffordableMortgage && (
                            <div className="p-3 bg-yellow-100 rounded-lg mt-3">
                              <p className="text-sm text-yellow-800">
                                💡 Loan exceeds typical 4.5x income multiplier
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Cost Breakdown */}
                  <Card
                    id="cost-breakdown"
                    className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                  >
                    <CardHeader>
                      <CardTitle>Cost Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <h4 className="font-semibold text-gray-900">Upfront Costs</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span>Deposit ({results.depositPercentage?.toFixed(1)}%):</span>
                                <span>
                                  £
                                  {Number(deposit).toLocaleString('en-GB', {
                                    maximumFractionDigits: 0,
                                  })}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Stamp Duty:</span>
                                <span>
                                  £
                                  {results.stampDuty?.toLocaleString('en-GB', {
                                    maximumFractionDigits: 0,
                                  })}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Legal Fees (est.):</span>
                                <span>£1,500</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Survey Fees (est.):</span>
                                <span>£600</span>
                              </div>
                              <div className="flex justify-between border-t pt-2 font-semibold">
                                <span>Total Upfront:</span>
                                <span>
                                  £
                                  {results.totalUpfrontCosts?.toLocaleString('en-GB', {
                                    maximumFractionDigits: 0,
                                  })}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <h4 className="font-semibold text-gray-900">Lifetime Costs</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span>Loan Amount:</span>
                                <span>
                                  £
                                  {results.loanAmount?.toLocaleString('en-GB', {
                                    maximumFractionDigits: 0,
                                  })}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Total Interest:</span>
                                <span>
                                  £
                                  {results.totalInterest?.toLocaleString('en-GB', {
                                    maximumFractionDigits: 0,
                                  })}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Monthly Payment:</span>
                                <span>
                                  £
                                  {results.monthlyPayment?.toLocaleString('en-GB', {
                                    maximumFractionDigits: 0,
                                  })}
                                </span>
                              </div>
                              {repaymentType === 'interest_only' && (
                                <div className="flex justify-between text-red-600">
                                  <span>Final Balloon Payment:</span>
                                  <span>
                                    £
                                    {results.loanAmount?.toLocaleString('en-GB', {
                                      maximumFractionDigits: 0,
                                    })}
                                  </span>
                                </div>
                              )}
                              <div className="flex justify-between border-t pt-2 font-semibold">
                                <span>Total Payable:</span>
                                <span>
                                  £
                                  {results.totalPayable?.toLocaleString('en-GB', {
                                    maximumFractionDigits: 0,
                                  })}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Important Notes */}
                  <Card className="bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700">
                    <CardHeader>
                      <CardTitle className="text-blue-900">Important Information</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-blue-800">
                      <ul className="space-y-2">
                        <li>
                          🏠 <strong>Stamp Duty:</strong> Calculated for England & Wales. Scotland
                          and Northern Ireland have different rates.
                        </li>
                        <li>
                          📊 <strong>LTV Ratio:</strong> Lower ratios typically qualify for better
                          interest rates
                        </li>
                        <li>
                          💰 <strong>Affordability:</strong> Lenders typically offer 4-4.5x annual
                          income, subject to affordability tests
                        </li>
                        <li>
                          📈 <strong>Interest Only:</strong> Remember you'll still owe the full loan
                          amount at the end of the term
                        </li>
                        <li>
                          ⚖️ <strong>Additional Costs:</strong> Consider buildings insurance,
                          mortgage protection, and ongoing maintenance
                        </li>
                        <li>
                          📞 <strong>Professional Advice:</strong> Consult a mortgage advisor for
                          personalized recommendations
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <div className="non-printable pt-6">
                    <ExportActions
                      csvData={csvData}
                      fileName="mortgage-summary"
                      title="Mortgage Summary"
                    />
                  </div>
                </>
              ) : (
                // Placeholder if no calculation has occurred or results are null
                <Card className="lg:col-span-2 flex items-center justify-center h-[400px] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <div className="text-center text-gray-500">
                    <Calculator className="w-12 h-12 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold">Ready for your mortgage estimate?</h3>
                    <p>Fill in the details and click "Calculate Mortgage" to see your breakdown.</p>
                    {hasCalculated &&
                      !results && ( // Display error message if calculation was attempted but results are null
                        <p className="text-red-500 mt-2">
                          Please ensure all required fields are filled and valid (e.g., property
                          value, deposit, interest rate, term, and loan amount is positive).
                        </p>
                      )}
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>

        <CalculatorWrapper>
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              How to Use the UK Mortgage Calculator
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              A mortgage is typically the largest financial commitment you'll ever make. Our UK
              Mortgage Calculator is a powerful tool designed to give you clarity and confidence by
              estimating your monthly mortgage repayments. By entering the property price, your
              deposit amount, the mortgage interest rate, and the loan term, you can instantly see
              your potential monthly costs. This allows you to assess the affordability of a
              property, compare different mortgage deals, and understand the long-term financial
              implications of your homeownership journey.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              When Should You Use This Calculator?
            </h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>
                <b>Early-Stage House Hunting:</b> Get a feel for what you can afford before you
                start viewing properties.
              </li>
              <li>
                <b>Comparing Mortgage Deals:</b> Enter details from different lenders to see how a
                small change in interest rate can affect your monthly payment.
              </li>
              <li>
                <b>Considering Overpayments:</b> See how much you could save on interest by paying
                more than the required amount each month.
              </li>
              <li>
                <b>Choosing a Mortgage Term:</b> Understand the trade-off between a shorter term
                (higher monthly payments, less total interest) and a longer term (lower monthly
                payments, more total interest).
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Example Use Case
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              A couple is looking to buy a house valued at £300,000. They have saved a 15% deposit
              of £45,000, meaning they need to borrow £255,000. They have been offered a mortgage
              with a 4.5% interest rate over a 30-year term. They enter these values into the
              calculator. The result shows a monthly repayment of approximately £1,292. The
              amortization chart reveals that in the early years, a large portion of their payment
              goes towards interest, but this gradually shifts towards paying down the principal
              loan amount over time. This information helps them confidently confirm that the
              property fits within their monthly budget.
            </p>
          </div>
        </CalculatorWrapper>

        <div id="faq-section" className="bg-gray-50 dark:bg-gray-800/50 py-12 non-printable">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <FAQSection faqs={mortgageCalculatorFAQs} />
          </div>
        </div>

        <RelatedCalculators
          calculators={[
            {
              name: 'Stamp Duty Calculator',
              url: createPageUrl('StampDutyCalculator'),
              description: 'Calculate the property tax due on your purchase.',
            },
            {
              name: 'Rent vs Buy Calculator',
              url: createPageUrl('RentVsBuyCalculator'),
              description: 'Compare the financial costs of renting versus buying a home.',
            },
            {
              name: 'Mortgage Affordability Calculator',
              url: createPageUrl('MortgageAffordabilityCalculator'),
              description: 'Estimate how much you might be able to borrow.',
            },
          ]}
        />
      </div>
    </>
  );
}
