import React, { useMemo, useLayoutEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import RelatedCalculators from '@/components/calculators/RelatedCalculators';
import { getRelatedCalculators } from '@/utils/getRelatedCalculators';

// Deprecated local flattener; use getRelatedCalculators (uses tags + hierarchy)

export default function RelatedAuto() {
  const location = useLocation();
  const pathname = location?.pathname || '';

  // Compute related items from helper (3 max)
  const related = useMemo(() => getRelatedCalculators(pathname, { max: 3 }), [pathname]);

  const [showAuto, setShowAuto] = useState(false);
  // Decide visibility before paint to avoid flicker
  useLayoutEffect(() => {
    if (typeof document === 'undefined') return;
    const existing = document.querySelector('[data-related-calculators]');
    setShowAuto(!existing);
  }, [pathname]);

  // Find current calculator by URL (exact match)
  if (!showAuto || !Array.isArray(related) || related.length === 0) return null;
  const calculatorsProp = [
    ...related.map((c) => ({ name: c.name, url: c.url, description: c.description })),
    { name: 'UK Financial Stats', url: '/uk-financial-stats', description: 'Live BoE, CPIH, HPI & Ofgem cap.' },
  ];
  return <RelatedCalculators calculators={calculatorsProp} />;
}
