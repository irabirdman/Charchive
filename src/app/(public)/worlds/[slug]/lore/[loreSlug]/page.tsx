import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/layout/PageHeader';
import { LoreDetail } from '@/components/lore/LoreDetail';

export default async function LoreEntryPage({
  params,
}: {
  params: Promise<{ slug: string; loreSlug: string }>;
}) {
  const supabase = await createClient();
  const resolvedParams = await params;
  const loreSlug = resolvedParams.loreSlug;

  // Query by lore slug and join with world
  const { data: lore } = await supabase
    .from('world_lore')
    .select(`
      *,
      world:worlds!inner(id, name, slug, is_public)
    `)
    .eq('slug', loreSlug)
    .eq('world.is_public', true)
    .single();

  if (!lore || !lore.world) {
    notFound();
  }

  // Now fetch the full lore entry with relationships
  const { data: fullLore } = await supabase
    .from('world_lore')
    .select(`
      *,
      world:worlds(id, name, slug, is_public),
      related_ocs:world_lore_ocs(
        *,
        oc:ocs(id, name, slug)
      ),
      related_events:world_lore_timeline_events(
        *,
        event:timeline_events(id, title)
      )
    `)
    .eq('id', lore.id)
    .single();

  if (!fullLore || !fullLore.world) {
    notFound();
  }

  const world = fullLore.world;

  return (
    <div>
      <PageHeader
        title={lore.name}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Worlds', href: '/worlds' },
          { label: world.name, href: `/worlds/${world.slug}` },
          { label: 'Lore', href: `/worlds/${world.slug}/lore` },
          { label: lore.name },
        ]}
      />

      <section className="mt-8">
        <LoreDetail lore={fullLore} />
      </section>
    </div>
  );
}

