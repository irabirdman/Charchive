'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { World, WorldFieldDefinitions } from '@/types/oc';

interface WorldFieldsManagerProps {
  worlds: Array<World & { world_fields?: WorldFieldDefinitions | null }>;
}

export function WorldFieldsManager({ worlds: initialWorlds }: WorldFieldsManagerProps) {
  const [worlds] = useState(initialWorlds);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-100">World Fields Management</h2>
        <p className="text-gray-400 mt-1">
          Manage world field definitions (field sets) for each world. These fields appear in addition to the standard OC fields.
        </p>
      </div>

      <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600/50 mb-4">
        <h3 className="text-lg font-semibold text-gray-200 mb-2">How World Fields Work</h3>
        <ul className="list-disc list-inside space-y-1 text-gray-300 text-sm">
          <li>World fields are custom field sets that can be added to any world</li>
          <li>Each world can have multiple field sets, each containing multiple fields</li>
          <li>Fields can be of type: text, number, or array</li>
          <li>These fields appear in OC forms when creating/editing characters for that world</li>
          <li>World fields are stored in the world's <code className="bg-gray-800 px-1 rounded">world_fields</code> JSONB column</li>
        </ul>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {worlds.map((world) => {
          const fieldSets = world.world_fields?.field_sets || [];
          const hasFieldSets = fieldSets.length > 0;
          const totalFields = fieldSets.reduce((sum, set) => sum + set.fields.length, 0);

          return (
            <div
              key={world.id}
              className="bg-gray-800 rounded-lg shadow p-6 border border-gray-700 hover:border-gray-600 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-100 mb-1 truncate">
                    {world.name}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {world.series_type === 'canon' ? 'Canon' : 'Original'}
                  </p>
                </div>
                {hasFieldSets && (
                  <span className="px-2 py-1 text-xs bg-teal-600/20 text-teal-400 rounded border border-teal-600/50 flex-shrink-0 ml-2">
                    {fieldSets.length} set{fieldSets.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>

              <div className="mb-4">
                {hasFieldSets ? (
                  <div className="space-y-2">
                    {fieldSets.map((set) => (
                      <div
                        key={set.id}
                        className="bg-gray-700/50 rounded p-2 text-sm"
                      >
                        <div className="font-medium text-gray-200">{set.name}</div>
                        {set.description && (
                          <div className="text-xs text-gray-400 mt-1">{set.description}</div>
                        )}
                        <div className="text-xs text-gray-500 mt-1">
                          {set.fields.length} field{set.fields.length !== 1 ? 's' : ''}
                        </div>
                      </div>
                    ))}
                    <div className="text-xs text-gray-400 pt-1">
                      Total: {totalFields} field{totalFields !== 1 ? 's' : ''}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">No world fields defined</p>
                )}
              </div>

              <div className="flex gap-2">
                <Link
                  href={`/admin/worlds/${world.id}`}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-sm text-center transition-colors"
                >
                  Edit World
                </Link>
                <Link
                  href={`/admin/worlds/${world.id}/templates`}
                  className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 text-sm text-center transition-colors"
                >
                  Templates
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {worlds.length === 0 && (
        <div className="bg-gray-800 rounded-lg shadow p-12 border border-gray-700 text-center">
          <p className="text-gray-400 text-lg">No worlds found. Create a world first to manage world fields.</p>
          <Link
            href="/admin/worlds/new"
            className="inline-block mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            Create World
          </Link>
        </div>
      )}
    </div>
  );
}

