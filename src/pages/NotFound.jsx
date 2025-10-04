import { Link } from 'react-router-dom';

import Heading from '@/components/common/Heading';
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
      <Heading as="h1" size="h1" weight="bold" className="text-blue-600 mb-4">404</Heading>
      <Heading as="h2" size="h2" className="text-gray-900 dark:text-gray-100 mb-2">
        Page Not Found
      </Heading>
      <p className="text-gray-600 dark:text-gray-400 mb-6 text-center max-w-md">
        Sorry, the page you are looking for doesn’t exist or has been moved.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
      >
        Go back home
      </Link>
    </div>
  );
}
