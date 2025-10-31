// src/pages/financial-blueprint/MyMoneyBlueprint.jsx

import React, auseState } from 'react';
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
      // --- THIS IS THE FIX ---
      // Changed the URL to kebab-case to match the filename 'generate-report.js'
      const response = await fetch('/api/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        // Try to get a more detailed error from the API response
        const errorData = await response.json().catch(() => ({ message: 'The analysis could not be generated. Please try again.' }));
        throw new Error(errorData.error || 'Something went wrong. Please try again.');
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
      {error && <p className="text-center text-red-600 mt-4">{error}</p>}
    </div>
  );
};

export default MyMoneyBlueprint;
