// src/pages/financial-blueprint/MyMoneyBlueprint.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import paths from '../../paths';

const SAMPLE_REPORT_URL = '/sample-financial-report.pdf';

const MyMoneyBlueprint = () => {
  return (
    <div className="bg-white">
      <div className="max-w-4xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Check and Improve Your Financial Health
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Use our free Financial Blueprint calculator to get a comprehensive, AI-powered analysis of your financial health and a clear strategy for your money.
          </p>
        </div>

        {/* --- IMAGE SECTION --- */}
        <div className="mt-12">
          <img
            src="/financial-blueprint-hero.jpg" // The path to your image in the /public folder
            alt="A conceptual image of a financial blueprint, showing charts and plans for wealth management."
            className="w-full h-auto rounded-lg shadow-lg object-cover"
          />
        </div>

        {/* Introduction Section */}
        <div className="mt-12 text-lg text-gray-700 space-y-4">
          <p>
            A clear understanding of your current financial situation is the first step towards achieving long-term wealth and security. Our Financial Blueprint tool is more than just a simple calculator; it's a powerful financial health assessment tool. It provides a holistic overview of your assets, liabilities, and opportunities, creating a personalised money blueprint to guide your decisions.
          </p>
          <p>
            By answering a series of straightforward questions, you'll receive an instant, anonymous report that acts as your personal financial health check. This analysis highlights your strengths, identifies areas for improvement, and offers actionable steps to improve your financial wellness.
          </p>
        </div>
        
        <div className="mt-10 text-center">
          <p className="text-base font-medium text-gray-600">
            Estimated time to complete: <strong>5-7 minutes</strong>
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to={paths.financialBlueprintSurvey}
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 w-full sm:w-auto"
            >
              Let's Start
            </Link>
            <a
              href={SAMPLE_REPORT_URL}
              download
              className="inline-flex items-center justify-center px-8 py-3 border border-indigo-600 text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 w-full sm:w-auto"
            >
              Download Sample Report
            </a>
          </div>
        </div>

        {/* --- All other sections (FAQ, Disclaimer) remain the same --- */}
        <div className="mt-20 space-y-12">
          {/* ... FAQ and Disclaimer content ... */}
        </div>
      </div>
    </div>
  );
};

export default MyMoneyBlueprint;
