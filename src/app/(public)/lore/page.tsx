import type { Metadata } from 'next';
import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/layout/PageHeader';
import { LoreList } from '@/components/lore/LoreList';
import { LoreFilters } from '@/components/filters/LoreFilters';

export const metadata: Metadata = {
  title: 'Lore',
  description: 'Browse all lore entries and codex information on Ruutulian. Discover detailed world building, history, and background information.',
  keywords: ['lore', 'codex', 'world building', 'world lore', 'background information', 'OC wiki'],
  openGraph: {
    title: 'Lore | Ruutulian',
    description: 'Browse all lore entries and codex information on Ruutulian. Discover detailed world building, history, and background information.',
    url: '/lore',
    type: 'website',
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://ruutulian.com'}/icon.png`,
        width: 512,
        height: 512,
        alt: 'Ruutulian Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lore | Ruutulian',
    description: 'Browse all lore entries and codex information.',
    images: [`${process.env.NEXT_PUBLIC_SITE_URL || 'https://ruutulian.com'}/icon.png`],
  },
  alternates: {
    canonical: '/lore',
  },
};

interface LorePageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function LorePage({ searchParams }: LorePageProps) {
  const supabase = await createClient();

  // Extract filter values from searchParams
  const worldId = typeof searchParams.world === 'string' ? searchParams.world : '';
  const loreType = typeof searchParams.lore_type === 'string' ? searchParams.lore_type : '';

  // Build query
  let query = supabase
    .from('world_lore')
    .select(`
      *,
      world:worlds!inner(id, name, slug, is_public),
      related_ocs:world_lore_ocs(
        *,
        oc:ocs(id, name, slug)
      ),
      related_events:world_lore_timeline_events(
        *,
        event:timeline_events(id, title)
      )
    `)
    .eq('world.is_public', true);

  // Apply filters
  if (worldId) {
    query = query.eq('world_id', worldId);
  }
  if (loreType) {
    query = query.eq('lore_type', loreType);
  }

  const { data: loreEntries } = await query
    .order('world_id', { ascending: true })
    .order('name', { ascending: true });

  return (
    <div>
      <PageHeader
        title="Lore"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Lore' },
        ]}
      />

      <Suspense fallback={<div className="wiki-card p-6 mb-6">Loading filters...</div>}>
        <LoreFilters />
      </Suspense>

      <section className="mt-8">
        <LoreList loreEntries={loreEntries || []} searchParams={searchParams} />
      </section>
    </div>
  );
}








