// src/pages/financial-blueprint/MyMoneyBlueprint.jsx

import React, { useState } from 'react';
import QuestionnaireForm from './QuestionnaireForm';
import ReportDisplay from './ReportDisplay';

const MyMoneyBlueprint = () => {
  // --- THIS IS THE UPDATE ---
  // We've added an 'assets' object to hold the new fields.
  const [formData, setFormData] = useState({
    grossAnnualIncome: 65000,
    monthlyEssentialExpenses: 2000,
    assets: {
        cash: 12000, // Pre-filled with example data
        pension: 28000, // Pre-filled with example data
    },
    liabilities: { 
        creditCardDebt: 2000 
    }
  });

  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // NO CHANGE NEEDED HERE! 
  // Our existing handleChange function is smart enough to handle nested data 
  // like 'assets.cash' because of the `if (name.includes('.'))` logic.
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
        const [outerKey, innerKey] = name.split('.');
        setFormData(prevData => ({ ...prevData, [outerKey]: { ...prevData[outerKey], [innerKey]: value }}));
    } else {
        setFormData({ ...formData, [name]: value });
    }
  };

  // No changes needed for handleSubmit either. It just sends the whole formData object.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setReportData(null);
    try {
      const response = await fetch('/api/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Something went wrong. Please check the server logs.');
      }
      const data = await response.json();
      setReportData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {!reportData ? (
        <QuestionnaireForm
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
        />
      ) : (
        <ReportDisplay reportData={reportData} />
      )}
      {error && <p className="text-center text-red-600 mt-4 p-4">{error}</p>}
    </div>
  );
};

export default MyMoneyBlueprint;
