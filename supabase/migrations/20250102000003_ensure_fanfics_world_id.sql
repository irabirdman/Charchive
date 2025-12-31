-- Ensure world_id column exists in fanfics table
-- This migration fixes schema cache issues where world_id might not be recognized

-- Add world_id column if it doesn't exist
DO $$ 
BEGIN
  -- Check if column exists
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public'
    AND table_name = 'fanfics' 
    AND column_name = 'world_id'
  ) THEN
    -- Add the column if it doesn't exist
    ALTER TABLE fanfics 
    ADD COLUMN world_id UUID REFERENCES worlds(id) ON DELETE CASCADE;
    
    -- Make it NOT NULL (only if there are no existing rows, or all rows have a world_id)
    -- If there are existing rows without world_id, this will fail, which is expected
    -- In that case, you'll need to manually set world_id for existing rows first
    IF NOT EXISTS (SELECT 1 FROM fanfics) THEN
      ALTER TABLE fanfics ALTER COLUMN world_id SET NOT NULL;
    END IF;
  END IF;
END $$;

-- Ensure index exists
CREATE INDEX IF NOT EXISTS idx_fanfics_world_id ON fanfics(world_id);

-- Add comment
COMMENT ON COLUMN fanfics.world_id IS 'World/fandom this fanfic belongs to';

