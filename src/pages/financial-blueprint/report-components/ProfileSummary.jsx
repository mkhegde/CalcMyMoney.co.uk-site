// src/pages/financial-blueprint/report-components/ProfileSummary.jsx
import React from 'react';

const ProfileSummary = ({ data }) => {
  if (!data) return null;

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Section 1: Profile Summary</h2>
      <p className="text-gray-600">This report is based on the financial data you provided. As you add more profile details to the questionnaire, this section will populate with your information.</p>
    </div>
  );
};

export default ProfileSummary;
