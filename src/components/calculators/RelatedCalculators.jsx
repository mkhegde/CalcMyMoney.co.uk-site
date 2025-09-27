import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function RelatedCalculators({ calculators }) {
  return (
    <div className="bg-white dark:bg-gray-900 py-12 non-printable">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100 mb-8">
          Related Financial Tools
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {calculators.map((calc, index) => (
            <Link
              key={index}
              to={calc.url}
              className="group block p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-lg transition-all duration-300"
            >
              <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 mb-2">
                {calc.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{calc.description}</p>
              <div className="flex items-center text-sm font-medium text-blue-600 dark:text-blue-400">
                <span>Use Calculator</span>
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
