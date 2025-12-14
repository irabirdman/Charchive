import { WorldLoreForm } from '@/components/admin/WorldLoreForm';
import { createClient } from '@/lib/supabase/server';

export default async function NewWorldLorePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const supabase = await createClient();
  const resolvedSearchParams = await searchParams;
  const worldId = typeof resolvedSearchParams.world_id === 'string' ? resolvedSearchParams.world_id : undefined;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-100 mb-8">Create Lore Entry</h1>
      <div className="bg-gray-700/90 rounded-lg shadow-lg p-6 border border-gray-600/70">
        <WorldLoreForm worldId={worldId} />
      </div>
    </div>
  );
}

