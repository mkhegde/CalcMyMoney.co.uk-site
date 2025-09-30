// src/components/seo/SeoHead.jsx
import { Helmet } from 'react-helmet-async';

export default function SeoHead({ title, desc, canonical, ogImage }) {
  return (
    <Helmet>
      {title && <title>{title}</title>}
      {desc && <meta name="description" content={desc} />}
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Open Graph */}
      {title && <meta property="og:title" content={title} />}
      {desc && <meta property="og:description" content={desc} />}
      {canonical && <meta property="og:url" content={canonical} />}
      {ogImage && <meta property="og:image" content={ogImage} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      {title && <meta name="twitter:title" content={title} />}
      {desc && <meta name="twitter:description" content={desc} />}
      {ogImage && <meta name="twitter:image" content={ogImage} />}
    </Helmet>
  );
}
