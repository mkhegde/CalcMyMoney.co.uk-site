import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils/createPageUrl';

import { Search, Calculator, TrendingUp, Users, Star, ExternalLink } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  calculatorCategories,
  getAllCalculators,
  getCalculatorsByStatus,
  getCalculatorStats,
  searchCalculators,
} from '../components/data/calculatorConfig';
import { prefetchPage } from '@/utils/prefetchPage';
import FAQSection from '../components/calculators/FAQSection';
import { HandCoins, PoundSterling, Home as HomeIcon, PiggyBank } from 'lucide-react';

const homepageFaqs = [
  {
    question: 'How accurate are your UK salary/tax calculators?',
    answer: (
      <>
        <p>
          Our calculators are designed to be highly accurate, based on the latest UK tax laws and
          financial regulations. They use up-to-date information for Income Tax, National Insurance,
          pension contributions, and student loans for the specified tax year (2025/26).
        </p>
        <p className="mt-2">
          While we strive for precision, these tools are for estimation purposes and should not be
          considered financial advice. Always consult with a qualified financial advisor for
          personal financial decisions.
        </p>
      </>
    ),
  },
  {
    question: 'Which tax year do the calculators use (2025/26)?',
    answer:
      'All relevant calculators, including the Salary, Income Tax, and National Insurance calculators, have been updated and are based on the 2025/26 UK tax year, which runs from 6 April 2025 to 5 April 2026. Rates and thresholds for England, Scotland, Wales, and Northern Ireland are applied where applicable.',
  },
  {
    question: 'Can I download or print the results?',
    answer:
      "Yes. Most of our calculators feature 'Export' or 'Print' buttons that allow you to either download your results as a CSV/PDF file or generate a printer-friendly version of the summary. This makes it easy to save your calculations for your records or share them with others.",
  },
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showAllCalculators, setShowAllCalculators] = useState(false);

  const stats = getCalculatorStats();
  const allCalculators = getAllCalculators();
  const activeCalculators = getCalculatorsByStatus('active');

  // Popular/Featured calculators (you can customize this list)
  const featuredCalculators = [
    'SalaryCalculatorUK',
    'MortgageCalculator',
    'BudgetCalculator',
    'IncomeTaxCalculator',
    'CompoundInterestCalculator',
    'PensionCalculator',
  ];

  const featuredCalcObjects = featuredCalculators
    .map((pageName) => {
      const target = createPageUrl(pageName); // e.g. "SalaryCalculatorUK" -> "/salary-calculator-uk"
      return allCalculators.find((calc) => typeof calc?.url === 'string' && calc.url === target);
    })
    .filter(Boolean);

  // Handle search
  useEffect(() => {
    if (searchQuery.trim()) {
      const results = searchCalculators(searchQuery);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const hubCards = [
    {
      title: 'Salary & Income',
      icon: HandCoins,
      link: '#income-employment',
      description: 'Calculate take-home pay, tax, and more.',
    },
    {
      title: 'Tax Tools',
      icon: PoundSterling,
      link: '#tax-calculators',
      description: 'Tools for income tax, NI, VAT, and CGT.',
    },
    {
      title: 'Mortgage & Loans',
      icon: HomeIcon,
      link: '#property-mortgages',
      description: 'Estimate repayments and affordability.',
    },
    {
      title: 'Savings & Finance',
      icon: PiggyBank,
      link: '#savings-investments',
      description: 'Plan investments and savings goals.',
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-900">
      {/* Hero Section - calculators.net style */}
      <div className="bg-gray-50 dark:bg-gray-800/50 border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Free UK Salary, Tax & Mortgage Calculators
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Use our fast, accurate UK calculators to estimate take-home pay, tax & NI, mortgage
              repayments, and savings growth for the 2025/26 tax year. Start with salary, tax,
              mortgage or finance tools below.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search calculators... (e.g. salary, mortgage, tax)"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="pl-12 pr-4 py-4 text-lg border-2 border-gray-300 focus:border-blue-500 rounded-xl"
                />
              </div>

              {/* Search Results Dropdown */}
              {searchResults.length > 0 && (
                <div className="absolute z-50 w-full max-w-2xl mx-auto mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
                  <div className="p-2 max-h-64 overflow-y-auto">
                    {searchResults.slice(0, 8).map((calc, index) => (
                      <Link
                        key={index}
                        to={calc.url}
                        className="block p-3 hover:bg-gray-50 rounded-lg transition-colors"
                        onClick={() => {
                          setSearchQuery('');
                          setSearchResults([]);
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">{calc.name}</p>
                            <p className="text-sm text-gray-600">{calc.description}</p>
                            <p className="text-xs text-gray-500">
                              {calc.category} → {calc.subCategory}
                            </p>
                          </div>
                          {calc.status === 'planned' ? (
                            <Badge variant="secondary" className="text-xs">
                              Coming Soon
                            </Badge>
                          ) : (
                            <ExternalLink className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="flex justify-center items-center gap-8 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4" />
                <span>{stats.total} Calculators</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                <span>{stats.active} Active</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>Free to Use</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hub Cards Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-16 relative z-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {hubCards.map((card, index) => (
            <a
              key={index}
              href={card.link}
              className="group block p-6 bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transform transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-2">
                <div className="bg-blue-100 p-3 rounded-full">
                  <card.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-700">
                  {card.title}
                </h3>
              </div>
              <p className="text-sm text-gray-600">{card.description}</p>
            </a>
          ))}
        </div>
      </div>

      {/* Featured/Popular Calculators */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            <Calculator className="inline w-9 h-9 mr-2 text-blue-600" />
            Popular Calculators
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            The most used financial calculators on our platform
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {featuredCalcObjects.map((calc, index) => (
            <Link
              key={index}
              to={calc.url}
              onMouseEnter={() => calc.page && prefetchPage(calc.page)}
              onFocus={() => calc.page && prefetchPage(calc.page)}
              className="group block p-6 bg-white border border-gray-200 rounded-lg hover:shadow-md hover:border-blue-300 transition-all duration-200"
            >
              <div className="flex items-center gap-3 mb-2">
                <calc.icon className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">
                  {calc.name}
                </h3>
              </div>
              <p className="text-sm text-gray-600 mb-2">{calc.description}</p>
              <p className="text-xs text-gray-500">{calc.category}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Homepage FAQ Section */}
      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 text-center mb-10">
            Common Questions
          </h2>
          <FAQSection faqs={homepageFaqs} />
        </div>
      </div>

      {/* Complete Calculator Directory - calculators.net style */}
      <div className="bg-gray-50 dark:bg-gray-800/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Complete Calculator Directory
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Browse all {stats.total} financial calculators organized by category
            </p>
            <button
              onClick={() => setShowAllCalculators(!showAllCalculators)}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              {showAllCalculators ? 'Hide' : 'Show'} All Calculators
            </button>
          </div>

          {/* Calculator Categories */}
          <div className="space-y-12">
            {calculatorCategories.map((category) => (
              <div key={category.slug} id={category.slug} className="scroll-mt-20">
                {/* Category Header */}
                <div className="flex items-center gap-4 mb-6 pb-3 border-b-2 border-gray-300">
                  <category.icon className="w-8 h-8 text-blue-600" />
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {category.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">{category.description}</p>
                  </div>
                </div>

                {/* Sub-categories and Calculators */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {category.subCategories.map((subCategory) => (
                    <div key={subCategory.name} className="space-y-3">
                      <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-200 border-l-4 border-blue-500 pl-3">
                        {subCategory.name}
                      </h4>
                      <div className="space-y-2 pl-3">
                        {subCategory.calculators
                          .filter((calc) => showAllCalculators || calc.status === 'active')
                          .map((calc, index) => (
                            <div key={index} className="flex items-center justify-between group">
                              {calc.status === 'active' ? (
                                <Link
                                  to={calc.url}
                                  onMouseEnter={() => calc.page && prefetchPage(calc.page)}
                                  onFocus={() => calc.page && prefetchPage(calc.page)}
                                  className="flex-1 text-blue-600 hover:text-blue-800 hover:underline text-sm font-medium"
                                >
                                  {calc.name}
                                </Link>
                              ) : (
                                <span className="flex-1 text-gray-400 text-sm">{calc.name}</span>
                              )}
                              {calc.status === 'planned' && (
                                <Badge variant="outline" className="text-xs ml-2">
                                  Coming Soon
                                </Badge>
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Stats Footer */}
          <div className="mt-16 text-center p-8 bg-white rounded-lg border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Why Choose Our Calculators?
            </h3>
            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">{stats.active}</div>
                <p className="text-gray-600">Active Calculators</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">100%</div>
                <p className="text-gray-600">Free to Use</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600 mb-2">2025/26</div>
                <p className="text-gray-600">Up-to-Date Tax Rates</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
