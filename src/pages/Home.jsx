import { useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { Search, Calculator, TrendingUp, Users, ExternalLink } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

import {
  calculatorCategories,
  allCalculators as flatCalculators,
  getCalculatorStats,
  searchCalculators,
} from '../components/data/calculatorConfig';

import { prefetchPage } from '@/utils/prefetchPage';
import FAQSection from '../components/calculators/FAQSection';
import { HandCoins, PoundSterling, Home as HomeIcon, PiggyBank } from 'lucide-react';
import { useSeo } from '@/components/seo/SeoContext';
import Section from '@/components/common/Section';

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
  const { search } = useLocation();
  const hasQuery = new URLSearchParams(search).has('q');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showAllCalculators, setShowAllCalculators] = useState(false);
  const { setSeo, resetSeo } = useSeo();

  const stats = getCalculatorStats();

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
  const featuredCalcObjects = (() => {
    const picks = featuredSlugs
      .map((slug) => flatCalculators.find((c) => c.url === `/${slug}` && c.status === 'active'))
      .filter(Boolean);

    // Fallback so the section never renders empty
    return picks.length ? picks : flatCalculators.filter((c) => c.status === 'active').slice(0, 6);
  })();

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

  return (
    <div className="bg-background text-foreground">
      {/* Hero Section */}
      <Section
        variant="muted"
        className="border-b border-border/70 bg-hero bg-hero-pattern"
        spacing="py-16 md:py-20"
        contentClassName="max-w-4xl mx-auto text-center text-hero-foreground"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-hero-foreground mb-4">
          Free UK Salary, Tax & Mortgage Calculators
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Use our fast, accurate UK calculators to estimate take-home pay, tax & NI, mortgage
          repayments, and savings growth for the 2025/26 tax year. Start with salary, tax,
          mortgage or finance tools below.
        </p>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/70" />
            <Input
              type="text"
              placeholder="Search calculators... (e.g. salary, mortgage, tax)"
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-12 pr-4 py-4 text-lg border-2 border-input bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15 rounded-xl"
            />
          </div>

          {/* Search Results Dropdown */}
          {searchResults.length > 0 && (
            <div className="absolute z-50 w-full max-w-2xl mx-auto mt-2 rounded-lg border border-border bg-card shadow-lg">
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
                        <p className="text-sm text-muted-foreground">{calc.description}</p>
                        {(calc.category || calc.subCategory) && (
                          <p className="text-xs text-neutral-soft-foreground">
                            {calc.category || 'Calculator'}{' '}
                            {calc.subCategory ? `→ ${calc.subCategory}` : ''}
                          </p>
                        )}
                      </div>
                      {calc.status === 'planned' ? (
                        <Badge variant="secondary" className="text-xs">
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

        {/* Quick Stats */}
        <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
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
        </div>
      </Section>

      {/* Hub Cards Section */}
      <Section className="relative z-10 -mt-16" spacing="lg">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {hubCards.map((card, index) => (
            <a
              key={index}
              href={card.link}
              className="group block transform rounded-lg border border-card-muted bg-card p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl"
            >
              <div className="flex items-center gap-4 mb-2">
                <div className="rounded-full bg-pill p-3 text-pill-foreground">
                  <card.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-foreground transition-colors group-hover:text-primary">
                  {card.title}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">{card.description}</p>
            </a>
          ))}
        </div>
      </Section>

      {/* Featured/Popular Calculators */}
      <Section spacing="lg">
        <div className="mb-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            <Calculator className="mr-2 inline h-9 w-9 text-primary" />
            Popular Calculators
          </h2>
          <p className="text-muted-foreground">
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
                <h3 className="font-semibold text-foreground transition-colors group-hover:text-primary">
                  {calc.name}
                </h3>
              </div>
              <p className="mb-2 text-sm text-muted-foreground">{calc.description}</p>
              <p className="text-xs text-neutral-soft-foreground">{calc.category}</p>
            </Link>
          ))}
        </div>
      </Section>

      {/* Homepage FAQ Section */}
      <Section spacing="xl" width="narrow">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-10">
          Common Questions
        </h2>
        <FAQSection faqs={homepageFaqs} />
      </Section>

      {/* Complete Calculator Directory */}
      <Section className="bg-neutral-soft" spacing="xl">
        <div className="mb-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Complete Calculator Directory
          </h2>
          <p className="mb-6 text-muted-foreground">
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
          <div className="space-y-12">
            {calculatorCategories.map((category) => (
              <div key={category.slug} id={category.slug} className="scroll-mt-20">
                {/* Category Header */}
                <div className="mb-6 flex items-center gap-4 border-b-2 border-card-muted pb-3">
                  <category.icon className="h-8 w-8 text-primary" />
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">
                      {category.name}
                    </h3>
                    <p className="text-muted-foreground">{category.description}</p>
                  </div>
                </div>

                {/* Sub-categories and Calculators */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {category.subCategories.map((subCategory) => (
                    <div key={subCategory.name} className="space-y-3">
                      <h4 className="border-l-4 border-primary pl-3 text-lg font-semibold text-foreground">
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
                                  className="flex-1 text-sm font-medium text-primary transition-colors hover:text-primary/80 hover:underline"
                                >
                                  {calc.name}
                                </Link>
                              ) : (
                                <span className="flex-1 text-sm text-muted-foreground/60">{calc.name}</span>
                              )}
                              {(calc.status === 'planned' || calc.status === 'pending') && (
                                <Badge variant="outline" className="ml-2 text-xs text-primary">
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
          <div className="text-center text-muted-foreground">
            Expand the directory to explore every calculator we offer.
          </div>
        )}

        {/* Quick Stats Footer */}
        <div className="mt-16 rounded-lg border border-card-muted bg-card p-8 text-center">
          <h3 className="text-xl font-semibold text-foreground mb-4">
            Why Choose Our Calculators?
          </h3>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div>
              <div className="mb-2 text-3xl font-bold text-primary">{stats.active}</div>
              <p className="text-muted-foreground">Active Calculators</p>
            </div>
            <div>
              <div className="mb-2 text-3xl font-bold text-hero-accent">100%</div>
              <p className="text-muted-foreground">Free to Use</p>
            </div>
            <div>
              <div className="mb-2 text-3xl font-bold text-brandAqua">2025/26</div>
              <p className="text-muted-foreground">Up-to-Date Tax Rates</p>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
