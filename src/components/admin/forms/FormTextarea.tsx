'use client';

import React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  register?: UseFormRegisterReturn;
  error?: string;
  helpText?: string;
  markdown?: boolean;
}

export const FormTextarea = React.forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ register, error, helpText, markdown, className = '', disabled, ...props }, ref) => {
    const baseClasses = 'w-full px-3 py-2 md:px-4 md:py-2.5 bg-gray-900/60 border border-gray-500/60 rounded-lg text-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/70 focus:border-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base';
    const markdownClasses = markdown ? 'font-mono text-sm' : '';

    // Extract ref from register if it exists, otherwise use the forwarded ref
    const { ref: registerRef, ...registerProps } = register || {};
    const textareaRef = registerRef || ref;

    return (
      <div>
        <textarea
          {...registerProps}
          {...props}
          ref={textareaRef}
          disabled={disabled}
          className={`${baseClasses} ${markdownClasses} ${className}`}
        />
        {error && (
          <p className="mt-1.5 text-sm text-red-400 font-medium">{error}</p>
        )}
        {helpText && !error && (
          <p className="mt-1.5 text-xs text-gray-400/80">{helpText}</p>
        )}
      </div>
    );
  }
);

FormTextarea.displayName = 'FormTextarea';

