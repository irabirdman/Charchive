'use client';

import { useState, useEffect, useMemo } from 'react';
import { csvOptions } from '@/lib/utils/csvOptionsData';

type DropdownField = keyof typeof csvOptions;

interface UseDropdownOptionsResult {
  options: string[];
  isLoading: boolean;
  error: Error | null;
}

/**
 * Hook to fetch dropdown options from database first, with fallback to generated file
 * This ensures form components always have the latest data
 */
export function useDropdownOptions(field: DropdownField | undefined): UseDropdownOptionsResult {
  const [dbOptions, setDbOptions] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!field) {
      setDbOptions(null);
      return;
    }

    // Fetch from database
    setIsLoading(true);
    setError(null);
    
    fetch('/api/admin/dropdown-options')
      .then(res => {
        if (!res.ok) {
          throw new Error(`Failed to fetch options: ${res.statusText}`);
        }
        return res.json();
      })
      .then(data => {
        if (data.options && data.options[field]) {
          setDbOptions(data.options[field]);
        } else {
          // Field not found in database, will use fallback
          setDbOptions(null);
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.warn(`[useDropdownOptions] Failed to fetch ${field} from database, using fallback:`, err);
        setError(err);
        setDbOptions(null);
        setIsLoading(false);
      });
  }, [field]);

  // Return database options if available, otherwise fallback to generated file
  const options = useMemo(() => {
    if (dbOptions !== null) {
      return dbOptions;
    }
    // Fallback to generated file
    if (field && csvOptions[field]) {
      return csvOptions[field];
    }
    return [];
  }, [dbOptions, field]);

  return {
    options,
    isLoading,
    error,
  };
}

