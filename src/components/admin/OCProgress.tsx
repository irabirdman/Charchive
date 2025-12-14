import Link from 'next/link';
import type { OC } from '@/types/oc';

interface OCProgressItem {
  oc: OC;
  percentage: number;
  filledFields: number;
  totalFields: number;
}

function calculateOCProgress(oc: OC): OCProgressItem {
  // List of all fields to check (excluding system fields like id, created_at, updated_at)
  const fieldsToCheck: (keyof OC)[] = [
    // Overview
    'first_name',
    'last_name',
    'aliases',
    'species',
    'sex',
    'gender',
    'pronouns',
    'age',
    'date_of_birth',
    'occupation',
    'affiliations',
    'romantic_orientation',
    'sexual_orientation',
    'star_sign',
    
    // Identity Background
    'ethnicity',
    'place_of_origin',
    'current_residence',
    'languages',
    
    // Personality Overview
    'personality_summary',
    'alignment',
    
    // Personality Metrics
    'sociability',
    'communication_style',
    'judgment',
    'emotional_resilience',
    'courage',
    'risk_behavior',
    'honesty',
    'discipline',
    'temperament',
    'humor',
    
    // Personality Traits
    'positive_traits',
    'neutral_traits',
    'negative_traits',
    
    // Abilities
    'abilities',
    'skills',
    'aptitudes',
    'strengths',
    'limits',
    'conditions',
    
    // Appearance
    'standard_look',
    'alternate_looks',
    'accessories',
    'visual_motifs',
    'appearance_changes',
    'height',
    'weight',
    'build',
    'eye_color',
    'hair_color',
    'skin_tone',
    'features',
    'appearance_summary',
    
    // Relationships
    'family',
    'friends_allies',
    'rivals_enemies',
    'romantic',
    'other_relationships',
    
    // History
    'origin',
    'formative_years',
    'major_life_events',
    'history_summary',
    
    // Preferences & Habits
    'likes',
    'dislikes',
    
    // Media
    'gallery',
    'image_url',
    'icon_url',
    'seiyuu',
    'voice_actor',
    'theme_song',
    'inspirations',
    'design_notes',
    'name_meaning_etymology',
    'creator_notes',
    
    // Trivia
    'trivia',
    
    // Development
    'development_status',
  ];

  let filledCount = 0;
  const totalFields = fieldsToCheck.length;

  // Count standard fields
  for (const field of fieldsToCheck) {
    const value = oc[field];
    
    // Check if field is filled
    if (value !== null && value !== undefined && value !== '') {
      // For arrays, check if they have at least one item
      if (Array.isArray(value)) {
        if (value.length > 0) {
          filledCount++;
        }
      } else {
        filledCount++;
      }
    }
  }

  const percentage = totalFields > 0 ? Math.round((filledCount / totalFields) * 100) : 0;

  return {
    oc,
    percentage: Math.min(percentage, 100), // Cap at 100%
    filledFields: filledCount,
    totalFields: totalFields,
  };
}

interface OCProgressProps {
  ocs: OC[];
}

export function OCProgress({ ocs }: OCProgressProps) {
  const progressItems = ocs.map(calculateOCProgress);
  
  // Sort by percentage (lowest first) so profiles that need work appear at the top
  // Only show top 10 lowest percentage OCs
  const sortedItems = [...progressItems]
    .sort((a, b) => a.percentage - b.percentage)
    .slice(0, 10);

  const getProgressColor = (percentage: number): string => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-yellow-500';
    if (percentage >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getProgressTextColor = (percentage: number): string => {
    if (percentage >= 80) return 'text-green-400';
    if (percentage >= 60) return 'text-yellow-400';
    if (percentage >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow p-6 border border-gray-700">
      <div className="flex items-center gap-3 mb-4">
        <i className="fas fa-chart-line text-xl text-pink-400"></i>
        <h2 className="text-xl font-bold text-gray-100">OCs Progress</h2>
        <span className="text-sm text-gray-400">(Top 10 lowest completion)</span>
      </div>
      
      {sortedItems.length === 0 ? (
        <p className="text-gray-400">No OCs found.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {sortedItems.map((item) => {
            const worldName = item.oc.world?.name || item.oc.world_name || 'Unknown';
            return (
              <Link
                key={item.oc.id}
                href={`/admin/ocs/${item.oc.slug}`}
                className="block p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <div className="mb-2">
                  <h3 className="text-sm font-semibold text-gray-100 truncate" title={item.oc.name}>
                    {item.oc.name}
                  </h3>
                  <p className="text-xs text-gray-400 truncate" title={worldName}>
                    {worldName}
                  </p>
                </div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className={`text-lg font-bold ${getProgressTextColor(item.percentage)}`}>
                    {item.percentage}%
                  </div>
                  <div className="text-xs text-gray-400">
                    {item.filledFields}/{item.totalFields}
                  </div>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all ${getProgressColor(item.percentage)}`}
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
