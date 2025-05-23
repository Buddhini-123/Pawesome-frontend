import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-8xl mb-8">🐾</div>
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-600 mb-4">Page Not Found</h2>
        <p className="text-lg text-gray-500 mb-8 max-w-md">
          Oops! The page you're looking for seems to have wandered off like a curious pet.
        </p>
        <div className="space-x-4">
          <Link
            to="/"
            className="inline-block bg-amber-400 hover:bg-amber-500 text-gray-800 font-semibold px-8 py-3 rounded-full transition-colors"
          >
            Go Home
          </Link>
          <Link
            to="/contact"
            className="inline-block border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium px-8 py-3 rounded-full transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;