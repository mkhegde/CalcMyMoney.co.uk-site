// src/pages/financial-blueprint/QuestionnaireForm.jsx

import React from 'react';

const QuestionnaireForm = ({ formData, handleChange, handleSubmit, isLoading }) => {
  return (
    // Main container with padding and max-width
    <div className="max-w-3xl mx-auto p-4 sm:p-6 md:p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">My Financial Blueprint</h1>
          <p className="mt-2 text-lg text-gray-600">Fill in the details below to generate your personalized financial analysis.</p>
        </div>

        {/* Form fields container with a subtle border and padding */}
        <div className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          {/* Gross Annual Income Field */}
          <div>
            <label htmlFor="grossAnnualIncome" className="block text-sm font-medium text-gray-700">
              Gross Annual Income (£)
            </label>
            <div className="mt-1">
              <input
                type="number"
                id="grossAnnualIncome"
                name="grossAnnualIncome"
                value={formData.grossAnnualIncome}
                onChange={handleChange}
                required
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="e.g., 65000"
              />
            </div>
          </div>

          {/* Monthly Essential Expenses Field  */}
          <div>
            <label htmlFor="monthlyEssentialExpenses" className="block text-sm font-medium text-gray-700">
              Total Monthly Essential Expenses (£)
            </label>
            <div className="mt-1">
              <input
                type="number"
                id="monthlyEssentialExpenses"
                name="monthlyEssentialExpenses"
                value={formData.monthlyEssentialExpenses}
                onChange={handleChange}
                required
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="e.g., 2000"
              />
            </div>
          </div>

          {/* High-Interest Credit Card Debt Field */}
          <div>
            <label htmlFor="creditCardDebt" className="block text-sm font-medium text-gray-700">
              High-Interest Credit Card Debt (£)
            </label>
            <div className="mt-1">
              <input
                type="number"
                id="creditCardDebt"
                name="liabilities.creditCardDebt"
                value={formData.liabilities.creditCardDebt}
                onChange={handleChange}
                required
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="e.g., 2000"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-right">
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? 'Generating Report...' : 'Generate My Report'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuestionnaireForm;
