import { createClient } from '@/lib/supabase/server';
import { TimelineForm } from '@/components/admin/TimelineForm';

export default async function NewTimelinePage() {
  const supabase = await createClient();

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-100 mb-8">Create Timeline</h1>
      <div className="bg-gray-700/90 rounded-lg shadow-lg p-6 border border-gray-600/70">
        <TimelineForm />
      </div>
    </div>
  );
}
