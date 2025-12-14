import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export default async function AdminTimelinesPage() {
  const supabase = await createClient();

  const { data: timelines } = await supabase
    .from('timelines')
    .select('id, name, world:worlds(name)')
    .order('name', { ascending: true });

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-100">Timelines</h1>
        <Link
          href="/admin/timelines/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-colors text-sm sm:text-base w-fit"
        >
          Create Timeline
        </Link>
      </div>

      {timelines && timelines.length > 0 ? (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-gray-700/90 rounded-lg shadow-lg overflow-hidden border border-gray-600/70">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-600/80">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                    World
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-200 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-700/50 divide-y divide-gray-600/50">
                {timelines.map((timeline) => (
                  <tr key={timeline.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-100">{timeline.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {timeline.world ? (timeline.world as any).name : '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/admin/timelines/${timeline.id}`}
                        className="text-blue-400 hover:text-blue-300 mr-4"
                      >
                        Edit
                      </Link>
                      <Link
                        href={`/admin/timelines/${timeline.id}/events`}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        Events
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {timelines.map((timeline) => (
              <div
                key={timeline.id}
                className="bg-gray-700/90 rounded-lg shadow-lg border border-gray-600/70 p-4"
              >
                <div className="mb-3">
                  <div className="text-base font-medium text-gray-100 mb-2">{timeline.name}</div>
                  <div className="text-sm text-gray-400">
                    <span className="text-gray-500">World: </span>
                    {timeline.world ? (timeline.world as any).name : '—'}
                  </div>
                </div>
                <div className="pt-3 border-t border-gray-600/50 flex gap-4">
                  <Link
                    href={`/admin/timelines/${timeline.id}`}
                    className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                  >
                    Edit →
                  </Link>
                  <Link
                    href={`/admin/timelines/${timeline.id}/events`}
                    className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                  >
                    Events →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="bg-gray-700/90 rounded-lg shadow-lg p-12 text-center border border-gray-600/70">
          <p className="text-gray-400 mb-4">No timelines yet.</p>
          <Link
            href="/admin/timelines/new"
            className="text-blue-400 hover:text-blue-300"
          >
            Create your first timeline →
          </Link>
        </div>
      )}
    </div>
  );
}
