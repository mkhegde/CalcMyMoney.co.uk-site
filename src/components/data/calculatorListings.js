import { generatedCalculatorCatalog } from './calculatorCatalog.generated.js';

export const calculatorListings = generatedCalculatorCatalog.map((category) => ({
  category: category.name,
  slug: category.slug,
  description: category.description,
  calculators: (category.calculators || []).map((calculator) => ({
    name: calculator.name,
    slug: calculator.slug,
    path: calculator.url,
    keywords: Array.isArray(calculator.keywords) ? calculator.keywords : [],
  })),
}));
