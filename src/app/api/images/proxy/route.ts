import { NextRequest, NextResponse } from 'next/server';
import { getGoogleDriveFileId, getGoogleDriveImageUrls } from '@/lib/utils/googleDriveImage';

/**
 * API route to proxy Google Drive images
 * This bypasses CORS restrictions by fetching images server-side
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get('url');
  const fileId = searchParams.get('fileId');

  if (!url && !fileId) {
    return NextResponse.json(
      { error: 'Missing url or fileId parameter' },
      { status: 400 }
    );
  }

  // Get file ID from URL or use provided fileId
  const driveFileId = fileId || (url ? getGoogleDriveFileId(url) : null);
  
  if (!driveFileId) {
    return NextResponse.json(
      { error: 'Invalid Google Drive URL or file ID' },
      { status: 400 }
    );
  }

  // Try multiple URL formats in order of reliability
  const urls = url 
    ? getGoogleDriveImageUrls(url)
    : [
        `https://lh3.googleusercontent.com/d/${driveFileId}`,
        `https://drive.google.com/thumbnail?id=${driveFileId}&sz=w1920-h1080`,
        `https://drive.google.com/thumbnail?id=${driveFileId}`,
        `https://drive.google.com/uc?export=view&id=${driveFileId}`,
      ];

  // Try each URL format until one works
  for (const imageUrl of urls) {
    let timeoutId: NodeJS.Timeout | null = null;
    try {
      // Create abort controller for timeout
      const controller = new AbortController();
      timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(imageUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Referer': 'https://drive.google.com/',
        },
        signal: controller.signal,
      });
      
      if (timeoutId) clearTimeout(timeoutId);

      if (response.ok) {
        const imageBuffer = await response.arrayBuffer();
        const contentType = response.headers.get('content-type') || 'image/jpeg';

        // Return the image with appropriate headers
        return new NextResponse(imageBuffer, {
          status: 200,
          headers: {
            'Content-Type': contentType,
            'Cache-Control': 'public, max-age=31536000, immutable', // Cache for 1 year
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
          },
        });
      }
    } catch (error) {
      // Clear timeout if still active
      if (timeoutId) clearTimeout(timeoutId);
      // Continue to next URL if this one fails
      console.warn(`Failed to fetch image from ${imageUrl}:`, error);
      continue;
    }
  }

  // All URLs failed
  return NextResponse.json(
    { error: 'Failed to fetch image from Google Drive' },
    { status: 404 }
  );
}

