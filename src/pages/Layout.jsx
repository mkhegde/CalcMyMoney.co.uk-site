import React, { useState, useEffect } from 'react';
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
import CalculatorIndex from '../components/general/CalculatorIndex';

// Define a mapping for page names to titles and descriptions for SEO
// This object will be used to programmatically set SEO meta tags for each page.
// In a larger application, this data might come from a CMS or a more complex routing configuration.
const pageSeo = {
  Home: {
    title: 'UK Salary, Tax & Mortgage Calculators | Calculate My Money',
    description:
      'Free UK calculators for take-home pay, tax, NI, mortgages, savings and ROI. Fast, accurate tools for 2025/26.',
  },
  Resources: {
    title: 'Financial Resources & Guides | Calculate My Money',
    description:
      'Explore our financial resources and guides on Calculate My Money. Learn about tax, savings, investments, and personal finance in the UK.',
  },
  Blog: {
    title: 'Financial Blog | Insights & Articles - Calculate My Money',
    description:
      'Read the latest articles and insights on UK personal finance, tax, budgeting, and investment strategies from the Calculate My Money blog.',
  },
  BlogSmartMoneySavingTips: {
    title: 'Smart Money-Saving Tips for UK Families | Calculate My Money',
    description:
      'Discover practical tips for UK families to save money on groceries, energy bills, and everyday expenses. A complete guide to cut costs and budget effectively.',
  },
  BlogDebtRepaymentStrategies: {
    title: 'Debt Snowball vs. Avalanche in the UK | Calculate My Money',
    description:
      'Compare the Debt Snowball and Debt Avalanche methods. Find the best strategy to pay off your debts in the UK, from credit cards to loans.',
  },
  BlogFinancialPsychology: {
    title: 'Your Relationship with Money: A Guide to Financial Psychology',
    description:
      'Understand the psychology behind your spending and saving habits. Learn how your money mindset impacts your financial health and future prosperity in the UK.',
  },
  Contact: {
    title: 'Contact Us | Calculate My Money',
    description:
      "Get in touch with Calculate My Money for support, feedback, or business inquiries. We're here to help with your financial calculator needs.",
  },
  PrivacyPolicy: {
    title: 'Privacy Policy | Calculate My Money',
    description:
      'Understand our Privacy Policy at Calculate My Money. Learn how we collect, use, and protect your personal data.',
  },
  CookiePolicy: {
    title: 'Cookie Policy | Calculate My Money',
    description:
      'Review our Cookie Policy at Calculate My Money to understand how we use cookies on our website.',
  },
  TermsOfService: {
    title: 'Terms of Service | Calculate My Money',
    description:
      'Read the Terms of Service for Calculate My Money. By using our website, you agree to these terms.',
  },
  Disclaimer: {
    title: 'Disclaimer | Calculate My Money',
    description:
      'Important disclaimer regarding the use of financial calculators and information provided on Calculate My Money.',
  },
  Sitemap: {
    title: 'Sitemap | Calculate My Money',
    description:
      'Browse the sitemap for Calculate My Money to find all available financial calculators and resources.',
  },
  SalaryCalculatorUK: {
    title: 'UK Salary Calculator (Take-Home Pay 2025/26)',
    description:
      'Calculate your UK take-home pay after tax and NI for 2025/26. Includes paycheck, pro-rata and gross-to-net tools.',
  },
  SalaryCalculatorTakeHomePay: {
    title: 'Take-Home Pay Calculator UK (2025/26)',
    description: 'Estimate UK take-home pay after tax, NI, pension & student loans for 2025/26.',
  },
  SalaryCalculatorPaycheck: {
    title: 'Paycheck Calculator UK (After Tax & NI)',
    description:
      'Work out your UK paycheck after tax and NI. Supports weekly, fortnightly and monthly pay.',
  },
  GrossToNetCalculator: {
    title: 'Gross to Net Income Calculator UK',
    description: 'Convert gross salary to net take-home pay with UK tax and NI for 2025/26.',
  },
  ProRataSalaryCalculator: {
    title: 'Pro-Rata Salary Calculator UK',
    description: 'Convert annual salary to pro-rata pay by hours or days worked in the UK.',
  },
  MortgageCalculator: {
    title: 'UK Mortgage Calculator | Repayments & Affordability - Calculate My Money',
    description:
      'Estimate your UK mortgage repayments and check affordability with our free mortgage calculator. See monthly costs, interest, and the full amortization schedule.',
  },
  BudgetCalculator: {
    title: 'Budget Planner UK | Free Online Budgeting Tool - Calculate My Money',
    description:
      'Create a personal budget with our free UK budget planner. Track income and expenses to manage your finances effectively.',
  },
  CompoundInterestCalculator: {
    title: 'Compound Interest Calculator UK | Grow Your Savings - Calculate My Money',
    description:
      'See how your savings can grow with our UK compound interest calculator. Plan for future investments and financial goals.',
  },
  PensionCalculator: {
    title: 'UK Pension Calculator | Plan Your Retirement - Calculate My Money',
    description:
      'Estimate your future pension income with our UK pension calculator. Plan for a secure retirement.',
  },
  NationalInsuranceCalculator: {
    title: 'UK National Insurance Calculator 2025/26 | Calculate Your NI',
    description:
      "Calculate your UK National Insurance contributions for the 2025/26 tax year. Our free NI calculator shows you exactly what you'll pay based on your salary.",
  },
  MaternityPayCalculator: {
    title: 'Statutory Maternity Pay Calculator UK 2025 | SMP Estimator',
    description:
      "Estimate your Statutory Maternity Pay (SMP) with our free UK calculator. See how much you'll receive for the 39 weeks of your maternity leave.",
  },
  InflationCalculator: {
    title: 'UK Inflation Calculator | Calculate the Changing Value of Money',
    description:
      'See how the value of the pound has changed over time with our free UK inflation calculator. Compare the purchasing power of money between any two years.',
  },
  IncomeTaxCalculator: {
    title: 'UK Income Tax Calculator 2025/26 | Calculate Your Tax Bill - Calculate My Money',
    description:
      'Calculate your income tax for 2025/26 with our free UK tax calculator. Covers tax bands for England, Scotland, Wales & NI. Find out your true tax liability.',
  },
  SalaryIncreaseCalculator: {
    title: 'Salary Increase Calculator UK | See Your New Pay - Calculate My Money',
    description:
      'Calculate how a percentage-based pay rise will affect your annual and monthly gross income with our simple salary increase calculator.',
  },
  SimpleInterestCalculator: {
    title: 'Simple Interest Calculator UK | Calculate My Money',
    description:
      'Use our simple interest calculator to quickly determine the interest earned on a principal sum over a fixed period without compounding.',
  },
  EffectiveTaxRateCalculator: {
    title: 'Effective Tax Rate Calculator UK | Your True Tax Rate - Calculate My Money',
    description:
      'Find your true, overall tax burden. Our calculator shows your effective tax rate after factoring in your personal allowance, income tax, and NI.',
  },
  HomeEquityLoanCalculator: {
    title: 'Home Equity Loan Calculator UK | How Much Can You Borrow? - Calculate My Money',
    description:
      'Estimate how much equity you can borrow from your home with our free UK home equity loan calculator. Understand your LTV and available funds.',
  },
  AnnuityCalculator: {
    title: 'Annuity Calculator UK | Estimate Your Retirement Income - Calculate My Money',
    description:
      'Use our annuity calculator to estimate the guaranteed income you could receive from your pension pot for a fixed term or for life.',
  },
  CommissionCalculator: {
    title: 'Commission Calculator UK | Calculate Sales Earnings - Calculate My Money',
    description:
      'Easily calculate your gross commission earnings based on sales revenue and commission percentage with our free online tool.',
  },
  DividendTaxCalculator: {
    title: 'UK Dividend Tax Calculator 2024/25 | Calculate My Money',
    description:
      'Estimate your tax liability on dividend income for the 2024/25 tax year. Accounts for allowances and income tax bands.',
  },
  FutureValueCalculator: {
    title: "Future Value Calculator | Project Your Investment's Worth - Calculate My Money",
    description:
      'Calculate the future value of a single lump-sum investment based on a constant interest rate over a specific period.',
  },
  OvertimePayCalculator: {
    title: 'Overtime Pay Calculator UK | Calculate Your Extra Earnings - Calculate My Money',
    description:
      'Work out your gross pay including overtime hours. Set your standard rate, overtime hours, and pay multiplier to see your total earnings.',
  },
  LoanComparisonCalculator: {
    title: 'Loan Comparison Calculator UK | Find The Better Deal - Calculate My Money',
    description:
      'Compare two loan offers side-by-side to determine the true cost. Analyze monthly payments, total interest, and the total amount repaid.',
  },
  InheritanceTaxCalculator: {
    title: 'Inheritance Tax Calculator UK | IHT Estimator - Calculate My Money',
    description:
      'Estimate your potential Inheritance Tax (IHT) liability with our easy-to-use UK calculator. Understand the nil-rate bands.',
  },
  CouncilTaxCalculator: {
    title: 'Council Tax Calculator UK | Estimate Your Bill - Calculate My Money',
    description:
      "Get an estimate of your annual Council Tax bill based on your property's band. Covers average rates for England.",
  },
  MortgageRepaymentCalculator: {
    title: 'Mortgage Repayment Schedule Calculator | Amortization - Calculate My Money',
    description:
      'Generate a full mortgage repayment (amortization) schedule. See the breakdown of principal and interest and interest for each payment.',
  },
  FirstTimeBuyerCalculator: {
    title: 'First-Time Buyer Calculator UK | Affordability & Costs - Calculate My Money',
    description:
      'Assess your affordability as a first-time buyer. Calculate your loan-to-income ratio, deposit percentage, and estimated stamp duty.',
  },
  RentVsBuyCalculator: {
    title: 'Rent vs Buy Calculator UK | Financial Comparison - Calculate My Money',
    description:
      'Compare the estimated monthly costs of renting a property versus buying a home to help you make an informed financial decision.',
  },
  HouseholdBillsSplitter: {
    title: 'Household Bill Splitter Calculator | Calculate My Money',
    description:
      'Easily split rent, utilities, and other shared household expenses between multiple people with our simple bill splitting tool.',
  },
  CommuteCostCalculator: {
    title: 'Commute Cost Calculator UK | Fuel & Transport Costs - Calculate My Money',
    description:
      'Calculate the weekly and monthly cost of your commute, factoring in fuel consumption, prices, and public transport expenses.',
  },
  CarCostCalculator: {
    title: 'True Cost of Car Ownership Calculator UK | Calculate My Money',
    description:
      'Calculate the total cost of owning a car, including depreciation, fuel, insurance, tax, and maintenance over your ownership term.',
  },
  SubscriptionCostCalculator: {
    title: 'Subscription Cost Calculator | Track Your Spending - Calculate My Money',
    description:
      'Track all your monthly and annual subscriptions in one place to see the total cost and find areas to save money.',
  },
  RuleOf72Calculator: {
    title: 'Rule of 72 Calculator | Doubling Time for Investments - Calculate My Money',
    description:
      'Use the Rule of 72 to quickly estimate how many years it will take for your investment to double at a given rate of return.',
  },
  StudentLoanRepaymentCalculator: {
    title: 'Student Loan Repayment Calculator UK (All Plans) | Calculate My Money',
    description:
      'Calculate your estimated monthly and annual student loan repayments based on your salary and specific UK loan plan (Plan 1, 2, 4, 5, or Postgraduate).',
  },
  WeddingBudgetCalculator: {
    title: 'Wedding Budget Calculator & Tracker | Calculate My Money',
    description:
      'Plan and track your wedding expenses with our comprehensive budget calculator. Manage your spending across all categories.',
  },
  TravelBudgetCalculator: {
    title: 'Travel & Holiday Budget Calculator | Calculate My Money',
    description:
      'Plan your next holiday with our easy-to-use travel budget calculator. Estimate costs for flights, accommodation, food, and activities.',
  },
  ChildcareCostCalculator: {
    title: 'Childcare Cost Calculator UK | Nursery Fees Estimator - Calculate My Money',
    description:
      'Estimate the weekly, monthly, and annual cost of childcare based on daily rates and the number of days required.',
  },
  TipCalculator: {
    title: 'UK Tip & Bill Splitting Calculator | Calculate My Money',
    description:
      'Easily calculate a tip and split the total bill between any number of people. Perfect for dining out in the UK.',
  },
  OvertimeRateCalculator: {
    title: 'Overtime Rate Calculator UK | Calculate My Money',
    description:
      'Calculate your hourly pay rate for overtime work based on your standard rate and contract multiplier (e.g., time-and-a-half).',
  },
  CurrencyConverter: {
    title: 'Currency Converter & Exchange Rate Hub | Calculate My Money',
    description:
      'Understand currency exchange and find links to reliable, live exchange rates for GBP, USD, EUR, and more. An educational tool for travellers and investors.',
  },
  UKGovernmentBudget: {
    title: 'UK Government Budget Analysis | Calculate My Money',
    description:
      'Detailed analysis of the latest UK Government Budget announcements and their impact on your finances and calculators.',
  },
  UKFinancialStats: {
    title: 'Live UK Financial Statistics Dashboard | BoE Rate, Inflation, House Prices',
    description:
      'Track key UK economic indicators in real-time. Our dashboard provides the latest Bank of England interest rate, inflation (CPI), house prices, and more.',
  },
  JobSalaries: {
    title: 'Average Job Salaries UK | By Industry & Region - Calculate My Money',
    description:
      'Discover average job salaries across various industries and regions in the UK. Compare earnings and career prospects with our tools.',
  },
  CostOfLiving: {
    title: 'Cost of Living UK | City & Regional Breakdown - Calculate My Money',
    description:
      'Explore the cost of living in various UK cities and regions. Understand typical expenses for housing, food, and transport with our data.',
  },
  Methodology: {
    title: 'Methodology & Data Sources (HMRC, BoE) | Calculate My Money',
    description:
      'How we calculate UK salary, tax and mortgage results. Data sources: HMRC 2025/26, Bank of England.',
  },
  About: {
    title: 'About Calculate My Money – UK Financial Calculators',
    description: 'Who we are and how we build accurate, transparent UK financial calculators.',
  },
  TaxCalculatorsUK: {
    title: 'UK Tax Calculators Hub | Income Tax, NI, Net Income',
    description:
      'Explore UK tax tools for 2025/26: Income Tax after tax, Tax + NI, Net Income and Self Assessment guides.',
  },
  TaxAfterTaxCalculator: {
    title: 'Tax After Tax Calculator UK | 2025/26',
    description:
      'Work out your UK tax after tax for the 2025/26 year. Clear band-by-band breakdowns.',
  },
  TaxAndNICalculator: {
    title: 'Tax and NI Calculator UK | Combined Deductions 2025/26',
    description: 'Calculate combined UK Income Tax and National Insurance for 2025/26.',
  },
  NetIncomeUKCalculator: {
    title: 'Net Income Calculator UK | Take-Home After Tax & NI',
    description: 'Estimate your UK net income after tax and NI deductions for 2025/26.',
  },
  SelfAssessmentGuide: {
    title: 'UK Self Assessment Guide | Deadlines, Rates, Tips',
    description:
      'Understand UK Self Assessment: deadlines, allowances, rates and tips for 2025/26.',
  },
  MortgageCalculatorUK: {
    title: 'UK Mortgage Calculators Hub | Repayments, Comparison',
    description:
      'Explore UK mortgage tools: loan repayment, comparisons, and home loan calculators for 2025/26.',
  },
  MortgageLoanRepayment: {
    title: 'Mortgage Loan Repayment Calculator UK',
    description: 'Estimate monthly mortgage repayments and total interest across the term.',
  },
  HomeLoanMortgageCalculator: {
    title: 'Home Loan Mortgage Calculator UK',
    description: 'Quick home loan mortgage estimates: payments by rate, term and deposit.',
  },
  MortgageComparison: {
    title: 'Mortgage Comparison Calculator UK',
    description: 'Compare two mortgage deals side-by-side. See total costs and savings.',
  },
  // Add entries for other specific pages/calculators here following the same pattern
};

// ---- OG/Twitter images for key salary pages (merge without replacing other entries) ----
const CDN = 'https://xifmvsuddgebmlleggqz.supabase.co/storage/v1/object/public/CalcMyMoney.co.uk';

pageSeo.SalaryCalculatorUK = {
  ...pageSeo.SalaryCalculatorUK,
  ogImage: `${CDN}/og-final-salary-hub.png`,
  ogImageAlt: 'UK Salary Calculator – Take-Home Pay (2025/26)',
};

pageSeo.SalaryCalculatorTakeHomePay = {
  ...pageSeo.SalaryCalculatorTakeHomePay,
  ogImage: `${CDN}/og-final-take-home.png`,
  ogImageAlt: 'Take-Home Pay Calculator UK (2025/26)',
};

pageSeo.SalaryCalculatorPaycheck = {
  ...pageSeo.SalaryCalculatorPaycheck,
  ogImage: `${CDN}/og-final-paycheck.png`,
  ogImageAlt: 'Paycheck Calculator UK – After Tax & NI',
};

pageSeo.GrossToNetCalculator = {
  ...pageSeo.GrossToNetCalculator,
  ogImage: `${CDN}/og-final-gross-to-net.png`,
  ogImageAlt: 'Gross to Net Income Calculator (UK)',
};

pageSeo.ProRataSalaryCalculator = {
  ...pageSeo.ProRataSalaryCalculator,
  ogImage: `${CDN}/og-final-pro-rata.png`,
  ogImageAlt: 'Pro-Rata Salary Calculator (UK)',
};

// Add a default Open Graph image (used if page-specific image isn't set)
const defaultOgImage =
  'https://xifmvsuddgebmlleggqz.supabase.co/storage/v1/object/public/CalcMyMoney.co.uk/og-default.png';
const defaultOgAlt = 'Calculate My Money – Free UK Calculators';

// Helper function to get or create a meta tag dynamically
const getOrCreateMeta = (name, attribute = 'name') => {
  let element = document.head.querySelector(`meta[${attribute}="${name}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }
  return element;
};

// Helper function to get or create a link tag dynamically
const getOrCreateLink = (rel) => {
  let element = document.head.querySelector(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }
  return element;
};

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openCategories, setOpenCategories] = useState({});
  const isHomePage = location.pathname === createPageUrl('Home');

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
        // hub page with optional slug
        const params = new URLSearchParams(window.location.search);
        const slug = params.get('slug');
        return slug ? `Cost of Living in ${toTitleCase(slug)}` : 'UK Cost of Living Explorer';
      }
      case 'CostOfLivingPage': {
        // dynamic city page
        const params = new URLSearchParams(window.location.search);
        const slug = params.get('slug');
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

  // SEO: Update page title and meta description based on currentPageName
  useEffect(() => {
    const defaultTitle = 'Calculate My Money - Free UK Financial Calculators';
    const defaultDescription =
      'Your go-to source for free UK financial calculators including salary, tax, mortgage, pension, and budget tools from Calculate My Money. Make smart money decisions.';

    const pageData = pageSeo[currentPageName];

    // Set document title
    document.title = pageData?.title || defaultTitle;

    // Set main meta description
    const descriptionMeta = getOrCreateMeta('description');
    descriptionMeta.setAttribute('content', pageData?.description || defaultDescription);

    // Add robots meta tag
    const robotsMeta = getOrCreateMeta('robots');
    robotsMeta.setAttribute('content', 'index,follow,max-image-preview:large');

    // Add theme-color meta tag
    const themeColorMeta = getOrCreateMeta('theme-color');
    themeColorMeta.setAttribute('content', '#0b5fff');

    // Add canonical link tag (updated to support dynamic pages with slug)
    const canonicalLink = getOrCreateLink('canonical');
    const origin = window.location.origin.endsWith('/')
      ? window.location.origin.slice(0, -1)
      : window.location.origin;
    const pathname = location.pathname;

    // Pages that rely on a "slug" query param for unique content
    const dynamicCanonicalPages = new Set(['CostOfLiving', 'JobSalaries']); // Updated CostOfLivingPage to CostOfLiving

    let canonicalUrl;
    if (currentPageName === 'Home' || pathname === '/') {
      canonicalUrl = `${origin}/`;
    } else if (dynamicCanonicalPages.has(currentPageName)) {
      // Keep only the slug param; drop tracking and other params
      const urlParams = new URLSearchParams(window.location.search);
      const slug = urlParams.get('slug');
      const canonicalParams = new URLSearchParams();
      if (slug) canonicalParams.set('slug', slug);
      const search = canonicalParams.toString();
      canonicalUrl = `${origin}${pathname}${search ? `?${search}` : ''}`;
    } else {
      // For all other pages, strip query params from canonical
      canonicalUrl = `${origin}${pathname}`;
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    // Set Open Graph (for Facebook, LinkedIn, etc.) meta tags
    const ogTitleMeta = getOrCreateMeta('og:title', 'property');
    ogTitleMeta.setAttribute('content', pageData?.title || defaultTitle);

    const ogDescriptionMeta = getOrCreateMeta('og:description', 'property');
    ogDescriptionMeta.setAttribute('content', pageData?.description || defaultDescription);

    const ogUrlMeta = getOrCreateMeta('og:url', 'property');
    ogUrlMeta.setAttribute('content', canonicalUrl); // Use canonical URL for consistency

    const ogTypeMeta = getOrCreateMeta('og:type', 'property');
    ogTypeMeta.setAttribute('content', 'website'); // Default type for general pages

    const ogSiteNameMeta = getOrCreateMeta('og:site_name', 'property');
    ogSiteNameMeta.setAttribute('content', 'Calculate My Money');

    // NEW: locale for consistency
    const ogLocaleMeta = getOrCreateMeta('og:locale', 'property');
    ogLocaleMeta.setAttribute('content', 'en_GB');

    // Set OG/Twitter images (use page-specific if provided, else default)
    const ogImageMeta = getOrCreateMeta('og:image', 'property');
    ogImageMeta.setAttribute('content', pageData?.ogImage || defaultOgImage);

    // Explicit dimensions and alt for OG image
    const ogImageWidthMeta = getOrCreateMeta('og:image:width', 'property');
    ogImageWidthMeta.setAttribute('content', '1200');

    const ogImageHeightMeta = getOrCreateMeta('og:image:height', 'property');
    ogImageHeightMeta.setAttribute('content', '630');

    const ogImageAltMeta = getOrCreateMeta('og:image:alt', 'property');
    ogImageAltMeta.setAttribute('content', pageData?.ogImageAlt || defaultOgAlt);

    // Set Twitter Card meta tags
    const twitterCardMeta = getOrCreateMeta('twitter:card');
    twitterCardMeta.setAttribute('content', 'summary_large_image'); // Or 'summary' for smaller image/no image

    const twitterTitleMeta = getOrCreateMeta('twitter:title');
    twitterTitleMeta.setAttribute('content', pageData?.title || defaultTitle);

    const twitterDescriptionMeta = getOrCreateMeta('twitter:description');
    twitterDescriptionMeta.setAttribute('content', pageData?.description || defaultDescription);

    const twitterImageMeta = getOrCreateMeta('twitter:image');
    twitterImageMeta.setAttribute('content', pageData?.ogImage || defaultOgImage);

    // NEW: twitter image alt for accessibility
    const twitterImageAltMeta = getOrCreateMeta('twitter:image:alt');
    twitterImageAltMeta.setAttribute('content', pageData?.ogImageAlt || defaultOgAlt);

    // --- Add JSON-LD Schema ---
    const organizationSchema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Calculate My Money',
      url: `${origin}/`,
      logo: 'https://calcmymoney.co.uk/images/logo-high-res.png', // Existing logo
      sameAs: [],
    };

    const websiteSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Calculate My Money',
      url: `${origin}/`,
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${origin}/?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    };

    // Function to create or update script tags
    const createOrUpdateJsonLd = (id, schema) => {
      let script = document.head.querySelector(`script[id="${id}"]`);
      if (!script) {
        script = document.createElement('script');
        script.id = id;
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(schema);
    };

    createOrUpdateJsonLd('organization-schema', organizationSchema);
    createOrUpdateJsonLd('website-schema', websiteSchema);

    // Add FAQ schema for specific pages
    const faqPages = [
      'Home',
      'SalaryCalculatorUK',
      'MortgageCalculator',
      'PensionCalculator',
      'BudgetCalculator',
    ];

    const existingFaqSchemaElement = document.head.querySelector(`script[id="faq-schema"]`);

    // NEW: detect if the page already includes any FAQPage JSON-LD to avoid duplicates
    const pageHasFAQSchema = () => {
      const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
      const hasFAQ = (node) => {
        if (!node) return false;
        if (Array.isArray(node)) {
          // If node is an array (e.g., '@graph'), check each item
          return node.some(hasFAQ);
        }
        if (typeof node === 'object' && node !== null) {
          // Check for @type directly
          if (node['@type'] === 'FAQPage') return true;
          // If there's an @graph, recurse into it
          if (node['@graph']) return hasFAQ(node['@graph']);
        }
        return false;
      };

      for (const s of scripts) {
        // Skip the specific script we control if it's currently being removed
        if (s.id === 'faq-schema' && !faqPages.includes(currentPageName)) {
          continue;
        }
        try {
          const json = JSON.parse(s.textContent || '{}');
          if (hasFAQ(json)) return true;
        } catch (_) {
          // ignore parse errors on unrelated JSON-LD
        }
      }
      return false;
    };

    if (faqPages.includes(currentPageName) && !pageHasFAQSchema()) {
      const faqSchema = {
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
      };
      createOrUpdateJsonLd('faq-schema', faqSchema);
    } else if (!faqPages.includes(currentPageName) && existingFaqSchemaElement) {
      // Clean up our injected FAQ schema if we navigate away from the specified FAQ pages
      document.head.removeChild(existingFaqSchemaElement);
    }
  }, [currentPageName, location.pathname]); // Dependency array: re-run when currentPageName changes, or location for accurate og:url

  const mainNavLinks = [
    { name: 'All Calculators', url: createPageUrl('home') },
    { name: 'Job Salaries', url: createPageUrl('job-salaries') },
    { name: 'Cost of Living', url: createPageUrl('cost-of-living') },
    { name: 'Financial Stats', url: createPageUrl('uk-financial-stats') },
    { name: 'Blog', url: createPageUrl('blog') },
    { name: 'Resources', url: createPageUrl('resources') },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <ScrollToTop />
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
              <Link to="/" className="flex items-center space-x-2">
                <PoundIconSVG size="32" className="h-8 w-8" />
                <span className="font-bold text-xl text-gray-800">Calculate My Money</span>
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
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/bda5a3f4d_image.png"
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
  );
}
