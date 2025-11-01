// src/pages/financial-blueprint/ProgressBar.jsx
import React from 'react';

const ProgressBar = ({ completion }) => {
  // Ensure completion is between 0 and 100
  const clampedCompletion = Math.min(Math.max(completion, 0), 100);

  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
      <div
        className="bg-indigo-600 h-2.5 rounded-full"
        style={{ width: `${clampedCompletion}%`, transition: 'width 0.5s ease-in-out' }}
      ></div>
    </div>
  );
};

export default ProgressBar;
