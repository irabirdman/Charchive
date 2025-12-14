'use client';

import React from 'react';

interface FormLabelProps {
  htmlFor?: string;
  required?: boolean;
  optional?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function FormLabel({ htmlFor, required, optional, children, className = '' }: FormLabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-sm font-semibold text-gray-200 mb-2 ${className}`}
    >
      {children}
      {required && <span className="text-red-400 ml-1">*</span>}
      {optional && <span className="text-xs font-normal text-gray-400/80 ml-1">(Optional)</span>}
    </label>
  );
}

