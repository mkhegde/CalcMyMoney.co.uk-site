
import React, { useState, useEffect } from 'react';

// A component to animate a number counting up
export default function AnimatedNumber({ value, className, locale = 'en-GB', options = { minimumFractionDigits: 1, maximumFractionDigits: 1 } }) {
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const startValue = currentValue;
    const duration = 800; // Animation duration in ms

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Allow for decimal animation by removing Math.floor
      const nextValue = progress * (value - startValue) + startValue;
      
      setCurrentValue(nextValue);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCurrentValue(value); // Ensure final value is exact
      }
    };

    window.requestAnimationFrame(step);
    
    // Cleanup function
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <span className={className}>
      {currentValue.toLocaleString(locale, options)}
    </span>
  );
}
