import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumbs({ path }) {
  if (!path || path.length === 0) {
    return null;
  }

  return (
    <nav className="text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
      <ol className="list-none p-0 inline-flex flex-wrap items-center">
        <li className="flex items-center">
             <Link to={path[0].url} className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1">
                <Home className="w-4 h-4" />
                {path[0].name}
              </Link>
        </li>
        {path.slice(1).map((item, index) => (
          <li key={index + 1} className="flex items-center">
            <ChevronRight className="w-4 h-4 mx-1" />
            {item.url ? (
              <Link to={item.url} className="text-blue-600 hover:text-blue-800 hover:underline">
                {item.name}
              </Link>
            ) : (
              <span className="text-gray-700 font-medium" aria-current="page">
                {item.name}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}