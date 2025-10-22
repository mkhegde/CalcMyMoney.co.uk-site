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
  keywords,
  ogTitle,
  ogDescription,
  ogType = 'website',
  ogUrl,
  ogImage = DEFAULT_OG_IMAGE,
  ogImageAlt,
  ogSiteName,
  ogLocale,
  articlePublishedTime,
  articleModifiedTime,
  articleSection,
  articleAuthor,
  articleTags,
  twitterCard = DEFAULT_TWITTER_CARD,
  twitterTitle,
  twitterDescription,
  twitterImage,
  twitterImageAlt,
  jsonLd,
}) {
  // Compute a clean canonical (no query/hash) when not explicitly provided
  let computedCanonical = undefined;
  if (!canonical && typeof window !== 'undefined' && window.location) {
    try {
      const url = new URL(window.location.pathname || '/', window.location.origin || '');
      computedCanonical = url.toString();
    } catch {
      computedCanonical = undefined;
    }
  }
  const normaliseCanonicalHref = (href) => {
    if (!href || typeof href !== 'string') return href;
    try {
      const url = new URL(href, 'https://www.calcmymoney.co.uk');
      const host = url.hostname || '';
      if (host && host !== 'www.calcmymoney.co.uk' && host !== 'calcmymoney.co.uk') {
        return href;
      }

      if (url.pathname && url.pathname.startsWith('/calculators/')) {
        url.pathname = url.pathname.replace(/^\/calculators/, '') || '/';
      }

      return url.toString();
    } catch (error) {
      return href;
    }
  };

  const canonicalHref = normaliseCanonicalHref(canonical || computedCanonical);

  const resolvedOgTitle = ogTitle || title;
  const resolvedOgDescription = ogDescription || description;
  const resolvedOgUrl = ogUrl || canonicalHref;
  const resolvedTwitterTitle = twitterTitle || resolvedOgTitle || title;
  const resolvedTwitterDescription = twitterDescription || resolvedOgDescription || description;
  const resolvedTwitterImage = twitterImage || ogImage;
  const resolvedTwitterImageAlt = twitterImageAlt || ogImageAlt;

  const jsonLdArray = Array.isArray(jsonLd) ? jsonLd.filter(Boolean) : [];
  const keywordContent = Array.isArray(keywords)
    ? keywords.filter(Boolean).join(', ')
    : typeof keywords === 'string'
      ? keywords
      : undefined;
  const articleTagsArray = Array.isArray(articleTags) ? articleTags.filter(Boolean) : [];

  return (
    <Helmet>
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      {keywordContent && <meta name="keywords" content={keywordContent} />}
      {canonicalHref && <link rel="canonical" href={canonicalHref} />}
      {robots && <meta name="robots" content={robots} />}
      {themeColor && <meta name="theme-color" content={themeColor} />}
      {articleAuthor && <meta name="author" content={articleAuthor} />}

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
      {articlePublishedTime && <meta property="article:published_time" content={articlePublishedTime} />}
      {articleModifiedTime && <meta property="article:modified_time" content={articleModifiedTime} />}
      {articleSection && <meta property="article:section" content={articleSection} />}
      {articleAuthor && <meta property="article:author" content={articleAuthor} />}
      {articleTagsArray.map((tag, index) => (
        <meta key={`article-tag-${index}`} property="article:tag" content={tag} />
      ))}

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
