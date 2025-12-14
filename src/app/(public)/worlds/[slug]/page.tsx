import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import type { StoryAlias } from '@/types/oc';
import { PageHeader } from '@/components/layout/PageHeader';
import { WorldHeader } from '@/components/world/WorldHeader';
import { WorldDetails } from '@/components/world/WorldDetails';
import { WorldStorySelector } from '@/components/world/WorldStorySelector';
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
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ story?: string }>;
}) {
  const supabase = await createClient();
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const storySlug = resolvedSearchParams?.story;

  const { data: world } = await supabase
    .from('worlds')
    .select(`
      *,
      story_aliases:story_aliases(
        id,
        name,
        slug,
        description
      )
    `)
    .eq('slug', resolvedParams.slug)
    .eq('is_public', true)
    .single();

  if (!world) {
    notFound();
  }

  // Load story-specific world data if story parameter is provided
  let storyData = null;
  let selectedStoryAlias = null;
  
  if (storySlug && world.series_type === 'canon') {
    // Find story alias by slug
    selectedStoryAlias = world.story_aliases?.find((sa: StoryAlias) => sa.slug === storySlug);
    
    if (selectedStoryAlias) {
      const { data: storyDataResult } = await supabase
        .from('world_story_data')
        .select('*')
        .eq('world_id', world.id)
        .eq('story_alias_id', selectedStoryAlias.id)
        .single();
      
      storyData = storyDataResult;
    }
  }

  // Merge base world data with story-specific data (story data overrides base)
  const displayWorld = storyData ? {
    ...world,
    setting: storyData.setting ?? world.setting,
    lore: storyData.lore ?? world.lore,
    the_world_society: storyData.the_world_society ?? world.the_world_society,
    culture: storyData.culture ?? world.culture,
    politics: storyData.politics ?? world.politics,
    technology: storyData.technology ?? world.technology,
    environment: storyData.environment ?? world.environment,
    races_species: storyData.races_species ?? world.races_species,
    power_systems: storyData.power_systems ?? world.power_systems,
    religion: storyData.religion ?? world.religion,
    government: storyData.government ?? world.government,
    important_factions: storyData.important_factions ?? world.important_factions,
    notable_figures: storyData.notable_figures ?? world.notable_figures,
    languages: storyData.languages ?? world.languages,
    trade_economy: storyData.trade_economy ?? world.trade_economy,
    travel_transport: storyData.travel_transport ?? world.travel_transport,
    themes: storyData.themes ?? world.themes,
    inspirations: storyData.inspirations ?? world.inspirations,
    current_era_status: storyData.current_era_status ?? world.current_era_status,
    notes: storyData.notes ?? world.notes,
    modular_fields: storyData.modular_fields ?? world.modular_fields,
  } : world;

  // Build query filters based on story alias
  const storyAliasId = selectedStoryAlias?.id || null;
  
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
    (() => {
      let loreQuery = supabase
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
        .eq('world_id', world.id);
      
      // Filter by story alias if selected, or show base world lore (null story_alias_id)
      if (storyAliasId) {
        loreQuery = loreQuery.or(`story_alias_id.eq.${storyAliasId},story_alias_id.is.null`);
      } else {
        loreQuery = loreQuery.is('story_alias_id', null);
      }
      
      return loreQuery
        .order('lore_type', { ascending: true })
        .order('name', { ascending: true })
        .limit(6); // Show preview of 6 entries
    })(),
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

      {world.series_type === 'canon' && world.story_aliases && world.story_aliases.length > 0 && (
        <WorldStorySelector 
          storyAliases={world.story_aliases} 
          currentStorySlug={storySlug || null}
        />
      )}

      {selectedStoryAlias && (
        <div className="mb-6 p-3 bg-amber-900/20 border border-amber-700/50 rounded text-sm text-amber-300">
          <strong>Note:</strong> You are viewing the world information for the story "{selectedStoryAlias.name}".
          Some content may differ from the base world.
        </div>
      )}

      <WorldHeader world={displayWorld} />
      <WorldDetails world={displayWorld} />

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
