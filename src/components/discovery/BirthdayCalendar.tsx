'use client';

import { useState, useMemo, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format } from 'date-fns';
import Link from 'next/link';
import { convertGoogleDriveUrl } from '@/lib/utils/googleDriveImage';
import { getDateInEST, formatDateOfBirth } from '@/lib/utils/dateFormat';

// Minimal type for birthday calendar - only requires the fields we actually use
interface BirthdayOC {
  id: string;
  name: string;
  slug: string;
  date_of_birth?: string | null;
  image_url?: string | null;
}

interface BirthdayCalendarProps {
  ocs: BirthdayOC[];
  className?: string;
}

interface BirthdayEvent {
  date: Date;
  characters: BirthdayOC[];
}

export function BirthdayCalendar({ ocs, className = '' }: BirthdayCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Build birthday map - use useMemo to avoid recreating on every render
  // Only build on client side to avoid SSR issues with Intl.DateTimeFormat
  const birthdayMap = useMemo(() => {
    const map = new Map<string, BirthdayOC[]>();

    // Only build map on client side
    if (typeof window === 'undefined') {
      return map;
    }

    ocs.forEach((oc) => {
      if (!oc.date_of_birth) {
        return;
      }

      try {
        const dateStr = oc.date_of_birth.trim();
        let month: number | undefined;
        let day: number | undefined;
        
        // Parse date string directly - extract month and day from string to avoid timezone issues
        // This works for both YYYY-MM-DD and MM/DD formats
        const isoMatch = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/); // YYYY-MM-DD
        const mmddMatch = dateStr.match(/^(\d{1,2})[\/\-](\d{1,2})/); // MM/DD or MM-DD
        
        if (isoMatch) {
          // ISO format: YYYY-MM-DD
          month = parseInt(isoMatch[2], 10) - 1; // Convert to 0-indexed (0-11)
          day = parseInt(isoMatch[3], 10);
        } else if (mmddMatch) {
          // MM/DD or MM-DD format
          month = parseInt(mmddMatch[1], 10) - 1; // Convert to 0-indexed (0-11)
          day = parseInt(mmddMatch[2], 10);
        } else {
          // Try parsing as Date and extracting month/day using EST
          try {
            const date = new Date(dateStr + (dateStr.includes('T') ? '' : 'T12:00:00.000Z'));
            if (!isNaN(date.getTime())) {
              const estDate = getDateInEST(date);
              month = estDate.month - 1;
              day = estDate.day;
            }
          } catch (e) {
            // Failed to parse date - skip this OC
          }
        }
        
        // Validate and add to map
        if (month !== undefined && day !== undefined && month >= 0 && month <= 11 && day >= 1 && day <= 31) {
          const key = `${month}-${day}`;
          if (!map.has(key)) {
            map.set(key, []);
          }
          map.get(key)!.push(oc);
        }
      } catch (e) {
        // Failed to parse date_of_birth - skip this OC
      }
    });

    return map;
  }, [ocs]);

  // Parse birthdays and group by date (using EST timezone)
  const birthdayEvents: BirthdayEvent[] = useMemo(() => {
    const events: BirthdayEvent[] = [];
    birthdayMap.forEach((characters, key) => {
      const [month, day] = key.split('-').map(Number);
      const date = new Date(2024, month, day); // Use current year for display
      events.push({ date, characters });
    });
    return events;
  }, [birthdayMap]);

  // Get characters for a specific date - use same method as map building
  const getCharactersForDate = (date: Date): BirthdayOC[] => {
    if (!date || isNaN(date.getTime())) {
      return [];
    }
    
    // Extract month and day - try EST first, fallback to local time
    let month: number;
    let day: number;
    
    try {
      // Try EST conversion first
      const estDate = getDateInEST(date);
      month = estDate.month - 1; // Convert to 0-indexed
      day = estDate.day;
    } catch (e) {
      // Fallback to local time (direct extraction from date object)
      month = date.getMonth(); // Already 0-indexed (0-11)
      day = date.getDate(); // 1-indexed (1-31)
    }
    
    // Validate and lookup
    if (month >= 0 && month <= 11 && day >= 1 && day <= 31) {
      const key = `${month}-${day}`;
      return birthdayMap.get(key) || [];
    }
    
    return [];
  };

  // Set mounted state on client side only to avoid hydration mismatches
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Custom tile content - only render after mount to avoid hydration mismatch
  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month' && isMounted) {
      const characters = getCharactersForDate(date);
      if (characters.length > 0) {
        return (
          <div className="flex flex-wrap gap-1 justify-center items-center mt-1.5 flex-shrink-0">
            {characters.slice(0, 2).map((oc) => (
              <div
                key={oc.id}
                className="w-2 h-2 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 shadow-sm flex-shrink-0"
                title={oc.name}
              />
            ))}
            {characters.length > 2 && (
              <div className="text-[10px] font-semibold text-purple-300 bg-purple-500/20 px-1.5 py-0.5 rounded flex-shrink-0">
                +{characters.length - 2}
              </div>
            )}
          </div>
        );
      }
    }
    return null;
  };

  // Custom tile className - only apply after mount to avoid hydration mismatch
  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month' && isMounted) {
      const characters = getCharactersForDate(date);
      if (characters.length > 0) {
        return 'has-birthday';
      }
    }
    return null;
  };

  // Get characters for selected date - use same function as tileContent
  const selectedCharacters = selectedDate ? getCharactersForDate(selectedDate) : [];

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="wiki-card p-4 md:p-6">
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-100 mb-2 flex items-center gap-3">
            <i className="fas fa-calendar-alt text-purple-400 text-2xl" aria-hidden="true"></i>
            Character Birthdays
          </h2>
          <p className="text-gray-400 text-sm md:text-base">
            Click on any date to see which characters have birthdays on that day
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-gray-700/50">
          <Calendar
            onChange={(value) => setSelectedDate(value as Date)}
            value={selectedDate}
            tileContent={tileContent}
            tileClassName={tileClassName}
            className="bg-transparent text-gray-100 border-none w-full"
          />
        </div>

        <style jsx global>{`
          .react-calendar {
            background: transparent !important;
            border: none !important;
            font-family: inherit;
            width: 100%;
          }
          
          .react-calendar__navigation {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
            padding: 0.5rem 0;
            border-bottom: 1px solid rgba(75, 85, 99, 0.3);
          }
          
          .react-calendar__navigation__label {
            font-size: 1.125rem;
            font-weight: 600;
            color: #f3f4f6;
            padding: 0.5rem 1rem;
            border-radius: 0.5rem;
            transition: all 0.2s;
          }
          
          .react-calendar__navigation__label:hover {
            background-color: rgba(139, 92, 246, 0.1);
            color: #c084fc;
          }
          
          .react-calendar__navigation button {
            color: #d1d5db;
            min-width: 44px;
            height: 44px;
            background: rgba(75, 85, 99, 0.2);
            font-size: 1rem;
            border-radius: 0.5rem;
            transition: all 0.2s;
            border: 1px solid transparent;
          }
          
          .react-calendar__navigation button:enabled:hover,
          .react-calendar__navigation button:enabled:focus {
            background: rgba(139, 92, 246, 0.2);
            color: #c084fc;
            border-color: rgba(139, 92, 246, 0.4);
            transform: scale(1.05);
          }
          
          .react-calendar__navigation button:disabled {
            opacity: 0.3;
            cursor: not-allowed;
          }
          
          .react-calendar__month-view__weekdays {
            text-align: center;
            text-transform: uppercase;
            font-weight: 600;
            font-size: 0.75rem;
            letter-spacing: 0.05em;
            color: #9ca3af;
            margin-bottom: 0.75rem;
            padding-bottom: 0.5rem;
            border-bottom: 1px solid rgba(75, 85, 99, 0.2);
          }
          
          .react-calendar__month-view__weekdays__weekday {
            padding: 0.5rem 0;
          }
          
          .react-calendar__month-view__days {
            display: grid !important;
            grid-template-columns: repeat(7, 1fr);
            grid-auto-rows: 1fr;
            gap: 0.5rem;
          }
          
          .react-calendar__tile {
            max-width: 100%;
            text-align: center;
            padding: 0.5rem;
            background: rgba(31, 41, 55, 0.4);
            color: #e5e7eb;
            border-radius: 0.5rem;
            min-height: 70px;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            border: 1px solid rgba(75, 85, 99, 0.2);
            transition: all 0.2s;
            font-weight: 500;
            position: relative;
            overflow: visible;
            box-sizing: border-box;
          }
          
          .react-calendar__tile abbr {
            position: relative;
            display: block;
            margin-bottom: 0.25rem;
            flex-shrink: 0;
            line-height: 1.2;
          }
          
          @media (min-width: 768px) {
            .react-calendar__tile {
              min-height: 80px;
            }
          }
          
          @media (min-width: 1024px) {
            .react-calendar__tile {
              min-height: 90px;
            }
          }
          
          .react-calendar__tile:enabled:hover,
          .react-calendar__tile:enabled:focus {
            background: rgba(75, 85, 99, 0.5);
            border-color: rgba(139, 92, 246, 0.4);
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(139, 92, 246, 0.2);
            z-index: 1;
          }
          
          .react-calendar__tile:disabled {
            opacity: 0.3;
            cursor: not-allowed;
            background: rgba(31, 41, 55, 0.2);
          }
          
          .react-calendar__tile--now {
            background: linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(236, 72, 153, 0.3));
            color: #f3f4f6;
            border-color: rgba(139, 92, 246, 0.5);
            font-weight: 600;
            box-shadow: 0 2px 8px rgba(139, 92, 246, 0.3);
          }
          
          .react-calendar__tile--now:enabled:hover {
            background: linear-gradient(135deg, rgba(139, 92, 246, 0.4), rgba(236, 72, 153, 0.4));
            box-shadow: 0 4px 16px rgba(139, 92, 246, 0.4);
          }
          
          .react-calendar__tile--active {
            background: linear-gradient(135deg, #8b5cf6, #ec4899);
            color: white;
            border-color: #a855f7;
            font-weight: 700;
            box-shadow: 0 4px 16px rgba(139, 92, 246, 0.5);
            transform: scale(1.05);
          }
          
          .react-calendar__tile--active:enabled:hover {
            background: linear-gradient(135deg, #7c3aed, #db2777);
            box-shadow: 0 6px 20px rgba(139, 92, 246, 0.6);
          }
          
          .react-calendar__tile.has-birthday {
            background: linear-gradient(135deg, rgba(139, 92, 246, 0.25), rgba(236, 72, 153, 0.15));
            border-color: rgba(139, 92, 246, 0.4);
            position: relative;
          }
          
          .react-calendar__tile.has-birthday::before {
            content: '';
            position: absolute;
            top: 4px;
            right: 4px;
            width: 6px;
            height: 6px;
            background: linear-gradient(135deg, #8b5cf6, #ec4899);
            border-radius: 50%;
            box-shadow: 0 0 4px rgba(139, 92, 246, 0.6);
          }
          
          .react-calendar__tile.has-birthday:enabled:hover {
            background: linear-gradient(135deg, rgba(139, 92, 246, 0.35), rgba(236, 72, 153, 0.25));
            border-color: rgba(139, 92, 246, 0.6);
            box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
          }
          
          .react-calendar__tile--active.has-birthday {
            background: linear-gradient(135deg, #8b5cf6, #ec4899);
          }
          
          .react-calendar__tile abbr {
            text-decoration: none;
            font-size: 0.95rem;
          }
        `}</style>
      </div>

      {selectedDate && selectedCharacters.length > 0 && (
        <div className="wiki-card p-4 md:p-6">
          <div className="mb-4 pb-3 border-b border-gray-700">
            <h3 className="text-xl md:text-2xl font-bold text-gray-100 flex items-center gap-2">
              <i className="fas fa-birthday-cake text-purple-400" aria-hidden="true"></i>
              Birthdays on {format(selectedDate, 'MMMM d')}
            </h3>
            <p className="text-gray-400 text-sm mt-1">
              {selectedCharacters.length} character{selectedCharacters.length !== 1 ? 's' : ''} found
            </p>
          </div>
          <div className="space-y-3">
            {selectedCharacters.map((oc) => (
              <Link
                key={oc.id}
                href={`/ocs/${oc.slug}`}
                className="group block p-4 bg-gradient-to-r from-gray-800/50 to-gray-800/30 rounded-lg hover:from-gray-700/50 hover:to-gray-700/30 transition-all border border-gray-700/50 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10"
              >
                <div className="flex items-center gap-4">
                  {oc.image_url && (
                    <div className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-purple-500/30">
                      {oc.image_url.includes('drive.google.com') ? (
                        <img
                          src={oc.image_url}
                          alt={oc.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <img
                          src={convertGoogleDriveUrl(oc.image_url)}
                          alt={oc.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-gray-100 font-semibold text-lg truncate mb-1">{oc.name}</h4>
                    {oc.date_of_birth && (
                      <p className="text-gray-400 text-sm flex items-center gap-2">
                        <i className="fas fa-calendar text-purple-400/60 text-xs" aria-hidden="true"></i>
                        {formatDateOfBirth(oc.date_of_birth)}
                      </p>
                    )}
                  </div>
                  <i className="fas fa-chevron-right text-gray-400 group-hover:text-purple-400 transition-colors flex-shrink-0" aria-hidden="true"></i>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {selectedDate && selectedCharacters.length === 0 && (
        <div className="wiki-card p-4 md:p-6 text-center">
          <div className="py-8">
            <i className="fas fa-calendar-times text-4xl text-gray-600 mb-4" aria-hidden="true"></i>
            <p className="text-gray-400 text-lg">
              No birthdays on {format(selectedDate, 'MMMM d')}
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Try selecting a different date
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

