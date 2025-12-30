-- Fix existing timeline events by linking them via the junction table
-- This migration fixes events that were inserted with timeline_id but not linked via timeline_event_timelines

DO $$
DECLARE
  event_record RECORD;
  position_counter INTEGER;
BEGIN
  -- Loop through all timelines
  FOR event_record IN 
    SELECT DISTINCT timeline_id 
    FROM timeline_events 
    WHERE timeline_id IS NOT NULL
  LOOP
    -- Reset position counter for each timeline
    position_counter := 0;
    
    -- Insert missing junction table records for this timeline
    -- Order by year, month, day, created_at to maintain chronological order
    INSERT INTO timeline_event_timelines (timeline_id, timeline_event_id, position)
    SELECT 
      te.timeline_id,
      te.id,
      ROW_NUMBER() OVER (
        ORDER BY 
          te.year ASC NULLS LAST,
          (te.date_data->>'month')::INTEGER ASC NULLS LAST,
          (te.date_data->>'day')::INTEGER ASC NULLS LAST,
          te.created_at ASC
      ) - 1 AS position
    FROM timeline_events te
    WHERE te.timeline_id = event_record.timeline_id
      AND NOT EXISTS (
        SELECT 1 
        FROM timeline_event_timelines tet 
        WHERE tet.timeline_id = te.timeline_id 
          AND tet.timeline_event_id = te.id
      )
    ON CONFLICT (timeline_id, timeline_event_id) DO NOTHING;
    
  END LOOP;
END $$;

