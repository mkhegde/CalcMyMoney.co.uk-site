import React from 'react';
import { Link } from 'react-router-dom';
import { ListTree, Compass, BookMarked } from 'lucide-react';

const ICONS = [ListTree, Compass, BookMarked];

export default function DirectoryLinks({ links = [] }) {
  if (!Array.isArray(links) || links.length === 0) {
    return null;
  }

  return (
    <section className="non-printable bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
        Explore More Resources
      </h2>
      <div className="grid gap-4 md:grid-cols-2">
        {links.slice(0, 3).map((link, index) => {
          const Icon = ICONS[index % ICONS.length];
          return (
            <Link
              key={`${link.url}-${index}`}
              to={link.url}
              className="group flex items-start gap-3 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 shadow-sm transition hover:shadow-md hover:border-sky-400 dark:hover:border-sky-400"
            >
              <span className="rounded-full bg-sky-100 dark:bg-sky-900/60 p-2 text-sky-700 dark:text-sky-300">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="font-medium text-slate-900 dark:text-slate-100 group-hover:text-sky-600 dark:group-hover:text-sky-300">
                  {link.label}
                </p>
                {link.description ? (
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{link.description}</p>
                ) : null}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
