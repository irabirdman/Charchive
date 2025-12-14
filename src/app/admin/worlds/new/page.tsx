import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { WorldForm } from '@/components/admin/WorldForm';

export const metadata: Metadata = {
  title: 'Create World',
};

export default async function NewWorldPage() {
  const supabase = await createClient();

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-100 mb-8">Create World</h1>
      <div className="bg-gray-700/90 rounded-lg shadow-lg p-6 border border-gray-600/70">
        <WorldForm />
      </div>
    </div>
  );
}
