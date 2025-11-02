/ src/pages/financial-blueprint/Step3_Expenses.jsx
import React from 'react';
import { MoneyInput } from './Step2_Income'; // We can reuse the MoneyInput component!
const Step3_Expenses = ({ onBack, onNext, formData, handleChange }) => {
return (
<div className="space-y-8">
<div className="text-center"><h2 className="text-2xl font-bold">Step 3 of 7: What You Spend</h2><p className="mt-2 text-gray-600">Provide an estimate of your household expenses.</p></div>
<div className="space-y-6 rounded-lg bg-gray-50 p-6 border border-gray-200">
<MoneyInput label="Total Monthly Essential Expenses" name="essentialExpenses" value={formData.essentialExpenses} handleChange={handleChange} placeholder="2,200" helpText="e.g., mortgage/rent, utilities, groceries, transport." />
<MoneyInput label="Total Monthly Discretionary (Non-Essential) Spending" name="discretionaryExpenses" value={formData.discretionaryExpenses} handleChange={handleChange} placeholder="600" helpText="e.g., dining out, hobbies, subscriptions, entertainment." />
<MoneyInput label="Total Annual Cost of Large, Infrequent Expenses" name="annualExpenses" value={formData.annualExpenses} handleChange={handleChange} placeholder="3,000" helpText="e.g., holidays, car insurance/MOT, Christmas." />
</div>
<div className="flex justify-between"><button type="button" onClick={onBack} className="btn-secondary">Back</button><button type="button" onClick={onNext} className="btn-primary">Next</button></div>
</div>
);
};
export default Step3_Expenses;
