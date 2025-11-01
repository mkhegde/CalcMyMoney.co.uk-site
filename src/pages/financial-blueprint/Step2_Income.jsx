// src/pages/financial-blueprint/Step2_Income.jsx
import React from 'react';

// --- THIS LINE IS NOW FIXED ---
const Step2_Income = ({ onBack, onNext, formData, handleChange }) => {
  // We reuse the exact same styles from Step 1 for perfect consistency
  const inputStyles = "mt-1 block w-full rounded-md border-gray-400 bg-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2";

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Step 2: Your Income</h2>
        <p className="mt-2 text-gray-600">Please provide details about your household's annual and monthly income.</p>
      </div>

      <div className="space-y-6 rounded-lg bg-gray-50 p-6 border border-gray-200">
        {/* Your Annual Salary */}
        <div>
          <label htmlFor="yourSalary" className="block text-sm font-medium text-gray-700">
            Your Annual Salary (before tax)
          </label>
          <input type="number" id="yourSalary" name="yourSalary" value={formData.yourSalary} onChange={handleChange} className={inputStyles} placeholder="e.g., 65000" />
        </div>

        {/* Partner's Annual Salary (Conditional) */}
        {formData.blueprintFor === 'family' && (
          <div>
            <label htmlFor="partnerSalary" className="block text-sm font-medium text-gray-700">
              Your Partner's Annual Salary (before tax)
            </label>
            <input type="number" id="partnerSalary" name="partnerSalary" value={formData.partnerSalary} onChange={handleChange} className={inputStyles} placeholder="e.g., 55000" />
          </div>
        )}

        {/* Other Monthly Income */}
        <div>
          <label htmlFor="otherIncome" className="block text-sm font-medium text-gray-700">
            Average Monthly Income from Other Sources
          </label>
          <input type="number" id="otherIncome" name="otherIncome" value={formData.otherIncome} onChange={handleChange} className={inputStyles} placeholder="e.g., 250" />
          <p className="mt-1 text-xs text-gray-500">e.g., side hustles, rental income, investments.</p>
        </div>

        {/* Monthly Benefits Income */}
        <div>
          <label htmlFor="benefitsIncome" className="block text-sm font-medium text-gray-700">
            Total Monthly Income from Benefits
          </label>
          <input type="number" id="benefitsIncome" name="benefitsIncome" value={formData.benefitsIncome} onChange={handleChange} className={inputStyles} placeholder="e.g., 150" />
          <p className="mt-1 text-xs text-gray-500">e.g., Child Benefit, Universal Credit, PIP.</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button onClick={onBack} className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
          Back
        </button>
        <button onClick={onNext} className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700">
          Next
        </button>
      </div>
    </div>
  );
};

export default Step2_Income;
