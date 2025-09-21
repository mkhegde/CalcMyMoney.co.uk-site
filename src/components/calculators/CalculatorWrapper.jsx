import React from 'react';

export default function CalculatorWrapper({ children }) {
  return (
    <div className="bg-white dark:bg-gray-900 py-12 non-printable">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
          {children}
        </div>
      </div>
    </div>
  );
}