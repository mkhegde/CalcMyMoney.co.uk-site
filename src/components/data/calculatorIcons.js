import {
  Calculator,
  Home,
  Coins,
  PiggyBank,
  FileText,
  CreditCard,
  Wallet,
  Briefcase,
  Zap,
  Users,
} from 'lucide-react';

export const ICONS_BY_SLUG = {
  'mortgages-property': Home,
  'tax-income': Coins,
  'retirement-pensions': FileText,
  'savings-investments': PiggyBank,
  'debt-loans': CreditCard,
  'budgeting-planning': Wallet,
  'business-freelancing': Briefcase,
  'utilities-tools': Zap,
  'family-lifestyle': Users,
};

export const getCategoryIcon = (slug) => ICONS_BY_SLUG[slug] || Calculator;
