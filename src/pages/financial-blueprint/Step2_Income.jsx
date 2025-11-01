// src/pages/financial-blueprint/Step2_Income.jsx
import React from 'react';
import { safeGBP, parseMoney } from '../../utils/number';

// Reusable component for our new Pound Sterling inputs
const MoneyInput = ({ label, name, value, handleChange, placeholder, helpText }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
        <div className="relative mt-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><span className="text-gray-500 sm:text-sm">£</span></div>
            <input 
                type="text" 
                inputMode="decimal"
                id={name} 
                name={name} 
                // Display value formatted with commas, removing fractions
                value={safeGBP(parseMoney(value), { minimumFractionDigits: 0, maximumFractionDigits: 0 })} 
                // On change, send the raw number back up to the state manager
                onChange={(e) => handleChange({ target: { name, value: parseMoney(e.target.value) } })} 
                className="pl-7 block w-full rounded-md border-gray-400 bg-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2" 
                placeholder={placeholder} 
                required 
            />
        </div>
        {helpText && <p className="mt-1 text-xs text-gray-500">{helpText}</p>}
    </div>
);

const Step2_Income = ({ onBack, onNext, formData, handleChange }) => {
  return (
    <div className="space-y-8">
      <div className="text-center"><h2 className="text-2xl font-bold">Step 2 of 7: What You Earn</h2><p className="mt-2 text-gray-600">Enter your household's income. Use '0' if a field isn't applicable.</p></div>
      <div className="space-y-6 rounded-lg bg-gray-50 p-6 border border-gray-200">
        <MoneyInput label="Your Annual Salary (before tax)" name="yourSalary" value={formData.yourSalary} handleChange={handleChange} placeholder="65,000" />
        {formData.blueprintFor === 'family' && (
          <MoneyInput label="Your Partner's Annual Salary (before tax)" name="partnerSalary" value={formData.partnerSalary} handleChange={handleChange} placeholder="55,000" />
        )}
        <MoneyInput label="Average Monthly Income from Other Sources" name="otherIncome" value={formData.otherIncome} handleChange={handleChange} placeholder="250" helpText="e.g., side hustles, rental income." />
        <MoneyInput label="Total Monthly Income from Benefits" name="benefitsIncome" value={formData.benefitsIncome} handleChange={handleChange} placeholder="150" helpText="e.g., Child Benefit, Universal Credit, PIP." />
      </div>
      <div className="flex justify-between">
        <button type="button" onClick={onBack} className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">Back</button>
        <button type="button" onClick={onNext} className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700">Next</button>
      </div>
    </div>
  );
};
export default Step2_Income;
