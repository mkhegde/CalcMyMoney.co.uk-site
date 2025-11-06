// src/pages/financial-blueprint/ReportDisplay.jsx

import React from 'react';
import ProfileSummary from './report-components/ProfileSummary';
import FinancialOverview from './report-components/FinancialOverview';
import TaxAndCashflow from './report-components/TaxAndCashflow';
import RetirementSnapshot from './report-components/RetirementSnapshot';
import ProtectionReview from './report-components/ProtectionReview';
import SwotAnalysis from './report-components/SwotAnalysis';
import ActionPlan from './report-components/ActionPlan';

const ReportDisplay = ({ reportData }) => {
  if (!reportData) {
    return (
      <div className="text-center p-8">
        <p>No report data available. Please generate a new report.</p>
      </div>
    );
  }
  
  // Destructure the data from the report for easier access
  const {
    profileSummary,
    financialOverview,
    taxAndCashflow,
    cashFlowAnalysis,
    taxAnalysis,
    retirementSnapshot,
    protectionReview,
    swotAnalysis,
    actionPlan,
  } = reportData;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8 bg-gray-50">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Your Financial Blueprint Report</h1>
        <p className="mt-2 text-lg text-gray-600">A comprehensive analysis of your financial health.</p>
      </div>

      {/* Main content area for the report cards */}
      <div className="space-y-8">
        {/* We pass the relevant piece of data to each component */}
        <ProfileSummary data={profileSummary} />
        <FinancialOverview data={financialOverview} />
        <TaxAndCashflow data={taxAndCashflow || (taxAnalysis || cashFlowAnalysis ? { tax: taxAnalysis, cashflow: cashFlowAnalysis } : null)} />
        <RetirementSnapshot data={retirementSnapshot} />
        <ProtectionReview data={protectionReview} />
        <SwotAnalysis data={swotAnalysis} />
        <ActionPlan data={actionPlan} />
      </div>
    </div>
  );
};

export default ReportDisplay;
