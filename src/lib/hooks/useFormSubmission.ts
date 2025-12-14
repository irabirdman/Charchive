import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface UseFormSubmissionOptions<T> {
  /**
   * Base API route (e.g., '/api/admin/ocs' or '/api/admin/worlds')
   */
  apiRoute: string;
  /**
   * Entity being edited (if editing) or undefined (if creating)
   */
  entity?: { id: string };
  /**
   * Route to navigate to after successful submission
   */
  successRoute: string;
  /**
   * Optional function to transform data before sending
   */
  transformData?: (data: T) => any;
  /**
   * Optional success message
   */
  successMessage?: string;
  /**
   * Whether to show success message with delay before navigation
   */
  showSuccessMessage?: boolean;
  /**
   * Delay in ms before navigation (only used if showSuccessMessage is true)
   */
  successDelay?: number;
}

interface UseFormSubmissionResult<T> {
  isSubmitting: boolean;
  error: string | null;
  success: boolean;
  submit: (data: T) => Promise<any>;
  clearError: () => void;
  clearSuccess: () => void;
}

/**
 * Hook to handle form submission with common patterns:
 * - Loading state management
 * - Error/success state handling
 * - API call with proper error handling
 * - Router navigation after success
 * 
 * Used across all admin forms to reduce duplication.
 */
export function useFormSubmission<T = any>(
  options: UseFormSubmissionOptions<T>
): UseFormSubmissionResult<T> {
  const {
    apiRoute,
    entity,
    successRoute,
    transformData,
    successMessage,
    showSuccessMessage = false,
    successDelay = 1000,
  } = options;

  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submit = async (data: T) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const url = entity ? `${apiRoute}/${entity.id}` : apiRoute;
      const method = entity ? 'PUT' : 'POST';

      // Transform data if transform function provided
      const requestData = transformData ? transformData(data) : data;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          error: `Failed to save: ${response.statusText}`,
        }));
        throw new Error(errorData.error || `Failed to save: ${response.statusText}`);
      }

      // Parse response (some routes return data, some don't)
      const responseData = await response.json().catch(() => null);

      setSuccess(true);

      if (showSuccessMessage) {
        // Wait before navigating to show success message
        setTimeout(() => {
          setIsSubmitting(false);
          router.push(successRoute);
          router.refresh();
        }, successDelay);
      } else {
        // Navigate immediately
        setIsSubmitting(false);
        router.push(successRoute);
        router.refresh();
      }

      return responseData;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save. Please try again.');
      setIsSubmitting(false);
    }
  };

  const clearError = () => setError(null);
  const clearSuccess = () => setSuccess(false);

  return {
    isSubmitting,
    error,
    success,
    submit,
    clearError,
    clearSuccess,
  };
}

