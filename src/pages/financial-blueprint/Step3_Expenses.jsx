// src/pages/financial-blueprint/Step3_Expenses.jsx
import React from 'react';

const Step3_Expenses = ({ onBack, onNext, formData, handleChange }) => {
  // Reusing our consistent, high-contrast input styles
  const inputStyles = "mt-1 block w-full rounded-md border-gray-400 bg-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2";

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Step 3: Your Expenses</h2>
        <p className="mt-2 text-gray-600">Provide an estimate of your regular household expenses.</p>
      </div>

      <div className="space-y-6 rounded-lg bg-gray-50 p-6 border border-gray-200">
        {/* Monthly Essential Expenses */}
        <div>
          <label htmlFor="essentialExpenses" className="block text-sm font-medium text-gray-700">
            Total Monthly Essential Expenses
          </label>
          <input type="number" id="essentialExpenses" name="essentialExpenses" value={formData.essentialExpenses} onChange={handleChange} className={inputStyles} placeholder="e.g., 2200" />
          <p className="mt-1 text-xs text-gray-500">e.g., mortgage/rent, utilities, groceries, transport.</p>
        </div>

        {/* Monthly Discretionary Expenses */}
        <div>
          <label htmlFor="discretionaryExpenses" className="block text-sm font-medium text-gray-700">
            Total Monthly Discretionary (Non-Essential) Spending
          </label>
          <input type="number" id="discretionaryExpenses" name="discretionaryExpenses" value={formData.discretionaryExpenses} onChange={handleChange} className={inputStyles} placeholder="e.g., 600" />
          <p className="mt-1 text-xs text-gray-500">e.g., dining out, hobbies, subscriptions, entertainment.</p>
        </div>

        {/* Annual Irregular Expenses */}
        <div>
          <label htmlFor="annualExpenses" className="block text-sm font-medium text-gray-700">
            Total Annual Cost of Large, Infrequent Expenses (Optional)
          </label>
          <input type="number" id="annualExpenses" name="annualExpenses" value={formData.annualExpenses} onChange={handleChange} className={inputStyles} placeholder="e.g., 3000" />
          <p className="mt-1 text-xs text-gray-500">e.g., holidays, car insurance/MOT, Christmas.</p>
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

export default Step3_Expenses;
