'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { WorldLore } from '@/types/oc';

interface WorldLoreListProps {
  loreEntries: WorldLore[];
  worlds: Array<{ id: string; name: string }>;
  initialFilters: {
    worldId: string;
    loreType: string;
    search: string;
  };
}

const loreTypes = ['clan', 'organization', 'location', 'religion', 'species', 'technique', 'concept', 'artifact', 'other'] as const;

export function WorldLoreList({
  loreEntries,
  worlds,
  initialFilters,
}: WorldLoreListProps) {
  const router = useRouter();
  const [filters, setFilters] = useState(initialFilters);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const updateFilter = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const buildQueryString = () => {
    const params = new URLSearchParams();
    if (filters.worldId) params.set('world_id', filters.worldId);
    if (filters.loreType) params.set('lore_type', filters.loreType);
    if (filters.search) params.set('search', filters.search);
    return params.toString();
  };

  const applyFilters = () => {
    const query = buildQueryString();
    window.location.href = `/admin/world-lore${query ? `?${query}` : ''}`;
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }

    setDeletingId(id);
    try {
      const response = await fetch(`/api/admin/world-lore/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete lore entry');
      }

      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to delete lore entry');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-gray-700/90 rounded-lg p-4 border border-gray-600/70">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              World
            </label>
            <select
              value={filters.worldId}
              onChange={(e) => updateFilter('worldId', e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-gray-100"
            >
              <option value="">All Worlds</option>
              {worlds.map((world) => (
                <option key={world.id} value={world.id}>
                  {world.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Lore Type
            </label>
            <select
              value={filters.loreType}
              onChange={(e) => updateFilter('loreType', e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-gray-100"
            >
              <option value="">All Types</option>
              {loreTypes.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Search
            </label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') applyFilters();
              }}
              placeholder="Search lore entries..."
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-gray-100"
            />
          </div>
        </div>
        <div className="mt-4">
          <button
            onClick={applyFilters}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-500"
          >
            Apply Filters
          </button>
          <button
            onClick={() => {
              setFilters({
                worldId: '',
                loreType: '',
                search: '',
              });
              window.location.href = '/admin/world-lore';
            }}
            className="ml-2 px-4 py-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Lore Entries List */}
      {loreEntries.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          No lore entries found.{' '}
          {filters.worldId || filters.loreType || filters.search
            ? 'Try adjusting your filters.'
            : 'Create your first lore entry!'}
        </div>
      ) : (
        <div className="bg-gray-700/90 rounded-lg border border-gray-600/70 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-800/50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-200">Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-200">Type</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-200">World</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-200">Characters</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-200">Events</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-200">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-600/50">
              {loreEntries.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-800/30">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/world-lore/${entry.id}`}
                      className="text-purple-400 hover:text-purple-300 font-medium"
                    >
                      {entry.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 text-xs font-medium bg-gray-600 text-gray-200 rounded">
                      {entry.lore_type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-300">
                    {entry.world?.name || 'Unknown'}
                  </td>
                  <td className="px-4 py-3 text-gray-300">
                    {entry.related_ocs?.length || 0}
                  </td>
                  <td className="px-4 py-3 text-gray-300">
                    {entry.related_events?.length || 0}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/world-lore/${entry.id}`}
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-500"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(entry.id, entry.name)}
                        disabled={deletingId === entry.id}
                        className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deletingId === entry.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

