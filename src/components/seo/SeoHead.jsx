import React from 'react';
import { Helmet } from 'react-helmet-async';

const DEFAULT_OG_IMAGE = 'https://www.calcmymoney.co.uk/og-image.png';
const DEFAULT_ROBOTS = 'index,follow,max-image-preview:large';
const DEFAULT_TWITTER_CARD = 'summary_large_image';

export default function SeoHead({
  title,
  description,
  canonical,
  robots = DEFAULT_ROBOTS,
  themeColor,
  ogTitle,
  ogDescription,
  ogType = 'website',
  ogUrl,
  ogImage = DEFAULT_OG_IMAGE,
  ogImageAlt,
  ogSiteName,
  ogLocale,
  twitterCard = DEFAULT_TWITTER_CARD,
  twitterTitle,
  twitterDescription,
  twitterImage,
  twitterImageAlt,
  jsonLd,
}) {
  const resolvedOgTitle = ogTitle || title;
  const resolvedOgDescription = ogDescription || description;
  const resolvedOgUrl = ogUrl || canonical;
  const resolvedTwitterTitle = twitterTitle || resolvedOgTitle || title;
  const resolvedTwitterDescription = twitterDescription || resolvedOgDescription || description;
  const resolvedTwitterImage = twitterImage || ogImage;
  const resolvedTwitterImageAlt = twitterImageAlt || ogImageAlt;

  const jsonLdArray = Array.isArray(jsonLd) ? jsonLd.filter(Boolean) : [];

  return (
    <Helmet>
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      {canonical && <link rel="canonical" href={canonical} />}
      {robots && <meta name="robots" content={robots} />}
      {themeColor && <meta name="theme-color" content={themeColor} />}

      {/* Open Graph */}
      {resolvedOgTitle && <meta property="og:title" content={resolvedOgTitle} />}
      {resolvedOgDescription && <meta property="og:description" content={resolvedOgDescription} />}
      {ogType && <meta property="og:type" content={ogType} />}
      {resolvedOgUrl && <meta property="og:url" content={resolvedOgUrl} />}
      {ogImage && <meta property="og:image" content={ogImage} />}
      {ogImageAlt && <meta property="og:image:alt" content={ogImageAlt} />}
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      {ogSiteName && <meta property="og:site_name" content={ogSiteName} />}
      {ogLocale && <meta property="og:locale" content={ogLocale} />}

      {/* Twitter */}
      {twitterCard && <meta name="twitter:card" content={twitterCard} />}
      {resolvedTwitterTitle && <meta name="twitter:title" content={resolvedTwitterTitle} />}
      {resolvedTwitterDescription && (
        <meta name="twitter:description" content={resolvedTwitterDescription} />
      )}
      {resolvedTwitterImage && <meta name="twitter:image" content={resolvedTwitterImage} />}
      {resolvedTwitterImageAlt && <meta name="twitter:image:alt" content={resolvedTwitterImageAlt} />}

      {/* JSON-LD */}
      {jsonLdArray.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </Helmet>
  );
}
