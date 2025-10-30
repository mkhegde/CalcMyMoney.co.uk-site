// src/pages/financial-blueprint/report-components/ProfileSummary.jsx
import React from 'react';

const ProfileSummary = ({ data }) => {
  if (!data) return null;

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Section 1: Profile Summary</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><strong>User ID:</strong> {data.userId || 'N/A'}</div>
        <div><strong>Area:</strong> {data.area || 'N/A'}</div>
        <div><strong>Age:</strong> {data.age || 'N/A'} years</div>
        <div><strong>Profession:</strong> {data.profession || 'N/A'}</div>
      </div>
    </div>
  );
};

export default ProfileSummary;
