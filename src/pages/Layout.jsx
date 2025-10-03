import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Menu, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import ScrollToTop from '../components/general/ScrollToTop';
import CookieConsentBanner from '../components/general/CookieConsentBanner';
import { calculatorCategories } from '../components/data/calculatorConfig';
import { pageSeo, defaultOgImage, defaultOgAlt } from '../components/data/pageSeo';
import CalculatorIndex from '../components/general/CalculatorIndex';
import SeoHead from '@/components/seo/SeoHead';
import { SeoProvider } from '@/components/seo/SeoContext';

const COST_OF_LIVING_BASE_PATH = createPageUrl('CostOfLiving');

const faqPages = ['Home', 'SalaryCalculatorUK', 'MortgageCalculator', 'PensionCalculator', 'BudgetCalculator'];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openCategories, setOpenCategories] = useState({});
  const [seoOverrides, setSeoOverrides] = useState({});
  const isHomePage = location.pathname === createPageUrl('Home');

  const costOfLivingBaseSlug = useMemo(
    () => COST_OF_LIVING_BASE_PATH.replace(/^\/+|\/+$/g, ''),
    []
  );

  const getCostOfLivingSlug = useCallback(() => {
    const pathnameSegments = (location.pathname || '')
      .replace(/^\/+|\/+$/g, '')
      .split('/')
      .filter(Boolean);

    if (pathnameSegments[0] === costOfLivingBaseSlug && pathnameSegments[1]) {
      const segment = pathnameSegments[1];
      try {
        return decodeURIComponent(segment).toLowerCase();
      } catch (error) {
        return segment.toLowerCase();
      }
    }

    const params = new URLSearchParams(location.search || '');
    const slugFromQuery = params.get('slug');
    return slugFromQuery ? slugFromQuery.trim().toLowerCase() : '';
  }, [costOfLivingBaseSlug, location.pathname, location.search]);

  const rawOrigin =
    typeof window !== 'undefined' && window.location?.origin
      ? window.location.origin
      : 'https://www.calcmymoney.co.uk';
  const normalizedOrigin = rawOrigin.endsWith('/') ? rawOrigin.slice(0, -1) : rawOrigin;

  const canonicalUrl = useMemo(() => {
    const pathname = location.pathname || '/';
    if (currentPageName === 'Home' || pathname === '/') {
      return `${normalizedOrigin}/`;
    }

    const searchCanonicalPages = new Set(['JobSalaries']);

    if (searchCanonicalPages.has(currentPageName)) {
      const params = new URLSearchParams(location.search || '');
      const slug = params.get('slug');
      const canonicalParams = new URLSearchParams();
      if (slug) {
        canonicalParams.set('slug', slug);
      }
      const search = canonicalParams.toString();
      return `${normalizedOrigin}${pathname}${search ? `?${search}` : ''}`;
    }

    return `${normalizedOrigin}${pathname}`;
  }, [currentPageName, location.pathname, location.search, normalizedOrigin]);

  const pageData = pageSeo[currentPageName] || {};

  const jsonLd = useMemo(() => {
    const schemas = [
      {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Calculate My Money',
        url: `${normalizedOrigin}/`,
        logo: 'https://www.calcmymoney.co.uk/images/logo-high-res.png',
        sameAs: [],
      },
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Calculate My Money',
        url: `${normalizedOrigin}/`,
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${normalizedOrigin}/?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      },
    ];

    if (faqPages.includes(currentPageName)) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'How accurate are your UK salary/tax calculators?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Our calculators are designed for high accuracy, using the latest UK tax laws for the specified tax year (2025/26). They cover Income Tax, National Insurance, and more. While we strive for precision, these tools are for estimation purposes and should not be considered financial advice.',
            },
          },
          {
            '@type': 'Question',
            name: 'Which tax year do the calculators use (2025/26)?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'All relevant financial calculators have been updated for the 2025/26 UK tax year, which runs from 6 April 2025 to 5 April 2026. Rates and thresholds for all UK nations are applied where applicable.',
            },
          },
          {
            '@type': 'Question',
            name: 'Can I download or print the results?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: "Yes. Most of our calculators feature 'Export' or 'Print' buttons, allowing you to download your results as a CSV/PDF file or generate a printer-friendly version of the summary for your records.",
            },
          },
        ],
      });
    }

    return schemas;
  }, [currentPageName, normalizedOrigin]);

  const defaultSeo = useMemo(() => {
    const defaultTitle = 'Calculate My Money - Free UK Financial Calculators';
    const defaultDescription =
      'Your go-to source for free UK financial calculators including salary, tax, mortgage, pension, and budget tools from Calculate My Money. Make smart money decisions.';

    const title = pageData.title || defaultTitle;
    const description = pageData.description || defaultDescription;

    return {
      title,
      description,
      canonical: canonicalUrl,
      robots: pageData.robots || 'index,follow,max-image-preview:large',
      themeColor: '#0b5fff',
      ogTitle: pageData.ogTitle || title,
      ogDescription: pageData.ogDescription || description,
      ogType: pageData.ogType || 'website',
      ogUrl: canonicalUrl,
      ogImage: pageData.ogImage || defaultOgImage,
      ogImageAlt: pageData.ogImageAlt || defaultOgAlt,
      ogSiteName: 'Calculate My Money',
      ogLocale: 'en_GB',
      twitterCard: pageData.twitterCard || 'summary_large_image',
      twitterTitle: pageData.twitterTitle || title,
      twitterDescription: pageData.twitterDescription || description,
      twitterImage: pageData.twitterImage || pageData.ogImage || defaultOgImage,
      twitterImageAlt: pageData.twitterImageAlt || pageData.ogImageAlt || defaultOgAlt,
      jsonLd,
    };
  }, [canonicalUrl, jsonLd, pageData]);

  const setSeo = useCallback((updates) => {
    if (!updates) return;

    setSeoOverrides((prev) => {
      const nextUpdates = typeof updates === 'function' ? updates(prev) : updates;
      if (!nextUpdates) {
        return prev;
      }

      const next = { ...prev };
      let changed = false;

      Object.entries(nextUpdates).forEach(([key, value]) => {
        if (value === undefined) {
          if (key in next) {
            delete next[key];
            changed = true;
          }
          return;
        }

        if (next[key] !== value) {
          next[key] = value;
          changed = true;
        }
      });

      return changed ? next : prev;
    });
  }, []);

  const resetSeo = useCallback(() => {
    setSeoOverrides({});
  }, []);

  useEffect(() => {
    resetSeo();
  }, [location.pathname, location.search, resetSeo]);

  const mergedSeo = useMemo(() => {
    const base = { ...defaultSeo };
    Object.entries(seoOverrides).forEach(([key, value]) => {
      if (value === undefined) {
        return;
      }
      base[key] = value;
    });
    return base;
  }, [defaultSeo, seoOverrides]);

  const seoContextValue = useMemo(
    () => ({ seo: mergedSeo, defaults: defaultSeo, overrides: seoOverrides, setSeo, resetSeo }),
    [mergedSeo, defaultSeo, seoOverrides, setSeo, resetSeo]
  );

  // Toggle category expansion in mobile menu
  const toggleCategory = (categorySlug) => {
    setOpenCategories((prev) => ({
      ...prev,
      [categorySlug]: !prev[categorySlug],
    }));
  };

  // NEW: Fallback H1 control
  const [needsFallbackH1, setNeedsFallbackH1] = useState(false);

  // Which pages should get a fallback H1 if one isn't present in their content
  // CHANGED: memoize for stable ref (fixes missing dependency warning)
  const fallbackH1Pages = React.useMemo(
    () =>
      new Set([
        'Contact',
        'StampDutyCalculator',
        'PAYECalculator',
        'CostOfLiving', // hub page
        'CostOfLivingPage', // dynamic city page
        'StudentLoanRepaymentCalculator',
        'NationalInsuranceCalculator',
      ]),
    []
  );

  // Helper: Title-case a slug (e.g., london -> London)
  const toTitleCase = (str) =>
    (str || '')
      .split('-')
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(' ');

  // Derive a sensible fallback H1 per page
  const getFallbackH1Text = () => {
    switch (currentPageName) {
      case 'Contact':
        return 'Contact Us';
      case 'StampDutyCalculator':
        return 'Stamp Duty Calculator';
      case 'PAYECalculator':
        return 'UK PAYE Calculator';
      case 'CostOfLiving': {
        const slug = getCostOfLivingSlug();
        return slug ? `Cost of Living in ${toTitleCase(slug)}` : 'UK Cost of Living Explorer';
      }
      case 'CostOfLivingPage': {
        const slug = getCostOfLivingSlug();
        return slug ? `Cost of Living in ${toTitleCase(slug)}` : 'UK Cost of Living Explorer';
      }
      case 'StudentLoanRepaymentCalculator':
        return 'Student Loan Repayment Calculator';
      case 'NationalInsuranceCalculator':
        return 'UK National Insurance Calculator';
      default:
        // Fall back to pageSeo title (left part before a pipe) if available
        const pageData = pageSeo[currentPageName];
        if (pageData?.title) {
          return pageData.title.split('|')[0].trim();
        }
        return currentPageName || 'Calculator';
    }
  };

  // Detect if the current page already rendered an H1; only show fallback if none found
  useEffect(() => {
    if (!fallbackH1Pages.has(currentPageName)) {
      setNeedsFallbackH1(false);
      return;
    }
    const mainEl = document.querySelector('main');
    const checkForH1 = () => {
      const hasH1 = !!(mainEl && mainEl.querySelector('h1'));
      setNeedsFallbackH1(!hasH1);
    };
    // Initial check after mount
    checkForH1();

    // Observe for dynamically injected content (e.g., after data fetch)
    const observer = new MutationObserver(() => {
      const hasH1 = !!(mainEl && mainEl.querySelector('h1'));
      if (hasH1) {
        setNeedsFallbackH1(false);
        observer.disconnect();
      } else {
        setNeedsFallbackH1(true);
      }
    });

    if (mainEl) {
      observer.observe(mainEl, { childList: true, subtree: true });
    }
    return () => observer.disconnect();
  }, [currentPageName, location.pathname, fallbackH1Pages]); // CHANGED: added fallbackH1Pages

  useEffect(() => {
    // Add Google Analytics script
    const gaMeasurementId = 'G-ESNP2YRGWB';

    // Performance: preconnect to frequently used domains
    const preconnects = [];
    const addPreconnect = (href) => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = href;
      // crossOrigin="anonymous" is often needed for fonts and other assets served from a different origin,
      // but might not be strictly necessary for all preconnects. Including for consistency based on outline.
      if (href.startsWith('https://')) {
        link.crossOrigin = 'anonymous';
      }
      document.head.appendChild(link);
      preconnects.push(link);
    };

    addPreconnect('https://www.googletagmanager.com');
    addPreconnect('https://images.unsplash.com'); // Example for external image hosts if used
    addPreconnect('https://qtrypzzcjebvfcihiynt.supabase.co'); // For Supabase storage
    addPreconnect('https://xifmvsuddgebmlleggqz.supabase.co'); // For Supabase storage (new og image)

    if (gaMeasurementId.startsWith('G-')) {
      const script1 = document.createElement('script');
      script1.src = `https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`;
      script1.async = true;
      document.head.appendChild(script1);

      const script2 = document.createElement('script');
      script2.innerHTML = `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaMeasurementId}');
        `;
      document.head.appendChild(script2);

      return () => {
        // Clean up scripts on component unmount
        if (document.head.contains(script1)) {
          document.head.removeChild(script1);
        }
        if (document.head.contains(script2)) {
          document.head.removeChild(script2);
        }
        // Clean up preconnects
        preconnects.forEach((link) => {
          if (document.head.contains(link)) document.head.removeChild(link);
        });
      };
    }
  }, []);

  useEffect(() => {
    // Fire calculator_view for calculator-like pages (simple heuristic)
    if (typeof window !== 'undefined' && window.gtag && /Calculator/i.test(currentPageName || '')) {
      window.gtag('event', 'calculator_view', {
        page_name: currentPageName,
        page_path: window.location.pathname,
        page_title: document.title,
      });
    }
  }, [currentPageName]);

  const mainNavLinks = [
    { name: 'All Calculators', url: createPageUrl('home') },
    { name: 'Job Salaries', url: createPageUrl('job-salaries') },
    { name: 'Cost of Living', url: createPageUrl('cost-of-living') },
    { name: 'Financial Stats', url: createPageUrl('uk-financial-stats') },
    { name: 'Blog', url: createPageUrl('blog') },
    { name: 'Resources', url: createPageUrl('resources') },
  ];

  return (
    <SeoProvider value={seoContextValue}>
      <div className="min-h-screen bg-gray-50 text-gray-800">
        <ScrollToTop />
        <SeoHead {...mergedSeo} />
      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }
        * {
          transition:
            background-color 0.3s ease,
            color 0.3s ease,
            border-color 0.3s ease;
        }
        @media print {
          html {
            scroll-behavior: auto;
          }
          .non-printable {
            display: none !important;
          }
          .printable-area {
            display: block !important;
            width: 100% !important;
            max-width: 100% !important;
            flex: 1 !important;
          }
          .printable-grid-cols-1 {
            grid-template-columns: 1fr !important;
          }
          .printable-content {
            padding: 0 !important;
            margin: 0 !important;
          }
          .print-title {
            display: block !important;
            text-align: center;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 2rem;
          }
        }
      `}</style>

        {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm sticky top-0 z-40 border-b border-gray-200 non-printable">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <Link to={createPageUrl('Home')} className="flex items-center space-x-2">
                               {' '}
                <img src="/app-icon.webp" alt="Calculate My Money Logo" className="h-8 w-8" />     
                 <span className="font-bold text-xl text-gray-800">Calculate My Money</span>       
                     {' '}
              </Link>
            </div>

            {/* Desktop Navigation - Simple Links */}
            <div className="hidden md:flex md:items-center md:space-x-6">
              {mainNavLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.url}
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-gray-600">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="bg-white border-gray-200 w-[300px] sm:w-[340px] overflow-y-auto">
                  <SheetHeader>
                    <Link
                      to={createPageUrl('Home')}
                      className="flex items-center space-x-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <img
                        src="https://www.calcmymoney.co.uk/images/logo-high-res.png"
                        alt="Calculate My Money Logo"
                        className="h-8 w-8"
                      />
                      <span className="font-bold text-xl text-gray-800">Calculate My Money</span>
                    </Link>
                  </SheetHeader>

                  <div className="mt-6">
                    {/* Main Navigation Links */}
                    <div className="space-y-4 mb-6">
                      {mainNavLinks.map((link) => (
                        <SheetClose key={link.name} asChild>
                          <Link
                            to={link.url}
                            className="block text-lg font-medium text-gray-700 hover:text-blue-600 py-2"
                          >
                            {link.name}
                          </Link>
                        </SheetClose>
                      ))}
                    </div>

                    <Separator className="my-4" />

                    {/* Calculator Categories with Collapsibles */}
                    <div className="space-y-2">
                      <h3 className="font-semibold text-gray-900 mb-3">Browse Calculators</h3>
                      {calculatorCategories.map((category) => (
                        <Collapsible
                          key={category.slug}
                          open={openCategories[category.slug]}
                          onOpenChange={() => toggleCategory(category.slug)}
                        >
                          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 text-left hover:bg-gray-50 rounded-lg transition-colors">
                            <div className="flex items-center gap-2">
                              <category.icon className="w-4 h-4 text-gray-600" />
                              <span className="font-medium text-gray-800">{category.name}</span>
                            </div>
                            {openCategories[category.slug] ? (
                              <ChevronDown className="w-4 h-4 text-gray-500" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-gray-500" />
                            )}
                          </CollapsibleTrigger>
                          <CollapsibleContent className="pl-6 mt-2 space-y-3">
                            {category.subCategories.map((subCategory) => (
                              <div key={subCategory.name} className="space-y-2">
                                <h4 className="text-sm font-medium text-gray-700 border-b border-gray-200 pb-1">
                                  {subCategory.name}
                                </h4>
                                <div className="space-y-1 pl-2">
                                  {subCategory.calculators.map((calc) => (
                                    <SheetClose key={calc.name} asChild>
                                      <Link
                                        to={calc.url}
                                        className={`block text-sm py-1 transition-colors ${
                                          calc.status === 'active'
                                            ? 'text-gray-600 hover:text-blue-600'
                                            : 'text-gray-400 cursor-not-allowed'
                                        }`}
                                      >
                                        {calc.name}{' '}
                                        {calc.status === 'planned' && (
                                          <span className="text-xs">(soon)</span>
                                        )}
                                      </Link>
                                    </SheetClose>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </CollapsibleContent>
                        </Collapsible>
                      ))}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 printable-content bg-gray-50">
        {/* NEW: Fallback H1 (only shows if page has no H1 and is one of the designated fallback pages) */}
        {needsFallbackH1 && fallbackH1Pages.has(currentPageName) && (
          <div className="bg-white border-b border-gray-200 non-printable">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                {getFallbackH1Text()}
              </h1>
            </div>
          </div>
        )}
        {children}
      </main>

      {/* NEW: Global collapsed calculator index to add strong internal linking */}
      <CalculatorIndex />

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16 non-printable">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-5 gap-8">
            <div className="md:col-span-1">
              <Link to={createPageUrl('Home')} className="flex items-center space-x-2 mb-4">
                <img
                  src="https://www.calcmymoney.co.uk/images/logo-high-res.png"
                  alt="Calculate My Money Logo"
                  className="h-8 w-8"
                />
                <span className="font-bold text-xl text-gray-800">Calculate My Money</span>
              </Link>
              <p className="text-gray-600 text-sm">
                Free UK financial calculators for salary, tax, mortgages, pensions, budgets and
                investments.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Popular Calculators</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to={createPageUrl('salary-calculator-uk')}
                    className="text-gray-700 hover:text-blue-600 hover:underline"
                  >
                    Salary Calculator
                  </Link>
                </li>
                <li>
                  <Link
                    to={createPageUrl('mortgage-calculator')}
                    className="text-gray-700 hover:text-blue-600 hover:underline"
                  >
                    Mortgage Calculator
                  </Link>
                </li>
                <li>
                  <Link
                    to={createPageUrl('budget-calculator')}
                    className="text-gray-700 hover:text-blue-600 hover:underline"
                  >
                    Budget Planner
                  </Link>
                </li>
                <li>
                  <Link
                    to={createPageUrl('compound-interest-calculator')}
                    className="text-gray-700 hover:text-blue-600 hover:underline"
                  >
                    Compound Interest
                  </Link>
                </li>
                <li>
                  <Link
                    to={createPageUrl('pension-calculator')}
                    className="text-gray-700 hover:text-blue-600 hover:underline"
                  >
                    Pension Calculator
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Categories</h4>
              <ul className="space-y-2 text-gray-600">
                {calculatorCategories.slice(0, 6).map((category) => (
                  <li key={category.slug}>
                    {isHomePage ? (
                      <a
                        href={`#${category.slug}`}
                        className="text-gray-700 hover:text-blue-600 hover:underline"
                      >
                        {category.name}
                      </a>
                    ) : (
                      <Link
                        to={`${createPageUrl('Home')}#${category.slug}`}
                        className="text-gray-700 hover:text-blue-600 hover:underline"
                      >
                        {category.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Information</h4>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <Link to={createPageUrl('About')} className="hover:text-blue-600">
                    About
                  </Link>
                </li>
                <li>
                  <Link to={createPageUrl('methodology')} className="hover:text-blue-600">
                    Methodology
                  </Link>
                </li>
                <li>
                  <Link to={createPageUrl('blog')} className="hover:text-blue-600">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link to={createPageUrl('resources')} className="hover:text-blue-600">
                    Resources
                  </Link>
                </li>
                <li>
                  <Link to={createPageUrl('uk-government-budget')} className="hover:text-blue-600">
                    UK Budget Analysis
                  </Link>
                </li>
                <li>
                  <Link to={createPageUrl('job-salaries')} className="hover:text-blue-600">
                    Job Salaries
                  </Link>
                </li>
                <li>
                  <Link to={createPageUrl('cost-of-living')} className="hover:text-blue-600">
                    Cost of Living
                  </Link>
                </li>
                <li>
                  <Link to={createPageUrl('uk-financial-stats')} className="hover:text-blue-600">
                    Financial Stats
                  </Link>
                </li>
                <li>
                  <Link to={createPageUrl('contact')} className="hover:text-blue-600">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link to={createPageUrl('sitemap')} className="hover:text-blue-600">
                    Sitemap
                  </Link>
                </li>
                <li>
                  <Link to={createPageUrl('link-to-us')} className="hover:text-blue-600">
                    Link to Us
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <Link to={createPageUrl('privacy-policy')} className="hover:text-blue-600">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to={createPageUrl('cookie-policy')} className="hover:text-blue-600">
                    Cookie Policy
                  </Link>
                </li>
                <li>
                  <Link to={createPageUrl('terms-of-service')} className="hover:text-blue-600">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to={createPageUrl('disclaimer')} className="hover:text-blue-600">
                    Disclaimer
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-500 text-sm">
            <p>&copy; 2025 Calculate My Money - UK Financial Calculator Tools</p>
          </div>
        </div>
      </footer>

        <CookieConsentBanner />
      </div>
    </SeoProvider>
  );
}
