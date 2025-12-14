import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { OCForm } from '@/components/admin/OCForm';

export const metadata: Metadata = {
  title: 'Create Character',
};

export default async function NewOCPage({
  searchParams,
}: {
  searchParams: { identity_id?: string };
}) {
  const supabase = await createClient();
  
  // If identity_id is provided, fetch the identity info
  let identity = null;
  if (searchParams.identity_id) {
    const { data } = await supabase
      .from('oc_identities')
      .select('id, name')
      .eq('id', searchParams.identity_id)
      .single();
    identity = data;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-50 mb-8">
        {identity ? `Add New Version: ${identity.name}` : 'Create Character'}
      </h1>
      {identity && (
        <div className="mb-6 p-4 bg-blue-900/20 border border-blue-700/50 rounded-lg">
          <p className="text-sm text-blue-300">
            You're adding a new version to the existing identity <strong>{identity.name}</strong>.
            Select a different world/fandom for this version.
          </p>
        </div>
      )}
      <div className="bg-gray-800/40 rounded-xl shadow-xl p-8 border border-gray-600/50 backdrop-blur-sm">
        <OCForm identityId={searchParams.identity_id} />
      </div>
    </div>
  );
}
