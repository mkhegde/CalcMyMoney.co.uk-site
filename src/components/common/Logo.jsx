import React from 'react';

export default function Logo({ size = 32, className = '', alt = 'Calculate My Money Logo' }) {
  const px = Number(size) || 32;
  // Choose closest fallback PNG
  const fallback = px >= 64 ? '/favicon-32x32.png' : '/favicon-16x16.png';
  const inlineSvg = `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='${px}' height='${px}' viewBox='0 0 32 32'>
      <rect width='32' height='32' rx='6' fill='#0f172a'/>
      <text x='16' y='21' text-anchor='middle' font-family='system-ui,Segoe UI,Roboto,Helvetica,Arial' font-size='16' fill='#fff'>£</text>
    </svg>`
  )}`;
  const hasOptimized = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.PROD;
  return (
    <picture>
      {hasOptimized && (
        <>
          <source
            type="image/avif"
            srcSet={`/logo-32.avif 32w, /logo-64.avif 64w`}
            sizes={`${px}px`}
          />
          <source
            type="image/webp"
            srcSet={`/logo-32.webp 32w, /logo-64.webp 64w, /logo-128.webp 128w`}
            sizes={`${px}px`}
          />
        </>
      )}
      <img
        src={fallback}
        width={px}
        height={px}
        alt={alt}
        decoding="async"
        fetchPriority="high"
        onError={(e) => {
          if (e?.currentTarget) e.currentTarget.src = inlineSvg;
        }}
        className={className}
      />
    </picture>
  );
}
