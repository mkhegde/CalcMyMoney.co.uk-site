// src/pages/financial-blueprint/MyMoneyBlueprint.jsx

import React, { useState } from 'react'; // <-- THIS LINE IS NOW FIXED
import QuestionnaireForm from './QuestionnaireForm';
import ReportDisplay from './ReportDisplay';

const MyMoneyBlueprint = () => {
  const [formData, setFormData] = useState({
    grossAnnualIncome: 65000,
    monthlyEssentialExpenses: 2000,
    liabilities: { creditCardDebt: 2000 }
  });

  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
        const [outerKey, innerKey] = name.split('.');
        setFormData(prevData => ({ ...prevData, [outerKey]: { ...prevData[outerKey], [innerKey]: value }}));
    } else {
        setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setReportData(null);

    try {
      // The fetch URL is correctly set to kebab-case
      const response = await fetch('/api/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        // Try to get a more detailed error message from the API's response body
        const errorData = await response.json().catch(() => ({})); // Use empty object as fallback
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
