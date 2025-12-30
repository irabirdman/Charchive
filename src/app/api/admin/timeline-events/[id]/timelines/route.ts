import { createAdminClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth/require-auth';

// Add event to timeline
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await checkAuth();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createAdminClient();

  const body = await request.json();
  const { timeline_id, position } = body;

  if (!timeline_id) {
    return NextResponse.json(
      { error: 'timeline_id is required' },
      { status: 400 }
    );
  }

  // Get the highest position in the timeline
  const { data: existing } = await supabase
    .from('timeline_event_timelines')
    .select('position')
    .eq('timeline_id', timeline_id)
    .order('position', { ascending: false })
    .limit(1)
    .single();

  const newPosition = position !== undefined ? position : (existing?.position ?? -1) + 1;

  const { data, error } = await supabase
    .from('timeline_event_timelines')
    .insert({
      timeline_id,
      timeline_event_id: params.id,
      position: newPosition,
    })
    .select(`
      *,
      timeline:timelines(id, name)
    `)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data);
}

// Remove event from timeline
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await checkAuth();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createAdminClient();

  const { searchParams } = new URL(request.url);
  const timeline_id = searchParams.get('timeline_id');

  if (!timeline_id) {
    return NextResponse.json(
      { error: 'timeline_id query parameter is required' },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from('timeline_event_timelines')
    .delete()
    .eq('timeline_id', timeline_id)
    .eq('timeline_event_id', params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}

// Update position in timeline
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await checkAuth();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createAdminClient();

  const body = await request.json();
  const { timeline_id, position } = body;

  if (!timeline_id || position === undefined) {
    return NextResponse.json(
      { error: 'timeline_id and position are required' },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from('timeline_event_timelines')
    .update({ position })
    .eq('timeline_id', timeline_id)
    .eq('timeline_event_id', params.id)
    .select(`
      *,
      timeline:timelines(id, name)
    `)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data);
}

