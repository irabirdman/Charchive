import { createHash, randomBytes, timingSafeEqual } from 'crypto';

/**
 * Constant-time string comparison to prevent timing attacks
 */
export function constantTimeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  
  // Convert to buffers for timing-safe comparison
  const bufferA = Buffer.from(a, 'utf8');
  const bufferB = Buffer.from(b, 'utf8');
  
  try {
    return timingSafeEqual(bufferA, bufferB);
  } catch {
    return false;
  }
}

/**
 * Generate a secure random session token
 */
export function generateSessionToken(): string {
  // Generate 32 random bytes and encode as base64
  const token = randomBytes(32).toString('base64url');
  return token;
}

/**
 * Hash a session token for storage (optional, for extra security)
 */
export function hashSessionToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

/**
 * Verify a session token against a hash
 */
export function verifySessionToken(token: string, hash: string): boolean {
  const tokenHash = hashSessionToken(token);
  return constantTimeCompare(tokenHash, hash);
}

/**
 * Hash a password using bcrypt
 * Note: This is async because bcrypt operations are CPU-intensive
 */
export async function hashPassword(password: string): Promise<string> {
  const bcrypt = await import('bcryptjs');
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

/**
 * Verify a password against a bcrypt hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const bcrypt = await import('bcryptjs');
  return bcrypt.compare(password, hash);
}





















