// src/pages/financial-blueprint/SurveyPage.jsx
import React, { useState } from 'react';
import ProgressBar from './ProgressBar';
import ReportDisplay from './ReportDisplay';
import Step1_Profile from './Step1_Profile';
import Step2_Income from './Step2_Income';
import Step3_Expenses from './Step3_Expenses';
import Step4_Assets from './Step4_Assets';
import Step5_Liabilities from './Step5_Liabilities';

// Placeholder for Step 6
const Step6 = ({ onBack, onNext }) => <div className="text-center"><h2 className="text-2xl font-bold">Step 6: Protection</h2><p className="mt-4">Protection questions will go here.</p><div className="flex justify-center gap-4 mt-6"><button onClick={onBack} className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md">Back</button><button onClick={onNext} className="bg-indigo-600 text-white py-2 px-4 rounded-md">Finish & Generate Report</button></div></div>;

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
    // The incorrect '=>' has been removed from the catch block.
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const completionPercentage = ((currentStep - 1) / TOTAL_STEPS) * 100;

  const renderContent = () => {
    if (isLoading) {
      return <div className="text-center p-8">Generating your report...</div>;
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
        stepContent = <Step6 onBack={handleBack} onNext={handleNext} />;
        break;
      default:
        stepContent = <div><p>Step {currentStep}</p><button onClick={handleBack}>Back</button><button onClick={handleNext}>Finish</button></div>;
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
