import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/layout/PageHeader';
import { LoreList } from '@/components/lore/LoreList';

export default async function WorldLorePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const supabase = await createClient();
  const resolvedParams = await params;

  const { data: world } = await supabase
    .from('worlds')
    .select('*')
    .eq('slug', resolvedParams.slug)
    .eq('is_public', true)
    .single();

  if (!world) {
    notFound();
  }

  const { data: loreEntries } = await supabase
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
    .eq('world_id', world.id)
    .order('lore_type', { ascending: true })
    .order('name', { ascending: true });

  return (
    <div>
      <PageHeader
        title={`${world.name} - Lore`}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Worlds', href: '/worlds' },
          { label: world.name, href: `/worlds/${world.slug}` },
          { label: 'Lore' },
        ]}
      />

      <section className="mt-8">
        <LoreList loreEntries={loreEntries || []} />
      </section>
    </div>
  );
}

