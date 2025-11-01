// src/pages/financial-blueprint/SurveyPage.jsx
import React, { useState } from 'react';
import ProgressBar from './ProgressBar';
import ReportDisplay from './ReportDisplay';
import Step1_Profile from './Step1_Profile';
import Step2_Income from './Step2_Income';
import Step3_Expenses from './Step3_Expenses';
import Step4_Assets from './Step4_Assets';
import Step5_Liabilities from './Step5_Liabilities';
import Step6_Protection from './Step6_Protection';

const TOTAL_STEPS = 6;

const SurveyPage = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    // Step 1
    blueprintFor: 'individual',
    location: 'england',
    maritalStatus: 'single',
    age: '',
    partnerAge: '',
    profession: '',
    // Step 2
    yourSalary: '',
    partnerSalary: '',
    otherIncome: '',
    benefitsIncome: '',
    // Step 3
    essentialExpenses: '',
    discretionaryExpenses: '',
    annualExpenses: '',
    // Step 4
    cashSavings: '',
    pensionValue: '',
    propertyValue: '',
    otherInvestments: '',
    // Step 5
    mortgageBalance: '',
    creditCardDebt: '',
    otherLoans: '',
    // Step 6
    hasWill: 'no',
    hasLifeInsurance: 'no',
    hasIncomeProtection: 'no',
    hasLPA: 'no',
  });

  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Something went wrong.');
      }
      const data = await response.json();
      setReportData(data);
    // --- THE FIX IS HERE ---
    // The invalid '=>' has been removed.
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Correctly calculate completion percentage for display
  const completionPercentage = (currentStep / TOTAL_STEPS) * 100;

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="text-center p-12">
            <h2 className="text-2xl font-semibold">Generating Your Blueprint...</h2>
            <p className="mt-2 text-gray-600">Our AI is analyzing your data. This may take a moment.</p>
        </div>
      );
    }
    if (error) {
      return <div className="text-center p-8 text-red-600">{error}</div>;
    }
    if (reportData) {
      return <ReportDisplay reportData={reportData} />;
    }

    let stepContent;
    switch (currentStep) {
      case 1:
        stepContent = <Step1_Profile onNext={handleNext} formData={formData} handleChange={handleChange} />;
        break;
      case 2:
        stepContent = <Step2_Income onBack={handleBack} onNext={handleNext} formData={formData} handleChange={handleChange} />;
        break;
      case 3:
        stepContent = <Step3_Expenses onBack={handleBack} onNext={handleNext} formData={formData} handleChange={handleChange} />;
        break;
      case 4:
        stepContent = <Step4_Assets onBack={handleBack} onNext={handleNext} formData={formData} handleChange={handleChange} />;
        break;
      case 5:
        stepContent = <Step5_Liabilities onBack={handleBack} onNext={handleNext} formData={formData} handleChange={handleChange} />;
        break;
      case 6:
        stepContent = <Step6_Protection onBack={handleBack} onNext={handleNext} formData={formData} handleChange={handleChange} />;
        break;
      default:
        // This case should not be reached with the current logic
        stepContent = <div><p>Invalid Step</p></div>;
    }

    return (
      <>
        <div className="mb-8">
          <ProgressBar completion={completionPercentage} />
        </div>
        {stepContent}
      </>
    );
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 md:p-8 bg-white my-10 rounded-lg shadow-md">
      {renderContent()}
    </div>
  );
};

export default SurveyPage;
