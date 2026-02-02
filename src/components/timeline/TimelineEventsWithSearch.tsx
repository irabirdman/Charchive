'use client';

import { useMemo, useState } from 'react';
import { TimelineEvent } from '@/components/timeline/TimelineEvent';
import type { TimelineEvent as TimelineEventType } from '@/types/oc';

interface TimelineEventsWithSearchProps {
  events: TimelineEventType[];
}

function normalizeForSearch(s: string | null | undefined): string {
  if (s == null) return '';
  return String(s).toLowerCase().trim();
}

function eventMatchesQuery(event: TimelineEventType, query: string): boolean {
  if (!query) return true;
  const q = normalizeForSearch(query);
  if (normalizeForSearch(event.title).includes(q)) return true;
  if (event.description && normalizeForSearch(event.description).includes(q)) return true;
  if (event.description_markdown && normalizeForSearch(event.description_markdown).includes(q)) return true;
  if (event.location && normalizeForSearch(event.location).includes(q)) return true;
  if (event.date_text && normalizeForSearch(event.date_text).includes(q)) return true;
  if (event.story_alias?.name && normalizeForSearch(event.story_alias.name).includes(q)) return true;
  if (event.categories?.some((c) => normalizeForSearch(c).includes(q))) return true;
  if (event.characters?.length) {
    const charNames = event.characters.map(
      (c) => c.custom_name ?? c.oc?.name ?? ''
    );
    if (charNames.some((n) => normalizeForSearch(n).includes(q))) return true;
  }
  return false;
}

export function TimelineEventsWithSearch({ events }: TimelineEventsWithSearchProps) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query.trim()) return events;
    return events.filter((e) => eventMatchesQuery(e, query));
  }, [events, query]);

  if (!events || events.length === 0) {
    return (
      <div className="wiki-card p-12 text-center">
        <div className="flex flex-col items-center gap-4">
          <i className="fas fa-calendar-times text-4xl text-gray-600" aria-hidden="true"></i>
          <p className="text-gray-400 text-lg">No events in this timeline yet.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <label htmlFor="timeline-event-search" className="sr-only">
          Search timeline events
        </label>
        <div className="relative">
          <i
            className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
            aria-hidden="true"
          />
          <input
            id="timeline-event-search"
            type="search"
            placeholder="Search events by title, description, location, story, characters…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-gray-800/80 border border-gray-600/50 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-500 hover:text-gray-300 rounded-lg hover:bg-gray-700/50"
              aria-label="Clear search"
            >
              <i className="fas fa-times" aria-hidden="true" />
            </button>
          )}
        </div>
        {query && (
          <p className="mt-2 text-sm text-gray-400">
            Showing {filtered.length} of {events.length} {events.length === 1 ? 'event' : 'events'}
          </p>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="wiki-card p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <i className="fas fa-search text-4xl text-gray-600" aria-hidden="true"></i>
            <p className="text-gray-400 text-lg">No events match your search.</p>
            <button
              type="button"
              onClick={() => setQuery('')}
              className="px-4 py-2 bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 rounded-lg border border-purple-500/30 transition-colors"
            >
              Clear search
            </button>
          </div>
        </div>
      ) : (
        <div className="relative">
          <div
            className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 via-purple-400 to-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.4)] z-10 md:hidden"
            style={{ left: '1.375rem' }}
          />
          <div
            className="hidden md:block absolute top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 via-purple-400 to-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.4)] z-10"
            style={{ left: '1.875rem' }}
          />
          {filtered.map((event, index) => (
            <TimelineEvent
              key={event.id}
              event={event}
              isLast={index === filtered.length - 1}
            />
          ))}
        </div>
      )}
    </>
  );
}
