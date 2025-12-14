import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/layout/PageHeader';
import { WorldHeader } from '@/components/world/WorldHeader';
import { WorldDetails } from '@/components/world/WorldDetails';
import { OCCard } from '@/components/oc/OCCard';
import { TimelineList } from '@/components/timeline/TimelineList';
import { LoreCard } from '@/components/lore/LoreCard';
import Link from 'next/link';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const supabase = await createClient();
  const resolvedParams = await params;

  const { data: world } = await supabase
    .from('worlds')
    .select('name')
    .eq('slug', resolvedParams.slug)
    .eq('is_public', true)
    .single();

  if (!world) {
    return {
      title: 'World Not Found',
    };
  }

  return {
    title: world.name,
  };
}

export const revalidate = 300;

export default async function WorldDetailPage({
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

  // Parallelize independent queries for better performance
  const [ocsResult, timelinesResult, loreEntriesResult] = await Promise.all([
    supabase
      .from('ocs')
      .select('*, world:worlds(*)')
      .eq('world_id', world.id)
      .eq('is_public', true)
      .order('name', { ascending: true }),
    supabase
      .from('timelines')
      .select('*')
      .eq('world_id', world.id)
      .order('name', { ascending: true }),
    supabase
      .from('world_lore')
      .select(`
        *,
        world:worlds(id, name, slug),
        story_alias:story_aliases(id, name, slug, description),
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
      .order('name', { ascending: true })
      .limit(6), // Show preview of 6 entries
  ]);

  const ocs = ocsResult.data;
  const timelines = timelinesResult.data;
  const loreEntries = loreEntriesResult.data;

  return (
    <div>
      <PageHeader
        title={world.name}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Worlds', href: '/worlds' },
          { label: world.name },
        ]}
      />

      <WorldHeader world={world} />
      <WorldDetails world={world} />

      {ocs && ocs.length > 0 && (
        <section className="mt-12">
          <h2 className="wiki-section-header">
            <i className="fas fa-users text-blue-400"></i>
            Characters
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ocs.map((oc) => (
              <OCCard key={oc.id} oc={oc} />
            ))}
          </div>
        </section>
      )}

      {timelines && timelines.length > 0 && (
        <section className="mt-12">
          <h2 className="wiki-section-header">
            <i className="fas fa-clock text-purple-400"></i>
            Timelines
          </h2>
          <TimelineList timelines={timelines} worldSlug={world.slug} />
        </section>
      )}

      {loreEntries && loreEntries.length > 0 && (
        <section className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="wiki-section-header">
              <i className="fas fa-book text-green-400"></i>
              Lore
            </h2>
            <Link
              href={`/worlds/${world.slug}/lore`}
              prefetch={true}
              className="text-purple-400 hover:text-purple-300 text-sm font-medium"
            >
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loreEntries.map((lore) => (
              <LoreCard key={lore.id} lore={lore} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
