'use client';

import { useState, useRef, useMemo, useEffect, memo } from 'react';
import { getProxyUrl } from '@/lib/utils/googleDriveImage';

interface GoogleDriveImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  fallbackSrc?: string;
}

function GoogleDriveImageComponent({ 
  src, 
  alt, 
  className = '', 
  style,
  fallbackSrc = 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/960px-Placeholder_view_vector.svg.png'
}: GoogleDriveImageProps) {
  // Calculate proxy URL immediately, not in useEffect - memoize to prevent recalculation
  const imageUrl = useMemo(() => {
    if (src.includes('drive.google.com')) {
      return getProxyUrl(src);
    }
    return src;
  }, [src]);

  // Track the current image URL to prevent unnecessary state changes
  const currentImageUrlRef = useRef<string>(imageUrl);
  const [hasError, setHasError] = useState(false);
  const errorCountRef = useRef<number>(0);

  // Only update ref when imageUrl actually changes
  useEffect(() => {
    if (currentImageUrlRef.current !== imageUrl) {
      currentImageUrlRef.current = imageUrl;
      // Reset error state only when URL changes
      setHasError(false);
      errorCountRef.current = 0;
    }
  }, [imageUrl]);

  const handleError = () => {
    // Prevent infinite error loops - only show error after first attempt
    errorCountRef.current += 1;
    if (errorCountRef.current === 1 && !hasError) {
      setHasError(true);
      console.error('Failed to load image. Original URL:', src);
      console.error('Proxy URL attempted:', imageUrl);
    }
  };

  const handleLoad = () => {
    // Successfully loaded - reset error state and count
    if (hasError) {
      setHasError(false);
    }
    errorCountRef.current = 0;
  };

  // Use the current image URL, or fallback if there's an error
  const displayUrl = hasError ? fallbackSrc : imageUrl;

  return (
    <img
      src={displayUrl}
      alt={alt}
      className={className}
      style={style}
      onError={handleError}
      onLoad={handleLoad}
      loading="lazy"
      decoding="async"
    />
  );
}

// Memoize to prevent unnecessary re-renders when parent components update
export const GoogleDriveImage = memo(GoogleDriveImageComponent);













