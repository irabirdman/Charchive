import { createClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/layout/PageHeader';
import { LoreList } from '@/components/lore/LoreList';

export default async function LorePage() {
  const supabase = await createClient();

  const { data: loreEntries } = await supabase
    .from('world_lore')
    .select(`
      *,
      world:worlds!inner(id, name, slug, is_public),
      related_ocs:world_lore_ocs(
        *,
        oc:ocs(id, name, slug)
      ),
      related_events:world_lore_timeline_events(
        *,
        event:timeline_events(id, title)
      )
    `)
    .eq('world.is_public', true)
    .order('lore_type', { ascending: true })
    .order('name', { ascending: true });

  return (
    <div>
      <PageHeader
        title="Lore"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Lore' },
        ]}
      />

      <section className="mt-8">
        <LoreList loreEntries={loreEntries || []} />
      </section>
    </div>
  );
}




