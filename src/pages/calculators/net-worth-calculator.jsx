import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, PiggyBank, TrendingUp } from 'lucide-react';

import Heading from '@/components/common/Heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';

const keywords = ['net worth calculator', 'how to calculate net worth'];

const metaDescription =
  'Use our net worth calculator to track assets, compare net worth calculator progress, and keep your financial snapshot updated each quarter.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/net-worth-calculator';
const schemaKeywords = keywords;

const currencyFormatter = (value) =>
  value.toLocaleString('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
  });

const netWorthFaqs = [
  {
    question: 'What assets should I include?',
    answer:
      'Include property equity, investments, pensions, savings, cash, and high-value belongings. Use realistic valuations to avoid inflating your net worth.',
  },
  {
    question: 'How often should I review my net worth?',
    answer:
      'Quarterly reviews are ideal. Monthly updates can be helpful during rapid change, while annual updates work for long-term planning.',
  },
  {
    question: 'Should I include pension pots?',
    answer:
      'Yes. Estimate pension values from provider statements so your net worth reflects all long-term assets. Remember that tax may apply when withdrawing.',
  },
];

const calculateNetWorth = ({ assets, liabilities }) => {
  const totalAssets = assets.reduce((sum, item) => sum + (Number(item.value) || 0), 0);
  const totalLiabilities = liabilities.reduce((sum, item) => sum + (Number(item.value) || 0), 0);
  const netWorth = totalAssets - totalLiabilities;
  const debtRatio = totalAssets > 0 ? (totalLiabilities / totalAssets) * 100 : 0;
  return {
    totalAssets,
    totalLiabilities,
    netWorth,
    debtRatio,
  };
};

export default function NetWorthCalculatorPage() {
  const [assets, setAssets] = useState([
    { name: 'Home equity', value: '150000' },
    { name: 'Investments', value: '65000' },
    { name: 'Cash savings', value: '12000' },
  ]);

  const [liabilities, setLiabilities] = useState([
    { name: 'Mortgage balance', value: '120000' },
    { name: 'Credit cards', value: '2500' },
  ]);

  const results = useMemo(() => calculateNetWorth({ assets, liabilities }), [assets, liabilities]);

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>Net Worth Calculator | How to Calculate Net Worth</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Net Worth Calculator | How to Calculate Net Worth" />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Calc My Money" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Net Worth Calculator | How to Calculate Net Worth" />
        <meta name="twitter:description" content={metaDescription} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: 'Net Worth Calculator',
              url: canonicalUrl,
              description: metaDescription,
              keywords: schemaKeywords,
              inLanguage: 'en-GB',
              potentialAction: {
                '@type': 'Action',
                name: 'Calculate net worth',
                target: canonicalUrl,
              },
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Net Worth Calculator
          </Heading>
          <p className="text-lg md:text-xl text-blue-100">
            Track assets and debts in one place. Understand how to calculate net worth and visualise
            your progress toward financial independence.
          </p>
        </div>
      </section>

      <CalculatorWrapper className="bg-white dark:bg-gray-950">
        <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
          <Card className="border border-blue-200 dark:border-blue-900 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Calculator className="h-5 w-5 text-blue-500" />
                Assets
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {assets.map((asset, index) => (
                <div key={`asset-${index}`} className="space-y-2">
                  <Input
                    value={asset.name}
                    onChange={(event) =>
                      setAssets((prev) =>
                        prev.map((entry, entryIndex) =>
                          entryIndex === index ? { ...entry, name: event.target.value } : entry
                        )
                      )
                    }
                    placeholder="Asset name"
                  />
                  <Input
                    type="number"
                    min={0}
                    inputMode="decimal"
                    value={asset.value}
                    onChange={(event) =>
                      setAssets((prev) =>
                        prev.map((entry, entryIndex) =>
                          entryIndex === index ? { ...entry, value: event.target.value } : entry
                        )
                      )
                    }
                    placeholder="Value (£)"
                  />
                </div>
              ))}
              <Button
                onClick={() => setAssets((prev) => [...prev, { name: 'New asset', value: '0' }])}
                variant="outline"
                className="w-full"
              >
                Add asset
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border border-blue-200 dark:border-blue-900 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                  Liabilities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {liabilities.map((liability, index) => (
                  <div key={`liability-${index}`} className="space-y-2">
                    <Input
                      value={liability.name}
                      onChange={(event) =>
                        setLiabilities((prev) =>
                          prev.map((entry, entryIndex) =>
                            entryIndex === index ? { ...entry, name: event.target.value } : entry
                          )
                        )
                      }
                      placeholder="Liability name"
                    />
                    <Input
                      type="number"
                      min={0}
                      inputMode="decimal"
                      value={liability.value}
                      onChange={(event) =>
                        setLiabilities((prev) =>
                          prev.map((entry, entryIndex) =>
                            entryIndex === index ? { ...entry, value: event.target.value } : entry
                          )
                        )
                      }
                      placeholder="Balance (£)"
                    />
                  </div>
                ))}
                <Button
                  onClick={() =>
                    setLiabilities((prev) => [...prev, { name: 'New liability', value: '0' }])
                  }
                  variant="outline"
                  className="w-full"
                >
                  Add liability
                </Button>
              </CardContent>
            </Card>

            <Card className="border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-900/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-blue-900 dark:text-blue-100">
                  <PiggyBank className="h-5 w-5" />
                  Net Worth Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-4 gap-4 text-center">
                <div className="rounded-md bg-white/70 dark:bg-blue-900/60 p-4 border border-blue-100 dark:border-blue-800">
                  <p className="text-sm text-blue-700 dark:text-blue-200">Assets</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    {currencyFormatter(results.totalAssets)}
                  </p>
                </div>
                <div className="rounded-md bg-white/70 dark:bg-blue-900/60 p-4 border border-blue-100 dark:border-blue-800">
                  <p className="text-sm text-blue-700 dark:text-blue-200">Liabilities</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    {currencyFormatter(results.totalLiabilities)}
                  </p>
                </div>
                <div className="rounded-md bg-white/70 dark:bg-blue-900/60 p-4 border border-blue-100 dark:border-blue-800">
                  <p className="text-sm text-blue-700 dark:text-blue-200">Net worth</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    {currencyFormatter(results.netWorth)}
                  </p>
                </div>
                <div className="rounded-md bg-white/70 dark:bg-blue-900/60 p-4 border border-blue-100 dark:border-blue-800">
                  <p className="text-sm text-blue-700 dark:text-blue-200">Debt ratio</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    {results.debtRatio.toFixed(1)}%
                  </p>
                </div>
              </CardContent>
            </Card>

            <section className="space-y-6">
              <Heading
                as="h2"
                size="h2"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                How to calculate net worth effectively
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Update asset values, subtract liabilities, and commit to quarterly reviews. Keeping
                the net worth calculator current helps you benchmark progress toward financial
                independence.
              </p>
              <Heading
                as="h3"
                size="h3"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                Using the net worth calculator for goal setting
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Map debt payoff and investment milestones. The net worth calculator shows how
                reducing liabilities and increasing savings changes your financial snapshot.
              </p>
            </section>
          </div>
        </div>
      </CalculatorWrapper>

      <section className="bg-white dark:bg-gray-950 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FAQSection faqs={netWorthFaqs} />
        </div>
      </section>
    </div>
  );
}
