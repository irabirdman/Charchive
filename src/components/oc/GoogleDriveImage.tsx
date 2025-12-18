'use client';

import { useState, useEffect } from 'react';
import { getGoogleDriveFileId } from '@/lib/utils/googleDriveImage';

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
  const [imageUrl, setImageUrl] = useState<string>(src);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Reset state when src changes
    setHasError(false);
    setIsLoading(true);

    // If it's a Google Drive URL, use the proxy API
    if (src.includes('drive.google.com')) {
      const fileId = getGoogleDriveFileId(src);
      if (fileId) {
        // Use the proxy API to bypass CORS
        const proxyUrl = `/api/images/proxy?fileId=${encodeURIComponent(fileId)}&url=${encodeURIComponent(src)}`;
        setImageUrl(proxyUrl);
      } else {
        // Fallback to original URL if we can't extract file ID
        setImageUrl(src);
      }
    } else {
      // Not a Google Drive URL, use as-is
      setImageUrl(src);
    }
  }, [src]);

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
    console.error('Failed to load image:', src);
  };

  const handleLoad = () => {
    setHasError(false);
    setIsLoading(false);
  };

  return (
    <img
      src={hasError ? fallbackSrc : imageUrl}
      alt={alt}
      className={className}
      style={style}
      onError={handleError}
      onLoad={handleLoad}
    />
  );
}













