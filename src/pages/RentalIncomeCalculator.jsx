import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  PoundSterling,
  Home,
  Calculator,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Percent,
} from 'lucide-react';
import ExportActions from '../components/calculators/ExportActions';
import { TooltipProvider } from '@/components/ui/tooltip'; // New import for TooltipProvider
import {
import Heading from '@/components/common/Heading';
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'; // New imports for Accordion

const rentalIncomeCalculatorJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'UK Rental Income Calculator 2025/26',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web Browser',
  description:
    'Free UK rental income calculator for landlords. Calculate rental yield, profit/loss, and tax on rental income with accurate UK rates for 2025/26.',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'GBP',
  },
  featureList: [
    'Rental yield calculation',
    'Income tax estimation',
    'Cash flow analysis',
    'Expense tracking',
    'ROI calculation',
    'Cash-on-cash return analysis',
  ],
};

export default function RentalIncomeCalculator() {
  // Income inputs
  const [monthlyRent, setMonthlyRent] = useState('');
  const [propertyValue, setPropertyValue] = useState('');
  const [capitalInvested, setCapitalInvested] = useState(''); // New state for Capital Invested

  // Expense inputs
  const [mortgagePayment, setMortgagePayment] = useState('');
  const [insurance, setInsurance] = useState('');
  const [maintenance, setMaintenance] = useState('');
  const [managementFees, setManagementFees] = useState('');
  const [groundRent, setGroundRent] = useState('');
  const [serviceFees, setServiceFees] = useState('');
  const [voidPeriods, setVoidPeriods] = useState('1'); // months per year

  // Tax inputs
  const [taxRate, setTaxRate] = useState('20'); // basic rate
  const [otherAllowableExpenses, setOtherAllowableExpenses] = useState('');

  const [results, setResults] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [csvData, setCsvData] = useState(null);

  const handleCalculate = () => {
    const currentMonthlyRent = Number(monthlyRent) || 0;
    const currentPropertyValue = Number(propertyValue) || 0;
    const currentCapitalInvested = Number(capitalInvested) || 0; // Get capital invested value

    if (currentMonthlyRent <= 0) {
      setResults(null);
      setHasCalculated(true);
      return;
    }

    // Calculate annual figures
    const annualRentBeforeVoids = currentMonthlyRent * 12;
    const voidLoss = currentMonthlyRent * (Number(voidPeriods) || 0);
    const annualRentAfterVoids = annualRentBeforeVoids - voidLoss;

    // Calculate annual expenses
    const annualMortgage = (Number(mortgagePayment) || 0) * 12;
    const annualInsurance = Number(insurance) || 0;
    const annualMaintenance = Number(maintenance) || 0;
    const annualManagementFees = (Number(managementFees) || 0) * 12;
    const annualGroundRent = Number(groundRent) || 0;
    const annualServiceFees = Number(serviceFees) || 0;
    const annualOtherExpenses = Number(otherAllowableExpenses) || 0;

    const totalExpenses =
      annualMortgage +
      annualInsurance +
      annualMaintenance +
      annualManagementFees +
      annualGroundRent +
      annualServiceFees +
      annualOtherExpenses;

    // Calculate profit/loss before tax
    const profitBeforeTax = annualRentAfterVoids - totalExpenses;

    // Calculate tax (only on profit)
    const taxOwed = profitBeforeTax > 0 ? profitBeforeTax * (Number(taxRate) / 100) : 0;

    // Net profit after tax
    const netProfit = profitBeforeTax - taxOwed;

    // Calculate yields (if property value provided)
    const grossYield =
      currentPropertyValue > 0 ? (annualRentBeforeVoids / currentPropertyValue) * 100 : 0;
    const netYield = currentPropertyValue > 0 ? (netProfit / currentPropertyValue) * 100 : 0;

    // Calculate Cash-on-Cash Return (if capital invested provided)
    const cashOnCashReturn =
      currentCapitalInvested > 0 ? (netProfit / currentCapitalInvested) * 100 : 0;

    const newResults = {
      annualRentBeforeVoids,
      voidLoss,
      annualRentAfterVoids,
      totalExpenses,
      profitBeforeTax,
      taxOwed,
      netProfit,
      grossYield,
      netYield,
      cashOnCashReturn, // Add to results
      monthlyNetProfit: netProfit / 12,
      expenses: {
        mortgage: annualMortgage,
        insurance: annualInsurance,
        maintenance: annualMaintenance,
        management: annualManagementFees,
        groundRent: annualGroundRent,
        serviceFees: annualServiceFees,
        otherExpenses: annualOtherExpenses,
      },
    };

    setResults(newResults);
    setHasCalculated(true);

    // Prepare CSV data
    const csvExportData = [
      ['Description', 'Annual', 'Monthly'],
      [
        'Rental Income (before voids)',
        `£${newResults.annualRentBeforeVoids.toFixed(2)}`,
        `£${currentMonthlyRent.toFixed(2)}`,
      ],
      [
        'Void Periods Loss',
        `£${(-newResults.voidLoss).toFixed(2)}`,
        `£${(-newResults.voidLoss / 12).toFixed(2)}`,
      ],
      [
        'Net Rental Income',
        `£${newResults.annualRentAfterVoids.toFixed(2)}`,
        `£${(newResults.annualRentAfterVoids / 12).toFixed(2)}`,
      ],
      ['', '', ''],
      ['EXPENSES', '', ''],
      [
        'Mortgage Payments',
        `£${(-newResults.expenses.mortgage).toFixed(2)}`,
        `£${(-newResults.expenses.mortgage / 12).toFixed(2)}`,
      ],
      [
        'Insurance',
        `£${(-newResults.expenses.insurance).toFixed(2)}`,
        `£${(-newResults.expenses.insurance / 12).toFixed(2)}`,
      ],
      [
        'Maintenance',
        `£${(-newResults.expenses.maintenance).toFixed(2)}`,
        `£${(-newResults.expenses.maintenance / 12).toFixed(2)}`,
      ],
      [
        'Management Fees',
        `£${(-newResults.expenses.management).toFixed(2)}`,
        `£${(-newResults.expenses.management / 12).toFixed(2)}`,
      ],
      [
        'Ground Rent',
        `£${(-newResults.expenses.groundRent).toFixed(2)}`,
        `£${(-newResults.expenses.groundRent / 12).toFixed(2)}`,
      ],
      [
        'Service Fees',
        `£${(-newResults.expenses.serviceFees).toFixed(2)}`,
        `£${(-newResults.expenses.serviceFees / 12).toFixed(2)}`,
      ],
      [
        'Other Expenses',
        `£${(-newResults.expenses.otherExpenses).toFixed(2)}`,
        `£${(-newResults.expenses.otherExpenses / 12).toFixed(2)}`,
      ],
      [
        'Total Expenses',
        `£${(-newResults.totalExpenses).toFixed(2)}`,
        `£${(-newResults.totalExpenses / 12).toFixed(2)}`,
      ],
      ['', '', ''],
      [
        'Profit Before Tax',
        `£${newResults.profitBeforeTax.toFixed(2)}`,
        `£${(newResults.profitBeforeTax / 12).toFixed(2)}`,
      ],
      [
        'Tax Owed',
        `£${(-newResults.taxOwed).toFixed(2)}`,
        `£${(-newResults.taxOwed / 12).toFixed(2)}`,
      ],
      [
        'Net Profit After Tax',
        `£${newResults.netProfit.toFixed(2)}`,
        `£${newResults.monthlyNetProfit.toFixed(2)}`,
      ],
      ['', '', ''],
      currentPropertyValue > 0
        ? ['Gross Rental Yield', `${newResults.grossYield.toFixed(2)}%`, '']
        : null,
      currentPropertyValue > 0
        ? ['Net Rental Yield', `${newResults.netYield.toFixed(2)}%`, '']
        : null,
      currentCapitalInvested > 0
        ? ['Cash-on-Cash Return', `${newResults.cashOnCashReturn.toFixed(2)}%`, '']
        : null,
    ].filter(Boolean); // Filter out null values from optional rows
    setCsvData(csvExportData);
  };

  useEffect(() => {
    setHasCalculated(false);
    setResults(null);
  }, [
    monthlyRent,
    propertyValue,
    capitalInvested,
    mortgagePayment,
    insurance,
    maintenance,
    managementFees,
    groundRent,
    serviceFees,
    voidPeriods,
    taxRate,
    otherAllowableExpenses,
  ]);

  return (
    <>
      <script type="application/ld+json">{JSON.stringify(rentalIncomeCalculatorJsonLd)}</script>

      <TooltipProvider>
        {' '}
        {/* New wrapper */}
        <div className="bg-white dark:bg-gray-900">
          {/* Page Header */}
          <div className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 non-printable">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="text-center">
                <Heading as="h1" size="h1" weight="bold" className="text-gray-900 dark:text-gray-100 mb-4">
                  UK Rental Income Calculator 2025/26
                </Heading>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  Calculate your rental property profit, tax obligations, and rental yield. Free
                  calculator for UK landlords and property investors.
                </p>
              </div>
            </div>
          </div>

          {/* Main Calculator Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="print-title hidden">Rental Income Calculation Results</div>

            <div className="grid lg:grid-cols-3 gap-8 printable-grid-cols-1">
              {/* Input Panel */}
              <div className="lg:col-span-1 space-y-6 non-printable">
                {/* Property & Rent Details */}
                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Home className="w-5 h-5" />
                      Property Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="monthlyRent">Monthly Rental Income</Label>
                      <div className="relative">
                        <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="monthlyRent"
                          type="number"
                          value={monthlyRent}
                          onChange={(e) => setMonthlyRent(e.target.value)}
                          className="pl-10"
                          placeholder="e.g. 1500"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="propertyValue">Property Value (Optional)</Label>
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
                      <p className="text-xs text-gray-500">(for rental yield calculation)</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="capitalInvested">Total Capital Invested (Optional)</Label>
                      <div className="relative">
                        <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="capitalInvested"
                          type="number"
                          value={capitalInvested}
                          onChange={(e) => setCapitalInvested(e.target.value)}
                          className="pl-10"
                          placeholder="e.g. 50000"
                        />
                      </div>
                      <p className="text-xs text-gray-500">
                        (for cash-on-cash return calculation - e.g., deposit, legal fees, stamp
                        duty)
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="voidPeriods">Void Periods (months per year)</Label>
                      <Input
                        id="voidPeriods"
                        type="number"
                        value={voidPeriods}
                        onChange={(e) => setVoidPeriods(e.target.value)}
                        placeholder="e.g. 1"
                        min="0"
                        max="12"
                      />
                      <p className="text-xs text-gray-500">Months property is empty annually</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Monthly Expenses */}
                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingDown className="w-5 h-5" />
                      Monthly Expenses
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="mortgagePayment">Mortgage Payment</Label>
                      <div className="relative">
                        <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="mortgagePayment"
                          type="number"
                          value={mortgagePayment}
                          onChange={(e) => setMortgagePayment(e.target.value)}
                          className="pl-10"
                          placeholder="e.g. 800"
                        />
                      </div>
                      <p className="text-xs text-gray-500">Monthly mortgage payment</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="managementFees">Management Fees</Label>
                      <div className="relative">
                        <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="managementFees"
                          type="number"
                          value={managementFees}
                          onChange={(e) => setManagementFees(e.target.value)}
                          className="pl-10"
                          placeholder="e.g. 120"
                        />
                      </div>
                      <p className="text-xs text-gray-500">
                        Monthly agent fees (typically 8-12% of rent)
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Annual Expenses */}
                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle>Annual Expenses</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="insurance">Buildings/Contents Insurance</Label>
                      <div className="relative">
                        <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="insurance"
                          type="number"
                          value={insurance}
                          onChange={(e) => setInsurance(e.target.value)}
                          className="pl-10"
                          placeholder="e.g. 400"
                        />
                      </div>
                      <p className="text-xs text-gray-500">Annual insurance premium</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="maintenance">Maintenance & Repairs</Label>
                      <div className="relative">
                        <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="maintenance"
                          type="number"
                          value={maintenance}
                          onChange={(e) => setMaintenance(e.target.value)}
                          className="pl-10"
                          placeholder="e.g. 1000"
                        />
                      </div>
                      <p className="text-xs text-gray-500">
                        Annual budget for repairs and maintenance
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="groundRent">Ground Rent</Label>
                      <div className="relative">
                        <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="groundRent"
                          type="number"
                          value={groundRent}
                          onChange={(e) => setGroundRent(e.target.value)}
                          className="pl-10"
                          placeholder="e.g. 300"
                        />
                      </div>
                      <p className="text-xs text-gray-500">Annual ground rent charge</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="serviceFees">Service Charges</Label>
                      <div className="relative">
                        <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="serviceFees"
                          type="number"
                          value={serviceFees}
                          onChange={(e) => setServiceFees(e.target.value)}
                          className="pl-10"
                          placeholder="e.g. 500"
                        />
                      </div>
                      <p className="text-xs text-gray-500">
                        Annual service charge (leasehold properties)
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="otherAllowableExpenses">Other Allowable Expenses</Label>
                      <div className="relative">
                        <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="otherAllowableExpenses"
                          type="number"
                          value={otherAllowableExpenses}
                          onChange={(e) => setOtherAllowableExpenses(e.target.value)}
                          className="pl-10"
                          placeholder="e.g. 200"
                        />
                      </div>
                      <p className="text-xs text-gray-500">Annual legal fees, accountancy, etc.</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Tax Settings */}
                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle>Tax Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="taxRate">Your Income Tax Rate (%)</Label>
                      <div className="relative">
                        <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="taxRate"
                          type="number"
                          value={taxRate}
                          onChange={(e) => setTaxRate(e.target.value)}
                          className="pl-10"
                          placeholder="20"
                        />
                      </div>
                      <p className="text-xs text-gray-500">
                        Basic: 20%, Higher: 40%, Additional: 45%
                      </p>
                    </div>

                    <Button onClick={handleCalculate} className="w-full text-lg">
                      <Calculator className="w-5 h-5 mr-2" />
                      Calculate Rental Income
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Results Panel */}
              <div className="lg:col-span-2 space-y-6 printable-area">
                {hasCalculated && results ? (
                  <>
                    <div className="flex justify-between items-center non-printable">
                      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                        Rental Income Analysis
                      </h2>
                      <ExportActions
                        csvData={csvData}
                        fileName="rental-income-calculation"
                        title="Rental Income Calculation"
                      />
                    </div>

                    {/* Key Metrics */}
                    <div className="grid md:grid-cols-3 gap-4">
                      <Card
                        className={`${results.netProfit >= 0 ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700' : 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700'}`}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium">Monthly Net Profit</p>
                              <p
                                className={`text-2xl font-bold ${results.netProfit >= 0 ? 'text-green-900' : 'text-red-900'}`}
                              >
                                {results.netProfit >= 0 ? '£' : '-£'}
                                {Math.abs(results.monthlyNetProfit).toLocaleString('en-GB', {
                                  maximumFractionDigits: 0,
                                })}
                              </p>
                            </div>
                            <TrendingUp
                              className={`w-8 h-8 ${results.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}
                            />
                          </div>
                        </CardContent>
                      </Card>

                      {propertyValue && (
                        <>
                          <Card className="bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700">
                            <CardContent className="p-6">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-medium text-blue-800">Gross Yield</p>
                                  <p className="text-2xl font-bold text-blue-900">
                                    {results.grossYield.toFixed(2)}%
                                  </p>
                                </div>
                                <Percent className="w-8 h-8 text-blue-600" />
                              </div>
                            </CardContent>
                          </Card>

                          <Card className="bg-purple-50 dark:bg-purple-900/30 border-purple-200 dark:border-purple-700">
                            <CardContent className="p-6">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-medium text-purple-800">Net Yield</p>
                                  <p className="text-2xl font-bold text-purple-900">
                                    {results.netYield.toFixed(2)}%
                                  </p>
                                </div>
                                <TrendingUp className="w-8 h-8 text-purple-600" />
                              </div>
                            </CardContent>
                          </Card>
                        </>
                      )}
                      {capitalInvested && (
                        <Card className="bg-orange-50 dark:bg-orange-900/30 border-orange-200 dark:border-orange-700">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-orange-800">
                                  Cash-on-Cash Return
                                </p>
                                <p
                                  className={`text-2xl font-bold ${results.cashOnCashReturn >= 0 ? 'text-green-900' : 'text-red-900'}`}
                                >
                                  {results.cashOnCashReturn.toFixed(2)}%
                                </p>
                              </div>
                              <TrendingUp
                                className={`w-8 h-8 ${results.cashOnCashReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}
                              />
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>

                    {/* Detailed Breakdown */}
                    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                      <CardHeader>
                        <CardTitle>Income & Expense Breakdown</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {/* Income Section */}
                          <div>
                            <h4 className="font-semibold text-green-700 mb-3">
                              Annual Rental Income
                            </h4>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span>Gross Rental Income:</span>
                                <span className="font-semibold text-green-600">
                                  £{results.annualRentBeforeVoids.toLocaleString()}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Less: Void Periods ({voidPeriods} months):</span>
                                <span className="font-semibold text-red-600">
                                  -£{results.voidLoss.toLocaleString()}
                                </span>
                              </div>
                              <div className="flex justify-between border-t pt-2">
                                <span className="font-semibold">Net Rental Income:</span>
                                <span className="font-bold text-green-700">
                                  £{results.annualRentAfterVoids.toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Expenses Section */}
                          <div>
                            <h4 className="font-semibold text-red-700 mb-3">Annual Expenses</h4>
                            <div className="space-y-2 text-sm">
                              {results.expenses.mortgage > 0 && (
                                <div className="flex justify-between">
                                  <span>Mortgage Payments:</span>
                                  <span>-£{results.expenses.mortgage.toLocaleString()}</span>
                                </div>
                              )}
                              {results.expenses.management > 0 && (
                                <div className="flex justify-between">
                                  <span>Management Fees:</span>
                                  <span>-£{results.expenses.management.toLocaleString()}</span>
                                </div>
                              )}
                              {results.expenses.insurance > 0 && (
                                <div className="flex justify-between">
                                  <span>Insurance:</span>
                                  <span>-£{results.expenses.insurance.toLocaleString()}</span>
                                </div>
                              )}
                              {results.expenses.maintenance > 0 && (
                                <div className="flex justify-between">
                                  <span>Maintenance & Repairs:</span>
                                  <span>-£{results.expenses.maintenance.toLocaleString()}</span>
                                </div>
                              )}
                              {results.expenses.groundRent > 0 && (
                                <div className="flex justify-between">
                                  <span>Ground Rent:</span>
                                  <span>-£{results.expenses.groundRent.toLocaleString()}</span>
                                </div>
                              )}
                              {results.expenses.serviceFees > 0 && (
                                <div className="flex justify-between">
                                  <span>Service Charges:</span>
                                  <span>-£{results.expenses.serviceFees.toLocaleString()}</span>
                                </div>
                              )}
                              {results.expenses.otherExpenses > 0 && (
                                <div className="flex justify-between">
                                  <span>Other Expenses:</span>
                                  <span>-£{results.expenses.otherExpenses.toLocaleString()}</span>
                                </div>
                              )}
                              <div className="flex justify-between border-t pt-2 font-semibold">
                                <span>Total Expenses:</span>
                                <span className="text-red-700">
                                  -£{results.totalExpenses.toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Profit & Tax */}
                          <div>
                            <h4 className="font-semibold text-gray-700 mb-3">Profit & Tax</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span>Profit Before Tax:</span>
                                <span
                                  className={`font-semibold ${results.profitBeforeTax >= 0 ? 'text-green-600' : 'text-red-600'}`}
                                >
                                  {results.profitBeforeTax >= 0 ? '£' : '-£'}
                                  {Math.abs(results.profitBeforeTax).toLocaleString()}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Income Tax ({taxRate}%):</span>
                                <span className="font-semibold text-red-600">
                                  -£{results.taxOwed.toLocaleString()}
                                </span>
                              </div>
                              <div
                                className={`flex justify-between border-t pt-2 font-bold text-lg ${results.netProfit >= 0 ? 'text-green-700' : 'text-red-700'}`}
                              >
                                <span>Net Annual Profit:</span>
                                <span>
                                  {results.netProfit >= 0 ? '£' : '-£'}
                                  {Math.abs(results.netProfit).toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Yield Information (if property value provided) */}
                    {propertyValue && (
                      <Card className="bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700">
                        <CardHeader>
                          <CardTitle>Rental Yield Analysis</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-semibold mb-2">Gross Rental Yield</h4>
                              <p className="text-3xl font-bold text-blue-700">
                                {results.grossYield.toFixed(2)}%
                              </p>
                              <p className="text-sm text-gray-600 mt-2">
                                Based on gross annual rent of £
                                {results.annualRentBeforeVoids.toLocaleString()} and property value
                                of £{Number(propertyValue).toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2">Net Rental Yield</h4>
                              <p
                                className={`text-3xl font-bold ${results.netYield >= 0 ? 'text-green-700' : 'text-red-700'}`}
                              >
                                {results.netYield.toFixed(2)}%
                              </p>
                              <p className="text-sm text-gray-600 mt-2">
                                After all expenses and tax, based on net profit of £
                                {Math.abs(results.netProfit).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Capital Invested Analysis (if capital invested provided) */}
                    {capitalInvested && (
                      <Card className="bg-orange-50 dark:bg-orange-900/30 border-orange-200 dark:border-orange-700">
                        <CardHeader>
                          <CardTitle>Capital Invested Analysis</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid md:grid-cols-1 gap-6">
                            <div>
                              <h4 className="font-semibold mb-2">Cash-on-Cash Return</h4>
                              <p
                                className={`text-3xl font-bold ${results.cashOnCashReturn >= 0 ? 'text-green-700' : 'text-red-700'}`}
                              >
                                {results.cashOnCashReturn.toFixed(2)}%
                              </p>
                              <p className="text-sm text-gray-600 mt-2">
                                Annual net profit (£{Math.abs(results.netProfit).toLocaleString()})
                                as a percentage of your total cash invested (£
                                {Number(capitalInvested).toLocaleString()}).
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Important Notes */}
                    <Card className="bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-700">
                      <CardContent className="p-4 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-700 mt-0.5" />
                        <div className="text-sm text-amber-800">
                          <p className="font-semibold mb-2">Important Tax Information:</p>
                          <ul className="space-y-1 text-xs">
                            <li>• Rental income is added to your total income for tax purposes</li>
                            <li>• You can claim tax relief on allowable expenses</li>
                            <li>
                              • Mortgage interest relief is restricted (gradually being phased out)
                            </li>
                            <li>• Consider the impact on your overall tax position</li>
                            <li>
                              • This calculator provides estimates only - consult a tax advisor for
                              accurate advice
                            </li>
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <Card className="lg:col-span-2 flex items-center justify-center h-[400px] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <div className="text-center text-gray-500">
                      <Home className="w-12 h-12 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold">
                        Ready to analyze your rental income?
                      </h3>
                      <p>
                        Enter your rental income and expenses to see your profit and yield
                        calculations.
                      </p>
                      {hasCalculated && !results && (
                        <p className="text-red-500 mt-2">
                          Please enter a valid monthly rent amount.
                        </p>
                      )}
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-gray-50 dark:bg-gray-800/50 py-12 non-printable">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <FAQSection
                faqs={rentalIncomeFAQs}
                title="Rental Income - Frequently Asked Questions"
              />
            </div>
          </div>
        </div>
      </TooltipProvider>
    </>
  );
}

const FAQSection = ({ faqs, title }) => (
  <div className="py-8">
    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">
      {title}
    </h2>
    <Accordion type="single" collapsible className="w-full">
      {faqs.map((faq, index) => (
        <AccordionItem key={`faq-${index}`} value={`item-${index}`}>
          <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
          <AccordionContent>
            <p className="text-gray-700 dark:text-gray-300">{faq.answer}</p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  </div>
);

const rentalIncomeFAQs = [
  {
    question: 'What is rental yield and why is it important?',
    answer:
      'Rental yield shows the annual return on your property investment as a percentage. Gross yield is annual rent divided by property value. Net yield considers expenses. In the UK, gross yields typically range from 3-8% depending on location. Higher yields often indicate higher risk areas or properties requiring more management.',
  },
  {
    question: 'What expenses can I claim against rental income?',
    answer:
      'You can claim legitimate business expenses including: mortgage interest (with restrictions for higher-rate taxpayers), insurance, maintenance and repairs, management fees, ground rent and service charges, accountancy fees, and advertising for tenants. You cannot claim capital improvements or your own time.',
  },
  {
    question: 'How do I account for void periods?',
    answer:
      'Void periods (empty property between tenants) are inevitable. Budget 1-2 weeks per year minimum, more in areas with high tenant turnover. Our calculator lets you specify void periods in months per year. Factor this into your cash flow projections as it directly impacts your actual rental income.',
  },
  {
    question: "What's a good rental yield for UK property?",
    answer:
      'This varies by location and property type. Generally: 4-6% gross yield in expensive areas like London, 6-8% in most UK cities, 8%+ in cheaper areas (but often with higher management needs). Consider net yield after expenses - typically 2-4% lower than gross yield.',
  },
  {
    question: 'Should I use a letting agent or manage the property myself?',
    answer:
      'Letting agents typically charge 8-12% of rent plus setup fees, but provide tenant finding, rent collection, maintenance coordination, and legal compliance. Self-management saves money but requires time and knowledge of landlord obligations. Factor management costs into your calculations either way.',
  },
  {
    question: 'How much should I budget for maintenance and repairs?',
    answer:
      'Budget 10-15% of annual rent for maintenance and repairs, more for older properties. This covers regular maintenance, emergency repairs, safety checks (gas/electrical), and periodic updates. New-build properties may need less initially but will require more as they age.',
  },
  {
    question: 'What insurance do I need as a landlord?',
    answer:
      'You need buildings insurance (often required by mortgage lender) and should consider landlord insurance covering liability, loss of rent, and contents if furnished. Costs vary by property value, location, and coverage level - typically £200-£600 annually for standard properties.',
  },
  {
    question: 'How do taxes work on rental income?',
    answer:
      'Rental income is added to your other income and taxed at your marginal rate (20%, 40%, or 45%). You can deduct allowable expenses. Higher-rate taxpayers have restrictions on mortgage interest relief. Consider the £1,000 property allowance for small landlords. Seek professional advice for complex situations.',
  },
];
