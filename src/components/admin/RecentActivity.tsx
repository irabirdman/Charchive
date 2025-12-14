'use client';

import Link from 'next/link';

interface RecentItem {
  id: string;
  name: string;
  type: 'oc' | 'world' | 'lore' | 'timeline' | 'timeline-event';
  updated_at: string;
  href: string;
}

interface RecentActivityProps {
  items: RecentItem[];
}

const typeConfig = {
  oc: { label: 'OC', color: 'text-pink-400', icon: 'fas fa-user' },
  world: { label: 'World', color: 'text-purple-400', icon: 'fas fa-globe' },
  lore: { label: 'Lore', color: 'text-teal-400', icon: 'fas fa-book' },
  timeline: { label: 'Timeline', color: 'text-blue-400', icon: 'fas fa-clock' },
  'timeline-event': { label: 'Event', color: 'text-orange-400', icon: 'fas fa-calendar' },
};

export function RecentActivity({ items }: RecentActivityProps) {
  if (items.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg shadow p-4 sm:p-6 border border-gray-700">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-100 mb-4">Recent Activity</h2>
        <p className="text-sm sm:text-base text-gray-400">No recent activity to display.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg shadow p-4 sm:p-6 border border-gray-700">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-100 mb-4">Recent Activity</h2>
      <div className="space-y-2 sm:space-y-3">
        {items.map((item) => {
          const config = typeConfig[item.type];
          const date = new Date(item.updated_at);
          const timeAgo = getTimeAgo(date);

          return (
            <Link
              key={item.id}
              href={item.href}
              className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700/70 transition-colors group touch-manipulation min-h-[44px]"
            >
              <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                <i className={`${config.icon} ${config.color} flex-shrink-0 text-sm sm:text-base`}></i>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs sm:text-sm font-medium text-gray-300 group-hover:text-white truncate">
                      {item.name}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded ${config.color} bg-gray-800/50 flex-shrink-0`}>
                      {config.label}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{timeAgo}</p>
                </div>
              </div>
              <i className="fas fa-chevron-right text-gray-500 group-hover:text-gray-300 flex-shrink-0 ml-2"></i>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
}




