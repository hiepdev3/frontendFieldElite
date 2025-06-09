import React from 'react';

export default function AccountDisabledPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-16">
      <div className="max-w-xl w-full bg-white rounded-xl shadow-md p-12 text-center">
        <svg
          className="mx-auto mb-8 h-16 w-16 text-red-500"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"
          />
        </svg>

        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
          Your Account Has Been Disabled
        </h1>
        <p className="text-gray-600 text-lg mb-6">
          Your account was disabled due to a violation of our policy.
        </p>
        <p className="text-gray-600 text-base mb-8">
          Please contact us at{' '}
          <a
            href="mailto:support.yourservice@gmail.com"
            className="text-red-600 font-semibold hover:underline"
          >
            sohufield@gmail.com
          </a>{' '}
          to reactivate your account.
        </p>
        <a
          href="mailto:support.yourservice@gmail.com"
          className="inline-block px-8 py-3 bg-red-600 hover:bg-red-700 text-white text-lg font-semibold rounded-lg shadow-md transition-colors duration-300"
          aria-label="Contact support by email"
        >
          Contact Support
        </a>
      </div>
    </div>
  );
}

