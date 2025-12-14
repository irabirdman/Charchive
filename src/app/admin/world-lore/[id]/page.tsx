import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { WorldLoreForm } from '@/components/admin/WorldLoreForm';

export default async function EditWorldLorePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const supabase = await createClient();

  const { data: lore } = await supabase
    .from('world_lore')
    .select(`
      *,
      world:worlds(id, name, slug),
      related_ocs:world_lore_ocs(
        *,
        oc:ocs(id, name, slug)
      ),
      related_events:world_lore_timeline_events(
        *,
        event:timeline_events(id, title)
      )
    `)
    .eq('id', resolvedParams.id)
    .single();

  if (!lore) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-100 mb-8">Edit Lore Entry</h1>
      <div className="bg-gray-700/90 rounded-lg shadow-lg p-6 border border-gray-600/70">
        <WorldLoreForm lore={lore} />
      </div>
    </div>
  );
}

