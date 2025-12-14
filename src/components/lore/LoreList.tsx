'use client';

import { useState } from 'react';
import type { WorldLore } from '@/types/oc';
import { LoreCard } from './LoreCard';

interface LoreListProps {
  loreEntries: WorldLore[];
}

const loreTypes = ['clan', 'organization', 'location', 'religion', 'species', 'technique', 'concept', 'artifact', 'other'] as const;

export function LoreList({ loreEntries }: LoreListProps) {
  const [selectedType, setSelectedType] = useState<string>('');

  const filteredEntries = selectedType
    ? loreEntries.filter((entry) => entry.lore_type === selectedType)
    : loreEntries;

  const groupedByType = filteredEntries.reduce((acc, entry) => {
    if (!acc[entry.lore_type]) {
      acc[entry.lore_type] = [];
    }
    acc[entry.lore_type].push(entry);
    return acc;
  }, {} as Record<string, WorldLore[]>);

  return (
    <div className="space-y-6">
      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setSelectedType('')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            selectedType === ''
              ? 'bg-purple-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          All Types
        </button>
        {loreTypes.map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedType === type
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Grouped List */}
      {Object.keys(groupedByType).length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          No lore entries found.
        </div>
      ) : (
        Object.entries(groupedByType).map(([type, entries]) => (
          <section key={type} className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-100">
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {entries.map((entry) => (
                <LoreCard key={entry.id} lore={entry} />
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}

