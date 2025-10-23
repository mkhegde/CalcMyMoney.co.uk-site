import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

import { calculatorListings } from '../src/components/data/calculatorListings.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '..');
const calculatorsDir = path.resolve(projectRoot, 'src/pages/calculators');
const outputPath = path.resolve(projectRoot, 'src/components/data/calculatorCatalog.generated.js');

const CATEGORY_DEFINITIONS = [
  {
    slug: 'mortgages-property',
    name: 'Mortgages & Property',
    description: 'Mortgage and property tools for buying, remortgaging, and landlord planning in the UK.',
  },
  {
    slug: 'tax-income',
    name: 'Tax & Income',
    description: 'Understand UK tax bands, payroll deductions, and take-home pay across every income type.',
  },
  {
    slug: 'retirement-pensions',
    name: 'Retirement & Pensions',
    description: 'Plan UK pension contributions, retirement income needs, and annuity choices.',
  },
  {
    slug: 'savings-investments',
    name: 'Savings & Investments',
    description: 'Project savings growth, investment returns, and the impact of inflation or compounding.',
  },
  {
    slug: 'debt-loans',
    name: 'Debt & Loans',
    description: 'Compare borrowing options and build repayment strategies for loans, credit, and debt.',
  },
  {
    slug: 'budgeting-planning',
    name: 'Budgeting & Planning',
    description: 'Track budgets, plan major purchases, and stay on top of day-to-day money decisions.',
  },
  {
    slug: 'business-freelancing',
    name: 'Business & Freelancing',
    description: 'Essential tools for contractors, freelancers, and small business owners in the UK.',
  },
  {
    slug: 'utilities-tools',
    name: 'Utilities & Tools',
    description: 'Handy everyday calculators for bills, conversions, and splitting shared household costs.',
  },
  {
    slug: 'family-lifestyle',
    name: 'Family & Lifestyle',
    description: 'Plan for family expenses, benefits, and big lifestyle milestones with confidence.',
  },
];

const LISTING_CATEGORY_SLUGS = {
  'Loans & Debt': 'debt-loans',
  'Pensions & Retirement': 'retirement-pensions',
  'Savings & Investments': 'savings-investments',
  'Mortgages & Property': 'mortgages-property',
  'Budgeting & Expenses': 'budgeting-planning',
  'Budgeting & Planning': 'budgeting-planning',
  'Taxes & Compliance': 'tax-income',
  'Tax & Income': 'tax-income',
  'Family & Benefits': 'family-lifestyle',
  'Family & Lifestyle': 'family-lifestyle',
  'Income & Employment': 'tax-income',
  'Business & Freelancing': 'business-freelancing',
  'Freelance & Contracting': 'business-freelancing',
  'Income & Payroll': 'tax-income',
  'Lifestyle Goals': 'family-lifestyle',
  'Utilities & Tools': 'utilities-tools',
  'Household & Utilities': 'utilities-tools',
};

const manualCategoryAssignments = {
  'break-even-calculator': 'business-freelancing',
  'budget-calculator': 'budgeting-planning',
  'business-loan-calculator': 'business-freelancing',
  'council-tax-calculator': 'tax-income',
  'first-time-buyer-calculator': 'mortgages-property',
  'inheritance-tax-calculator': 'tax-income',
  'investment-calculator': 'savings-investments',
  'maternity-pay-calculator': 'tax-income',
  'minimum-wage-calculator': 'tax-income',
  'national-insurance-calculator': 'tax-income',
  'payroll-calculator': 'tax-income',
  'pension-contribution-calculator': 'retirement-pensions',
  'personal-allowance-calculator': 'tax-income',
  'personal-loan-calculator': 'debt-loans',
  'redundancy-pay-calculator': 'tax-income',
  'remortgage-calculator': 'mortgages-property',
  'rule-of-72-calculator': 'savings-investments',
  'savings-goal-calculator': 'savings-investments',
  'household-bills-splitter': 'utilities-tools',
  'dream-lifestyle-calculator': 'family-lifestyle',
  'energy-bill-calculator': 'utilities-tools',
  'fuel-cost-calculator': 'utilities-tools',
  'price-per-unit-calculator': 'utilities-tools',
  'tip-calculator': 'utilities-tools',
  'emergency-fund-calculator': 'budgeting-planning',
  'net-worth-calculator': 'budgeting-planning',
  'personal-finance-calculator': 'budgeting-planning',
  'travel-budget-calculator': 'family-lifestyle',
  'wedding-budget-calculator': 'family-lifestyle',
  'weekly-budget-planner': 'budgeting-planning',
  'subscription-cost-calculator': 'budgeting-planning',
  'car-cost-calculator': 'budgeting-planning',
  'commute-cost-calculator': 'budgeting-planning',
  'cost-of-living-calculator': 'budgeting-planning',
  'down-payment-calculator': 'mortgages-property',
  'home-equity-loan-calculator': 'mortgages-property',
  'capital-gains-tax-calculator': 'tax-income',
  'contractor-calculator': 'business-freelancing',
  'corporation-tax-calculator': 'business-freelancing',
  'dividend-tax-calculator': 'tax-income',
  'effective-tax-rate-calculator': 'tax-income',
  'freelancer-day-rate-calculator': 'business-freelancing',
  'gross-to-net-calculator': 'tax-income',
  'income-tax-calculator': 'tax-income',
  'net-income-uk-calculator': 'tax-income',
  'ni-calculator': 'tax-income',
  'paye-calculator': 'tax-income',
  'property-tax-calculator': 'tax-income',
  'salary-calculator': 'tax-income',
  'salary-sacrifice-calculator': 'tax-income',
  'sdlt-calculator': 'mortgages-property',
  'self-assessment-calculator': 'tax-income',
  'take-home-pay-calculator': 'tax-income',
  'tax-refund-calculator': 'tax-income',
  'vat-calculator': 'business-freelancing',
};

const toTitleCase = (slug) => {
  const acronyms = {
    uk: 'UK',
    roi: 'ROI',
    isa: 'ISA',
    vat: 'VAT',
    ni: 'NI',
    sdlt: 'SDLT',
    brrrr: 'BRRRR',
    fire: 'FIRE',
    paye: 'PAYE',
    cgt: 'CGT',
  };
  return slug
    .split('-')
    .map((part) => {
      const lower = part.toLowerCase();
      if (acronyms[lower]) return acronyms[lower];
      if (lower === 'vs') return 'vs';
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(' ');
};

const calculatorFiles = fs
  .readdirSync(calculatorsDir)
  .filter((file) => file.endsWith('.jsx'))
  .sort();

const slugToListingEntry = new Map();
for (const entry of calculatorListings) {
  const categorySlug = entry.slug || LISTING_CATEGORY_SLUGS[entry.category];
  if (!categorySlug) continue;
  for (const calc of entry.calculators) {
    slugToListingEntry.set(calc.slug, {
      categorySlug,
      keywords: Array.isArray(calc.keywords) ? calc.keywords : [],
      name: calc.name,
    });
  }
}

const calculatorsByCategory = new Map(
  CATEGORY_DEFINITIONS.map((cat) => [cat.slug, []])
);

const errors = [];

for (const file of calculatorFiles) {
  const slug = file.replace(/\.jsx$/, '');
  const filePath = path.resolve(calculatorsDir, file);
  const source = fs.readFileSync(filePath, 'utf8');

  const listingInfo = slugToListingEntry.get(slug);
  const manualCategory = manualCategoryAssignments[slug];
  const categorySlug = manualCategory || listingInfo?.categorySlug;

  if (!categorySlug) {
    errors.push(`No category mapping found for ${slug}`);
    continue;
  }

  const nameFromListing = listingInfo?.name;
  const defaultName = toTitleCase(slug.replace(/-calculator$/, '')) + ' Calculator';
  const name = nameFromListing || defaultName;

  let description = '';
  const match = source.match(/const\s+metaDescription\s*=\s*([^;]+);/);
  if (match) {
    try {
      description = vm.runInNewContext(match[1]);
    } catch (error) {
      errors.push(`Unable to evaluate metaDescription for ${slug}: ${error.message}`);
    }
  }
  if (!description) {
    description = `Use the ${name} to make informed UK money decisions.`;
  }

  const keywords = listingInfo?.keywords || [];

  const buildPublicUrl = (value) => {
    const raw = typeof value === 'string' ? value.trim() : '';
    const withLeadingSlash = raw ? (raw.startsWith('/') ? raw : `/${raw}`) : '';

    if (!withLeadingSlash) {
      return slug ? `/${slug}` : '/';
    }

    if (withLeadingSlash === '/calculators') {
      return '/';
    }

    if (withLeadingSlash.startsWith('/calculators/')) {
      const stripped = withLeadingSlash.replace(/^\/calculators\//, '/');
      return stripped === '' ? '/' : stripped;
    }

    return withLeadingSlash;
  };

  calculatorsByCategory.get(categorySlug).push({
    slug,
    name,
    description,
    url: buildPublicUrl(`/calculators/${slug}`),
    page: `calculators/${slug}`,
    keywords,
    status: 'active',
  });
}

if (errors.length > 0) {
  throw new Error(errors.join('\n'));
}

const generated = CATEGORY_DEFINITIONS.map((category) => {
  const calculators = calculatorsByCategory.get(category.slug) || [];
  calculators.sort((a, b) => a.name.localeCompare(b.name));
  return {
    name: category.name,
    slug: category.slug,
    description: category.description,
    calculators,
  };
});

const fileBanner = `/**\n * This file is auto-generated by scripts/build-calculator-data.mjs.\n * Do not edit manually.\n */`;

const fileContents = `${fileBanner}\n\nexport const generatedCalculatorCatalog = ${JSON.stringify(
  generated,
  null,
  2
)};\n`;

fs.writeFileSync(outputPath, fileContents, 'utf8');
console.log(`Wrote ${outputPath}`);
