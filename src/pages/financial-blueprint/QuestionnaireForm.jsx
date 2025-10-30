// src/pages/financial-blueprint/QuestionnaireForm.jsx

import React from 'react';

// The 'formData' prop holds the current state of the form.
// The 'handleChange' prop is a function to update the state in the parent component.
// The 'handleSubmit' prop is the function to call when the form is submitted.
// The 'isLoading' prop disables the button while the report is being generated.
const QuestionnaireForm = ({ formData, handleChange, handleSubmit, isLoading }) => {
  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2>My Financial Blueprint</h2>
      <p>Fill in the details below to generate your personalized financial analysis.</p>

      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="grossAnnualIncome">Gross Annual Income (£)</label>
        <input
          type="number"
          id="grossAnnualIncome"
          name="grossAnnualIncome"
          value={formData.grossAnnualIncome}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: '8px', marginTop: '4px' }}
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="monthlyEssentialExpenses">Total Monthly Essential Expenses (£)</label>
        <input
          type="number"
          id="monthlyEssentialExpenses"
          name="monthlyEssentialExpenses"
          value={formData.monthlyEssentialExpenses}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: '8px', marginTop: '4px' }}
        />
      </div>

       <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="creditCardDebt">High-Interest Credit Card Debt (£)</label>
        <input
          type="number"
          id="creditCardDebt"
          name="liabilities.creditCardDebt" // Using dot notation for nested objects
          value={formData.liabilities.creditCardDebt}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: '8px', marginTop: '4px' }}
        />
      </div>


      <button type="submit" disabled={isLoading} style={{ padding: '10px 20px', cursor: 'pointer' }}>
        {isLoading ? 'Generating Report...' : 'Generate My Report'}
      </button>
    </form>
  );
};

export default QuestionnaireForm;
