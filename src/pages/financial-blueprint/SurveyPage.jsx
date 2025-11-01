// src/pages/financial-blueprint/SurveyPage.jsx
import React, { useState } from 'react';
import ProgressBar from './ProgressBar';
import ReportDisplay from './ReportDisplay';
import Step1_Profile from './Step1_Profile';
import Step2_Income from './Step2_Income';
import Step3_Expenses from './Step3_Expenses';
import Step4_Assets from './Step4_Assets'; // <-- 1. IMPORT Step 4

// --- Placeholder for Step 5 ---
const Step5 = ({ onBack, onNext }) => <div className="text-center"><h2 className="text-2xl font-bold">Step 5: Liabilities</h2><p className="mt-4">Liability questions will go here.</p><div className="flex justify-center gap-4 mt-6"><button onClick={onBack} className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md">Back</button><button onClick={onNext} className="bg-indigo-600 text-white py-2 px-4 rounded-md">Next</button></div></div>;
// ---

const TOTAL_STEPS = 6;

const SurveyPage = () => {
  const [currentStep, setCurrentStep] = useState(1);

  // --- 2. UPDATE state to include new asset fields ---
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
  });

  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // No changes needed to our handler functions
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
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

  const handleSubmit = async () => { /* ... Full logic remains the same ... */ };

  const completionPercentage = ((currentStep - 1) / TOTAL_STEPS) * 100;

  const renderContent = () => {
    if (isLoading) { /* ... */ }
    if (error) { /* ... */ }
    if (reportData) { /* ... */ }

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
        // --- 3. USE the new Step 4 component ---
        stepContent = <Step4_Assets onBack={handleBack} onNext={handleNext} formData={formData} handleChange={handleChange} />;
        break;
      case 5:
        stepContent = <Step5 onBack={handleBack} onNext={handleNext} />;
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
    <div className="max-w-3xl mx-auto p-4 sm:p-6 md:p-8 bg-white my-10 rounded-lg shadow-md">
      {renderContent()}
    </div>
  );
};

export default SurveyPage;
