import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import RelatedCalculators from '@/components/calculators/RelatedCalculators';
import { calculatorCategories } from '@/components/data/calculatorConfig';

function flattenCalculators() {
  const out = [];
  (calculatorCategories || []).forEach((cat) => {
    (cat?.subCategories || []).forEach((sub) => {
      (sub?.calculators || []).forEach((calc) => {
        out.push({
          name: calc?.name,
          url: calc?.url,
          description: calc?.description,
          category: cat?.name,
          subCategory: sub?.name,
          status: calc?.status,
          page: calc?.page,
        });
      });
    });
  });
  return out;
}

export default function RelatedAuto() {
  const location = useLocation();
  const pathname = location?.pathname || '';

  const calculators = useMemo(() => flattenCalculators(), []);

  // Find current calculator by URL (exact match)
  const current = useMemo(
    () => calculators.find((c) => typeof c?.url === 'string' && c.url === pathname) || null,
    [calculators, pathname]
  );

  // If we're not on a calculator URL, render nothing
  if (!current) return null;

  const pool = calculators.filter(
    (c) => c && c.status === 'active' && c.url && c.url !== current.url
  );

  // Prefer same subCategory, then same category, then popular leftovers (keep list order)
  const sameSub = pool.filter((c) => c.subCategory === current.subCategory);
  const sameCat = pool.filter(
    (c) => c.category === current.category && c.subCategory !== current.subCategory
  );
  const leftovers = pool.filter((c) => c.category !== current.category);

  const picked = [];
  const seen = new Set();
  const pushUnique = (arr) => {
    for (const item of arr) {
      if (!item?.url || seen.has(item.url)) continue;
      picked.push({ name: item.name, url: item.url, description: item.description });
      seen.add(item.url);
      if (picked.length >= 3) break;
    }
  };
  pushUnique(sameSub);
  if (picked.length < 3) pushUnique(sameCat);
  if (picked.length < 3) pushUnique(leftovers);

  // Always append the stats hub link
  const calculatorsProp = [
    ...picked,
    {
      name: 'UK Financial Stats',
      url: '/uk-financial-stats',
      description: 'Live BoE, CPIH, HPI & Ofgem cap.',
    },
  ];

  return <RelatedCalculators calculators={calculatorsProp} />;
}
