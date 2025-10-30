// src/pages/financial-blueprint/report-components/ActionPlan.jsx

import React from 'react';

// This object maps the priority level from our API to specific Tailwind CSS border colors
const priorityStyles = {
  High: 'border-red-500',
  Medium: 'border-yellow-500',
  Low: 'border-blue-500',
};

// This object maps priority to background and text colors for the badge
const priorityBadgeStyles = {
    High: 'bg-red-100 text-red-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    Low: 'bg-blue-100 text-blue-800',
}

const ActionPlan = ({ data }) => {
  // Don't render anything if there's no action plan data
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Action Plan: Your Priority Steps</h2>
      <div className="space-y-4">
        {data.map((item, index) => (
          <div 
            key={index} 
            // The left border color changes based on priority
            className={`p-4 border-l-4 ${priorityStyles[item.priority] || 'border-gray-300'} bg-gray-50 rounded-r-lg`}
          >
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-900">{item.action}</h3>
              <span 
                className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${priorityBadgeStyles[item.priority] || 'bg-gray-100 text-gray-800'}`}
              >
                {item.priority}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">{item.explanation}</p>
            {/* Only show the potential saving if the API provides it */}
            {item.potentialSaving && (
              <p className="text-sm font-semibold text-green-600 mt-2">
                Potential annual saving: ~£{item.potentialSaving.toLocaleString()}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActionPlan;```
