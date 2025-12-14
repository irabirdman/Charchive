import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { TimelineEventForm } from '@/components/admin/TimelineEventForm';
import type { TimelineEvent } from '@/types/oc';

export default async function TimelineEventDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();

  const { data: event } = await supabase
    .from('timeline_events')
    .select(`
      *,
      world:worlds(id, name, slug),
      characters:timeline_event_characters(
        *,
        oc:ocs(id, name, slug)
      ),
      timelines:timeline_event_timelines(
        *,
        timeline:timelines(id, name)
      )
    `)
    .eq('id', params.id)
    .single();

  if (!event) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-100 mb-8">Edit Timeline Event</h1>
      <div className="bg-gray-700/90 rounded-lg p-6 border border-gray-600/70">
        <TimelineEventForm event={event as TimelineEvent} />
      </div>
    </div>
  );
}

