import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/layout/PageHeader';
import { TimelineEvent } from '@/components/timeline/TimelineEvent';
import { Markdown } from '@/lib/utils/markdown';

export const revalidate = 300;

export default async function TimelinePage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();

  const { data: timeline } = await supabase
    .from('timelines')
    .select('*, world:worlds(*)')
    .eq('id', params.id)
    .single();

  if (!timeline) {
    notFound();
  }

  // Check if world is public
  if (timeline.world && !timeline.world.is_public) {
    notFound();
  }

  // Load events via junction table
  const { data: associations } = await supabase
    .from('timeline_event_timelines')
    .select(`
      position,
      event:timeline_events(
        *,
        world:worlds(id, name, slug),
        story_alias:story_aliases(id, name, slug, description),
        characters:timeline_event_characters(
          *,
          oc:ocs(id, name, slug)
        )
      )
    `)
    .eq('timeline_id', timeline.id)
    .order('position', { ascending: true });

  // Extract events from associations
  const events = associations
    ?.map((assoc: any) => assoc.event)
    .filter((e: any) => e?.id) || [];

  return (
    <div>
      <PageHeader
        title={timeline.name}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          timeline.world
            ? { label: timeline.world.name, href: `/worlds/${timeline.world.slug}` }
            : { label: 'Timeline' },
          { label: timeline.name },
        ]}
      />

      <div className="wiki-card p-6 md:p-8 mb-8">
        {timeline.description_markdown && (
          <div className="prose max-w-none">
            <Markdown content={timeline.description_markdown} />
          </div>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-100 mb-6">Events</h2>
        {events && events.length > 0 ? (
          <div className="space-y-4">
            {events.map((event) => (
              <TimelineEvent key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="wiki-card p-6 text-center text-gray-500">
            No events in this timeline yet.
          </div>
        )}
      </div>
    </div>
  );
}
