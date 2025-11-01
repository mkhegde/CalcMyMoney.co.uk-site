// src/pages/financial-blueprint/Step4_Assets.jsx
import React from 'react';

const Step4_Assets = ({ onBack, onNext, formData, handleChange }) => {
  // Reusing our consistent, high-contrast input styles
  const inputStyles = "mt-1 block w-full rounded-md border-gray-400 bg-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2";

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Step 4: Your Assets</h2>
        <p className="mt-2 text-gray-600">Enter the current estimated value of your assets.</p>
      </div>

      <div className="space-y-6 rounded-lg bg-gray-50 p-6 border border-gray-200">
        {/* Cash Savings */}
        <div>
          <label htmlFor="cashSavings" className="block text-sm font-medium text-gray-700">
            Cash Savings
          </label>
          <input type="number" id="cashSavings" name="cashSavings" value={formData.cashSavings} onChange={handleChange} className={inputStyles} placeholder="e.g., 15000" />
          <p className="mt-1 text-xs text-gray-500">Total in current accounts, savings accounts, etc.</p>
        </div>

        {/* Pension Value */}
        <div>
          <label htmlFor="pensionValue" className="block text-sm font-medium text-gray-700">
            Total Pension Value
          </label>
          <input type="number" id="pensionValue" name="pensionValue" value={formData.pensionValue} onChange={handleChange} className={inputStyles} placeholder="e.g., 50000" />
          <p className="mt-1 text-xs text-gray-500">Include all workplace and private pensions.</p>
        </div>

        {/* Property Value */}
        <div>
          <label htmlFor="propertyValue" className="block text-sm font-medium text-gray-700">
            Primary Residence Value (Optional)
          </label>
          <input type="number" id="propertyValue" name="propertyValue" value={formData.propertyValue} onChange={handleChange} className={inputStyles} placeholder="e.g., 250000" />
          <p className="mt-1 text-xs text-gray-500">Your current estimated home value.</p>
        </div>

        {/* Other Investments */}
        <div>
          <label htmlFor="otherInvestments" className="block text-sm font-medium text-gray-700">
            Other Investments (Optional)
          </label>
          <input type="number" id="otherInvestments" name="otherInvestments" value={formData.otherInvestments} onChange={handleChange} className={inputStyles} placeholder="e.g., 10000" />
          <p className="mt-1 text-xs text-gray-500">e.g., Stocks & Shares ISAs, funds, crypto.</p>
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

export default Step4_Assets;
