'use client';

import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger';

interface FormButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  isLoading?: boolean;
  children: React.ReactNode;
}

export function FormButton({
  variant = 'primary',
  isLoading = false,
  disabled,
  children,
  className = '',
  ...props
}: FormButtonProps) {
  const variantClasses = {
    primary: 'px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/70 focus:ring-offset-2 focus:ring-offset-gray-900 shadow-md hover:shadow-lg',
    secondary: 'px-6 py-2.5 bg-gray-700/80 text-gray-200 rounded-lg hover:bg-gray-600/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium focus:outline-none focus:ring-2 focus:ring-gray-500/70 focus:ring-offset-2 focus:ring-offset-gray-900',
    danger: 'px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium focus:outline-none focus:ring-2 focus:ring-red-500/70 focus:ring-offset-2 focus:ring-offset-gray-900',
  };

  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={`${variantClasses[variant]} ${className}`}
    >
      {isLoading ? (
        <span className="flex items-center">
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
}

