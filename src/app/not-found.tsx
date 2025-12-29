'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900/30">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-100 mb-4">404</h1>
        <p className="text-xl text-gray-300 mb-8">Page not found</p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
