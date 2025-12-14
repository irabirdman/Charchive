/**
 * Persistent file-based session store
 * Sessions are saved to disk so they persist across server restarts
 */

import { promises as fs } from 'fs';
import { join } from 'path';

interface SessionData {
  token: string;
  expiresAt: number;
  createdAt: number;
}

// Session duration: 7 days
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

// Path to store sessions file
const DATA_DIR = join(process.cwd(), '.data');
const SESSIONS_FILE = join(DATA_DIR, 'sessions.json');

// In-memory cache for fast access
const sessions = new Map<string, SessionData>();

// Track if sessions have been loaded
let sessionsLoaded = false;
let loadPromise: Promise<void> | null = null;

// Ensure data directory exists
async function ensureDataDir(): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    // Directory might already exist, that's fine
  }
}

// Load sessions from disk
async function loadSessions(): Promise<void> {
  if (sessionsLoaded) {
    return;
  }
  
  try {
    await ensureDataDir();
    const data = await fs.readFile(SESSIONS_FILE, 'utf-8');
    const sessionsData: Record<string, SessionData> = JSON.parse(data);
    
    // Load into memory and filter out expired sessions
    const now = Date.now();
    for (const [token, session] of Object.entries(sessionsData)) {
      if (session.expiresAt > now) {
        sessions.set(token, session);
      }
    }
    
    // Save cleaned up sessions back to disk
    await saveSessions();
    sessionsLoaded = true;
  } catch (error) {
    // File doesn't exist yet, that's fine - start with empty sessions
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      console.error('Error loading sessions:', error);
    }
    sessionsLoaded = true; // Mark as loaded even if file doesn't exist
  }
}

// Save sessions to disk
async function saveSessions(): Promise<void> {
  try {
    await ensureDataDir();
    const sessionsData: Record<string, SessionData> = {};
    for (const [token, session] of sessions.entries()) {
      sessionsData[token] = session;
    }
    await fs.writeFile(SESSIONS_FILE, JSON.stringify(sessionsData, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving sessions:', error);
  }
}

// Initialize: load sessions from disk on startup
if (typeof window === 'undefined') {
  loadPromise = loadSessions();
  loadPromise.catch(console.error);
}

/**
 * Create a new session
 */
export async function createSession(token: string): Promise<void> {
  const expiresAt = Date.now() + SESSION_DURATION_MS;
  sessions.set(token, {
    token,
    expiresAt,
    createdAt: Date.now(),
  });
  await saveSessions();
}

/**
 * Verify and get session data
 * This function will wait for sessions to load if they haven't loaded yet
 */
export async function getSession(token: string): Promise<SessionData | null> {
  // Wait for sessions to load if they haven't loaded yet
  if (!sessionsLoaded && loadPromise) {
    await loadPromise;
  } else if (!sessionsLoaded) {
    // If loadPromise doesn't exist, start loading now
    await loadSessions();
  }
  
  const session = sessions.get(token);
  
  if (!session) {
    return null;
  }
  
  // Check if expired
  if (session.expiresAt < Date.now()) {
    sessions.delete(token);
    saveSessions().catch(console.error); // Save async, don't block
    return null;
  }
  
  return session;
}

/**
 * Delete a session
 */
export async function deleteSession(token: string): Promise<void> {
  sessions.delete(token);
  await saveSessions();
}

/**
 * Clean up expired sessions
 */
export async function cleanupSessions(): Promise<void> {
  const now = Date.now();
  let cleaned = false;
  for (const [token, session] of sessions.entries()) {
    if (session.expiresAt < now) {
      sessions.delete(token);
      cleaned = true;
    }
  }
  if (cleaned) {
    await saveSessions();
  }
}

// Clean up expired sessions every hour
if (typeof setInterval !== 'undefined' && typeof window === 'undefined') {
  setInterval(() => {
    cleanupSessions().catch(console.error);
  }, 60 * 60 * 1000);
}


