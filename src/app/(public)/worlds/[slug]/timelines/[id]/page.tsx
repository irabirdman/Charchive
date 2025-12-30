import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function WorldTimelinePage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const supabase = await createClient();
  const resolvedParams = await params;

  // Verify the timeline exists and belongs to this world
  const { data: timeline } = await supabase
    .from('timelines')
    .select('id, world:worlds(slug, is_public)')
    .eq('id', resolvedParams.id)
    .single();

  if (!timeline) {
    notFound();
  }

  const world = timeline.world as any;
  
  // Check if world slug matches
  if (world?.slug !== resolvedParams.slug) {
    // Redirect to correct world slug if different
    if (world?.slug) {
      redirect(`/worlds/${world.slug}/timelines/${resolvedParams.id}`);
    } else {
      redirect(`/timelines/${resolvedParams.id}`);
    }
  }

  // Check if world is public
  if (!world?.is_public) {
    notFound();
  }

  // Redirect to the main timeline page (which handles the display)
  redirect(`/timelines/${resolvedParams.id}`);
}

