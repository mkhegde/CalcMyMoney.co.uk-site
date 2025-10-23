import { useLocation } from 'react-router-dom';
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';

import { Search, Calculator, TrendingUp, Users, ExternalLink } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

import { useSeo } from '@/components/seo/SeoContext';
import Heading from '@/components/common/Heading';
import { calculatorCategories as DEFAULT_DIRECTORY_CATEGORIES } from '../components/data/calculatorConfig.js';
import { getMappedKeywords } from '@/components/seo/keywordMappings';
import { getCategoryIcon } from '@/components/data/calculatorIcons.js';

const DEFAULT_STATS = { total: 0, active: 0, categories: 0 };

const pageTitle = 'UK Salary, Tax & Mortgage Calculators (2025/26) | CalcMyMoney';
const metaDescription =
  'Free UK calculators for salary, PAYE tax & NI, mortgages, loans, budgeting, savings and pensions. Fast, accurate 2025/26 tools to help you make confident money decisions.';
const canonicalUrl = 'https://www.calcmymoney.co.uk/';
const keywords = getMappedKeywords('Home');

export default function Home() {
  const location = useLocation();
  const { search } = location;
  const hasQuery = new URLSearchParams(search).has('q');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
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
    import('../components/data/calculatorConfig.js')
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

  const fallbackHubCards = useMemo(
    () =>
      DEFAULT_DIRECTORY_CATEGORIES.map((category) => {
        const Icon = getCategoryIcon(category.slug) || Calculator;
        return {
          title: category.name,
          icon: Icon,
          link: `#${category.slug}`,
          description: category.description,
        };
      }),
    []
  );

  const directoryCategories = useMemo(() => {
    if (!calcData.categories.length) return DEFAULT_DIRECTORY_CATEGORIES;
    const map = new Map(calcData.categories.map((category) => [category.slug, category]));
    return DEFAULT_DIRECTORY_CATEGORIES.map((category) => map.get(category.slug) || category);
  }, [calcData.categories]);

  const hubCards = useMemo(() => {
    if (!calcData.categories.length) return fallbackHubCards;
    return directoryCategories.map((category) => ({
      title: category.name,
      icon: getCategoryIcon(category.slug) || Calculator,
      link: `#${category.slug}`,
      description: category.description,
    }));
  }, [calcData.categories, directoryCategories, fallbackHubCards]);

  useEffect(() => {
    const origin =
      typeof window !== 'undefined' && window.location?.origin
        ? window.location.origin
        : 'https://www.calcmymoney.co.uk';
    const currentCanonical = origin.endsWith('/') ? origin : `${origin}/`;

    if (hasQuery) {
      setSeo({
        robots: 'noindex,follow',
        canonical: currentCanonical,
      });
    } else {
      setSeo({
        title: pageTitle,
        description: metaDescription,
        canonical: canonicalUrl,
        ogTitle: pageTitle,
        ogDescription: metaDescription,
        ogUrl: canonicalUrl,
        ogType: 'website',
        ogSiteName: 'CalcMyMoney UK',
        ogLocale: 'en_GB',
        twitterTitle: pageTitle,
        twitterDescription: metaDescription,
        keywords: keywords,
        articleTags: keywords,
      });
    }

    return () => {
      resetSeo();
    };
  }, [hasQuery, setSeo, resetSeo]);

  return (
    <div className="bg-background text-foreground">
      {/* Hero Section */}
      <div className="relative border-b border-border/70 bg-hero-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="text-center max-w-4xl mx-auto text-hero-foreground">
            <Heading
              as="h1"
              size="h1"
              weight="bold"
              className="title-hero text-hero-foreground mb-4"
            >
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
            <div
              key={index}
              className="group block w-full transform rounded-lg border border-card-muted bg-card p-6 text-left shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl"
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
            </div>
          ))}
        </div>
      </div>

      
    </div>
  );
}
