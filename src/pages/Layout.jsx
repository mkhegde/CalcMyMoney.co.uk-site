import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Menu, ChevronDown, ChevronRight, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuIndicator,
} from '@/components/ui/navigation-menu';
import ScrollToTop from '../components/general/ScrollToTop';
import CookieConsentBanner from '../components/general/CookieConsentBanner';
import { calculatorCategories } from '../components/data/calculatorConfig';
import { pageSeo, defaultOgImage, defaultOgAlt } from '../components/data/pageSeo';
import CalculatorIndex from '../components/general/CalculatorIndex';
import RelatedAuto from '@/components/calculators/RelatedAuto';
import SeoHead from '@/components/seo/SeoHead';
import { SeoProvider } from '@/components/seo/SeoContext';

import Heading from '@/components/common/Heading';
const COST_OF_LIVING_BASE_PATH = createPageUrl('CostOfLiving');

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
        logo: 'https://www.calcmymoney.co.uk/logo-high-res.png',
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
      articlePublishedTime: pageData.publishedTime,
      articleModifiedTime: pageData.modifiedTime || pageData.publishedTime,
      articleSection: pageData.section,
      articleAuthor: pageData.author,
      articleTags: pageData.tags,
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

  const isActiveLink = useCallback(
    (url) => {
      if (!url) return false;
      if (url === '/') {
        return location.pathname === '/' || location.pathname === '';
      }
      return location.pathname === url || location.pathname.startsWith(`${url}/`);
    },
    [location.pathname]
  );

  const navLinkBaseClass =
    'relative inline-flex items-center px-1 py-2 text-sm font-semibold text-muted-foreground transition-all duration-200 after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 hover:text-foreground hover:after:scale-x-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background';

  return (
    <SeoProvider value={seoContextValue}>
      <div className="min-h-screen bg-background text-foreground">
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
        <header className="sticky top-0 z-40 border-b border-border/70 bg-background/95 backdrop-blur-sm non-printable">
          <nav className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex-shrink-0">
              <Link to={createPageUrl('Home')} className="flex items-center space-x-2">
                               {' '}
                <img src="/app-icon.webp" alt="Calculate My Money Logo" className="h-8 w-8" /> 
                <span className="text-xl font-bold text-foreground">Calculate My Money</span>   
                 {' '}
              </Link>
            </div>

            {/* Desktop Navigation */}
            <NavigationMenu className="ml-6 hidden md:flex items-center">
              <NavigationMenuList className="flex items-center gap-1">
                {mainNavLinks.map((link) => {
                  const active = isActiveLink(link.url);
                  return (
                    <NavigationMenuItem key={link.name}>
                      <NavigationMenuLink asChild>
                        <Link
                          to={link.url}
                          className={`${navLinkBaseClass} ${active ? 'text-foreground after:scale-x-100' : ''}`}
                          aria-current={active ? 'page' : undefined}
                        >
                          {link.name}
                        </Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  );
                })}
              </NavigationMenuList>
              <NavigationMenuIndicator className="hidden md:flex" />
            </NavigationMenu>

            {/* Mobile Menu Button */}
            <div className="flex items-center md:hidden">
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-muted-foreground">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-[300px] overflow-y-auto border-border bg-background sm:w-[340px]">
                  <SheetHeader>
                    <Link
                      to={createPageUrl('Home')}
                      className="flex items-center space-x-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <img
                        src="/logo-high-res.png"
                        alt="Calculate My Money Logo"
                        className="h-8 w-8"
                      />
                      <span className="text-xl font-bold text-foreground">Calculate My Money</span>
                    </Link>
                  </SheetHeader>

                  <div className="mt-6">
                    {/* Main Navigation Links */}
                    <div className="space-y-4 mb-6">
                      {mainNavLinks.map((link) => (
                        <SheetClose key={link.name} asChild>
                          <Link
                            to={link.url}
                            className="block py-2 text-lg font-medium text-muted-foreground transition-colors hover:text-primary"
                          >
                            {link.name}
                          </Link>
                        </SheetClose>
                      ))}
                    </div>

                    <Separator className="my-4" />

                    {/* Calculator Categories with Collapsibles */}
                    <div className="space-y-2">
                      <h3 className="mb-3 font-semibold text-foreground">Browse Calculators</h3>
                      {calculatorCategories.map((category) => (
                        <Collapsible
                          key={category.slug}
                          open={openCategories[category.slug]}
                          onOpenChange={() => toggleCategory(category.slug)}
                        >
                          <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg p-2 text-left transition-colors hover:bg-neutral-soft">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <category.icon className="h-4 w-4" />
                              <span className="font-medium text-foreground">{category.name}</span>
                            </div>
                            {openCategories[category.slug] ? (
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            )}
                          </CollapsibleTrigger>
                          <CollapsibleContent className="pl-6 mt-2 space-y-3">
                            {category.subCategories.map((subCategory) => (
                              <div key={subCategory.name} className="space-y-2">
                                <h4 className="border-b border-card-muted pb-1 text-sm font-medium text-muted-foreground">
                                  {subCategory.name}
                                </h4>
                                <div className="space-y-1 pl-2">
                                  {subCategory.calculators.map((calc) => (
                                    <SheetClose key={calc.name} asChild>
                                      <Link
                                        to={calc.url}
                                        className={`block py-1 text-sm transition-colors ${
                                          calc.status === 'active'
                                            ? 'text-muted-foreground hover:text-primary'
                                            : 'cursor-not-allowed text-muted-foreground/60'
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
          </nav>
        </header>

        {/* Main Content */}
        <main className="flex-1 bg-background printable-content">
          {/* NEW: Fallback H1 (only shows if page has no H1 and is one of the designated fallback pages) */}
          {needsFallbackH1 && fallbackH1Pages.has(currentPageName) && (
            <div className="non-printable border-b border-border bg-card">
              <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <Heading as="h1" size="h1" weight="bold" className="text-foreground">
                  {getFallbackH1Text()}
                </Heading>
              </div>
            </div>
          )}
          {children}
          {/* Auto-related calculators for calculator pages */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
            <RelatedAuto />
          </div>
        </main>

        {/* NEW: Global collapsed calculator index to add strong internal linking */}
        <CalculatorIndex />

        {/* Footer */}
        <footer className="mt-16 border-t border-border bg-background non-printable">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-5 gap-8">
              <div className="md:col-span-1">
                <Link to={createPageUrl('Home')} className="flex items-center space-x-2 mb-4">
                  <img src="/logo-high-res.png" alt="Calculate My Money Logo" className="h-8 w-8" />
                  <span className="text-xl font-bold text-foreground">Calculate My Money</span>
                </Link>
                <p className="text-sm text-muted-foreground">
                  Free UK financial calculators for salary, tax, mortgages, pensions, budgets and
                  investments.
                </p>
              </div>

              <div>
                <h4 className="mb-4 font-semibold text-foreground">Popular Calculators</h4>
                <ul className="space-y-2">
                  <li>
                    <Link
                      to={createPageUrl('salary-calculator-uk')}
                      className="text-muted-foreground transition-colors hover:text-primary hover:underline"
                    >
                      Salary Calculator
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={createPageUrl('mortgage-calculator')}
                      className="text-muted-foreground transition-colors hover:text-primary hover:underline"
                    >
                      Mortgage Calculator
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={createPageUrl('budget-calculator')}
                      className="text-muted-foreground transition-colors hover:text-primary hover:underline"
                    >
                      Budget Planner
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={createPageUrl('compound-interest-calculator')}
                      className="text-muted-foreground transition-colors hover:text-primary hover:underline"
                    >
                      Compound Interest
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={createPageUrl('pension-calculator')}
                      className="text-muted-foreground transition-colors hover:text-primary hover:underline"
                    >
                      Pension Calculator
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="mb-4 font-semibold text-foreground">Categories</h4>
                <ul className="space-y-2 text-muted-foreground">
                  {calculatorCategories.slice(0, 6).map((category) => (
                    <li key={category.slug}>
                      {isHomePage ? (
                        <a
                          href={`#${category.slug}`}
                          className="text-muted-foreground transition-colors hover:text-primary hover:underline"
                        >
                          {category.name}
                        </a>
                      ) : (
                        <Link
                          to={`${createPageUrl('Home')}#${category.slug}`}
                          className="text-muted-foreground transition-colors hover:text-primary hover:underline"
                        >
                          {category.name}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="mb-4 font-semibold text-foreground">Information</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>
                    <Link
                      to={createPageUrl('About')}
                      className="transition-colors hover:text-primary"
                    >
                      About
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={createPageUrl('methodology')}
                      className="transition-colors hover:text-primary"
                    >
                      Methodology
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={createPageUrl('blog')}
                      className="transition-colors hover:text-primary"
                    >
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={createPageUrl('resources')}
                      className="transition-colors hover:text-primary"
                    >
                      Resources
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={createPageUrl('uk-government-budget')}
                      className="transition-colors hover:text-primary"
                    >
                      UK Budget Analysis
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={createPageUrl('job-salaries')}
                      className="transition-colors hover:text-primary"
                    >
                      Job Salaries
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={createPageUrl('cost-of-living')}
                      className="transition-colors hover:text-primary"
                    >
                      Cost of Living
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={createPageUrl('uk-financial-stats')}
                      className="transition-colors hover:text-primary"
                    >
                      Financial Stats
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={createPageUrl('contact')}
                      className="transition-colors hover:text-primary"
                    >
                      Contact Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={createPageUrl('sitemap')}
                      className="transition-colors hover:text-primary"
                    >
                      Sitemap
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={createPageUrl('link-to-us')}
                      className="transition-colors hover:text-primary"
                    >
                      Link to Us
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="mb-4 font-semibold text-foreground">Legal</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>
                    <Link
                      to={createPageUrl('privacy-policy')}
                      className="transition-colors hover:text-primary"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={createPageUrl('cookie-policy')}
                      className="transition-colors hover:text-primary"
                    >
                      Cookie Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={createPageUrl('terms-of-service')}
                      className="transition-colors hover:text-primary"
                    >
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={createPageUrl('disclaimer')}
                      className="transition-colors hover:text-primary"
                    >
                      Disclaimer
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
              <p>&copy; 2025 Calculate My Money - UK Financial Calculator Tools</p>
            </div>
          </div>
        </footer>

        <CookieConsentBanner />
      </div>
    </SeoProvider>
  );
}
