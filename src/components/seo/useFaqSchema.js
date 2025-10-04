import React from 'react';
import { useMemo } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const htmlEntityMap = {
  '&nbsp;': ' ',
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
};

const decodeHtmlEntities = (value) => {
  if (!value) {
    return '';
  }

  let decoded = value;

  if (typeof window !== 'undefined' && window.document?.createElement) {
    const textarea = window.document.createElement('textarea');
    textarea.innerHTML = value;
    decoded = textarea.value;
  } else {
    decoded = Object.entries(htmlEntityMap).reduce(
      (acc, [entity, replacement]) => acc.replace(new RegExp(entity, 'g'), replacement),
      value
    );
  }

  return decoded;
};

const stripHtmlTags = (value) =>
  typeof value === 'string' ? value.replace(/<[^>]*>/g, ' ') : '';

const normaliseWhitespace = (value) => value.replace(/\s+/g, ' ').trim();

const toPlainText = (value) => {
  if (value === null || value === undefined) {
    return '';
  }

  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    const decoded = decodeHtmlEntities(String(value));
    return normaliseWhitespace(stripHtmlTags(decoded));
  }

  if (Array.isArray(value)) {
    const text = value.map((item) => toPlainText(item)).filter(Boolean).join(' ');
    return normaliseWhitespace(text);
  }

  if (React.isValidElement(value)) {
    const markup = renderToStaticMarkup(value);
    const withoutTags = stripHtmlTags(markup);
    return normaliseWhitespace(decodeHtmlEntities(withoutTags));
  }

  if (typeof value === 'object') {
    if (typeof value.toString === 'function' && value.toString !== Object.prototype.toString) {
      return normaliseWhitespace(decodeHtmlEntities(value.toString()));
    }
  }

  return '';
};

export default function useFaqSchema(faqs) {
  return useMemo(() => {
    if (!Array.isArray(faqs) || faqs.length === 0) {
      return null;
    }

    const mainEntity = faqs
      .map((faq) => {
        if (!faq) {
          return null;
        }

        const question = toPlainText(faq.question);
        const answer = toPlainText(faq.answer);

        if (!question || !answer) {
          return null;
        }

        return {
          '@type': 'Question',
          name: question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: answer,
          },
        };
      })
      .filter(Boolean);

    if (mainEntity.length === 0) {
      return null;
    }

    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity,
    };
  }, [faqs]);
}
