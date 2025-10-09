import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function RelatedCalculators({ calculators = [] }) {
  const list = Array.isArray(calculators) ? calculators.slice(0, 3) : [];

  const onClick = (url) => () => {
    try {
      // Prefer global analytics if present
      // eslint-disable-next-line no-undef
      if (typeof trackEvent === 'function') trackEvent('related_calculator_click', { label: url });
      // Fallback to gtag
      // eslint-disable-next-line no-undef
      else window?.gtag?.('event', 'related_calculator_click', { label: url });
    } catch {}
  };

  if (!list.length) return null;

  return (
    <section aria-labelledby="related-tools" className="bg-white dark:bg-gray-900 py-12 non-printable" data-related-calculators="1">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 id="related-tools" className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100 mb-8">
          Related Financial Tools
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((calc, index) => (
            <Link
              key={index}
              to={calc.url}
              onClick={onClick(calc.url)}
              className="group block p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-lg transition-all duration-300"
            >
              <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 mb-2">
                {calc.name}
              </h3>
              {calc.description && (
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{calc.description}</p>
              )}
              <div className="flex items-center text-sm font-medium text-blue-600 dark:text-blue-400">
                <span>Use Calculator</span>
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
