import React from 'react';
import { Quote } from 'lucide-react';

export default function EmotionalHook({ title, message, quote, author }) {
  if (!message && !quote) return null;

  return (
    <section className="non-printable bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-lg p-8 shadow-md">
      <div className="space-y-4">
        {title ? (
          <h2 className="text-2xl font-semibold tracking-tight text-slate-100">{title}</h2>
        ) : null}
        {message ? <p className="text-base text-slate-200">{message}</p> : null}
        {quote ? (
          <figure className="border-l-4 border-sky-400 pl-4">
            <blockquote className="italic text-slate-100 flex items-start gap-3">
              <Quote className="w-5 h-5 mt-1 shrink-0 text-sky-300" aria-hidden="true" />
              <span>{quote}</span>
            </blockquote>
            {author ? (
              <figcaption className="mt-2 text-sm text-slate-300">— {author}</figcaption>
            ) : null}
          </figure>
        ) : null}
      </div>
    </section>
  );
}
