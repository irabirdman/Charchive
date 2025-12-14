'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { WorldLore } from '@/types/oc';
import { Markdown } from '@/lib/utils/markdown';
import { applyWorldThemeStyles } from '@/lib/theme/worldTheme';
import { getWorldLoreFieldDefinitions, getFieldValue } from '@/lib/fields/worldFields';
import { TagList } from '@/components/wiki/TagList';
import { convertGoogleDriveUrl, isGoogleSitesUrl } from '@/lib/utils/googleDriveImage';

interface LoreDetailProps {
  lore: WorldLore;
}

export function LoreDetail({ lore }: LoreDetailProps) {
  const themeStyles = applyWorldThemeStyles(lore.world);
  const fieldDefinitions = getWorldLoreFieldDefinitions(lore);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="wiki-card overflow-hidden" style={themeStyles}>
        <div className="relative h-64 w-full overflow-hidden">
          {lore.image_url ? (
            <Image
              src={convertGoogleDriveUrl(lore.image_url)}
              alt={lore.name}
              fill
              sizes="100vw"
              className="object-cover"
              unoptimized={lore.image_url.includes('drive.google.com') || isGoogleSitesUrl(lore.image_url)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
              <span className="text-gray-500 text-6xl">?</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 text-sm font-medium bg-purple-600/80 text-white rounded">
                {lore.lore_type}
              </span>
              {lore.world && (
                <Link
                  href={`/worlds/${lore.world.slug}`}
                  className="text-sm text-white/80 hover:text-white underline"
                >
                  {lore.world.name}
                </Link>
              )}
            </div>
            <h1 className="text-4xl font-bold text-white">{lore.name}</h1>
          </div>
        </div>
      </div>

      {/* Description */}
      {lore.description && (
        <div className="wiki-card p-6">
          <p className="text-lg text-gray-300">{lore.description}</p>
        </div>
      )}

      {/* Full Description (Markdown) */}
      {lore.description_markdown && (
        <div className="wiki-card p-6">
          <h2 className="text-2xl font-bold text-gray-100 mb-4">Details</h2>
          <div className="prose prose-invert max-w-none">
            <Markdown content={lore.description_markdown} />
          </div>
        </div>
      )}

      {/* Related Characters */}
      {lore.related_ocs && lore.related_ocs.length > 0 && (
        <div className="wiki-card p-6">
          <h2 className="text-2xl font-bold text-gray-100 mb-4">Related Characters</h2>
          <div className="space-y-2">
            {lore.related_ocs.map((rel) => (
              <div key={rel.id} className="flex items-center gap-2">
                {rel.oc && (
                  <Link
                    href={`/ocs/${rel.oc.slug}`}
                    className="text-purple-400 hover:text-purple-300 font-medium"
                  >
                    {rel.oc.name}
                  </Link>
                )}
                {rel.role && (
                  <span className="text-sm text-gray-400">— {rel.role}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related Timeline Events */}
      {lore.related_events && lore.related_events.length > 0 && (
        <div className="wiki-card p-6">
          <h2 className="text-2xl font-bold text-gray-100 mb-4">Related Timeline Events</h2>
          <div className="space-y-2">
            {lore.related_events.map((rel) => (
              <div key={rel.id}>
                {rel.event && (
                  <Link
                    href={`/timelines/${rel.event.id}`}
                    className="text-purple-400 hover:text-purple-300 font-medium"
                  >
                    {rel.event.title}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modular Fields */}
      {fieldDefinitions.length > 0 && lore.modular_fields && (
        <div className="wiki-card p-6">
          <h2 className="text-2xl font-bold text-gray-100 mb-4">Additional Information</h2>
          <dl className="space-y-4">
            {fieldDefinitions.map((fieldDef) => {
              const value = getFieldValue(fieldDef, lore.modular_fields);
              if (value === null || value === undefined || value === '' || (Array.isArray(value) && value.length === 0)) {
                return null;
              }

              if (fieldDef.type === 'array' && Array.isArray(value)) {
                return (
                  <div key={fieldDef.key} className="border-b border-gray-700/60 pb-4 last:border-b-0">
                    <dt className="font-semibold text-gray-200 mb-2 text-sm">{fieldDef.label}</dt>
                    <dd>
                      <TagList tags={value} />
                    </dd>
                  </div>
                );
              }

              return (
                <div key={fieldDef.key} className="border-b border-gray-700/60 pb-4 last:border-b-0">
                  <dt className="font-semibold text-gray-200 mb-1 text-sm">{fieldDef.label}</dt>
                  <dd className="text-gray-300">
                    {fieldDef.type === 'number' ? value : String(value)}
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>
      )}
    </div>
  );
}

