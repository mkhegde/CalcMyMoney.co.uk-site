// src/pages/financial-blueprint/SurveyPage.jsx
import React, { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import ProgressBar from './ProgressBar';
import ReportDisplay from './ReportDisplay';

import {
  step1Schema,
  step2Schema,
  step3Schema,
  step4Schema,
  step5Schema,
  step6Schema,
  step7Schema,
  step8Schema,
  step9Schema,
} from './schemas';
import Step1_Profile from './Step1_Profile';
import Step2_Income from './Step2_Income';
import Step3_Expenses from './Step3_Expenses';
import Step4_Assets from './Step4_Assets';
import Step5_Liabilities from './Step5_Liabilities';
import Step6_Mindset from './Step6_Mindset';
import Step7_Protection from './Step7_Protection';
import Step8_RetirementGoals from './Step8_RetirementGoals';
import Step9_ProtectionDetails from './Step9_ProtectionDetails';
import Step8_Review from './Step8_Review';

const SurveyPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [finalData, setFinalData] = useState({});
  const stepConfigs = useMemo(
    () => [
      { Component: Step1_Profile, schema: step1Schema },
      { Component: Step2_Income, schema: step2Schema },
      { Component: Step3_Expenses, schema: step3Schema },
      { Component: Step4_Assets, schema: step4Schema },
      { Component: Step5_Liabilities, schema: step5Schema },
      { Component: Step6_Mindset, schema: step6Schema },
      { Component: Step7_Protection, schema: step7Schema },
      { Component: Step8_RetirementGoals, schema: step8Schema },
      { Component: Step9_ProtectionDetails, schema: step9Schema },
      { Component: Step8_Review, schema: null, isReview: true },
    ],
    []
  );
  const totalSteps = stepConfigs.length;
  const currentIndex = Math.min(Math.max(currentStep - 1, 0), totalSteps - 1);
  const currentStepConfig = stepConfigs[currentIndex];

  const {
    register,
    watch,
    formState: { errors },
    control,
    setError: setFieldError,
    clearErrors,
    setValue,
    getValues,
  } = useForm({
    defaultValues: {
      blueprintFor: 'individual',
      location: 'england',
      housingStatus: 'renting',
      maritalStatus: 'single',
      age: '',
      partnerAge: '',
      profession: '',
      partnerProfession: '',
      numberOfChildren: '0',
      specialNeedsChildren: '0',
      specialNeedsSupport: '',
      healthStatus: 'good',
      smoker: 'no',
      alcoholUnitsWeekly: '0',
      tobaccoSpendWeekly: '0',
      yourSalary: '',
      partnerSalary: '',
      otherIncomeMonthly: '0',
      benefitsIncomeMonthly: '0',
      expensesHousing: '0',
      expensesUtilities: '0',
      expensesGroceries: '0',
      expensesTransport: '0',
      expensesLifestyle: '0',
      expensesChildcare: '0',
      specialNeedsCostsMonthly: '0',
      emergencySavingsContributionMonthly: '0',
      pensionContributionMonthly: '0',
      partnerPensionContributionMonthly: '0',
      isaContributionMonthly: '0',
      partnerIsaContributionMonthly: '0',
      childcareVouchersMonthly: '0',
      cashSavings: '0',
      emergencyFundBalance: '0',
      pensionValue: '0',
      propertyValue: '0',
      isaInvestmentsValue: '0',
      otherInvestments: '0',
      otherAssets: '0',
      mortgageBalance: '0',
      mortgageInterestRatePercent: '0',
      mortgageRemainingTermYears: '0',
      creditCardDebt: '0',
      otherLoans: '0',
      studentLoanBalance: '0',
      insurancePremiumsTotalMonthly: '0',
      earningHabit: '',
      savingHabit: '',
      investingHabit: '',
      emergencySavingsConfidence: '',
      hasWill: '',
      hasLifeInsurance: '',
      partnerHasLifeInsurance: 'no',
      lifeInsuranceBenefitAmount: '0',
      partnerLifeInsuranceBenefitAmount: '0',
      hasIncomeProtection: '',
      partnerHasIncomeProtection: 'no',
      incomeProtectionBenefitAmount: '0',
      partnerIncomeProtectionBenefitAmount: '0',
      hasLPA: '',
      retirementTargetAge: '0',
      partnerRetirementTargetAge: '0',
      retirementIncomeTargetMonthly: '0',
      partnerRetirementIncomeTargetMonthly: '0',
      statePensionQualifyingYears: '0',
      statePensionLastStatementYear: '0',
      statePensionForecastAmountMonthly: '0',
      lifeInsuranceProvider: '',
      lifeInsuranceSumAssured: '0',
      lifeInsurancePremiumMonthlyDetail: '0',
      lifeInsuranceBeneficiaryNotes: '',
      incomeProtectionProvider: '',
      incomeProtectionBenefitMonthly: '0',
      incomeProtectionPremiumMonthlyDetail: '0',
      incomeProtectionBeneficiaryNotes: '',
      partnerLifeInsuranceProvider: '',
      partnerLifeInsuranceSumAssured: '0',
      partnerLifeInsurancePremiumMonthlyDetail: '0',
      partnerLifeInsuranceBeneficiaryNotes: '',
      partnerIncomeProtectionProvider: '',
      partnerIncomeProtectionBenefitMonthly: '0',
      partnerIncomeProtectionPremiumMonthlyDetail: '0',
      partnerIncomeProtectionBeneficiaryNotes: '',
    },
    shouldUnregister: false,
  });

  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [submissionError, setSubmissionError] = useState(null);

  const handleNext = async () => {
    const schema = currentStepConfig?.schema;
    if (!schema) {
      if (currentStep < totalSteps) {
        setCurrentStep((prev) => prev + 1);
      }
      return;
    }

    const values = getValues();
    const result = await schema.safeParseAsync(values);

    if (!result.success) {
      clearErrors();
      result.error.issues.forEach((issue) => {
        const fieldName = issue.path.filter(Boolean).join('.');
        if (!fieldName) {
          return;
        }
        setFieldError(fieldName, { type: 'manual', message: issue.message });
      });
      return;
    }

    clearErrors();
    setFinalData((prev) => ({ ...prev, ...result.data }));
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep === 1) {
      return;
    }
    clearErrors();
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const finalSubmit = async () => {
    const latestValues = getValues();
    const payloadSource = { ...latestValues, ...finalData };
    setIsLoading(true);
    setSubmissionError(null);
      try {
        const payload = {
          ...payloadSource,
          otherIncome: payloadSource.otherIncomeMonthly ?? payloadSource.otherIncome ?? '0',
          benefitsIncome: payloadSource.benefitsIncomeMonthly ?? payloadSource.benefitsIncome ?? '0',
          housingPaymentMonthly: payloadSource.expensesHousing ?? '0',
        };
      const response = await fetch('/api/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Something went wrong.');
      }
      const data = await response.json();
      setReportData(data);
    } catch (err) {
      setSubmissionError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const completionPercentage = totalSteps ? (currentStep / totalSteps) * 100 : 0;

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="text-center p-12">
          <h2 className="text-2xl font-semibold">Generating Your Blueprint...</h2>
          <p className="mt-2 text-gray-600">
            Our AI is analyzing your data. This may take a moment.
          </p>
        </div>
      );
    }
    if (submissionError) {
      return (
        <div className="space-y-4 text-center p-8">
          <p className="text-red-600">{submissionError}</p>
          <button
            type="button"
            onClick={() => setSubmissionError(null)}
            className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            Back to review
          </button>
        </div>
      );
    }
    if (reportData) {
      return <ReportDisplay reportData={reportData} />;
    }

    const StepComponent = currentStepConfig?.Component;
    if (!StepComponent) {
      return (
        <div className="text-center">
          <h2 className="text-2xl font-bold">Step {currentStep}</h2>
          <p className="mt-4">This step is unavailable. Please go back and try again.</p>
          <button
            type="button"
            onClick={handleBack}
            className="mt-6 bg-gray-300 text-gray-800 py-2 px-4 rounded-md"
          >
            Go Back
          </button>
        </div>
      );
    }

    if (currentStepConfig.isReview) {
      const reviewValues = { ...getValues(), ...finalData };
      return (
        <StepComponent
          onBack={handleBack}
          onConfirm={finalSubmit}
          values={reviewValues}
          isLoading={isLoading}
        />
      );
    }

    return (
      <StepComponent
        register={register}
        control={control}
        errors={errors}
        watch={watch}
        setValue={setValue}
        onNext={handleNext}
        onBack={handleBack}
        currentStep={currentStep}
        totalSteps={totalSteps}
      />
    );
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 md:p-8 bg-white my-10 rounded-lg shadow-md">
      {reportData || isLoading || submissionError ? null : (
        <div className="mb-8">
          <ProgressBar completion={completionPercentage} />
        </div>
      )}
      {renderContent()}
    </div>
  );
};

export default SurveyPage;
