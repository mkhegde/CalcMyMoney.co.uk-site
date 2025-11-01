**File: `src/pages/financial-blueprint/Step4_Assets.jsx`**
```jsx
// src/pages/financial-blueprint/Step4_Assets.jsx
import React from 'react';
import { MoneyInput } from './Step2_Income';

const Step4_Assets = ({ onBack, onNext, formData, handleChange }) => {
  return (
    <div className="space-y-8">
      <div className="text-center"><h2 className="text-2xl font-bold">Step 4 of 7: What You Own</h2><p className="mt-2 text-gray-600">Enter the current estimated value of your assets.</p></div>
      <div className="space-y-6 rounded-lg bg-gray-50 p-6 border border-gray-200">
        <MoneyInput label="Cash Savings" name="cashSavings" value={formData.cashSavings} handleChange={handleChange} placeholder="15,000" helpText="Total in current accounts, savings accounts, etc." />
        <MoneyInput label="Total Pension Value" name="pensionValue" value={formData.pensionValue} handleChange={handleChange} placeholder="50,000" helpText="Include all workplace and private pensions." />
        <MoneyInput label="Primary Residence Value" name="propertyValue" value={formData.propertyValue} handleChange={handleChange} placeholder="250,000" helpText="Your current estimated home value." />
        <MoneyInput label="Other Investments" name="otherInvestments" value={formData.otherInvestments} handleChange={handleChange} placeholder="10,000" helpText="e.g., Stocks & Shares ISAs, funds, crypto." />
      </div>
      <div className="flex justify-between"><button type="button" onClick={onBack} className="btn-secondary">Back</button><button type="button" onClick={onNext} className="btn-primary">Next</button></div>
    </div>
  );
};
export default Step4_Assets;
