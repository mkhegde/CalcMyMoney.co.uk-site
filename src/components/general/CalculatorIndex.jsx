import React from 'react';
import { Link } from 'react-router-dom';
import { calculatorCategories } from '../data/calculatorConfig.js';
import { createPageUrl } from '@/utils';

export default function CalculatorIndex() {
  return (
    <section className="bg-white border-t border-gray-200 non-printable">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <details className="group">
          <summary className="cursor-pointer list-none">
            <div className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg p-4 transition-colors">
              <div>
                <h2 className="text-lg md:text-xl font-semibold text-gray-900">
                  Browse all calculators (A–Z by category)
                </h2>
                <p className="text-sm text-gray-600">
                  Open this index to quickly jump to any tool across the site.
                </p>
              </div>
              <span className="text-blue-600 text-sm font-medium">Show/Hide</span>
            </div>
          </summary>

          <div className="mt-6 space-y-10">
            {calculatorCategories.map((category) => (
              <div key={category.slug}>
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-xl font-bold text-gray-900">{category.name}</h3>
                  <span className="text-xs text-gray-500">
                    {/* anchor to homepage category for users who prefer the hub */}
                    <a
                      href={`${createPageUrl('Home')}#${category.slug}`}
                      className="text-blue-600 hover:underline"
                    >
                      View on directory
                    </a>
                  </span>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.subCategories.map((sub) => (
                    <div key={sub.name}>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">{sub.name}</h4>
                      <ul className="space-y-1">
                        {sub.calculators
                          .filter((c) => c.status === 'active')
                          .map((calc) => (
                            <li key={calc.name}>
                              <Link
                                to={calc.url}
                                className="text-blue-600 hover:text-blue-800 hover:underline text-sm"
                              >
                                {calc.name}
                              </Link>
                            </li>
                          ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </details>
      </div>
    </section>
  );
}
