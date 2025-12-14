import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { WorldForm } from '@/components/admin/WorldForm';
import Link from 'next/link';

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const supabase = await createClient();

  const { data: world } = await supabase
    .from('worlds')
    .select('name')
    .eq('id', params.id)
    .single();

  if (!world) {
    return {
      title: 'Edit World',
    };
  }

  return {
    title: `Edit ${world.name}`,
  };
}

export default async function EditWorldPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();

  const { data: world } = await supabase
    .from('worlds')
    .select(`
      *,
      story_aliases:story_aliases(
        id,
        name,
        slug,
        description,
        created_at,
        updated_at
      )
    `)
    .eq('id', params.id)
    .single();

  if (!world) {
    notFound();
  }

  // Get lore entries count for this world
  const { count: loreCount } = await supabase
    .from('world_lore')
    .select('*', { count: 'exact', head: true })
    .eq('world_id', world.id);

  return (
    <div className="px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-100">Edit World</h1>
        <Link
          href={`/admin/world-lore?world_id=${world.id}`}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-500 text-sm md:text-base w-fit"
        >
          View Lore Entries ({loreCount || 0})
        </Link>
      </div>
      <div className="bg-gray-700/90 rounded-lg shadow-lg p-4 md:p-6 border border-gray-600/70">
        <WorldForm world={world} />
      </div>
    </div>
  );
}
