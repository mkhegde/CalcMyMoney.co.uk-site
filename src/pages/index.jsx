import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Layout from './Layout.jsx';
import NotFound from './NotFound';

// --- STATIC IMPORTS (Small pages / info pages) ---
import Home from './Home';
import PrivacyPolicy from './PrivacyPolicy';
import CookiePolicy from './CookiePolicy';
import Contact from './Contact';
import Resources from './Resources';
import Blog from './Blog';
import Sitemap from './Sitemap';
import JobSalaries from './JobSalaries';
import CostOfLiving from './CostOfLiving';
import UKGovernmentBudget from './UKGovernmentBudget';
import TermsOfService from './TermsOfService';
import Disclaimer from './Disclaimer';
import BlogSmartMoneySavingTips from './BlogSmartMoneySavingTips';
import BlogDebtRepaymentStrategies from './BlogDebtRepaymentStrategies';
import BlogFinancialPsychology from './BlogFinancialPsychology';
import JobSalaryPage from './JobSalaryPage';
import CostOfLivingPage from './CostOfLivingPage';
import UKFinancialStats from './UKFinancialStats';
import Methodology from './Methodology';
import About from './About';
import SelfAssessmentGuide from './SelfAssessmentGuide';
import LinkToUs from './LinkToUs';

// Pull calculator config so we can auto-generate routes for entries with `page`
import { calculatorCategories } from '../components/data/calculatorConfig';

// --- EXISTING LAZY IMPORTS (keep these; dynamic routes will coexist safely) ---
const LazySalaryCalculatorUK = lazy(() => import('./SalaryCalculatorUK.jsx'));
const LazyMortgageCalculator = lazy(() => import('./MortgageCalculator.jsx'));
const LazyRentalIncomeCalculator = lazy(() => import('./RentalIncomeCalculator.jsx'));
const LazyBRRRRCalculator = lazy(() => import('./BRRRRCalculator.jsx'));
const LazyDebtCalculator = lazy(() => import('./DebtCalculator.jsx'));
const LazyFIRECalculator = lazy(() => import('./FIRECalculator.jsx'));
const LazyBudgetCalculator = lazy(() => import('./BudgetCalculator.jsx'));
const LazyIncomeTaxCalculator = lazy(() => import('./IncomeTaxCalculator.jsx'));
const LazyNationalInsuranceCalculator = lazy(() => import('./NationalInsuranceCalculator.jsx'));
const LazyCompoundInterestCalculator = lazy(() => import('./CompoundInterestCalculator.jsx'));
const LazyStudentLoanCalculator = lazy(() => import('./StudentLoanCalculator.jsx'));
const LazySavingsGoalCalculator = lazy(() => import('./SavingsGoalCalculator.jsx'));
const LazyPensionCalculator = lazy(() => import('./PensionCalculator.jsx'));
const LazyMaternityPayCalculator = lazy(() => import('./MaternityPayCalculator.jsx'));
const LazyStatutorySickPayCalculator = lazy(() => import('./StatutorySickPayCalculator.jsx'));
const LazyEmergencyFundCalculator = lazy(() => import('./EmergencyFundCalculator.jsx'));
const LazySalarySacrificeCalculator = lazy(() => import('./SalarySacrificeCalculator.jsx'));
const LazyHolidayPayCalculator = lazy(() => import('./HolidayPayCalculator.jsx'));
const LazyInflationCalculator = lazy(() => import('./InflationCalculator.jsx'));
const LazyDreamLifestyleCalculator = lazy(() => import('./DreamLifestyleCalculator.jsx'));
const LazyRedundancyPayCalculator = lazy(() => import('./RedundancyPayCalculator.jsx'));
const LazyMinimumWageCalculator = lazy(() => import('./MinimumWageCalculator.jsx'));
const LazyOvertimeBonusCalculator = lazy(() => import('./OvertimeBonusCalculator.jsx'));
const LazyHourlyToAnnualSalaryCalculator = lazy(
  () => import('./HourlyToAnnualSalaryCalculator.jsx')
);
const LazyContractorCalculator = lazy(() => import('./ContractorCalculator.jsx'));
const LazyNetWorthCalculator = lazy(() => import('./NetWorthCalculator.jsx'));
const LazyEnergyBillCalculator = lazy(() => import('./EnergyBillCalculator.jsx'));
const LazyPAYECalculator = lazy(() => import('./PAYECalculator.jsx'));
const LazyVATCalculator = lazy(() => import('./VATCalculator.jsx'));
const LazyMortgageAffordabilityCalculator = lazy(
  () => import('./MortgageAffordabilityCalculator.jsx')
);
const LazyProRataSalaryCalculator = lazy(() => import('./ProRataSalaryCalculator.jsx'));
const LazyISACalculator = lazy(() => import('./ISACalculator.jsx'));
const LazyCapitalGainsTaxCalculator = lazy(() => import('./CapitalGainsTaxCalculator.jsx'));
const LazyLoanRepaymentCalculator = lazy(() => import('./LoanRepaymentCalculator.jsx'));
const LazyCorporationTaxCalculator = lazy(() => import('./CorporationTaxCalculator.jsx'));
const LazyStampDutyCalculator = lazy(() => import('./StampDutyCalculator.jsx'));
const LazyFreelancerDayRateCalculator = lazy(() => import('./FreelancerDayRateCalculator.jsx'));
const LazyPensionContributionCalculator = lazy(() => import('./PensionContributionCalculator.jsx'));
const LazyBusinessLoanCalculator = lazy(() => import('./BusinessLoanCalculator.jsx'));
const LazyBreakEvenCalculator = lazy(() => import('./BreakEvenCalculator.jsx'));
const LazyCarLoanCalculator = lazy(() => import('./CarLoanCalculator.jsx'));
const LazyDebtToIncomeRatioCalculator = lazy(() => import('./DebtToIncomeRatioCalculator.jsx'));
const LazyBuyToLetMortgageCalculator = lazy(() => import('./BuyToLetMortgageCalculator.jsx'));
const LazyRemortgageCalculator = lazy(() => import('./RemortgageCalculator.jsx'));
const LazyInvestmentCalculator = lazy(() => import('./InvestmentCalculator.jsx'));
const LazyPersonalLoanCalculator = lazy(() => import('./PersonalLoanCalculator.jsx'));
const LazyCreditCardRepaymentCalculator = lazy(() => import('./CreditCardRepaymentCalculator.jsx'));
const LazyRetirementSavingsCalculator = lazy(() => import('./RetirementSavingsCalculator.jsx'));
const LazyPayrollCalculator = lazy(() => import('./PayrollCalculator.jsx'));
const LazyAmortizationCalculator = lazy(() => import('./AmortizationCalculator.jsx'));
const LazyAnnuityCalculator = lazy(() => import('./AnnuityCalculator.jsx'));
const LazySimpleInterestCalculator = lazy(() => import('./SimpleInterestCalculator.jsx'));
const LazySalaryIncreaseCalculator = lazy(() => import('./SalaryIncreaseCalculator.jsx'));
const LazyEffectiveTaxRateCalculator = lazy(() => import('./EffectiveTaxRateCalculator.jsx'));
const LazyHomeEquityLoanCalculator = lazy(() => import('./HomeEquityLoanCalculator.jsx'));
const LazyCommissionCalculator = lazy(() => import('./CommissionCalculator.jsx'));
const LazyDividendTaxCalculator = lazy(() => import('./DividendTaxCalculator.jsx'));
const LazyFutureValueCalculator = lazy(() => import('./FutureValueCalculator.jsx'));
const LazyOvertimePayCalculator = lazy(() => import('./OvertimePayCalculator.jsx'));
const LazyLoanComparisonCalculator = lazy(() => import('./LoanComparisonCalculator.jsx'));
const LazyInheritanceTaxCalculator = lazy(() => import('./InheritanceTaxCalculator.jsx'));
const LazyCouncilTaxCalculator = lazy(() => import('./CouncilTaxCalculator.jsx'));
const LazyMortgageRepaymentCalculator = lazy(() => import('./MortgageRepaymentCalculator.jsx'));
const LazyFirstTimeBuyerCalculator = lazy(() => import('./FirstTimeBuyerCalculator.jsx'));
const LazyRentVsBuyCalculator = lazy(() => import('./RentVsBuyCalculator.jsx'));
const LazyHouseholdBillsSplitter = lazy(() => import('./HouseholdBillsSplitter.jsx'));
const LazyCommuteCostCalculator = lazy(() => import('./CommuteCostCalculator.jsx'));
const LazyCarCostCalculator = lazy(() => import('./CarCostCalculator.jsx'));
const LazySubscriptionCostCalculator = lazy(() => import('./SubscriptionCostCalculator.jsx'));
const LazyRuleOf72Calculator = lazy(() => import('./RuleOf72Calculator.jsx'));
const LazyStudentLoanRepaymentCalculator = lazy(
  () => import('./StudentLoanRepaymentCalculator.jsx')
);
const LazyWeddingBudgetCalculator = lazy(() => import('./WeddingBudgetCalculator.jsx'));
const LazyTravelBudgetCalculator = lazy(() => import('./TravelBudgetCalculator.jsx'));
const LazyChildcareCostCalculator = lazy(() => import('./ChildcareCostCalculator.jsx'));
const LazyTipCalculator = lazy(() => import('./TipCalculator.jsx'));
const LazyOvertimeRateCalculator = lazy(() => import('./OvertimeRateCalculator.jsx'));
const LazyCurrencyConverter = lazy(() => import('./CurrencyConverter.jsx'));
const LazySalaryCalculatorTakeHomePay = lazy(() => import('./SalaryCalculatorTakeHomePay.jsx'));
const LazySalaryCalculatorPaycheck = lazy(() => import('./SalaryCalculatorPaycheck.jsx'));
const LazyGrossToNetCalculator = lazy(() => import('./GrossToNetCalculator.jsx'));
const LazyTaxCalculatorsUK = lazy(() => import('./TaxCalculatorsUK.jsx'));
const LazyTaxAfterTaxCalculator = lazy(() => import('./TaxAfterTaxCalculator.jsx'));
const LazyTaxAndNICalculator = lazy(() => import('./TaxAndNICalculator.jsx'));
const LazyNetIncomeUKCalculator = lazy(() => import('./NetIncomeUKCalculator.jsx'));
const LazyMortgageCalculatorUK = lazy(() => import('./MortgageCalculatorUK.jsx'));
const LazyMortgageLoanRepayment = lazy(() => import('./MortgageLoanRepayment.jsx'));
const LazyHomeLoanMortgageCalculator = lazy(() => import('./HomeLoanMortgageCalculator.jsx'));
const LazyMortgageComparison = lazy(() => import('./MortgageComparison.jsx'));

// --- STATIC PAGES MAP (used for currentPageName in Layout) ---
const PAGES = {
  Home: Home,
  PrivacyPolicy: PrivacyPolicy,
  CookiePolicy: CookiePolicy,
  Contact: Contact,
  Resources: Resources,
  Blog: Blog,
  Sitemap: Sitemap,
  JobSalaries: JobSalaries,
  CostOfLiving: CostOfLiving,
  UKGovernmentBudget: UKGovernmentBudget,
  TermsOfService: TermsOfService,
  Disclaimer: Disclaimer,
  BlogSmartMoneySavingTips: BlogSmartMoneySavingTips,
  BlogDebtRepaymentStrategies: BlogDebtRepaymentStrategies,
  BlogFinancialPsychology: BlogFinancialPsychology,
  JobSalaryPage: JobSalaryPage,
  CostOfLivingPage: CostOfLivingPage,
  UKFinancialStats: UKFinancialStats,
  Methodology: Methodology,
  About: About,
  SelfAssessmentGuide: SelfAssessmentGuide,
  LinkToUs: LinkToUs,
};

// Build a flattended list of calculators from the config
const _allCalcs = calculatorCategories.flatMap((cat) =>
  (cat?.subCategories || []).flatMap((sub) => sub?.calculators || [])
);

// Vite glob for any page component in this folder (e.g., './PAYECalculator.jsx')
const pageModules = import.meta.glob('./*.jsx');
const _loadPage = (pageName) => {
  if (!pageName) return null;
  const key = `./${pageName}.jsx`;
  const loader = pageModules[key];
  return loader ? lazy(loader) : null;
};

// Build dynamic routes for calculators that have `page` defined
const DYNAMIC_CALC_ROUTES = _allCalcs
  .filter((c) => c?.status === 'active' && typeof c.page === 'string' && c.page.trim())
  .map((c) => {
    const C = _loadPage(c.page);
    return C ? { path: c.url, Component: C, name: c.name } : null;
  })
  .filter(Boolean);

// Helper for Layout current page label
function _getCurrentPage(url) {
  if (url.endsWith('/')) url = url.slice(0, -1);
  let urlLastPart = url.split('/').pop();
  if (urlLastPart.includes('?')) urlLastPart = urlLastPart.split('?')[0];

  const pageName = Object.keys(PAGES).find(
    (page) => page.toLowerCase() === urlLastPart.toLowerCase()
  );
  // If not a known static page, treat it as a lazy/dynamic route for Layout purposes.
  return pageName || 'LazyRoute' || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
  const location = useLocation();
  const currentPage = _getCurrentPage(location.pathname);

  return (
    <Layout currentPageName={currentPage}>
      <Suspense
        fallback={
          <div className="p-10 text-center text-lg text-indigo-600">
            <div className="animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent rounded-full mr-2"></div>
            Loading Calculator Page...
          </div>
        }
      >
        <Routes>
          {/* Home/Index (STATIC) */}
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />

          {/* --- Auto-generated calculator routes (lazy).
               Placed BEFORE/AFTER static calculator routes both work in RRv6.
               We place them BEFORE to allow gradual migration:
               new calculators with `page` need no manual route. */}
          {DYNAMIC_CALC_ROUTES.map(({ path, Component }) => (
            <Route key={`dyn:${path}`} path={path} element={<Component />} />
          ))}

          {/* --- Existing manual calculator routes (LAZY) --- */}
          <Route path="/budget-calculator" element={<LazyBudgetCalculator />} />
          <Route path="/debt-calculator" element={<LazyDebtCalculator />} />
          <Route path="/mortgage-calculator" element={<LazyMortgageCalculator />} />
          <Route
            path="/compound-interest-calculator"
            element={<LazyCompoundInterestCalculator />}
          />
          <Route path="/savings-goal-calculator" element={<LazySavingsGoalCalculator />} />
          <Route path="/pension-calculator" element={<LazyPensionCalculator />} />
          <Route path="/emergency-fund-calculator" element={<LazyEmergencyFundCalculator />} />
          <Route path="/inflation-calculator" element={<LazyInflationCalculator />} />
          <Route path="/dream-lifestyle-calculator" element={<LazyDreamLifestyleCalculator />} />
          <Route path="/minimum-wage-calculator" element={<LazyMinimumWageCalculator />} />
          <Route
            path="/hourly-to-annual-salary-calculator"
            element={<LazyHourlyToAnnualSalaryCalculator />}
          />
          <Route path="/fire-calculator" element={<LazyFIRECalculator />} />
          <Route path="/net-worth-calculator" element={<LazyNetWorthCalculator />} />
          <Route path="/energy-bill-calculator" element={<LazyEnergyBillCalculator />} />
          <Route path="/rental-income-calculator" element={<LazyRentalIncomeCalculator />} />
          <Route path="/brrrr-calculator" element={<LazyBRRRRCalculator />} />
          <Route path="/pro-rata-salary-calculator" element={<LazyProRataSalaryCalculator />} />
          <Route path="/loan-repayment-calculator" element={<LazyLoanRepaymentCalculator />} />
          <Route
            path="/freelancer-day-rate-calculator"
            element={<LazyFreelancerDayRateCalculator />}
          />
          <Route
            path="/pension-contribution-calculator"
            element={<LazyPensionContributionCalculator />}
          />
          <Route path="/business-loan-calculator" element={<LazyBusinessLoanCalculator />} />
          <Route path="/break-even-calculator" element={<LazyBreakEvenCalculator />} />
          <Route path="/car-loan-calculator" element={<LazyCarLoanCalculator />} />
          <Route
            path="/debt-to-income-ratio-calculator"
            element={<LazyDebtToIncomeRatioCalculator />}
          />
          <Route
            path="/buy-to-let-mortgage-calculator"
            element={<LazyBuyToLetMortgageCalculator />}
          />
          <Route path="/remortgage-calculator" element={<LazyRemortgageCalculator />} />
          <Route path="/investment-calculator" element={<LazyInvestmentCalculator />} />
          <Route path="/personal-loan-calculator" element={<LazyPersonalLoanCalculator />} />
          <Route
            path="/credit-card-repayment-calculator"
            element={<LazyCreditCardRepaymentCalculator />}
          />
          <Route
            path="/retirement-savings-calculator"
            element={<LazyRetirementSavingsCalculator />}
          />
          <Route path="/amortization-calculator" element={<LazyAmortizationCalculator />} />
          <Route path="/annuity-calculator" element={<LazyAnnuityCalculator />} />
          <Route path="/simple-interest-calculator" element={<LazySimpleInterestCalculator />} />
          <Route path="/salary-increase-calculator" element={<LazySalaryIncreaseCalculator />} />
          <Route
            path="/effective-tax-rate-calculator"
            element={<LazyEffectiveTaxRateCalculator />}
          />
          <Route path="/home-equity-loan-calculator" element={<LazyHomeEquityLoanCalculator />} />
          <Route path="/commission-calculator" element={<LazyCommissionCalculator />} />
          <Route path="/dividend-tax-calculator" element={<LazyDividendTaxCalculator />} />
          <Route path="/future-value-calculator" element={<LazyFutureValueCalculator />} />
          <Route path="/overtime-pay-calculator" element={<LazyOvertimePayCalculator />} />
          <Route path="/loan-comparison-calculator" element={<LazyLoanComparisonCalculator />} />
          <Route
            path="/mortgage-repayment-calculator"
            element={<LazyMortgageRepaymentCalculator />}
          />
          <Route path="/first-time-buyer-calculator" element={<LazyFirstTimeBuyerCalculator />} />
          <Route path="/rent-vs-buy-calculator" element={<LazyRentVsBuyCalculator />} />
          <Route path="/household-bills-splitter" element={<LazyHouseholdBillsSplitter />} />
          <Route path="/commute-cost-calculator" element={<LazyCommuteCostCalculator />} />
          <Route path="/car-cost-calculator" element={<LazyCarCostCalculator />} />
          <Route
            path="/subscription-cost-calculator"
            element={<LazySubscriptionCostCalculator />}
          />
          <Route path="/rule-of-72-calculator" element={<LazyRuleOf72Calculator />} />
          <Route
            path="/student-loan-repayment-calculator"
            element={<LazyStudentLoanRepaymentCalculator />}
          />
          <Route path="/wedding-budget-calculator" element={<LazyWeddingBudgetCalculator />} />
          <Route path="/travel-budget-calculator" element={<LazyTravelBudgetCalculator />} />
          <Route path="/childcare-cost-calculator" element={<LazyChildcareCostCalculator />} />
          <Route path="/tip-calculator" element={<LazyTipCalculator />} />
          <Route path="/overtime-rate-calculator" element={<LazyOvertimeRateCalculator />} />
          <Route path="/currency-converter" element={<LazyCurrencyConverter />} />

          {/* --- UK Tax & Payroll (LAZY) --- */}
          <Route path="/income-tax-calculator" element={<LazyIncomeTaxCalculator />} />
          <Route
            path="/national-insurance-calculator"
            element={<LazyNationalInsuranceCalculator />}
          />
          <Route path="/student-loan-calculator" element={<LazyStudentLoanCalculator />} />
          <Route path="/maternity-pay-calculator" element={<LazyMaternityPayCalculator />} />
          <Route
            path="/statutory-sick-pay-calculator"
            element={<LazyStatutorySickPayCalculator />}
          />
          <Route path="/salary-sacrifice-calculator" element={<LazySalarySacrificeCalculator />} />
          <Route path="/holiday-pay-calculator" element={<LazyHolidayPayCalculator />} />
          <Route path="/redundancy-pay-calculator" element={<LazyRedundancyPayCalculator />} />
          <Route path="/overtime-bonus-calculator" element={<LazyOvertimeBonusCalculator />} />
          <Route path="/paye-calculator" element={<LazyPAYECalculator />} />
          <Route path="/vat-calculator" element={<LazyVATCalculator />} />
          <Route path="/isa-calculator" element={<LazyISACalculator />} />
          <Route path="/capital-gains-tax-calculator" element={<LazyCapitalGainsTaxCalculator />} />
          <Route path="/corporation-tax-calculator" element={<LazyCorporationTaxCalculator />} />
          <Route path="/stamp-duty-calculator" element={<LazyStampDutyCalculator />} />
          <Route path="/payroll-calculator" element={<LazyPayrollCalculator />} />
          <Route path="/inheritance-tax-calculator" element={<LazyInheritanceTaxCalculator />} />
          <Route path="/council-tax-calculator" element={<LazyCouncilTaxCalculator />} />
          <Route path="/salary-calculator-uk" element={<LazySalaryCalculatorUK />} />
          <Route path="/job-salaries/:slug" element={<JobSalaryPage />} />
          <Route path="/job-salaries" element={<JobSalaryPage />} />

          <Route
            path="/salary-calculator-take-home-pay"
            element={<LazySalaryCalculatorTakeHomePay />}
          />
          <Route path="/salary-calculator-paycheck" element={<LazySalaryCalculatorPaycheck />} />
          <Route path="/gross-to-net-calculator" element={<LazyGrossToNetCalculator />} />
          <Route path="/tax-calculators-uk" element={<LazyTaxCalculatorsUK />} />
          <Route path="/tax-after-tax-calculator" element={<LazyTaxAfterTaxCalculator />} />
          <Route path="/tax-and-ni-calculator" element={<LazyTaxAndNICalculator />} />
          <Route path="/net-income-uk-calculator" element={<LazyNetIncomeUKCalculator />} />
          <Route path="/mortgage-calculator-uk" element={<LazyMortgageCalculatorUK />} />
          <Route path="/mortgage-loan-repayment" element={<LazyMortgageLoanRepayment />} />
          <Route
            path="/home-loan-mortgage-calculator"
            element={<LazyHomeLoanMortgageCalculator />}
          />
          <Route path="/mortgage-comparison" element={<LazyMortgageComparison />} />
          <Route
            path="/mortgage-affordability-calculator"
            element={<LazyMortgageAffordabilityCalculator />}
          />
          <Route path="/contractor-calculator" element={<LazyContractorCalculator />} />

          {/* --- Static/Blog/Data (STATIC) --- */}
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/sitemap" element={<Sitemap />} />
          <Route path="/job-salaries" element={<JobSalaries />} />
          <Route path="/cost-of-living" element={<CostOfLiving />} />
          <Route path="/uk-government-budget" element={<UKGovernmentBudget />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/blog-smart-money-saving-tips" element={<BlogSmartMoneySavingTips />} />
          <Route path="/blog-debt-repayment-strategies" element={<BlogDebtRepaymentStrategies />} />
          <Route path="/blog-financial-psychology" element={<BlogFinancialPsychology />} />
          <Route path="/job-salary-page" element={<JobSalaryPage />} />
          <Route path="/cost-of-living-page" element={<CostOfLivingPage />} />
          <Route path="/uk-financial-stats" element={<UKFinancialStats />} />
          <Route path="/methodology" element={<Methodology />} />
          <Route path="/about" element={<About />} />
          <Route path="/self-assessment-guide" element={<SelfAssessmentGuide />} />
          <Route path="/link-to-us" element={<LinkToUs />} />

          {/* Catch-all 404 MUST be last */}
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
