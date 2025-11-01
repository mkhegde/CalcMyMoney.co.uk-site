// src/pages/financial-blueprint/Step5_Liabilities.jsx
import React from 'react';

const Step5_Liabilities = ({ onBack, onNext, formData, handleChange }) => {
  // Reusing our consistent, high-contrast input styles
  const inputStyles = "mt-1 block w-full rounded-md border-gray-400 bg-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2";

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Step 5: Your Liabilities (Debt)</h2>
        <p className="mt-2 text-gray-600">Enter the outstanding balance on your major debts.</p>
      </div>

      <div className="space-y-6 rounded-lg bg-gray-50 p-6 border border-gray-200">
        {/* Outstanding Mortgage */}
        <div>
          <label htmlFor="mortgageBalance" className="block text-sm font-medium text-gray-700">
            Outstanding Mortgage Balance (Optional)
          </label>
          <input type="number" id="mortgageBalance" name="mortgageBalance" value={formData.mortgageBalance} onChange={handleChange} className={inputStyles} placeholder="e.g., 200000" />
          <p className="mt-1 text-xs text-gray-500">The total amount you still owe on your property.</p>
        </div>

        {/* Credit Card Debt */}
        <div>
          <label htmlFor="creditCardDebt" className="block text-sm font-medium text-gray-700">
            Total Credit Card Debt
          </label>
          <input type="number" id="creditCardDebt" name="creditCardDebt" value={formData.creditCardDebt} onChange={handleChange} className={inputStyles} placeholder="e.g., 5000" />
          <p className="mt-1 text-xs text-gray-500">Include store cards and other credit lines.</p>
        </div>

        {/* Other Loans */}
        <div>
          <label htmlFor="otherLoans" className="block text-sm font-medium text-gray-700">
            Other Loans (Optional)
          </label>
          <input type="number" id="otherLoans" name="otherLoans" value={formData.otherLoans} onChange={handleChange} className={inputStyles} placeholder="e.g., 8000" />
          <p className="mt-1 text-xs text-gray-500">e.g., car finance, personal loans, student loans.</p>
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

export default Step5_Liabilities;
