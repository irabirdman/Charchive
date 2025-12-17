'use client';

import { useState, useEffect } from 'react';
import { getGoogleDriveImageUrls } from '@/lib/utils/googleDriveImage';

interface GoogleDriveImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  fallbackSrc?: string;
}

export function GoogleDriveImage({ 
  src, 
  alt, 
  className = '', 
  style,
  fallbackSrc = 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/960px-Placeholder_view_vector.svg.png'
}: GoogleDriveImageProps) {
  const [currentUrlIndex, setCurrentUrlIndex] = useState(0);
  const [hasError, setHasError] = useState(false);
  
  const urls = src.includes('drive.google.com') 
    ? getGoogleDriveImageUrls(src)
    : [src];
  
  const currentUrl = urls[currentUrlIndex] || fallbackSrc;

  useEffect(() => {
    setCurrentUrlIndex(0);
    setHasError(false);
  }, [src]);

  const handleError = () => {
    if (currentUrlIndex < urls.length - 1) {
      // Try next URL format
      setCurrentUrlIndex(currentUrlIndex + 1);
    } else {
      // All URLs failed, show fallback
      setHasError(true);
      console.error('Failed to load Google Drive image. Tried URLs:', urls);
      console.error('Original URL:', src);
    }
  };

  const handleLoad = () => {
    setHasError(false);
  };

  return (
    <img
      src={hasError ? fallbackSrc : currentUrl}
      alt={alt}
      className={className}
      style={style}
      onError={handleError}
      onLoad={handleLoad}
    />
  );
}







