import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Layout from './Layout.jsx';
import { pageSeo } from '../components/data/pageSeo';
import { createPageUrl } from '../utils/createPageUrl';
import NotFound from './NotFound';

// --- STATIC PAGES (lazy-loaded info pages) ---
const Home = lazy(() => import('./Home.jsx'));
const PrivacyPolicy = lazy(() => import('./PrivacyPolicy.jsx'));
const CookiePolicy = lazy(() => import('./CookiePolicy.jsx'));
const Contact = lazy(() => import('./Contact.jsx'));
const Resources = lazy(() => import('./Resources.jsx'));
const Blog = lazy(() => import('./Blog.jsx'));
const Sitemap = lazy(() => import('./Sitemap.jsx'));
const JobSalaries = lazy(() => import('./JobSalaries.jsx'));
const CostOfLiving = lazy(() => import('./CostOfLiving.jsx'));
const UKGovernmentBudget = lazy(() => import('./UKGovernmentBudget.jsx'));
const TermsOfService = lazy(() => import('./TermsOfService.jsx'));
const Disclaimer = lazy(() => import('./Disclaimer.jsx'));
const BlogSmartMoneySavingTips = lazy(() => import('./BlogSmartMoneySavingTips.jsx'));
const BlogDebtRepaymentStrategies = lazy(() => import('./BlogDebtRepaymentStrategies.jsx'));
const BlogFinancialPsychology = lazy(() => import('./BlogFinancialPsychology.jsx'));
const BlogWhyCalculationsMatter = lazy(() => import('./BlogWhyCalculationsMatter.jsx'));
const JobSalaryPage = lazy(() => import('./JobSalaryPage.jsx'));
const CostOfLivingPage = lazy(() => import('./CostOfLivingPage.jsx'));
const UKFinancialStats = lazy(() => import('./UKFinancialStats.jsx'));
const Methodology = lazy(() => import('./Methodology.jsx'));
const About = lazy(() => import('./About.jsx'));
const SelfAssessmentGuide = lazy(() => import('./SelfAssessmentGuide.jsx'));
const LinkToUs = lazy(() => import('./LinkToUs.jsx'));

// Legacy redirects (old path -> new path)
const LEGACY_REDIRECTS = {
  '/AnnuityCalculator': '/annuity-calculator',
  '/ProRataSalaryCalculator': '/pro-rata-salary-calculator',
  '/overtimepaycalculator': '/overtime-bonus-calculator',
  '/salary-calculator-u-k': '/salary-calculator',
  '/mortgage-calculator-u-k': '/mortgage-calculator',
  '/tax-calculators-u-k': '/income-tax-calculator',
};

// Pull calculator config so we can auto-generate routes for entries with `page`
import { calculatorCategories } from '../components/data/calculatorConfig';
import { ukCities, createSlug } from '../components/data/seo-data';

const COST_OF_LIVING_BASE_PATH = createPageUrl('CostOfLiving');

// --- LAZY IMPORTS (calculators) ---
const LazyAmortizationCalculator = lazy(() => import('../calculators/amortization-calculator.js'));
const LazyAnnuityCalculator = lazy(() => import('../calculators/annuity-calculator.js'));
const LazyAverageDailyBalanceCalculator = lazy(() => import('../calculators/average-daily-balance-calculator.jsx'));
const LazyBrrrrCalculator = lazy(() => import('../calculators/brrrr-calculator.js'));
const LazyBudgetPlanner = lazy(() => import('../calculators/budget-planner.js'));
const LazyBuyToLetMortgageCalculator = lazy(() => import('../calculators/buy-to-let-mortgage-calculator.js'));
const LazyCapitalGainsTaxCalculator = lazy(() => import('../calculators/capital-gains-tax-calculator.js'));
const LazyCarCostCalculator = lazy(() => import('../calculators/car-cost-calculator.js'));
const LazyCarFinanceCalculator = lazy(() => import('../calculators/car-finance-calculator.jsx'));
const LazyCarLoanCalculator = lazy(() => import('../calculators/car-loan-calculator.js'));
const LazyCarPaymentCalculator = lazy(() => import('../calculators/car-payment-calculator.jsx'));
const LazyChildBenefitCalculator = lazy(() => import('../calculators/child-benefit-calculator.js'));
const LazyChildcareCostCalculator = lazy(() => import('../calculators/childcare-cost-calculator.js'));
const LazyCommissionCalculator = lazy(() => import('../calculators/commission-calculator.jsx'));
const LazyCommuteCostCalculator = lazy(() => import('../calculators/commute-cost-calculator.jsx'));
const LazyCompoundInterestCalculator = lazy(() => import('../calculators/compound-interest-calculator.jsx'));
const LazyContractorCalculator = lazy(() => import('../calculators/contractor-calculator.jsx'));
const LazyCorporationTaxCalculator = lazy(() => import('../calculators/corporation-tax-calculator.jsx'));
const LazyCostOfLivingCalculator = lazy(() => import('../calculators/cost-of-living-calculator.jsx'));
const LazyDebtCalculator = lazy(() => import('../calculators/debt-calculator.jsx'));
const LazyDebtToIncomeRatioCalculator = lazy(() => import('../calculators/debt-to-income-ratio-calculator.jsx'));
const LazyDiscountCalculator = lazy(() => import('../calculators/discount-calculator.jsx'));
const LazyDividendTaxCalculator = lazy(() => import('../calculators/dividend-tax-calculator.jsx'));
const LazyDownPaymentCalculator = lazy(() => import('../calculators/down-payment-calculator.jsx'));
const LazyDreamLifestyleCalculator = lazy(() => import('../calculators/dream-lifestyle-calculator.jsx'));
const LazyEnergyBillCalculator = lazy(() => import('../calculators/energy-bill-calculator.jsx'));
const LazyFireCalculator = lazy(() => import('../calculators/fire-calculator.jsx'));
const LazyFirstTimeBuyerCalculator = lazy(() => import('../calculators/first-time-buyer-calculator.jsx'));
const LazyFuelCostCalculator = lazy(() => import('../calculators/fuel-cost-calculator.jsx'));
const LazyGrossToNetCalculator = lazy(() => import('../calculators/gross-to-net-calculator.jsx'));
const LazyHolidayPayCalculator = lazy(() => import('../calculators/holiday-pay-calculator.jsx'));
const LazyHomeEquityLoanCalculator = lazy(() => import('../calculators/home-equity-loan-calculator.jsx'));
const LazyHourlyToAnnualSalaryCalculator = lazy(() => import('../calculators/hourly-to-annual-salary-calculator.jsx'));
const LazyHouseholdBillsSplitter = lazy(() => import('../calculators/household-bills-splitter.jsx'));
const LazyIncomeTaxCalculator = lazy(() => import('../calculators/income-tax-calculator.jsx'));
const LazyInflationCalculator = lazy(() => import('../calculators/inflation-calculator.jsx'));
const LazyInvestmentCalculator = lazy(() => import('../calculators/investment-calculator.jsx'));
const LazyIsaCalculator = lazy(() => import('../calculators/isa-calculator.jsx'));
const LazyMortgageAffordabilityCalculator = lazy(() => import('../calculators/mortgage-affordability-calculator.jsx'));
const LazyMortgageCalculator = lazy(() => import('../calculators/mortgage-calculator.jsx'));
const LazyMortgageComparisonCalculator = lazy(() => import('../calculators/mortgage-comparison-calculator.jsx'));
const LazyMortgageRepaymentCalculator = lazy(() => import('../calculators/mortgage-repayment-calculator.jsx'));
const LazyNetIncomeUkCalculator = lazy(() => import('../calculators/net-income-uk-calculator.jsx'));
const LazyNetWorthCalculator = lazy(() => import('../calculators/net-worth-calculator.jsx'));
const LazyNiCalculator = lazy(() => import('../calculators/ni-calculator.jsx'));
const LazyOvertimeBonusCalculator = lazy(() => import('../calculators/overtime-bonus-calculator.jsx'));
const LazyPayeCalculator = lazy(() => import('../calculators/paye-calculator.jsx'));
const LazyPensionCalculator = lazy(() => import('../calculators/pension-calculator.jsx'));
const LazyPercentageChangeCalculator = lazy(() => import('../calculators/percentage-change-calculator.jsx'));
const LazyPersonalAllowanceCalculator = lazy(() => import('../calculators/personal-allowance-calculator.jsx'));
const LazyPersonalFinanceCalculator = lazy(() => import('../calculators/personal-finance-calculator.jsx'));
const LazyPersonalLoanCalculator = lazy(() => import('../calculators/personal-loan-calculator.jsx'));
const LazyPresentValueCalculator = lazy(() => import('../calculators/present-value-calculator.jsx'));
const LazyPricePerUnitCalculator = lazy(() => import('../calculators/price-per-unit-calculator.jsx'));
const LazyProRataSalaryCalculator = lazy(() => import('../calculators/pro-rata-salary-calculator.jsx'));
const LazyPropertyFlippingCalculator = lazy(() => import('../calculators/property-flipping-calculator.jsx'));
const LazyPropertyTaxCalculator = lazy(() => import('../calculators/property-tax-calculator.jsx'));
const LazyRentToBuyCalculator = lazy(() => import('../calculators/rent-to-buy-calculator.jsx'));
const LazyRentVsBuyCalculator = lazy(() => import('../calculators/rent-vs-buy-calculator.jsx'));
const LazyRentalYieldCalculator = lazy(() => import('../calculators/rental-yield-calculator.jsx'));
const LazyRetirementCalculator = lazy(() => import('../calculators/retirement-calculator.jsx'));
const LazyRetirementSavingsCalculator = lazy(() => import('../calculators/retirement-savings-calculator.jsx'));
const LazyReverseMortgageCalculator = lazy(() => import('../calculators/reverse-mortgage-calculator.jsx'));
const LazyRoiCalculator = lazy(() => import('../calculators/roi-calculator.jsx'));
const LazyRuleOf72Calculator = lazy(() => import('../calculators/rule-of-72-calculator.jsx'));
const LazySalaryCalculator = lazy(() => import('../calculators/salary-calculator.jsx'));
const LazySalarySacrificeCalculator = lazy(() => import('../calculators/salary-sacrifice-calculator.jsx'));
const LazySavingsCalculator = lazy(() => import('../calculators/savings-calculator.jsx'));
const LazySavingsGoalCalculator = lazy(() => import('../calculators/savings-goal-calculator.jsx'));
const LazySdltCalculator = lazy(() => import('../calculators/sdlt-calculator.jsx'));
const LazyStudentLoanRepaymentCalculator = lazy(() => import('../calculators/student-loan-repayment-calculator.jsx'));
const LazySubscriptionCostCalculator = lazy(() => import('../calculators/subscription-cost-calculator.jsx'));
const LazyTimeValueOfMoneyCalculator = lazy(() => import('../calculators/time-value-of-money-calculator.jsx'));
const LazyTipCalculator = lazy(() => import('../calculators/tip-calculator.jsx'));
const LazyTravelBudgetCalculator = lazy(() => import('../calculators/travel-budget-calculator.jsx'));
const LazyVatCalculator = lazy(() => import('../calculators/vat-calculator.jsx'));
const LazyWeddingBudgetCalculator = lazy(() => import('../calculators/wedding-budget-calculator.jsx'));
const LazyWeeklyBudgetPlanner = lazy(() => import('../calculators/weekly-budget-planner.jsx'));
const LazyYearlyIncomeCalculator = lazy(() => import('../calculators/yearly-income-calculator.jsx'));
const LazyZeroBasedBudgetingCalculator = lazy(() => import('../calculators/zero-based-budgeting-calculator.jsx'));

// --- STATIC PAGES MAP (used for currentPageName in Layout) ---
const PAGES = {
  Home,
  PrivacyPolicy,
  CookiePolicy,
  Contact,
  Resources,
  Blog,
  Sitemap,
  JobSalaries,
  CostOfLiving,
  UKGovernmentBudget,
  TermsOfService,
  Disclaimer,
  BlogSmartMoneySavingTips,
  BlogDebtRepaymentStrategies,
  BlogFinancialPsychology,
  JobSalaryPage,
  CostOfLivingPage,
  UKFinancialStats,
  Methodology,
  About,
  SelfAssessmentGuide,
  LinkToUs,
};

// Flatten calculators from config
const _allCalcs = calculatorCategories.flatMap((cat) =>
  (cat?.subCategories || []).flatMap((sub) => sub?.calculators || [])
);

// Vite glob loader for pages
// Calculator routes are manually defined below to point at the new slug-based components.
const DYNAMIC_CALC_ROUTES = [];

const _normalizeSlug = (value = '') => {
  if (typeof value !== 'string') return '';
  const [path] = value.split('?');
  const [cleanPath] = path.split('#');
  return cleanPath.replace(/^\/+|\/+$/g, '').toLowerCase();
};

const _registerSlug = (map, slug, pageName) => {
  if (!pageName || typeof pageName !== 'string') return;
  const normalized = _normalizeSlug(slug);
  if (normalized === undefined) return;
  if (!map.has(normalized)) {
    map.set(normalized, pageName);
  }
};

const _slugToPageName = (() => {
  const map = new Map();

  const registerPageKey = (pageKey) => {
    _registerSlug(map, createPageUrl(pageKey), pageKey);
  };

  // Home variations
  _registerSlug(map, '/', 'Home');
  _registerSlug(map, 'home', 'Home');

  Object.keys(PAGES).forEach(registerPageKey);
  Object.keys(pageSeo || {}).forEach(registerPageKey);

  _allCalcs.forEach((calc) => {
    if (!calc) return;
    if (calc.url) {
      const target =
        (typeof calc.page === 'string' && calc.page.trim()) || undefined;
      _registerSlug(map, calc.url, target);
    }

    if (typeof calc?.page === 'string' && calc.page.trim()) {
      _registerSlug(map, createPageUrl(calc.page), calc.page.trim());
    }
  });

  const costOfLivingBase = COST_OF_LIVING_BASE_PATH.replace(/^\/+|\/+$/g, '');
  if (costOfLivingBase) {
    ukCities.forEach((city) => {
      if (!city?.name) return;
      const slug = createSlug(city.name);
      if (!slug) return;
      _registerSlug(map, `${costOfLivingBase}/${slug}`, 'CostOfLivingPage');
    });
  }

  return map;
})();

function LegacyCostOfLivingRedirect() {
  const location = useLocation();
  const params = new URLSearchParams(location.search || '');
  const slug = params.get('slug');
  const normalizedSlug = slug ? createSlug(slug) : '';
  if (normalizedSlug) {
    return <Navigate to={`${COST_OF_LIVING_BASE_PATH}/${normalizedSlug}`} replace />;
  }
  return <Navigate to={COST_OF_LIVING_BASE_PATH} replace />;
}

// Helper for Layout current page label
function _getCurrentPage(pathname) {
  const normalizedPath = _normalizeSlug(pathname || '/');
  if (!normalizedPath || normalizedPath === 'home') {
    return 'Home';
  }

  if (normalizedPath.startsWith('cost-of-living/')) {
    return 'CostOfLivingPage';
  }

  const segments = normalizedPath.split('/').filter(Boolean);
  const candidateSlugs = new Set([normalizedPath]);

  if (segments.length > 0) {
    candidateSlugs.add(segments[segments.length - 1]);
    let running = '';
    segments.forEach((segment) => {
      running = running ? `${running}/${segment}` : segment;
      if (running !== normalizedPath) {
        candidateSlugs.add(running);
      }
    });
  }

  for (const slug of candidateSlugs) {
    const match = _slugToPageName.get(slug);
    if (match) return match;
  }

  return 'LazyRoute';
}

function PagesContent() {
  const location = useLocation();
  const currentPage = _getCurrentPage(location.pathname);

  return (
    <Layout currentPageName={currentPage}>
      <Suspense
        fallback={
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-background/90 text-lg text-indigo-600">
            <div className="flex items-center gap-3 rounded-full bg-card px-6 py-4 shadow-lg border border-border">
              <div className="animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent rounded-full"></div>
              <span>Loading Calculator Page&hellip;</span>
            </div>
          </div>
        }
      >
        <Routes>
          {/* Home */}
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />

          {/* Auto-generated calculator routes */}
          {DYNAMIC_CALC_ROUTES.map(({ path, Component }) => (
            <Route key={`dyn:${path}`} path={path} element={<Component />} />
          ))}

          {/* Manual calculator routes */}
          <Route path="/amortization-calculator" element={<LazyAmortizationCalculator />} />
          <Route path="/annuity-calculator" element={<LazyAnnuityCalculator />} />
          <Route path="/average-daily-balance-calculator" element={<LazyAverageDailyBalanceCalculator />} />
          <Route path="/brrrr-calculator" element={<LazyBrrrrCalculator />} />
          <Route path="/budget-planner" element={<LazyBudgetPlanner />} />
          <Route path="/buy-to-let-mortgage-calculator" element={<LazyBuyToLetMortgageCalculator />} />
          <Route path="/capital-gains-tax-calculator" element={<LazyCapitalGainsTaxCalculator />} />
          <Route path="/car-cost-calculator" element={<LazyCarCostCalculator />} />
          <Route path="/car-finance-calculator" element={<LazyCarFinanceCalculator />} />
          <Route path="/car-loan-calculator" element={<LazyCarLoanCalculator />} />
          <Route path="/car-payment-calculator" element={<LazyCarPaymentCalculator />} />
          <Route path="/child-benefit-calculator" element={<LazyChildBenefitCalculator />} />
          <Route path="/childcare-cost-calculator" element={<LazyChildcareCostCalculator />} />
          <Route path="/commission-calculator" element={<LazyCommissionCalculator />} />
          <Route path="/commute-cost-calculator" element={<LazyCommuteCostCalculator />} />
          <Route path="/compound-interest-calculator" element={<LazyCompoundInterestCalculator />} />
          <Route path="/contractor-calculator" element={<LazyContractorCalculator />} />
          <Route path="/corporation-tax-calculator" element={<LazyCorporationTaxCalculator />} />
          <Route path="/cost-of-living-calculator" element={<LazyCostOfLivingCalculator />} />
          <Route path="/debt-calculator" element={<LazyDebtCalculator />} />
          <Route path="/debt-to-income-ratio-calculator" element={<LazyDebtToIncomeRatioCalculator />} />
          <Route path="/discount-calculator" element={<LazyDiscountCalculator />} />
          <Route path="/dividend-tax-calculator" element={<LazyDividendTaxCalculator />} />
          <Route path="/down-payment-calculator" element={<LazyDownPaymentCalculator />} />
          <Route path="/dream-lifestyle-calculator" element={<LazyDreamLifestyleCalculator />} />
          <Route path="/energy-bill-calculator" element={<LazyEnergyBillCalculator />} />
          <Route path="/fire-calculator" element={<LazyFireCalculator />} />
          <Route path="/first-time-buyer-calculator" element={<LazyFirstTimeBuyerCalculator />} />
          <Route path="/fuel-cost-calculator" element={<LazyFuelCostCalculator />} />
          <Route path="/gross-to-net-calculator" element={<LazyGrossToNetCalculator />} />
          <Route path="/holiday-pay-calculator" element={<LazyHolidayPayCalculator />} />
          <Route path="/home-equity-loan-calculator" element={<LazyHomeEquityLoanCalculator />} />
          <Route path="/hourly-to-annual-salary-calculator" element={<LazyHourlyToAnnualSalaryCalculator />} />
          <Route path="/household-bills-splitter" element={<LazyHouseholdBillsSplitter />} />
          <Route path="/income-tax-calculator" element={<LazyIncomeTaxCalculator />} />
          <Route path="/inflation-calculator" element={<LazyInflationCalculator />} />
          <Route path="/investment-calculator" element={<LazyInvestmentCalculator />} />
          <Route path="/isa-calculator" element={<LazyIsaCalculator />} />
          <Route path="/mortgage-affordability-calculator" element={<LazyMortgageAffordabilityCalculator />} />
          <Route path="/mortgage-calculator" element={<LazyMortgageCalculator />} />
          <Route path="/mortgage-comparison-calculator" element={<LazyMortgageComparisonCalculator />} />
          <Route path="/mortgage-repayment-calculator" element={<LazyMortgageRepaymentCalculator />} />
          <Route path="/net-income-uk-calculator" element={<LazyNetIncomeUkCalculator />} />
          <Route path="/net-worth-calculator" element={<LazyNetWorthCalculator />} />
          <Route path="/ni-calculator" element={<LazyNiCalculator />} />
          <Route path="/overtime-bonus-calculator" element={<LazyOvertimeBonusCalculator />} />
          <Route path="/paye-calculator" element={<LazyPayeCalculator />} />
          <Route path="/pension-calculator" element={<LazyPensionCalculator />} />
          <Route path="/percentage-change-calculator" element={<LazyPercentageChangeCalculator />} />
          <Route path="/personal-allowance-calculator" element={<LazyPersonalAllowanceCalculator />} />
          <Route path="/personal-finance-calculator" element={<LazyPersonalFinanceCalculator />} />
          <Route path="/personal-loan-calculator" element={<LazyPersonalLoanCalculator />} />
          <Route path="/present-value-calculator" element={<LazyPresentValueCalculator />} />
          <Route path="/price-per-unit-calculator" element={<LazyPricePerUnitCalculator />} />
          <Route path="/pro-rata-salary-calculator" element={<LazyProRataSalaryCalculator />} />
          <Route path="/property-flipping-calculator" element={<LazyPropertyFlippingCalculator />} />
          <Route path="/property-tax-calculator" element={<LazyPropertyTaxCalculator />} />
          <Route path="/rent-to-buy-calculator" element={<LazyRentToBuyCalculator />} />
          <Route path="/rent-vs-buy-calculator" element={<LazyRentVsBuyCalculator />} />
          <Route path="/rental-yield-calculator" element={<LazyRentalYieldCalculator />} />
          <Route path="/retirement-calculator" element={<LazyRetirementCalculator />} />
          <Route path="/retirement-savings-calculator" element={<LazyRetirementSavingsCalculator />} />
          <Route path="/reverse-mortgage-calculator" element={<LazyReverseMortgageCalculator />} />
          <Route path="/roi-calculator" element={<LazyRoiCalculator />} />
          <Route path="/rule-of-72-calculator" element={<LazyRuleOf72Calculator />} />
          <Route path="/salary-calculator" element={<LazySalaryCalculator />} />
          <Route path="/salary-sacrifice-calculator" element={<LazySalarySacrificeCalculator />} />
          <Route path="/savings-calculator" element={<LazySavingsCalculator />} />
          <Route path="/savings-goal-calculator" element={<LazySavingsGoalCalculator />} />
          <Route path="/sdlt-calculator" element={<LazySdltCalculator />} />
          <Route path="/student-loan-repayment-calculator" element={<LazyStudentLoanRepaymentCalculator />} />
          <Route path="/subscription-cost-calculator" element={<LazySubscriptionCostCalculator />} />
          <Route path="/time-value-of-money-calculator" element={<LazyTimeValueOfMoneyCalculator />} />
          <Route path="/tip-calculator" element={<LazyTipCalculator />} />
          <Route path="/travel-budget-calculator" element={<LazyTravelBudgetCalculator />} />
          <Route path="/vat-calculator" element={<LazyVatCalculator />} />
          <Route path="/wedding-budget-calculator" element={<LazyWeddingBudgetCalculator />} />
          <Route path="/weekly-budget-planner" element={<LazyWeeklyBudgetPlanner />} />
          <Route path="/yearly-income-calculator" element={<LazyYearlyIncomeCalculator />} />
          <Route path="/zero-based-budgeting-calculator" element={<LazyZeroBasedBudgetingCalculator />} />
          {/* Job Salaries */}
          <Route path="/job-salaries" element={<JobSalaries />} />
          <Route path="/job-salaries/:slug" element={<JobSalaryPage />} />

          {/* Inline legacy redirects (must be <Route> children) */}
          {Object.entries(LEGACY_REDIRECTS).map(([from, to]) => (
            <Route key={`legacy:${from}`} path={from} element={<Navigate to={to} replace />} />
          ))}

          {/* Static/Blog/Data */}
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/sitemap" element={<Sitemap />} />
          <Route path="/cost-of-living" element={<CostOfLiving />} />
          <Route path="/cost-of-living/:slug" element={<CostOfLivingPage />} />
          <Route path="/uk-government-budget" element={<UKGovernmentBudget />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/blog-smart-money-saving-tips" element={<BlogSmartMoneySavingTips />} />
          <Route path="/blog-debt-repayment-strategies" element={<BlogDebtRepaymentStrategies />} />
          <Route path="/blog-financial-psychology" element={<BlogFinancialPsychology />} />
          <Route path="/blog/why-small-calculations-matter" element={<BlogWhyCalculationsMatter />} />
          <Route path="/job-salary-page" element={<JobSalaryPage />} />
          <Route path="/jobsalarypage" element={<JobSalaryPage />} />
          <Route path="/cost-of-living-page" element={<LegacyCostOfLivingRedirect />} />
          <Route path="/uk-financial-stats" element={<UKFinancialStats />} />
          <Route path="/methodology" element={<Methodology />} />
          <Route path="/about" element={<About />} />
          <Route path="/self-assessment-guide" element={<SelfAssessmentGuide />} />
          <Route path="/link-to-us" element={<LinkToUs />} />

          {/* 404 LAST */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}

export default function Pages() {
  return (
    <Router>
      <PagesContent />
    </Router>
  );
}
