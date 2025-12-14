import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { fetchTemplates } from '@/lib/templates/ocTemplates.server';
import { OCList } from '@/components/admin/OCList';

export const metadata: Metadata = {
  title: 'Characters',
};

export default async function AdminOCsPage() {
  const templates = await fetchTemplates();
  const supabase = await createClient();

  const { data: ocs } = await supabase
    .from('ocs')
    .select(`
      id,
      name,
      slug,
      template_type,
      is_public,
      world:worlds(name),
      identity_id,
      identity:oc_identities(
        id,
        name,
        versions:ocs(id)
      )
    `)
    .order('name', { ascending: true });

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-100">Characters</h1>
        <Link
          href="/admin/ocs/new"
          className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-500 transition-colors text-sm sm:text-base w-fit"
        >
          Create Character
        </Link>
      </div>

      <OCList ocs={(ocs || []) as any} templates={templates} />
    </div>
  );
}
