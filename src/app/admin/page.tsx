import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { StatsCard } from '@/components/admin/StatsCard';
import { FeatureTile } from '@/components/admin/FeatureTile';
import { RecentActivity } from '@/components/admin/RecentActivity';
import { OCProgress } from '@/components/admin/OCProgress';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
};

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Parallel queries for better performance
  const [
    worldsResult,
    ocsResult,
    timelinesResult,
    loreResult,
    timelineEventsResult,
    identitiesResult,
  ] = await Promise.all([
    supabase.from('worlds').select('*', { count: 'exact', head: true }),
    supabase.from('ocs').select('*', { count: 'exact', head: true }),
    supabase.from('timelines').select('*', { count: 'exact', head: true }),
    supabase.from('world_lore').select('*', { count: 'exact', head: true }),
    supabase.from('timeline_events').select('*', { count: 'exact', head: true }),
    supabase.from('oc_identities').select('*', { count: 'exact', head: true }),
  ]);

  const worldCount = worldsResult.count ?? 0;
  const ocCount = ocsResult.count ?? 0;
  const timelineCount = timelinesResult.count ?? 0;
  const loreCount = loreResult.count ?? 0;
  const timelineEventCount = timelineEventsResult.count ?? 0;
  const identityCount = identitiesResult.count ?? 0;

  // Fetch all OCs for progress tracking
  const { data: allOCs } = await supabase
    .from('ocs')
    .select('*, world:worlds(id, name, slug)')
    .order('name', { ascending: true });

  // Query recent activity (last 10 items across all tables)
  const [recentOCs, recentWorlds, recentLore, recentTimelines, recentEvents] = await Promise.all([
    supabase
      .from('ocs')
      .select('id, name, updated_at')
      .order('updated_at', { ascending: false })
      .limit(3),
    supabase
      .from('worlds')
      .select('id, name, updated_at')
      .order('updated_at', { ascending: false })
      .limit(3),
    supabase
      .from('world_lore')
      .select('id, name, updated_at')
      .order('updated_at', { ascending: false })
      .limit(2),
    supabase
      .from('timelines')
      .select('id, name, updated_at')
      .order('updated_at', { ascending: false })
      .limit(2),
    supabase
      .from('timeline_events')
      .select('id, title, updated_at')
      .order('updated_at', { ascending: false })
      .limit(2),
  ]);

  // Combine and sort recent activity
  const recentItems = [
    ...(recentOCs.data || []).map((item) => ({
      id: item.id,
      name: item.name,
      type: 'oc' as const,
      updated_at: item.updated_at,
      href: `/admin/ocs/${item.id}`,
    })),
    ...(recentWorlds.data || []).map((item) => ({
      id: item.id,
      name: item.name,
      type: 'world' as const,
      updated_at: item.updated_at,
      href: `/admin/worlds/${item.id}`,
    })),
    ...(recentLore.data || []).map((item) => ({
      id: item.id,
      name: item.name,
      type: 'lore' as const,
      updated_at: item.updated_at,
      href: `/admin/world-lore/${item.id}`,
    })),
    ...(recentTimelines.data || []).map((item) => ({
      id: item.id,
      name: item.name,
      type: 'timeline' as const,
      updated_at: item.updated_at,
      href: `/admin/timelines/${item.id}`,
    })),
    ...(recentEvents.data || []).map((item) => ({
      id: item.id,
      name: item.title,
      type: 'timeline-event' as const,
      updated_at: item.updated_at,
      href: `/admin/timeline-events/${item.id}`,
    })),
  ]
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 10);

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-100">Admin Dashboard</h1>
          <p className="text-gray-400 mt-2 text-sm md:text-base">Control center for managing all content and settings</p>
        </div>
        <Link
          href="/"
          className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors text-sm md:text-base w-fit"
        >
          ← Website Home
        </Link>
      </div>

      {/* Enhanced Stats Section */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-100 mb-4">Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          <StatsCard
            title="Worlds"
            count={worldCount}
            href="/admin/worlds"
            color="#a855f7"
            icon="fas fa-globe"
          />
          <StatsCard
            title="Characters"
            count={ocCount}
            href="/admin/ocs"
            color="#ec4899"
            icon="fas fa-user"
          />
          <StatsCard
            title="Timelines"
            count={timelineCount}
            href="/admin/timelines"
            color="#3b82f6"
            icon="fas fa-clock"
          />
          <StatsCard
            title="Lore Entries"
            count={loreCount}
            href="/admin/world-lore"
            color="#14b8a6"
            icon="fas fa-book"
          />
          <StatsCard
            title="Timeline Events"
            count={timelineEventCount}
            href="/admin/timeline-events"
            color="#f97316"
            icon="fas fa-calendar"
          />
          <StatsCard
            title="OC Identities"
            count={identityCount}
            href="/admin/ocs"
            color="#8b5cf6"
            icon="fas fa-users"
          />
        </div>
      </div>

      {/* OCs Progress Section */}
      {(allOCs && allOCs.length > 0) && (
        <div>
          <OCProgress ocs={allOCs as any} />
        </div>
      )}

      {/* Quick Actions Bar */}
      <div className="bg-gray-800 rounded-lg shadow p-4 md:p-6 border border-gray-700">
        <h2 className="text-lg md:text-xl font-semibold text-gray-100 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-2 md:gap-3">
          <Link
            href="/admin/ocs/new"
            className="px-4 py-2 md:px-5 md:py-2.5 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-all hover:scale-105 shadow-lg flex items-center gap-2 text-sm md:text-base"
          >
            <i className="fas fa-plus"></i>
            New OC
          </Link>
          <Link
            href="/admin/worlds/new"
            className="px-4 py-2 md:px-5 md:py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all hover:scale-105 shadow-lg flex items-center gap-2 text-sm md:text-base"
          >
            <i className="fas fa-plus"></i>
            New World
          </Link>
          <Link
            href="/admin/world-lore/new"
            className="px-4 py-2 md:px-5 md:py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all hover:scale-105 shadow-lg flex items-center gap-2 text-sm md:text-base"
          >
            <i className="fas fa-plus"></i>
            New Lore Entry
          </Link>
          <Link
            href="/admin/timelines/new"
            className="px-4 py-2 md:px-5 md:py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all hover:scale-105 shadow-lg flex items-center gap-2 text-sm md:text-base"
          >
            <i className="fas fa-plus"></i>
            New Timeline
          </Link>
          <Link
            href="/admin/timeline-events/new"
            className="px-4 py-2 md:px-5 md:py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all hover:scale-105 shadow-lg flex items-center gap-2 text-sm md:text-base"
          >
            <i className="fas fa-plus"></i>
            New Timeline Event
          </Link>
        </div>
      </div>

      {/* Feature Tiles - Create Section */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-100 mb-4">Create</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <FeatureTile
            title="New OC"
            description="Create a new original character for any world"
            href="/admin/ocs/new"
            icon="fas fa-user-plus"
            color="pink"
            actionLabel="Create →"
          />
          <FeatureTile
            title="New World"
            description="Create a new world or universe setting"
            href="/admin/worlds/new"
            icon="fas fa-globe-americas"
            color="purple"
            actionLabel="Create →"
          />
          <FeatureTile
            title="New Lore Entry"
            description="Add a new lore/codex entry to a world"
            href="/admin/world-lore/new"
            icon="fas fa-book-open"
            color="teal"
            actionLabel="Create →"
          />
          <FeatureTile
            title="New Timeline"
            description="Create a new timeline for a world"
            href="/admin/timelines/new"
            icon="fas fa-clock"
            color="blue"
            actionLabel="Create →"
          />
          <FeatureTile
            title="New Timeline Event"
            description="Create a new timeline event"
            href="/admin/timeline-events/new"
            icon="fas fa-calendar-plus"
            color="orange"
            actionLabel="Create →"
          />
        </div>
      </div>

      {/* Feature Tiles - Manage Section */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-100 mb-4">Manage</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <FeatureTile
            title="Browse OCs"
            description="View and manage all original characters"
            href="/admin/ocs"
            icon="fas fa-users"
            color="pink"
            count={ocCount}
            actionLabel="Browse →"
          />
          <FeatureTile
            title="Browse Worlds"
            description="View and manage all worlds"
            href="/admin/worlds"
            icon="fas fa-globe"
            color="purple"
            count={worldCount}
            actionLabel="Browse →"
          />
          <FeatureTile
            title="Browse Lore Entries"
            description="View and manage all lore/codex entries"
            href="/admin/world-lore"
            icon="fas fa-book"
            color="teal"
            count={loreCount}
            actionLabel="Browse →"
          />
          <FeatureTile
            title="Browse Timelines"
            description="View and manage all timelines"
            href="/admin/timelines"
            icon="fas fa-clock"
            color="blue"
            count={timelineCount}
            actionLabel="Browse →"
          />
          <FeatureTile
            title="Browse Timeline Events"
            description="View and manage all timeline events"
            href="/admin/timeline-events"
            icon="fas fa-calendar-alt"
            color="orange"
            count={timelineEventCount}
            actionLabel="Browse →"
          />
        </div>
      </div>

      {/* Feature Tiles - Admin Tools Section */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-100 mb-4">Admin Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          <FeatureTile
            title="OC Statistics"
            description="View comprehensive analytics and statistics for all characters"
            href="/admin/stats"
            icon="fas fa-chart-bar"
            color="pink"
            actionLabel="View Stats →"
          />
          <FeatureTile
            title="Manage Templates & Fields"
            description="Manage template definitions, template fields, and world-specific field sets"
            href="/admin/templates"
            icon="fas fa-file-code"
            color="indigo"
            actionLabel="Manage →"
          />
          <FeatureTile
            title="Manage Dropdown Options"
            description="Edit available options for form dropdowns"
            href="/admin/dropdown-options"
            icon="fas fa-list"
            color="blue"
            actionLabel="Manage →"
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <RecentActivity items={recentItems} />
      </div>
    </div>
  );
}
