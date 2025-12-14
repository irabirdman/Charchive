import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

interface World {
  id: string;
  name: string;
  slug?: string;
}

interface UseWorldsOptions {
  includeSlug?: boolean;
}

interface UseWorldsResult {
  worlds: World[];
  loading: boolean;
  error: string | null;
}

/**
 * Hook to fetch all worlds from the database.
 * Used across multiple forms for world selection dropdowns.
 */
export function useWorlds(options: UseWorldsOptions = {}): UseWorldsResult {
  const { includeSlug = false } = options;
  const [worlds, setWorlds] = useState<World[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWorlds() {
      try {
        setLoading(true);
        setError(null);
        const supabase = createClient();
        const selectFields = includeSlug ? 'id, name, slug' : 'id, name';
        const { data, error: fetchError } = await supabase
          .from('worlds')
          .select(selectFields)
          .order('name');

        if (fetchError) {
          throw fetchError;
        }

        setWorlds(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch worlds');
        console.error('Error fetching worlds:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchWorlds();
  }, [includeSlug]);

  return { worlds, loading, error };
}




