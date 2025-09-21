
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PoundSterling, TrendingUp, TrendingDown, Building, Users, Heart, GraduationCap, Shield } from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const governmentBudget2024 = {
  // Data reflecting 2024/25 fiscal year estimates
  revenue: [
    { category: "Income Tax", amount: 275000, percentage: 26.2, icon: Users, description: "Tax on individual earnings" },
    { category: "National Insurance", amount: 178000, percentage: 17.0, icon: Shield, description: "Contributions for pensions and benefits" },
    { category: "VAT", amount: 170000, percentage: 16.2, icon: PoundSterling, description: "Value Added Tax on goods and services" },
    { category: "Corporation Tax", amount: 105000, percentage: 10.0, icon: Building, description: "Tax on company profits" },
    { category: "Fuel, Alcohol, Tobacco", amount: 48000, percentage: 4.6, icon: TrendingUp, description: "Duties on fuel, alcohol and tobacco" },
    { category: "Council Tax", amount: 46000, percentage: 4.4, icon: Building, description: "Local authority property tax" },
    { category: "Business Rates", amount: 33000, percentage: 3.1, icon: Building, description: "Commercial property tax" },
    { category: "Other", amount: 195000, percentage: 18.5, icon: PoundSterling, description: "Interest, dividends, other taxes" }
  ],
  expenditure: [
    { category: "Social Protection", amount: 395000, percentage: 34.0, icon: Users, description: "State Pension, Universal Credit, other benefits" },
    { category: "Health (NHS)", amount: 240000, percentage: 20.7, icon: Heart, description: "Healthcare services, staff, and infrastructure" },
    { category: "Education", amount: 125000, percentage: 10.8, icon: GraduationCap, description: "Schools, universities, and skills training" },
    { category: "Debt Interest", amount: 115000, percentage: 9.9, icon: TrendingDown, description: "Interest on national government debt" },
    { category: "Defence", amount: 65000, percentage: 5.6, icon: Shield, description: "Military operations and national security" },
    { category: "Transport", amount: 45000, percentage: 3.9, icon: TrendingUp, description: "Roads, railways, and public transport" },
    { category: "Public Order & Safety", amount: 40000, percentage: 3.4, icon: Shield, description: "Police, courts, and prisons" },
    { category: "Other Spending", amount: 135000, percentage: 11.6, icon: Building, description: "Housing, environment, culture, etc." }
  ],
  totalRevenue: 1050000,
  totalExpenditure: 1160000,
  deficit: -110000
};

const governmentBudget2025 = {
  // Data reflecting 2025/26 fiscal year forecasts
  revenue: [
    { category: "Income Tax", amount: 290000, percentage: 26.6, icon: Users, description: "Tax on individual earnings" },
    { category: "National Insurance", amount: 185000, percentage: 17.0, icon: Shield, description: "Contributions for pensions and benefits" },
    { category: "VAT", amount: 175000, percentage: 16.1, icon: PoundSterling, description: "Value Added Tax on goods and services" },
    { category: "Corporation Tax", amount: 110000, percentage: 10.1, icon: Building, description: "Tax on company profits" },
    { category: "Fuel, Alcohol, Tobacco", amount: 49000, percentage: 4.5, icon: TrendingUp, description: "Duties on fuel, alcohol and tobacco" },
    { category: "Council Tax", amount: 48000, percentage: 4.4, icon: Building, description: "Local authority property tax" },
    { category: "Business Rates", amount: 34000, percentage: 3.1, icon: Building, description: "Commercial property tax" },
    { category: "Other", amount: 199000, percentage: 18.2, icon: PoundSterling, description: "Interest, dividends, other taxes" }
  ],
  expenditure: [
    { category: "Social Protection", amount: 410000, percentage: 34.8, icon: Users, description: "State Pension, Universal Credit, other benefits" },
    { category: "Health (NHS)", amount: 250000, percentage: 21.2, icon: Heart, description: "Healthcare services, staff, and infrastructure" },
    { category: "Education", amount: 130000, percentage: 11.0, icon: GraduationCap, description: "Schools, universities, and skills training" },
    { category: "Debt Interest", amount: 105000, percentage: 8.9, icon: TrendingDown, description: "Interest on national government debt" },
    { category: "Defence", amount: 70000, percentage: 5.9, icon: Shield, description: "Military operations and national security" },
    { category: "Transport", amount: 48000, percentage: 4.1, icon: TrendingUp, description: "Roads, railways, and public transport" },
    { category: "Public Order & Safety", amount: 42000, percentage: 3.6, icon: Shield, description: "Police, courts, and prisons" },
    { category: "Other Spending", amount: 125000, percentage: 10.6, icon: Building, description: "Housing, environment, culture, etc." }
  ],
  totalRevenue: 1090000,
  totalExpenditure: 1180000,
  deficit: -90000
};

const CHART_COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#f97316', '#06b6d4', '#84cc16'];

export default function UKGovernmentBudget() {
  const [selectedYear, setSelectedYear] = useState('2025');
  const currentBudget = selectedYear === '2025' ? governmentBudget2025 : governmentBudget2024;

  const prepareChartData = (data) => {
    return data.map((item, index) => ({
      ...item,
      color: CHART_COLORS[index % CHART_COLORS.length]
    }));
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 dark:text-gray-100">{data.category}</p>
          <p style={{ color: data.color }}>
            £{(data.amount / 1000).toFixed(1)}bn ({data.percentage.toFixed(1)}%)
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">{data.description}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-900">
      {/* SEO-Optimized Header */}
      <div className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              UK Government Budget {selectedYear}/{(parseInt(selectedYear) + 1).toString().slice(-2)} | Where Your Taxes Go
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-4xl mx-auto">
              Understand how the UK government manages the nation's finances. See exactly where tax revenue comes from and how every pound of public money is spent.
            </p>
            <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
              <p>Comprehensive breakdown of UK government income and expenditure • Financial Year {selectedYear}/{(parseInt(selectedYear) + 1).toString().slice(-2)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Year Selection */}
        <div className="text-center mb-8">
          <div className="inline-flex rounded-lg border border-gray-200 dark:border-gray-700">
             <button
              onClick={() => setSelectedYear('2024')}
              className={`px-6 py-2 rounded-l-lg ${selectedYear === '2024'
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              2024/25
            </button>
            <button
              onClick={() => setSelectedYear('2025')}
              className={`px-6 py-2 rounded-r-lg border-l border-gray-200 dark:border-gray-700 ${selectedYear === '2025'
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              2025/26
            </button>
          </div>
        </div>

        {/* Budget Overview Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/50 dark:to-green-800/50 border-green-200 dark:border-green-700">
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-8 h-8 mx-auto text-green-600 dark:text-green-400 mb-2" />
              <p className="text-sm font-medium text-green-800 dark:text-green-300">Total Revenue</p>
              <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                £{(currentBudget.totalRevenue / 1000).toFixed(0)}bn
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50 border-blue-200 dark:border-blue-700">
            <CardContent className="p-6 text-center">
              <TrendingDown className="w-8 h-8 mx-auto text-blue-600 dark:text-blue-400 mb-2" />
              <p className="text-sm font-medium text-blue-800 dark:text-blue-300">Total Spending</p>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                £{(currentBudget.totalExpenditure / 1000).toFixed(0)}bn
              </p>
            </CardContent>
          </Card>

          <Card className={`bg-gradient-to-br ${currentBudget.deficit < 0
            ? 'from-red-50 to-red-100 dark:from-red-900/50 dark:to-red-800/50 border-red-200 dark:border-red-700'
            : 'from-green-50 to-green-100 dark:from-green-900/50 dark:to-green-800/50 border-green-200 dark:border-green-700'
          }`}>
            <CardContent className="p-6 text-center">
              {currentBudget.deficit < 0 ? (
                <TrendingDown className="w-8 h-8 mx-auto text-red-600 dark:text-red-400 mb-2" />
              ) : (
                <TrendingUp className="w-8 h-8 mx-auto text-green-600 dark:text-green-400 mb-2" />
              )}
              <p className={`text-sm font-medium ${currentBudget.deficit < 0
                ? 'text-red-800 dark:text-red-300'
                : 'text-green-800 dark:text-green-300'
              }`}>
                {currentBudget.deficit < 0 ? 'Budget Deficit' : 'Budget Surplus'}
              </p>
              <p className={`text-2xl font-bold ${currentBudget.deficit < 0
                ? 'text-red-900 dark:text-red-100'
                : 'text-green-900 dark:text-green-100'
              }`}>
                £{Math.abs(currentBudget.deficit / 1000).toFixed(0)}bn
              </p>
               {currentBudget.deficit < 0 && (
                <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                  (Financed by government borrowing)
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="revenue" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="revenue">Government Revenue</TabsTrigger>
            <TabsTrigger value="expenditure">Government Spending</TabsTrigger>
          </TabsList>

          <TabsContent value="revenue" className="space-y-8">
            {/* Revenue Analysis */}
            <div className="grid lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Sources Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={prepareChartData(currentBudget.revenue)}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="amount"
                        label={({ category, percentage }) => `${category.split(' ')[0]} ${percentage.toFixed(1)}%`}
                        className="text-xs fill-gray-600 dark:fill-gray-400"
                      >
                        {prepareChartData(currentBudget.revenue).map((entry, index) => (
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
                  <CardTitle>Revenue Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {currentBudget.revenue.map((item, index) => (
                    <div key={item.category} className="flex items-center justify-between p-3 border-l-4 bg-gray-50 dark:bg-gray-800/50 rounded-r-lg" style={{borderLeftColor: CHART_COLORS[index % CHART_COLORS.length]}}>
                      <div className="flex items-center gap-3">
                        <item.icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        <div>
                          <span className="font-medium text-gray-900 dark:text-gray-100">{item.category}</span>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                          £{(item.amount / 1000).toFixed(1)}bn
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {item.percentage.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="expenditure" className="space-y-8">
            {/* Expenditure Analysis */}
            <div className="grid lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Spending Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={prepareChartData(currentBudget.expenditure)}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="amount"
                        label={({ category, percentage }) => `${category.includes('(') ? category.split('(')[0].trim() : category.split(' ')[0]} ${percentage.toFixed(1)}%`}
                        className="text-xs fill-gray-600 dark:fill-gray-400"
                      >
                        {prepareChartData(currentBudget.expenditure).map((entry, index) => (
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
                  <CardTitle>Spending Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {currentBudget.expenditure.map((item, index) => (
                    <div key={item.category} className="flex items-center justify-between p-3 border-l-4 bg-gray-50 dark:bg-gray-800/50 rounded-r-lg" style={{borderLeftColor: CHART_COLORS[index % CHART_COLORS.length]}}>
                      <div className="flex items-center gap-3">
                        <item.icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        <div>
                          <span className="font-medium text-gray-900 dark:text-gray-100">{item.category}</span>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                          £{(item.amount / 1000).toFixed(1)}bn
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {item.percentage.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Educational Section */}
        <Card className="mt-12 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-4">
              What This Means for Your Personal Budget
            </h2>
            <p className="text-blue-800 dark:text-blue-200 mb-6">
              The government's budget management principles apply to personal finances too. Just like the Treasury balances income and expenditure, you should track where your money comes from and where it goes.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to={createPageUrl("SalaryCalculator")}>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Calculate Your Take-Home Pay
                </Button>
              </Link>
              <Link to={createPageUrl("BudgetCalculator")}>
                <Button variant="outline">
                  Plan Your Personal Budget
                </Button>
              </Link>
              <Link to={createPageUrl("IncomeTaxCalculator")}>
                <Button variant="outline">
                  See Your Tax Contribution
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Source Attribution */}
        <Card className="mt-8 bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Sources</h3>
            <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
              <p>• <a href="https://obr.uk/forecasts-in-depth/tax-by-tax-spend-by-spend/" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600">Office for Budget Responsibility (OBR) - Fiscal Outlook</a></p>
              <p>• <a href="https://www.gov.uk/government/organisations/hm-treasury" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600">HM Treasury - Public Spending Statistics</a></p>
              <p>• <a href="https://www.ons.gov.uk/" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600">ONS (Office for National Statistics) - Government Finance Statistics</a></p>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
              *Figures are estimates based on official government projections and may be subject to revision. All amounts shown in millions of pounds (£m). A budget deficit is covered by government borrowing (issuing gilts), which adds to the national debt and incurs interest payments, as shown in the expenditure.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
