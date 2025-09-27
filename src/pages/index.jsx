import Layout from './Layout.jsx';

import Home from './Home';

import BudgetCalculator from './BudgetCalculator';

import DebtCalculator from './DebtCalculator';

import MortgageCalculator from './MortgageCalculator';

import IncomeTaxCalculator from './IncomeTaxCalculator';

import NationalInsuranceCalculator from './NationalInsuranceCalculator';

import CompoundInterestCalculator from './CompoundInterestCalculator';

import StudentLoanCalculator from './StudentLoanCalculator';

import SavingsGoalCalculator from './SavingsGoalCalculator';

import PensionCalculator from './PensionCalculator';

import PrivacyPolicy from './PrivacyPolicy';

import CookiePolicy from './CookiePolicy';

import Contact from './Contact';

import Resources from './Resources';

import MaternityPayCalculator from './MaternityPayCalculator';

import StatutorySickPayCalculator from './StatutorySickPayCalculator';

import EmergencyFundCalculator from './EmergencyFundCalculator';

import Blog from './Blog';

import SalarySacrificeCalculator from './SalarySacrificeCalculator';

import HolidayPayCalculator from './HolidayPayCalculator';

import InflationCalculator from './InflationCalculator';

import DreamLifestyleCalculator from './DreamLifestyleCalculator';

import RedundancyPayCalculator from './RedundancyPayCalculator';

import MinimumWageCalculator from './MinimumWageCalculator';

import OvertimeBonusCalculator from './OvertimeBonusCalculator';

import HourlyToAnnualSalaryCalculator from './HourlyToAnnualSalaryCalculator';

import Sitemap from './Sitemap';

import JobSalaries from './JobSalaries';

import CostOfLiving from './CostOfLiving';

import UKGovernmentBudget from './UKGovernmentBudget';

import TermsOfService from './TermsOfService';

import Disclaimer from './Disclaimer';

import FIRECalculator from './FIRECalculator';

import ContractorCalculator from './ContractorCalculator';

import BlogSmartMoneySavingTips from './BlogSmartMoneySavingTips';

import BlogDebtRepaymentStrategies from './BlogDebtRepaymentStrategies';

import BlogFinancialPsychology from './BlogFinancialPsychology';

import NetWorthCalculator from './NetWorthCalculator';

import EnergyBillCalculator from './EnergyBillCalculator';

import RentalIncomeCalculator from './RentalIncomeCalculator';

import BRRRRCalculator from './BRRRRCalculator';

import PAYECalculator from './PAYECalculator';

import VATCalculator from './VATCalculator';

import MortgageAffordabilityCalculator from './MortgageAffordabilityCalculator';

import ProRataSalaryCalculator from './ProRataSalaryCalculator';

import ISACalculator from './ISACalculator';

import CapitalGainsTaxCalculator from './CapitalGainsTaxCalculator';

import LoanRepaymentCalculator from './LoanRepaymentCalculator';

import CorporationTaxCalculator from './CorporationTaxCalculator';

import StampDutyCalculator from './StampDutyCalculator';

import FreelancerDayRateCalculator from './FreelancerDayRateCalculator';

import PensionContributionCalculator from './PensionContributionCalculator';

import BusinessLoanCalculator from './BusinessLoanCalculator';

import BreakEvenCalculator from './BreakEvenCalculator';

import CarLoanCalculator from './CarLoanCalculator';

import DebtToIncomeRatioCalculator from './DebtToIncomeRatioCalculator';

import BuyToLetMortgageCalculator from './BuyToLetMortgageCalculator';

import RemortgageCalculator from './RemortgageCalculator';

import InvestmentCalculator from './InvestmentCalculator';

import PersonalLoanCalculator from './PersonalLoanCalculator';

import CreditCardRepaymentCalculator from './CreditCardRepaymentCalculator';

import RetirementSavingsCalculator from './RetirementSavingsCalculator';

import PayrollCalculator from './PayrollCalculator';

import AmortizationCalculator from './AmortizationCalculator';

import JobSalaryPage from './JobSalaryPage';

import CostOfLivingPage from './CostOfLivingPage';

import AnnuityCalculator from './AnnuityCalculator';

import SimpleInterestCalculator from './SimpleInterestCalculator';

import SalaryIncreaseCalculator from './SalaryIncreaseCalculator';

import EffectiveTaxRateCalculator from './EffectiveTaxRateCalculator';

import HomeEquityLoanCalculator from './HomeEquityLoanCalculator';

import CommissionCalculator from './CommissionCalculator';

import DividendTaxCalculator from './DividendTaxCalculator';

import FutureValueCalculator from './FutureValueCalculator';

import OvertimePayCalculator from './OvertimePayCalculator';

import LoanComparisonCalculator from './LoanComparisonCalculator';

import InheritanceTaxCalculator from './InheritanceTaxCalculator';

import CouncilTaxCalculator from './CouncilTaxCalculator';

import MortgageRepaymentCalculator from './MortgageRepaymentCalculator';

import FirstTimeBuyerCalculator from './FirstTimeBuyerCalculator';

import RentVsBuyCalculator from './RentVsBuyCalculator';

import HouseholdBillsSplitter from './HouseholdBillsSplitter';

import CommuteCostCalculator from './CommuteCostCalculator';

import CarCostCalculator from './CarCostCalculator';

import SubscriptionCostCalculator from './SubscriptionCostCalculator';

import RuleOf72Calculator from './RuleOf72Calculator';

import StudentLoanRepaymentCalculator from './StudentLoanRepaymentCalculator';

import WeddingBudgetCalculator from './WeddingBudgetCalculator';

import TravelBudgetCalculator from './TravelBudgetCalculator';

import ChildcareCostCalculator from './ChildcareCostCalculator';

import TipCalculator from './TipCalculator';

import OvertimeRateCalculator from './OvertimeRateCalculator';

import CurrencyConverter from './CurrencyConverter';

import UKFinancialStats from './UKFinancialStats';

import SalaryCalculatorUK from './SalaryCalculatorUK';

import SalaryCalculatorTakeHomePay from './SalaryCalculatorTakeHomePay';

import SalaryCalculatorPaycheck from './SalaryCalculatorPaycheck';

import GrossToNetCalculator from './GrossToNetCalculator';

import Methodology from './Methodology';

import About from './About';

import TaxCalculatorsUK from './TaxCalculatorsUK';

import TaxAfterTaxCalculator from './TaxAfterTaxCalculator';

import TaxAndNICalculator from './TaxAndNICalculator';

import NetIncomeUKCalculator from './NetIncomeUKCalculator';

import SelfAssessmentGuide from './SelfAssessmentGuide';

import MortgageCalculatorUK from './MortgageCalculatorUK';

import MortgageLoanRepayment from './MortgageLoanRepayment';

import HomeLoanMortgageCalculator from './HomeLoanMortgageCalculator';

import MortgageComparison from './MortgageComparison';

import LinkToUs from './LinkToUs';

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
  Home: Home,

  BudgetCalculator: BudgetCalculator,

  DebtCalculator: DebtCalculator,

  MortgageCalculator: MortgageCalculator,

  IncomeTaxCalculator: IncomeTaxCalculator,

  NationalInsuranceCalculator: NationalInsuranceCalculator,

  CompoundInterestCalculator: CompoundInterestCalculator,

  StudentLoanCalculator: StudentLoanCalculator,

  SavingsGoalCalculator: SavingsGoalCalculator,

  PensionCalculator: PensionCalculator,

  PrivacyPolicy: PrivacyPolicy,

  CookiePolicy: CookiePolicy,

  Contact: Contact,

  Resources: Resources,

  MaternityPayCalculator: MaternityPayCalculator,

  StatutorySickPayCalculator: StatutorySickPayCalculator,

  EmergencyFundCalculator: EmergencyFundCalculator,

  Blog: Blog,

  SalarySacrificeCalculator: SalarySacrificeCalculator,

  HolidayPayCalculator: HolidayPayCalculator,

  InflationCalculator: InflationCalculator,

  DreamLifestyleCalculator: DreamLifestyleCalculator,

  RedundancyPayCalculator: RedundancyPayCalculator,

  MinimumWageCalculator: MinimumWageCalculator,

  OvertimeBonusCalculator: OvertimeBonusCalculator,

  HourlyToAnnualSalaryCalculator: HourlyToAnnualSalaryCalculator,

  Sitemap: Sitemap,

  JobSalaries: JobSalaries,

  CostOfLiving: CostOfLiving,

  UKGovernmentBudget: UKGovernmentBudget,

  TermsOfService: TermsOfService,

  Disclaimer: Disclaimer,

  FIRECalculator: FIRECalculator,

  ContractorCalculator: ContractorCalculator,

  BlogSmartMoneySavingTips: BlogSmartMoneySavingTips,

  BlogDebtRepaymentStrategies: BlogDebtRepaymentStrategies,

  BlogFinancialPsychology: BlogFinancialPsychology,

  NetWorthCalculator: NetWorthCalculator,

  EnergyBillCalculator: EnergyBillCalculator,

  RentalIncomeCalculator: RentalIncomeCalculator,

  BRRRRCalculator: BRRRRCalculator,

  PAYECalculator: PAYECalculator,

  VATCalculator: VATCalculator,

  MortgageAffordabilityCalculator: MortgageAffordabilityCalculator,

  ProRataSalaryCalculator: ProRataSalaryCalculator,

  ISACalculator: ISACalculator,

  CapitalGainsTaxCalculator: CapitalGainsTaxCalculator,

  LoanRepaymentCalculator: LoanRepaymentCalculator,

  CorporationTaxCalculator: CorporationTaxCalculator,

  StampDutyCalculator: StampDutyCalculator,

  FreelancerDayRateCalculator: FreelancerDayRateCalculator,

  PensionContributionCalculator: PensionContributionCalculator,

  BusinessLoanCalculator: BusinessLoanCalculator,

  BreakEvenCalculator: BreakEvenCalculator,

  CarLoanCalculator: CarLoanCalculator,

  DebtToIncomeRatioCalculator: DebtToIncomeRatioCalculator,

  BuyToLetMortgageCalculator: BuyToLetMortgageCalculator,

  RemortgageCalculator: RemortgageCalculator,

  InvestmentCalculator: InvestmentCalculator,

  PersonalLoanCalculator: PersonalLoanCalculator,

  CreditCardRepaymentCalculator: CreditCardRepaymentCalculator,

  RetirementSavingsCalculator: RetirementSavingsCalculator,

  PayrollCalculator: PayrollCalculator,

  AmortizationCalculator: AmortizationCalculator,

  JobSalaryPage: JobSalaryPage,

  CostOfLivingPage: CostOfLivingPage,

  AnnuityCalculator: AnnuityCalculator,

  SimpleInterestCalculator: SimpleInterestCalculator,

  SalaryIncreaseCalculator: SalaryIncreaseCalculator,

  EffectiveTaxRateCalculator: EffectiveTaxRateCalculator,

  HomeEquityLoanCalculator: HomeEquityLoanCalculator,

  CommissionCalculator: CommissionCalculator,

  DividendTaxCalculator: DividendTaxCalculator,

  FutureValueCalculator: FutureValueCalculator,

  OvertimePayCalculator: OvertimePayCalculator,

  LoanComparisonCalculator: LoanComparisonCalculator,

  InheritanceTaxCalculator: InheritanceTaxCalculator,

  CouncilTaxCalculator: CouncilTaxCalculator,

  MortgageRepaymentCalculator: MortgageRepaymentCalculator,

  FirstTimeBuyerCalculator: FirstTimeBuyerCalculator,

  RentVsBuyCalculator: RentVsBuyCalculator,

  HouseholdBillsSplitter: HouseholdBillsSplitter,

  CommuteCostCalculator: CommuteCostCalculator,

  CarCostCalculator: CarCostCalculator,

  SubscriptionCostCalculator: SubscriptionCostCalculator,

  RuleOf72Calculator: RuleOf72Calculator,

  StudentLoanRepaymentCalculator: StudentLoanRepaymentCalculator,

  WeddingBudgetCalculator: WeddingBudgetCalculator,

  TravelBudgetCalculator: TravelBudgetCalculator,

  ChildcareCostCalculator: ChildcareCostCalculator,

  TipCalculator: TipCalculator,

  OvertimeRateCalculator: OvertimeRateCalculator,

  CurrencyConverter: CurrencyConverter,

  UKFinancialStats: UKFinancialStats,

  SalaryCalculatorUK: SalaryCalculatorUK,

  SalaryCalculatorTakeHomePay: SalaryCalculatorTakeHomePay,

  SalaryCalculatorPaycheck: SalaryCalculatorPaycheck,

  GrossToNetCalculator: GrossToNetCalculator,

  Methodology: Methodology,

  About: About,

  TaxCalculatorsUK: TaxCalculatorsUK,

  TaxAfterTaxCalculator: TaxAfterTaxCalculator,

  TaxAndNICalculator: TaxAndNICalculator,

  NetIncomeUKCalculator: NetIncomeUKCalculator,

  SelfAssessmentGuide: SelfAssessmentGuide,

  MortgageCalculatorUK: MortgageCalculatorUK,

  MortgageLoanRepayment: MortgageLoanRepayment,

  HomeLoanMortgageCalculator: HomeLoanMortgageCalculator,

  MortgageComparison: MortgageComparison,

  LinkToUs: LinkToUs,
};

function _getCurrentPage(url) {
  if (url.endsWith('/')) {
    url = url.slice(0, -1);
  }
  let urlLastPart = url.split('/').pop();
  if (urlLastPart.includes('?')) {
    urlLastPart = urlLastPart.split('?')[0];
  }

  const pageName = Object.keys(PAGES).find(
    (page) => page.toLowerCase() === urlLastPart.toLowerCase()
  );
  return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
  const location = useLocation();
  const currentPage = _getCurrentPage(location.pathname);

  return (
    <Layout currentPageName={currentPage}>
      <Routes>
        {/* Home/Index Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} /> {/* Corrected casing */}
        {/* --- Core Calculators & Tools --- */}
        <Route path="/budget-calculator" element={<BudgetCalculator />} />
        <Route path="/debt-calculator" element={<DebtCalculator />} />
        <Route path="/mortgage-calculator" element={<MortgageCalculator />} />
        <Route path="/compound-interest-calculator" element={<CompoundInterestCalculator />} />
        <Route path="/savings-goal-calculator" element={<SavingsGoalCalculator />} />
        <Route path="/pension-calculator" element={<PensionCalculator />} />
        <Route path="/emergency-fund-calculator" element={<EmergencyFundCalculator />} />
        <Route path="/inflation-calculator" element={<InflationCalculator />} />
        <Route path="/dream-lifestyle-calculator" element={<DreamLifestyleCalculator />} />
        <Route path="/minimum-wage-calculator" element={<MinimumWageCalculator />} />
        <Route
          path="/hourly-to-annual-salary-calculator"
          element={<HourlyToAnnualSalaryCalculator />}
        />
        <Route path="/fire-calculator" element={<FIRECalculator />} />
        <Route path="/net-worth-calculator" element={<NetWorthCalculator />} />
        <Route path="/energy-bill-calculator" element={<EnergyBillCalculator />} />
        <Route path="/rental-income-calculator" element={<RentalIncomeCalculator />} />
        <Route path="/brrrr-calculator" element={<BRRRRCalculator />} />
        <Route path="/pro-rata-salary-calculator" element={<ProRataSalaryCalculator />} />
        <Route path="/loan-repayment-calculator" element={<LoanRepaymentCalculator />} />
        <Route path="/freelancer-day-rate-calculator" element={<FreelancerDayRateCalculator />} />
        <Route
          path="/pension-contribution-calculator"
          element={<PensionContributionCalculator />}
        />
        <Route path="/business-loan-calculator" element={<BusinessLoanCalculator />} />
        <Route path="/break-even-calculator" element={<BreakEvenCalculator />} />
        <Route path="/car-loan-calculator" element={<CarLoanCalculator />} />
        <Route path="/debt-to-income-ratio-calculator" element={<DebtToIncomeRatioCalculator />} />
        <Route path="/buy-to-let-mortgage-calculator" element={<BuyToLetMortgageCalculator />} />
        <Route path="/remortgage-calculator" element={<RemortgageCalculator />} />
        <Route path="/investment-calculator" element={<InvestmentCalculator />} />
        <Route path="/personal-loan-calculator" element={<PersonalLoanCalculator />} />
        <Route
          path="/credit-card-repayment-calculator"
          element={<CreditCardRepaymentCalculator />}
        />
        <Route path="/retirement-savings-calculator" element={<RetirementSavingsCalculator />} />
        <Route path="/amortization-calculator" element={<AmortizationCalculator />} />
        <Route path="/annuity-calculator" element={<AnnuityCalculator />} />
        <Route path="/simple-interest-calculator" element={<SimpleInterestCalculator />} />
        <Route path="/salary-increase-calculator" element={<SalaryIncreaseCalculator />} />
        <Route path="/effective-tax-rate-calculator" element={<EffectiveTaxRateCalculator />} />
        <Route path="/home-equity-loan-calculator" element={<HomeEquityLoanCalculator />} />
        <Route path="/commission-calculator" element={<CommissionCalculator />} />
        <Route path="/dividend-tax-calculator" element={<DividendTaxCalculator />} />
        <Route path="/future-value-calculator" element={<FutureValueCalculator />} />
        <Route path="/overtime-pay-calculator" element={<OvertimePayCalculator />} />
        <Route path="/loan-comparison-calculator" element={<LoanComparisonCalculator />} />
        <Route path="/mortgage-repayment-calculator" element={<MortgageRepaymentCalculator />} />
        <Route path="/first-time-buyer-calculator" element={<FirstTimeBuyerCalculator />} />
        <Route path="/rent-vs-buy-calculator" element={<RentVsBuyCalculator />} />
        <Route path="/household-bills-splitter" element={<HouseholdBillsSplitter />} />
        <Route path="/commute-cost-calculator" element={<CommuteCostCalculator />} />
        <Route path="/car-cost-calculator" element={<CarCostCalculator />} />
        <Route path="/subscription-cost-calculator" element={<SubscriptionCostCalculator />} />
        <Route path="/rule-of-72-calculator" element={<RuleOf72Calculator />} />
        <Route path="/wedding-budget-calculator" element={<WeddingBudgetCalculator />} />
        <Route path="/travel-budget-calculator" element={<TravelBudgetCalculator />} />
        <Route path="/childcare-cost-calculator" element={<ChildcareCostCalculator />} />
        <Route path="/tip-calculator" element={<TipCalculator />} />
        <Route path="/overtime-rate-calculator" element={<OvertimeRateCalculator />} />
        <Route path="/currency-converter" element={<CurrencyConverter />} />
        {/* --- UK Tax & Payroll Calculators --- */}
        <Route path="/income-tax-calculator" element={<IncomeTaxCalculator />} />
        <Route path="/national-insurance-calculator" element={<NationalInsuranceCalculator />} />
        <Route path="/student-loan-calculator" element={<StudentLoanCalculator />} />
        <Route path="/maternity-pay-calculator" element={<MaternityPayCalculator />} />
        <Route path="/statutory-sick-pay-calculator" element={<StatutorySickPayCalculator />} />
        <Route path="/salary-sacrifice-calculator" element={<SalarySacrificeCalculator />} />
        <Route path="/holiday-pay-calculator" element={<HolidayPayCalculator />} />
        <Route path="/redundancy-pay-calculator" element={<RedundancyPayCalculator />} />
        <Route path="/overtime-bonus-calculator" element={<OvertimeBonusCalculator />} />
        <Route path="/paye-calculator" element={<PAYECalculator />} />
        <Route path="/vat-calculator" element={<VATCalculator />} />
        <Route path="/isa-calculator" element={<ISACalculator />} />
        <Route path="/capital-gains-tax-calculator" element={<CapitalGainsTaxCalculator />} />
        <Route path="/corporation-tax-calculator" element={<CorporationTaxCalculator />} />
        <Route path="/stamp-duty-calculator" element={<StampDutyCalculator />} />
        <Route path="/payroll-calculator" element={<PayrollCalculator />} />
        <Route path="/inheritance-tax-calculator" element={<InheritanceTaxCalculator />} />
        <Route path="/council-tax-calculator" element={<CouncilTaxCalculator />} />
        <Route
          path="/student-loan-repayment-calculator"
          element={<StudentLoanRepaymentCalculator />}
        />
        <Route path="/salary-calculator-uk" element={<SalaryCalculatorUK />} />
        <Route path="/salary-calculator-take-home-pay" element={<SalaryCalculatorTakeHomePay />} />
        <Route path="/salary-calculator-paycheck" element={<SalaryCalculatorPaycheck />} />
        <Route path="/gross-to-net-calculator" element={<GrossToNetCalculator />} />
        <Route path="/tax-calculators-uk" element={<TaxCalculatorsUK />} />
        <Route path="/tax-after-tax-calculator" element={<TaxAfterTaxCalculator />} />
        <Route path="/tax-and-ni-calculator" element={<TaxAndNICalculator />} />
        <Route path="/net-income-uk-calculator" element={<NetIncomeUKCalculator />} />
        <Route path="/mortgage-calculator-uk" element={<MortgageCalculatorUK />} />
        <Route path="/mortgage-loan-repayment" element={<MortgageLoanRepayment />} />
        <Route path="/home-loan-mortgage-calculator" element={<HomeLoanMortgageCalculator />} />
        <Route path="/mortgage-comparison" element={<MortgageComparison />} />
        <Route
          path="/mortgage-affordability-calculator"
          element={<MortgageAffordabilityCalculator />}
        />
        {/* --- Static/Blog/Data Pages --- */}
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
        <Route path="/contractor-calculator" element={<ContractorCalculator />} />
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
      </Routes>
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
