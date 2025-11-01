// src/pages/financial-blueprint/Step5_Liabilities.jsx
import React from 'react';
import { MoneyInput } from './Step2_Income';

const Step5_Liabilities = ({ onBack, onNext, formData, handleChange }) => {
  return (
    <div className="space-y-8">
      <div className="text-center"><h2 className="text-2xl font-bold">Step 5 of 7: What You Owe</h2><p className="mt-2 text-gray-600">Enter the outstanding balance on your major debts.</p></div>
      <div className="space-y-6 rounded-lg bg-gray-50 p-6 border border-gray-200">
        <MoneyInput label="Outstanding Mortgage Balance" name="mortgageBalance" value={formData.mortgageBalance} handleChange={handleChange} placeholder="200,000" helpText="The total amount you still owe on your property." />
        <MoneyInput label="Total Credit Card Debt" name="creditCardDebt" value={formData.creditCardDebt} handleChange={handleChange} placeholder="5,000" helpText="Include store cards and other credit lines." />
        <MoneyInput label="Other Loans" name="otherLoans" value={formData.otherLoans} handleChange={handleChange} placeholder="8,000" helpText="e.g., car finance, personal loans, student loans." />
      </div>
      <div className="flex justify-between"><button type="button" onClick={onBack} className="btn-secondary">Back</button><button type="button" onClick={onNext} className="btn-primary">Next</button></div>
    </div>
  );
};
export default Step5_Liabilities;
