// src/pages/financial-blueprint/SurveyPage.jsx
import React, { useState } from 'react';
import ProgressBar from './ProgressBar';
import ReportDisplay from './ReportDisplay';
import Step1_Profile from './Step1_Profile';
import Step2_Income from './Step2_Income';
import Step3_Expenses from './Step3_Expenses';
import Step4_Assets from './Step4_Assets';
import Step5_Liabilities from './Step5_Liabilities'; // <-- 1. IMPORT Step 5

// --- Placeholder for Step 6 ---
const Step6 = ({ onBack, onNext }) => <div className="text-center"><h2 className="text-2xl font-bold">Step 6: Protection</h2><p className="mt-4">Protection questions will go here.</p><div className="flex justify-center gap-4 mt-6"><button onClick={onBack} className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md">Back</button><button onClick={onNext} className="bg-indigo-600 text-white py-2 px-4 rounded-md">Finish & Generate Report</button></div></div>;
// ---

const TOTAL_STEPS = 6;

const SurveyPage = () => {
  const [currentStep, setCurrentStep] = useState(1);

  // --- 2. UPDATE state to include new liability fields ---
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

  // ... (All handler functions: handleChange, handleNext, handleBack, handleSubmit remain the same)
  // ... (The full code for these should be copied from the last working version)

  const completionPercentage = ((currentStep - 1) / TOTAL_STEPS) * 100;

  const renderContent = () => {
    // ... (isLoading, error, reportData logic remains the same)

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
        // --- 3. USE the new Step 5 component ---
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
  
  // Ensure this return has the full, unabridged code for all handlers
  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 md-p-8 bg-white my-10 rounded-lg shadow-md">
      {/* ... full renderContent logic ... */}
    </div>
  );
};

export default SurveyPage;
