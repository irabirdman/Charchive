-- Create admin_sessions table for storing admin authentication sessions
-- This replaces the file-based session store to persist sessions across server restarts

CREATE TABLE IF NOT EXISTS admin_sessions (
  token TEXT PRIMARY KEY,
  expires_at BIGINT NOT NULL,
  created_at BIGINT NOT NULL
);

-- Create index on expires_at for efficient cleanup queries
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires_at ON admin_sessions(expires_at);

-- Optional: Add comment
COMMENT ON TABLE admin_sessions IS 'Stores admin authentication session tokens with expiration times';
