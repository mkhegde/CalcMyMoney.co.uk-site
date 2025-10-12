import { useLocation } from 'react-router-dom';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';

import { Search, Calculator, TrendingUp, Users, ExternalLink } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

import { prefetchPage } from '@/utils/prefetchPage';
import FAQSection from '../components/calculators/FAQSection';
import { HandCoins, PoundSterling, Home as HomeIcon, PiggyBank } from 'lucide-react';
import { useSeo } from '@/components/seo/SeoContext';
import Heading from '@/components/common/Heading';

const DEFAULT_STATS = { total: 0, active: 0, categories: 0 };

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
  const location = useLocation();
  const { search, hash } = location;
  const hasQuery = new URLSearchParams(search).has('q');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showAllCalculators, setShowAllCalculators] = useState(false);
  const [pendingScrollSlug, setPendingScrollSlug] = useState(null);
  const lastHandledHashRef = useRef(null);
  const { setSeo, resetSeo } = useSeo();
  const [calcData, setCalcData] = useState({
    categories: [],
    calculators: [],
    stats: DEFAULT_STATS,
    searchFn: null,
    loading: true,
  });

  useEffect(() => {
    let cancelled = false;
    import('../components/data/calculatorConfig.jsx')
      .then((mod) => {
        if (cancelled) return;
        setCalcData({
          categories: mod?.calculatorCategories || [],
          calculators: mod?.allCalculators || [],
          stats: mod?.getCalculatorStats ? mod.getCalculatorStats() : DEFAULT_STATS,
          searchFn: mod?.searchCalculators || null,
          loading: false,
        });
      })
      .catch((error) => {
        if (import.meta.env.DEV) {
          // eslint-disable-next-line no-console
          console.error('Failed to load calculator catalog', error);
        }
        setCalcData((prev) => ({ ...prev, loading: false }));
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const stats = calcData.stats;
  const isCatalogLoading = calcData.loading;
  const categoriesLoaded = calcData.categories.length > 0;

  // Popular/Featured calculators — use kebab-case slugs (no leading slash)
  const featuredSlugs = [
    'salary-calculator-uk',
    'mortgage-calculator',
    'budget-calculator',
    'income-tax-calculator',
    'compound-interest-calculator',
    'pension-calculator',
  ];

  // Build featured objects by exact URL match
  const fallbackFeatured = [
    {
      name: 'Salary Calculator UK',
      url: '/salary-calculator-uk',
      description: 'Work out take-home pay for 2025/26.',
      category: 'Salary',
      icon: Calculator,
    },
    {
      name: 'Mortgage Calculator',
      url: '/mortgage-calculator',
      description: 'Estimate repayments and interest costs.',
      category: 'Property',
      icon: HomeIcon,
    },
    {
      name: 'Budget Planner',
      url: '/budget-calculator',
      description: 'Build a monthly budget and spot savings.',
      category: 'Budgeting',
      icon: PiggyBank,
    },
    {
      name: 'Income Tax Calculator',
      url: '/income-tax-calculator',
      description: 'See your PAYE, NI and take-home pay.',
      category: 'Tax',
      icon: PoundSterling,
    },
    {
      name: 'Compound Interest Calculator',
      url: '/compound-interest-calculator',
      description: 'Project savings with compounding returns.',
      category: 'Investing',
      icon: TrendingUp,
    },
    {
      name: 'Pension Calculator',
      url: '/pension-calculator',
      description: 'Plan retirement contributions and growth.',
      category: 'Retirement',
      icon: Users,
    },
  ];

  const featuredCalcObjects = useMemo(() => {
    if (!calcData.calculators.length) return fallbackFeatured;

    const picks = featuredSlugs
      .map((slug) =>
        calcData.calculators.find((c) => c.url === `/${slug}` && c.status === 'active')
      )
      .filter(Boolean);

    // Fallback so the section never renders empty
    return picks.length
      ? picks
      : calcData.calculators.filter((c) => c.status === 'active').slice(0, 6);
  }, [calcData.calculators]);

  // Handle search
  useEffect(() => {
    if (!calcData.searchFn) {
      setSearchResults([]);
      return;
    }

    if (searchQuery.trim()) {
      const results = calcData.searchFn(searchQuery);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, calcData.searchFn]);

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
      title: 'Tax Calculators',
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

  useEffect(() => {
    if (!hasQuery) {
      resetSeo();
      return;
    }

    const origin =
      typeof window !== 'undefined' && window.location?.origin
        ? window.location.origin
        : 'https://www.calcmymoney.co.uk';
    const canonical = origin.endsWith('/') ? origin : `${origin}/`;

    setSeo({
      robots: 'noindex,follow',
      canonical,
    });

    return () => {
      resetSeo();
    };
  }, [hasQuery, setSeo, resetSeo]);

  useEffect(() => {
    if (!showAllCalculators || !pendingScrollSlug) {
      return;
    }

    if (typeof document === 'undefined') {
      return;
    }

    const target = document.getElementById(pendingScrollSlug);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setPendingScrollSlug(null);
  }, [showAllCalculators, pendingScrollSlug]);

  useEffect(() => {
    if (!hash) {
      lastHandledHashRef.current = null;
      return;
    }

    const slug = hash.replace(/^#/, '').trim();
    if (!slug) {
      return;
    }

    if (lastHandledHashRef.current === slug) {
      return;
    }

    lastHandledHashRef.current = slug;
    setShowAllCalculators(true);
    setPendingScrollSlug(slug);
  }, [hash]);

  return (
    <div className="bg-background text-foreground">
      {/* Hero Section */}
      <div className="relative border-b border-border/70 bg-hero-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="text-center max-w-4xl mx-auto text-hero-foreground">
            <Heading as="h1" size="h1" weight="bold" className="title-hero text-hero-foreground mb-4">
              All UK Financial Calculators – Income Tax & Take-Home Pay
            </Heading>
            <p className="lead text-muted-foreground mb-8">
              Use our fast, accurate UK calculators to estimate take-home pay, tax & NI, mortgage
              repayments, and savings growth for the 2025/26 tax year. Start with salary, tax,
              mortgage or finance tools below.
            </p>

            {/* Search Bar */}
            <div className="max-w-3xl mx-auto mb-10">
              <div className="flex justify-center">
                <div className="relative w-full sm:max-w-xl">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/70" />
                  <Input
                    type="text"
                    placeholder="Search calculators... (e.g. salary, mortgage, tax)"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="pl-12 pr-4 py-4 text-lg border-2 border-input bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15 rounded-xl"
                  />
                  {searchResults.length > 0 && (
                    <div className="absolute z-50 w-full mt-2 rounded-lg border border-border bg-card shadow-lg">
                      <div className="p-2 max-h-64 overflow-y-auto text-left">
                        {searchResults.slice(0, 8).map((calc, index) => (
                          <Link
                            key={index}
                            to={calc.url}
                            className="block rounded-lg p-3 transition-colors hover:bg-muted"
                            onClick={() => {
                              setSearchQuery('');
                              setSearchResults([]);
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-foreground">{calc.name}</p>
                                <p className="body text-muted-foreground">{calc.description}</p>
                                {(calc.category || calc.subCategory) && (
                                  <p className="caption text-neutral-soft-foreground">
                                    {calc.category || 'Calculator'}{' '}
                                    {calc.subCategory ? `→ ${calc.subCategory}` : ''}
                                  </p>
                                )}
                              </div>
                              {calc.status === 'planned' ? (
                                <Badge variant="secondary" className="caption">
                                  Coming Soon
                                </Badge>
                              ) : (
                                <ExternalLink className="h-4 w-4 text-muted-foreground/60" />
                              )}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
          <div className="flex flex-wrap items-center justify-center gap-4 body text-muted-foreground sm:gap-8">
            {isCatalogLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <div
                  // eslint-disable-next-line react/no-array-index-key
                  key={`stats-skeleton-${index}`}
                  className="h-4 w-36 rounded bg-muted-foreground/20 animate-pulse"
                />
              ))
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <Calculator className="h-4 w-4 text-primary" />
                  <span>{stats.total} Calculators</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span>{stats.active} Active</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  <span>Free to Use</span>
                </div>
              </>
            )}
          </div>
          </div>
        </div>
      </div>

      {/* Hub Cards Section */}
      <div className="relative z-10 -mt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {hubCards.map((card, index) => (
            <button
              key={index}
              type="button"
              onClick={(event) => {
                event.preventDefault();
                const slug = card.link.startsWith('#') ? card.link.slice(1) : card.link;
                setPendingScrollSlug(slug);
                setShowAllCalculators(true);
              }}
              className="group block w-full transform rounded-lg border border-card-muted bg-card p-6 text-left shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
            >
              <div className="flex items-center gap-4 mb-2">
                <div className="rounded-full bg-pill p-3 text-pill-foreground">
                  <card.icon className="h-6 w-6" />
                </div>
                <Heading
                  as="h3"
                  size="h3"
                  className="text-foreground transition-colors group-hover:text-primary"
                >
                  {card.title}
                </Heading>
              </div>
              <p className="body text-muted-foreground">{card.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Featured/Popular Calculators */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 text-center">
          <Heading
            as="h2"
            size="h2"
            weight="bold"
            className="mb-4 flex items-center justify-center gap-3 text-foreground"
          >
            <Calculator className="h-9 w-9 text-primary" />
            Popular Calculators
          </Heading>
          <p className="lead text-muted-foreground">
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
              className="group block rounded-lg border border-card-muted bg-card p-6 transition-all duration-200 hover:border-primary/50 hover:shadow-md"
            >
              <div className="flex items-center gap-3 mb-2">
                <calc.icon className="h-5 w-5 text-primary" />
                <Heading
                  as="h3"
                  size="h3"
                  className="text-foreground transition-colors group-hover:text-primary"
                >
                  {calc.name}
                </Heading>
              </div>
              <p className="mb-2 body text-muted-foreground">{calc.description}</p>
              <p className="caption text-neutral-soft-foreground">{calc.category}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Homepage FAQ Section */}
      <div className="bg-background py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Heading as="h2" size="h2" weight="bold" underline className="text-foreground text-center mb-10">
            Common Questions
          </Heading>
          <FAQSection faqs={homepageFaqs} />
        </div>
      </div>

      {/* Complete Calculator Directory */}
      <div className="bg-neutral-soft py-16" id="calculator-directory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <Heading as="h2" size="h2" weight="bold" underline className="text-foreground mb-4">
              Complete Calculator Directory
            </Heading>
            <p className="mb-6 lead text-muted-foreground">
              Browse all {stats.total} financial calculators organized by category
            </p>
            <button
              onClick={() => setShowAllCalculators(!showAllCalculators)}
              className="font-medium text-primary transition-colors hover:text-primary/80"
            >
              {showAllCalculators ? 'Hide' : 'Show'} All Calculators
            </button>
          </div>

          {/* Calculator Categories */}
          {showAllCalculators ? (
            categoriesLoaded ? (
              <div className="space-y-12">
                {calcData.categories.map((category) => (
                  <div key={category.slug} id={category.slug} className="scroll-mt-20">
                    {/* Category Header */}
                    <div className="mb-6 flex items-center gap-4 border-b-2 border-card-muted pb-3">
                      <category.icon className="h-8 w-8 text-primary" />
                      <div>
                        <Heading as="h3" size="h3" weight="bold" className="text-foreground">
                          {category.name}
                        </Heading>
                        <p className="body text-muted-foreground">{category.description}</p>
                      </div>
                    </div>

                    {/* Sub-categories and Calculators */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {category.subCategories.map((subCategory) => (
                        <div key={subCategory.name} className="space-y-3">
                          <Heading
                            as="h4"
                            size="h3"
                            className="border-l-4 border-primary pl-3 text-foreground"
                          >
                            {subCategory.name}
                          </Heading>
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
                                      className="flex-1 body font-medium text-primary transition-colors hover:text-primary/80 hover:underline"
                                    >
                                      {calc.name}
                                    </Link>
                                  ) : (
                                    <span className="flex-1 body text-muted-foreground/60">{calc.name}</span>
                                  )}
                                  {(calc.status === 'planned' || calc.status === 'pending') && (
                                    <Badge variant="outline" className="ml-2 caption text-primary">
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
            ) : (
              <div className="space-y-12">
                {Array.from({ length: 4 }).map((_, categoryIndex) => (
                  <div
                    // eslint-disable-next-line react/no-array-index-key
                    key={`category-skeleton-${categoryIndex}`}
                    className="scroll-mt-20"
                  >
                    <div className="mb-6 flex items-center gap-4 border-b-2 border-card-muted pb-3">
                      <div className="h-8 w-8 rounded-full bg-muted-foreground/20 animate-pulse" />
                      <div className="space-y-2">
                        <div className="h-4 w-40 rounded bg-muted-foreground/20 animate-pulse" />
                        <div className="h-3 w-64 rounded bg-muted-foreground/10 animate-pulse" />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {Array.from({ length: 3 }).map((_, subIndex) => (
                        <div
                          // eslint-disable-next-line react/no-array-index-key
                          key={`subcategory-skeleton-${categoryIndex}-${subIndex}`}
                          className="space-y-3"
                        >
                          <div className="h-4 w-32 rounded bg-muted-foreground/20 animate-pulse" />
                          <div className="space-y-2 pl-3">
                            {Array.from({ length: 4 }).map((_, calcIndex) => (
                              <div
                                // eslint-disable-next-line react/no-array-index-key
                                key={`calc-skeleton-${categoryIndex}-${subIndex}-${calcIndex}`}
                                className="h-3 w-3/4 rounded bg-muted-foreground/15 animate-pulse"
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="text-center text-muted-foreground">
              Expand the directory to explore every calculator we offer.
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
