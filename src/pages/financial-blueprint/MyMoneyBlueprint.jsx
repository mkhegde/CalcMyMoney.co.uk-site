// src/pages/financial-blueprint/FinancialBlueprintPage.jsx

import React, { useState } from 'react';
import QuestionnaireForm from './QuestionnaireForm';
import ReportDisplay from './ReportDisplay'; // We will create this next

const FinancialBlueprintPage = () => {
  // State to hold all the user's answers
  const [formData, setFormData] = useState({
    grossAnnualIncome: 65000,
    monthlyEssentialExpenses: 2000,
    // We use a nested object for liabilities, just like in our prompt
    liabilities: {
        creditCardDebt: 2000
    }
    // You can add all other fields from the questionnaire here
  });

  // State to hold the final report from the API
  const [reportData, setReportData] = useState(null);
  // State to manage the loading spinner/message
  const [isLoading, setIsLoading] = useState(false);
  // State to hold any potential errors
  const [error, setError] = useState(null);

  // A single function to handle changes for ALL input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // This handles nested objects (like 'liabilities.creditCardDebt')
    if (name.includes('.')) {
        const [outerKey, innerKey] = name.split('.');
        setFormData(prevData => ({
            ...prevData,
            [outerKey]: {
                ...prevData[outerKey],
                [innerKey]: value
            }
        }));
    } else {
        setFormData({
            ...formData,
            [name]: value,
        });
    }
  };

  // Function to call our Vercel API
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the browser from reloading the page
    setIsLoading(true);
    setError(null);
    setReportData(null);

    try {
      const response = await fetch('/api/generateReport', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Something went wrong. Please try again.');
      }

      const data = await response.json();
      setReportData(data); // Save the report data to state

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* If we don't have a report yet, show the form. Otherwise, show the report. */}
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

      {/* Show an error message if something went wrong */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default FinancialBlueprintPage;
