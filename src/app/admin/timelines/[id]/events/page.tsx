import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { TimelineEventsManager } from '@/components/admin/TimelineEventsManager';

export default async function TimelineEventsPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();

  const { data: timeline } = await supabase
    .from('timelines')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!timeline) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-100 mb-8">
        Manage Events: {timeline.name}
      </h1>
      <div className="bg-gray-700/90 rounded-lg shadow-lg p-6 border border-gray-600/70">
        <TimelineEventsManager timelineId={timeline.id} />
      </div>
    </div>
  );
}
