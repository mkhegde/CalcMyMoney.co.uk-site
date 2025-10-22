import React from 'react';
import { Quote } from 'lucide-react';

import Heading from '@/components/common/Heading';

export default function EmotionalHook({ title, message, quote, author }) {
  if (!message && !quote) return null;

  return (
    <section className="non-printable rounded-xl border border-emerald-100 bg-white p-6 shadow-sm dark:border-emerald-900/40 dark:bg-slate-950/40">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2 max-w-2xl">
          {title ? (
            <Heading as="h2" size="h3" className="!mb-0 text-slate-900 dark:text-slate-100">
              {title}
            </Heading>
          ) : null}
          {message ? <p className="text-sm text-slate-600 dark:text-slate-300">{message}</p> : null}
        </div>
        {quote ? (
          <blockquote className="max-w-sm rounded-lg border border-emerald-200 bg-emerald-50/70 p-4 text-sm text-emerald-900 shadow-sm dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-100">
            <div className="flex items-start gap-2">
              <Quote className="h-4 w-4 shrink-0" aria-hidden="true" />
              <p className="italic leading-relaxed">“{quote}”</p>
            </div>
            {author ? (
              <footer className="mt-3 text-right text-xs font-medium uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
                — {author}
              </footer>
            ) : null}
          </blockquote>
        ) : null}
      </div>
    </section>
  );
}
