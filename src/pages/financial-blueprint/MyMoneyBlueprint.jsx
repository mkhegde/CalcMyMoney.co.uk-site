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

        {/* --- SEO-OPTIMIZED SECTIONS (RESTORED) --- */}
        <div className="mt-20 space-y-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 text-center">Why is a Financial Blueprint Important?</h2>
            <div className="mt-8 text-gray-700 space-y-4">
              <p>
                Just as a builder wouldn't construct a house without a detailed blueprint, navigating your financial life without a plan can lead to instability. A financial blueprint, or a financial health check, serves as your strategic guide, providing a clear picture of your current standing and a roadmap for the future.
              </p>
              <p>
                This financial health assessment helps you make informed, proactive decisions rather than reactive ones. By regularly conducting a money health check, you can identify potential issues like cash flow problems or growing debt early on, allowing you to take corrective action before they become serious. Ultimately, a strong financial blueprint is the foundation for building wealth, managing risk, and achieving peace of mind and financial freedom.
              </p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 text-center">Frequently Asked Questions</h2>
          <div className="mt-8 space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Do I have to provide my personal data?</h3>
              <p className="mt-2 text-gray-700">
                No. We are committed to your privacy. This financial health check is fully anonymous. We do not ask for, nor do we store, any 'personally identifiable information' (PII) such as your name, email address, specific location, or postcode to generate this report.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">How can I take away the report?</h3>
              <p className="mt-2 text-gray-700">
                After completing the financial health assessment, your anonymous report will be instantly available. You will have the option to download the full 'my financial health check result' as both a PDF and a CSV file, allowing you to keep it for your records or share it with a financial advisor. All data used to generate the report is immediately discarded once you leave the page.
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimer Section */}
        <div className="mt-20 text-center text-sm text-gray-500">
          <p>
            <strong>Disclaimer:</strong> This financial health score calculator is for illustrative and informational purposes only and should not be considered professional financial advice. All financial planning decisions should be made with the guidance of a qualified and regulated financial advisor. We are not liable for any actions taken based on the report's content.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MyMoneyBlueprint;
