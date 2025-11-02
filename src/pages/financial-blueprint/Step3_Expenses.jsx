// src/pages/financial-blueprint/Step3_Expenses.jsx
import React from 'react';
// We need to define MoneyInput or import it correctly.
// Let's import the one from Step2 as it's a great reusable component.
import { MoneyInput } from './Step2_Income';

const Step3_Expenses = ({ onBack, onNext, formData, handleChange }) => {
  return (
    <div className="space-y-8">
      <div className="text-center"><h2 className="text-2xl font-bold">Step 3 of 7: What You Spend</h2><p className="mt-2 text-gray-600">Provide an estimate of your household expenses. Use '0' if not applicable.</p></div>
      <div className="space-y-6 rounded-lg bg-gray-50 p-6 border border-gray-200">
        <MoneyInput label="Total Monthly Essential Expenses" name="essentialExpenses" value={formData.essentialExpenses} handleChange={handleChange} placeholder="2,200" helpText="e.g., mortgage/rent, utilities, groceries, transport." />
        <MoneyInput label="Total Monthly Discretionary (Non-Essential) Spending" name="discretionaryExpenses" value={formData.discretionaryExpenses} handleChange={handleChange} placeholder="600" helpText="e.g., dining out, hobbies, subscriptions, entertainment." />
        <MoneyInput label="Total Annual Cost of Large, Infrequent Expenses" name="annualExpenses" value={formData.annualExpenses} handleChange={handleChange} placeholder="3,000" helpText="e.g., holidays, car insurance/MOT, Christmas." />
      </div>
      <div className="flex justify-between">
        <button type="button" onClick={onBack} className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">Back</button>
        <button type="button" onClick={onNext} className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700">Next</button>
      </div>
    </div>
  );
};
export default Step3_Expenses;
