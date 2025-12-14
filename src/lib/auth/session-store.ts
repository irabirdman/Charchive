/**
 * Simple in-memory session store
 * In production, use Redis or a database for session storage
 */

interface SessionData {
  token: string;
  expiresAt: number;
  createdAt: number;
}

const sessions = new Map<string, SessionData>();

// Session duration: 7 days
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Create a new session
 */
export function createSession(token: string): void {
  const expiresAt = Date.now() + SESSION_DURATION_MS;
  sessions.set(token, {
    token,
    expiresAt,
    createdAt: Date.now(),
  });
}

/**
 * Verify and get session data
 */
export function getSession(token: string): SessionData | null {
  const session = sessions.get(token);
  
  if (!session) {
    return null;
  }
  
  // Check if expired
  if (session.expiresAt < Date.now()) {
    sessions.delete(token);
    return null;
  }
  
  return session;
}

/**
 * Delete a session
 */
export function deleteSession(token: string): void {
  sessions.delete(token);
}

/**
 * Clean up expired sessions
 */
export function cleanupSessions(): void {
  const now = Date.now();
  for (const [token, session] of sessions.entries()) {
    if (session.expiresAt < now) {
      sessions.delete(token);
    }
  }
}

// Clean up expired sessions every hour
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupSessions, 60 * 60 * 1000);
}


