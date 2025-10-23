import { useLocation } from 'react-router-dom';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';

import { Search, Calculator, TrendingUp, Users, ExternalLink } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

import { prefetchPage } from '@/utils/prefetchPage';
import { useSeo } from '@/components/seo/SeoContext';
import Heading from '@/components/common/Heading';
import { calculatorCategories as DEFAULT_DIRECTORY_CATEGORIES } from '../components/data/calculatorConfig.js';
import { getMappedKeywords } from '@/components/seo/keywordMappings';
import { getCategoryIcon } from '@/components/data/calculatorIcons.js';

const getCalculatorKey = (calculator) => calculator?.url || calculator?.page || calculator?.slug || null;

const buildStaticCatalog = (categories = []) => {
  const calculators = [];
  const seenGlobal = new Set();

  const directory = categories.map((category) => {
    const subCategories = (category.subCategories || []).map((subCategory) => {
      const subSeen = new Set();
      const calculatorsWithMeta = [];

      (subCategory.calculators || []).forEach((calculator) => {
        const enrichedCalculator = {
          ...calculator,
          category: category.name,
          categorySlug: category.slug,
          subCategory: subCategory.name,
        };

        const key = getCalculatorKey(enrichedCalculator);
        if (!key || subSeen.has(key)) {
          return;
        }

        subSeen.add(key);
        calculatorsWithMeta.push(enrichedCalculator);

        if (!seenGlobal.has(key)) {
          calculators.push(enrichedCalculator);
          seenGlobal.add(key);
        }
      });

      return {
        ...subCategory,
        calculators: calculatorsWithMeta,
      };
    });

    const calculatorsForCategory = subCategories.flatMap((subCategory) => subCategory.calculators || []);

    return {
      ...category,
      calculators: calculatorsForCategory,
      subCategories,
    };
  });

  return {
    directory,
    calculators,
  };
};

const { directory: STATIC_DIRECTORY_CATEGORIES, calculators: STATIC_CALCULATORS } = buildStaticCatalog(
  DEFAULT_DIRECTORY_CATEGORIES
);

const DEFAULT_STATS = {
  total: STATIC_CALCULATORS.length,
  active: STATIC_CALCULATORS.filter((calc) => calc.status === 'active').length,
  categories: STATIC_DIRECTORY_CATEGORIES.length,
};

const searchCatalog = (query) => {
  const term = String(query || '').trim().toLowerCase();
  if (!term) {
    return [];
  }

  return STATIC_CALCULATORS.filter((calc) => {
    const name = String(calc?.name || '').toLowerCase();
    const description = String(calc?.description || '').toLowerCase();
    const keywords = Array.isArray(calc?.keywords) ? calc.keywords : [];

    return (
      name.includes(term) ||
      description.includes(term) ||
      keywords.some((keyword) => String(keyword || '').toLowerCase().includes(term))
    );
  });
};

const pageTitle = 'UK Salary, Tax & Mortgage Calculators (2025/26) | CalcMyMoney';
const metaDescription =
  'Free UK calculators for salary, PAYE tax & NI, mortgages, loans, budgeting, savings and pensions. Fast, accurate 2025/26 tools to help you make confident money decisions.';
const canonicalUrl = 'https://www.calcmymoney.co.uk/';
const keywords = getMappedKeywords('Home');

export default function Home() {
  const location = useLocation();
  const { search, hash } = location;
  const hasQuery = new URLSearchParams(search).has('q');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllCalculators, setShowAllCalculators] = useState(true);
  const [pendingScrollSlug, setPendingScrollSlug] = useState(null);
  const lastHandledHashRef = useRef(null);
  const { setSeo, resetSeo } = useSeo();

  const directoryCategories = useMemo(() => STATIC_DIRECTORY_CATEGORIES, []);
  const stats = useMemo(() => DEFAULT_STATS, []);
  const isCatalogLoading = false;
  const categoriesLoaded = directoryCategories.length > 0;
  const searchResults = useMemo(() => searchCatalog(searchQuery), [searchQuery]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

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
                            onMouseEnter={() => calc.page && prefetchPage(calc.page)}
                            onFocus={() => calc.page && prefetchPage(calc.page)}
                            onClick={() => {
                              setSearchQuery('');
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
                {directoryCategories.map((category) => {
                  const Icon = getCategoryIcon(category.slug);
                  return (
                    <div key={category.slug} id={category.slug} className="scroll-mt-20">
                      {/* Category Header */}
                      <div className="mb-6 flex items-center gap-4 border-b-2 border-card-muted pb-3">
                        <Icon className="h-8 w-8 text-primary" />
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
                                  <div
                                    key={index}
                                    className="flex items-center justify-between group"
                                  >
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
                                      <span className="flex-1 body text-muted-foreground/60">
                                        {calc.name}
                                      </span>
                                    )}
                                    {(calc.status === 'planned' || calc.status === 'pending') && (
                                      <Badge variant="secondary" className="caption">
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
                  );
                })}
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
