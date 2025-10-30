// src/pages/financial-blueprint/ReportDisplay.jsx

import React from 'react';

const ReportDisplay = ({ reportData }) => {
  if (!reportData) {
    return <p>No report data available.</p>;
  }

  // For now, we just display the raw data to confirm it's working.
  // In the next step, we will build the beautiful UI for this.
  return (
    <div>
      <h2>Your Financial Blueprint Report</h2>
      <pre style={{ background: '#f4f4f4', padding: '1rem', whiteSpace: 'pre-wrap' }}>
        {JSON.stringify(reportData, null, 2)}
      </pre>
    </div>
  );
};

export default ReportDisplay;
