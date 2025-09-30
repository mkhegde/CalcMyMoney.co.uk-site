// src/components/seo/buildFaqJsonLd.js
export default function buildFaqJsonLd(faqs = []) {
  if (!Array.isArray(faqs) || faqs.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(({ question, answer }) => ({
      "@type": "Question",
      "name": String(question || '').trim(),
      "acceptedAnswer": {
        "@type": "Answer",
        "text": typeof answer === 'string' ? answer : (answer?.props ? '' : String(answer || ''))
      }
    }))
  };
}
