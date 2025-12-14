import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { TimelineForm } from '@/components/admin/TimelineForm';

export default async function EditTimelinePage({
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
      <h1 className="text-3xl font-bold text-gray-100 mb-8">Edit Timeline</h1>
      <div className="bg-gray-700/90 rounded-lg shadow-lg p-6 border border-gray-600/70">
        <TimelineForm timeline={timeline} />
      </div>
    </div>
  );
}
