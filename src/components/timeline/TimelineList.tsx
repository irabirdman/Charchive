import Link from 'next/link';
import type { Timeline } from '@/types/oc';

interface TimelineListProps {
  timelines: Timeline[];
  worldSlug?: string;
}

export function TimelineList({ timelines, worldSlug }: TimelineListProps) {
  if (!timelines || timelines.length === 0) {
    return (
      <div className="wiki-card p-6 text-center text-gray-400">
        No timelines available.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {timelines.map((timeline) => (
        <Link
          key={timeline.id}
          href={worldSlug ? `/worlds/${worldSlug}/timelines/${timeline.id}` : `/timelines/${timeline.id}`}
          prefetch={true}
        >
          <div className="wiki-card wiki-card-hover p-6">
            <h3 className="text-xl font-bold text-gray-100 mb-2">
              {timeline.name}
            </h3>
            {timeline.description_markdown && (
              <p className="text-gray-300 line-clamp-2">
                {timeline.description_markdown.replace(/[#*]/g, '').trim()}
              </p>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
