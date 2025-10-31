// src/pages/financial-blueprint/ReportDisplay.jsx
// ** TEMPORARY DEBUGGING VERSION **

import React from 'react';

const ReportDisplay = ({ reportData }) => {
  if (!reportData) {
    return <p>No report data available.</p>;
  }

  // This will display the raw JSON data on the screen without crashing.
  // It allows us to see the exact structure of the AI's response.
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
      <h2 className="text-2xl font-bold text-center mb-4">API Response Received</h2>
      <p className="text-center text-gray-600 mb-4">Please copy the text below and send it back so we can build the final report display.</p>
      <pre className="bg-gray-100 p-4 rounded-lg border text-sm whitespace-pre-wrap">
        {JSON.stringify(reportData, null, 2)}
      </pre>
    </div>
  );
};

export default ReportDisplay;
