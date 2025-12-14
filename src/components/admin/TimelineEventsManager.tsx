'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { TimelineEvent, OC, Timeline } from '@/types/oc';
import { createClient } from '@/lib/supabase/client';

interface TimelineEventsManagerProps {
  timelineId: string;
}

export function TimelineEventsManager({ timelineId }: TimelineEventsManagerProps) {
  const router = useRouter();
  const [timelineEvents, setTimelineEvents] = useState<Array<TimelineEvent & { position: number }>>([]);
  const [availableEvents, setAvailableEvents] = useState<TimelineEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [worldId, setWorldId] = useState<string | null>(null);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadTimelineAndEvents();
  }, [timelineId]);

  async function loadTimelineAndEvents() {
    setIsLoading(true);
    const supabase = createClient();
    
    // Get timeline to find world_id
    const { data: timeline } = await supabase
      .from('timelines')
      .select('world_id')
      .eq('id', timelineId)
      .single();
    
    if (!timeline) {
      setIsLoading(false);
      return;
    }

    setWorldId(timeline.world_id);

    // Load events associated with this timeline via junction table
    const { data: associations } = await supabase
      .from('timeline_event_timelines')
      .select(`
        *,
        event:timeline_events(
          *,
          world:worlds(id, name, slug),
          characters:timeline_event_characters(
            *,
            oc:ocs(id, name, slug)
          )
        )
      `)
      .eq('timeline_id', timelineId)
      .order('position', { ascending: true });

    if (associations) {
      const events = associations
        .map((assoc: any) => ({
          ...assoc.event,
          position: assoc.position,
        }))
        .filter((e: any) => e.id); // Filter out any null events
      setTimelineEvents(events);
    }

    // Load all available events from this world (for adding to timeline)
    const { data: allEvents } = await supabase
      .from('timeline_events')
      .select(`
        *,
        world:worlds(id, name, slug),
        characters:timeline_event_characters(
          *,
          oc:ocs(id, name, slug)
        )
      `)
      .eq('world_id', timeline.world_id)
      .order('year', { ascending: true, nullsFirst: false })
      .order('created_at', { ascending: false });

    if (allEvents) {
      setAvailableEvents(allEvents);
    }

    setIsLoading(false);
  }

  async function addEventToTimeline(eventId: string) {
    setIsSaving(true);
    const supabase = createClient();

    // Get the highest position
    const { data: existing } = await supabase
      .from('timeline_event_timelines')
      .select('position')
      .eq('timeline_id', timelineId)
      .order('position', { ascending: false })
      .limit(1)
      .single();

    const newPosition = (existing?.position ?? -1) + 1;

    const { error } = await supabase
      .from('timeline_event_timelines')
      .insert({
        timeline_id: timelineId,
        timeline_event_id: eventId,
        position: newPosition,
      });

    if (error) {
      console.error('Error adding event to timeline:', error);
      alert('Failed to add event to timeline');
    } else {
      await loadTimelineAndEvents();
      setShowAddEvent(false);
    }
    setIsSaving(false);
  }

  async function removeEventFromTimeline(eventId: string) {
    if (!confirm('Remove this event from this timeline? (The event itself will not be deleted)')) {
      return;
    }

    setIsSaving(true);
    const supabase = createClient();

    const { error } = await supabase
      .from('timeline_event_timelines')
      .delete()
      .eq('timeline_id', timelineId)
      .eq('timeline_event_id', eventId);

    if (error) {
      console.error('Error removing event from timeline:', error);
      alert('Failed to remove event from timeline');
    } else {
      await loadTimelineAndEvents();
    }
    setIsSaving(false);
  }

  async function updateEventPosition(eventId: string, newPosition: number) {
    setIsSaving(true);
    const supabase = createClient();

    const { error } = await supabase
      .from('timeline_event_timelines')
      .update({ position: newPosition })
      .eq('timeline_id', timelineId)
      .eq('timeline_event_id', eventId);

    if (error) {
      console.error('Error updating position:', error);
      alert('Failed to update event position');
    } else {
      await loadTimelineAndEvents();
    }
    setIsSaving(false);
  }

  function moveEvent(index: number, direction: 'up' | 'down') {
    const newEvents = [...timelineEvents];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newEvents.length) return;

    const event = newEvents[index];
    const targetEvent = newEvents[newIndex];

    // Swap positions
    updateEventPosition(event.id, targetEvent.position);
    updateEventPosition(targetEvent.id, event.position);
  }

  const filteredAvailableEvents = availableEvents.filter((event) => {
    if (!showAddEvent) return false;
    const alreadyAdded = timelineEvents.some((te) => te.id === event.id);
    if (alreadyAdded) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        event.title.toLowerCase().includes(query) ||
        event.description?.toLowerCase().includes(query) ||
        event.categories.some((cat) => cat.toLowerCase().includes(query))
      );
    }
    return true;
  });

  if (isLoading) {
    return <div className="text-center py-8 text-gray-300">Loading events...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-100">Timeline Events</h3>
        <div className="flex gap-2">
          <button
            onClick={() => router.push(`/admin/timeline-events/new?world_id=${worldId}`)}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            Create New Event
          </button>
          <button
            onClick={() => setShowAddEvent(!showAddEvent)}
            className="px-4 py-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600"
          >
            {showAddEvent ? 'Cancel' : 'Add Existing Event'}
          </button>
        </div>
      </div>

      {showAddEvent && (
        <div className="border border-gray-600/70 rounded-lg p-4 bg-gray-700/60">
          <div className="mb-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search events by title, description, or category..."
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-gray-100"
            />
          </div>
          {filteredAvailableEvents.length > 0 ? (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {filteredAvailableEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex justify-between items-center p-2 bg-gray-800 rounded hover:bg-gray-750"
                >
                  <div>
                    <div className="font-medium text-gray-100">{event.title}</div>
                    {event.date_text && (
                      <div className="text-sm text-gray-400">{event.date_text}</div>
                    )}
                    {event.categories && event.categories.length > 0 && (
                      <div className="flex gap-1 mt-1">
                        {event.categories.map((cat) => (
                          <span
                            key={cat}
                            className="text-xs px-2 py-0.5 bg-purple-600/30 text-purple-300 rounded"
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => addEventToTimeline(event.id)}
                    disabled={isSaving}
                    className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-400">
              {searchQuery
                ? 'No events found matching your search.'
                : 'No available events to add. Create a new event first.'}
            </div>
          )}
        </div>
      )}

      {timelineEvents.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          No events in this timeline yet. Add or create events to get started.
        </div>
      ) : (
        <div className="space-y-4">
          {timelineEvents.map((event, index) => (
            <div
              key={event.id}
              className="border border-gray-600/70 rounded-lg p-6 bg-gray-700/60"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm text-gray-400 font-mono">#{index + 1}</span>
                    <h4 className="text-lg font-semibold text-gray-100">{event.title}</h4>
                    {event.is_key_event && (
                      <span className="px-2 py-1 bg-yellow-600/30 text-yellow-300 rounded text-xs font-semibold">
                        KEY EVENT
                      </span>
                    )}
                  </div>
                  {event.date_text && (
                    <div className="text-sm text-gray-300 mb-2">{event.date_text}</div>
                  )}
                  {event.categories && event.categories.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {event.categories.map((cat) => (
                        <span
                          key={cat}
                          className="text-xs px-2 py-0.5 bg-purple-600/30 text-purple-300 rounded"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  )}
                  {event.description && (
                    <p className="text-sm text-gray-300 mb-2">{event.description}</p>
                  )}
                  {event.location && (
                    <p className="text-sm text-gray-400 italic">📍 {event.location}</p>
                  )}
                  {event.characters && event.characters.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-400 mb-1">Characters:</p>
                      <div className="flex flex-wrap gap-1">
                        {event.characters.map((char) => (
                          <span
                            key={char.id}
                            className="text-xs px-2 py-0.5 bg-gray-800 text-gray-300 rounded"
                          >
                            {char.oc?.name}
                            {char.role && ` (${char.role})`}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => moveEvent(index, 'up')}
                    disabled={index === 0 || isSaving}
                    className="px-3 py-1 bg-gray-700 text-gray-200 rounded hover:bg-gray-600 disabled:opacity-50"
                    title="Move up"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => moveEvent(index, 'down')}
                    disabled={index === timelineEvents.length - 1 || isSaving}
                    className="px-3 py-1 bg-gray-700 text-gray-200 rounded hover:bg-gray-600 disabled:opacity-50"
                    title="Move down"
                  >
                    ↓
                  </button>
                  <button
                    onClick={() => router.push(`/admin/timeline-events/${event.id}`)}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => removeEventFromTimeline(event.id)}
                    disabled={isSaving}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
