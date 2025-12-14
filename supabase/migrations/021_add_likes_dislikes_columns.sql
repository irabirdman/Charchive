-- Migration: Add likes and dislikes columns to ocs table
-- Run this in your Supabase SQL editor if the columns don't exist

-- Add likes column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'ocs' 
        AND column_name = 'likes'
    ) THEN
        ALTER TABLE ocs ADD COLUMN likes TEXT;
    END IF;
END $$;

-- Add dislikes column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'ocs' 
        AND column_name = 'dislikes'
    ) THEN
        ALTER TABLE ocs ADD COLUMN dislikes TEXT;
    END IF;
END $$;

-- Verify the columns were added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'ocs' 
AND column_name IN ('likes', 'dislikes');

