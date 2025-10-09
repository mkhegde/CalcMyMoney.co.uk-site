import React from 'react';

export default function Logo({ size = 32, className = '', alt = 'Calculate My Money Logo' }) {
  const px = Number(size) || 32;
  // Choose closest fallback PNG
  const fallback = px >= 64 ? '/favicon-32x32.png' : '/favicon-16x16.png';
  return (
    <picture>
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
      <img
        src={fallback}
        width={px}
        height={px}
        alt={alt}
        decoding="async"
        fetchPriority="high"
        className={className}
      />
    </picture>
  );
}

