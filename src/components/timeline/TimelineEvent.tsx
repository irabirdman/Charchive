import type { TimelineEvent as TimelineEventType, EventDateData } from '@/types/oc';
import { Markdown } from '@/lib/utils/markdown';
import { getCategoryColorClasses } from '@/lib/utils/categoryColors';
import { calculateAge } from '@/lib/utils/ageCalculation';

interface TimelineEventProps {
  event: TimelineEventType;
}

function formatDateData(dateData: EventDateData | null | undefined): string {
  if (!dateData) return '';
  
  // Handle case where dateData might be a string (invalid JSON from DB)
  if (typeof dateData === 'string') {
    return dateData;
  }
  
  // Ensure dateData has a type property
  if (typeof dateData !== 'object' || !('type' in dateData)) {
    return '';
  }
  
  switch (dateData.type) {
    case 'exact':
      const exact = dateData as any;
      const eraPrefix = exact.era ? `${exact.era} ` : '';
      const yearStr = exact.year.toString().padStart(4, '0');
      const approximateSuffix = exact.approximate ? ' ~' : '';
      
      if (exact.month && exact.day) {
        const monthStr = exact.month.toString().padStart(2, '0');
        const dayStr = exact.day.toString().padStart(2, '0');
        return `${eraPrefix}${yearStr}-${monthStr}-${dayStr}${approximateSuffix}`;
      }
      return `${eraPrefix}${yearStr}${approximateSuffix}`;
    case 'approximate':
      return dateData.text;
    case 'range':
      const range = dateData as any;
      const startEra = range.start?.era ? `${range.start.era} ` : '';
      const endEra = range.end?.era ? `${range.end.era} ` : '';
      const startParts = [range.start.year.toString().padStart(4, '0')];
      if (range.start.month) startParts.push(range.start.month.toString().padStart(2, '0'));
      if (range.start.day) startParts.push(range.start.day.toString().padStart(2, '0'));
      const endParts = [range.end.year.toString().padStart(4, '0')];
      if (range.end.month) endParts.push(range.end.month.toString().padStart(2, '0'));
      if (range.end.day) endParts.push(range.end.day.toString().padStart(2, '0'));
      const separator = range.start?.era && range.end?.era && range.start.era === range.end.era ? '–' : ' to ';
      return `${startEra}${startParts.join('-')}${separator}${endEra}${endParts.join('-')}${range.text ? ` (${range.text})` : ''}`;
    case 'relative':
      return dateData.text;
    case 'unknown':
      return dateData.text || 'Date unknown';
    default:
      return '';
  }
}

export function TimelineEvent({ event, isLast }: TimelineEventProps & { isLast?: boolean }) {
  const displayDate = event.date_data ? formatDateData(event.date_data) : event.date_text;

  return (
    <div className="relative pl-8 md:pl-12 pb-8 last:pb-0">
      {/* Timeline line */}
      <div className="absolute left-3 md:left-5 top-6 bottom-0 w-0.5 bg-gradient-to-b from-purple-500/60 via-purple-400/40 to-transparent" 
           style={{ display: isLast ? 'none' : 'block' }} />
      
      {/* Timeline dot */}
      <div className="absolute left-2.5 md:left-4 top-1.5 w-4 h-4 md:w-5 md:h-5 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 border-2 border-gray-800 shadow-lg z-10 flex items-center justify-center">
        {event.is_key_event && (
          <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-yellow-400 animate-pulse" />
        )}
      </div>

      {/* Event card */}
      <div className="wiki-card p-5 md:p-6 ml-2 hover:border-purple-500/50 transition-all duration-300">
        {/* Header with date and badges */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-4">
          <div className="flex-1">
            <div className="flex items-start gap-3 flex-wrap mb-2">
              <h3 className="text-xl md:text-2xl font-bold text-gray-100 leading-tight">
                {event.title}
              </h3>
              {event.is_key_event && (
                <span className="px-2.5 py-1 bg-gradient-to-r from-yellow-600/40 to-yellow-500/30 text-yellow-300 rounded-md text-xs font-bold uppercase tracking-wide border border-yellow-500/30 shadow-sm">
                  ⭐ Key Event
                </span>
              )}
            </div>
            
            {/* Date display */}
            {displayDate && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-600/20 to-purple-500/10 border border-purple-500/30 rounded-lg text-sm font-medium text-purple-200 mb-3">
                <i className="fas fa-calendar-alt text-xs" aria-hidden="true"></i>
                <span>{displayDate}</span>
              </div>
            )}
          </div>
        </div>

        {/* Story alias and location */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {event.story_alias && (
            <span className="px-2.5 py-1 bg-purple-600/20 text-purple-300 rounded-md text-xs font-semibold border border-purple-500/30">
              {event.story_alias.name}
            </span>
          )}
          {event.location && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-sm text-gray-400 bg-gray-700/30 rounded-md border border-gray-600/30">
              <i className="fas fa-map-marker-alt text-xs" aria-hidden="true"></i>
              {event.location}
            </span>
          )}
        </div>
        
        {/* Categories */}
        {event.categories && event.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {event.categories.map((cat) => (
              <span
                key={cat}
                className={`text-xs px-2.5 py-1 rounded-md border font-medium ${getCategoryColorClasses(cat)}`}
              >
                {cat}
              </span>
            ))}
          </div>
        )}

        {/* Description summary */}
        {event.description && (
          <p className="text-gray-300 mb-4 leading-relaxed">{event.description}</p>
        )}

        {/* Full description markdown */}
        {event.description_markdown && (
          <div className="text-gray-300 mb-4 prose prose-invert max-w-none prose-sm">
            <Markdown content={event.description_markdown} />
          </div>
        )}

        {/* Characters */}
        {event.characters && event.characters.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-700/50">
            <p className="text-sm text-gray-400 mb-2 font-medium">
              <i className="fas fa-users mr-1.5" aria-hidden="true"></i>
              Characters:
            </p>
            <div className="flex flex-wrap gap-2">
              {event.characters.map((char, index) => {
                const characterName = char.custom_name || char.oc?.name;
                const age = char.oc?.date_of_birth && event.date_data
                  ? calculateAge(char.oc.date_of_birth, event.date_data)
                  : null;
                
                return (
                  <span key={char.id} className="inline-flex items-center">
                    {char.oc?.slug ? (
                      <a
                        href={`/ocs/${char.oc.slug}`}
                        className="px-2.5 py-1 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 hover:text-purple-200 rounded-md text-sm font-medium transition-colors border border-purple-500/30"
                      >
                        {characterName}
                        {age !== null && <span className="text-purple-400/70 ml-1">({age})</span>}
                      </a>
                    ) : (
                      <span className="px-2.5 py-1 bg-gray-700/30 text-gray-300 rounded-md text-sm border border-gray-600/30">
                        {characterName}
                        {age !== null && <span className="text-gray-400 ml-1">({age})</span>}
                      </span>
                    )}
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
