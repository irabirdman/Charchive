import Image from 'next/image';
import type { World } from '@/types/oc';
import { Markdown } from '@/lib/utils/markdown';
import { convertGoogleDriveUrl, isGoogleSitesUrl } from '@/lib/utils/googleDriveImage';

interface WorldDetailsProps {
  world: World;
}

export function WorldDetails({ world }: WorldDetailsProps) {
  return (
    <div className="space-y-6">
      {/* About Section */}
      {(world.description_markdown || world.summary) && (
        <div className="wiki-card p-6 md:p-8">
          <h2 className="wiki-section-header">
            <i className="fas fa-info-circle text-blue-400"></i>
            About
          </h2>
          {world.description_markdown ? (
            <Markdown content={world.description_markdown} />
          ) : (
            <div className="text-gray-300 prose">
              <p>{world.summary}</p>
            </div>
          )}
        </div>
      )}

      {/* Setting Section */}
      {(world.setting || world.setting_img) && (
        <div className="wiki-card p-6 md:p-8">
          <h2 className="wiki-section-header">
            <i className="fas fa-map text-green-400"></i>
            Setting
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {world.setting_img && convertGoogleDriveUrl(world.setting_img) && (
              <div className="relative w-full aspect-[1/2] rounded-lg overflow-hidden">
                <Image
                  src={convertGoogleDriveUrl(world.setting_img)}
                  alt={`${world.name} setting`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="wiki-image"
                  unoptimized={world.setting_img?.includes('drive.google.com') || isGoogleSitesUrl(world.setting_img)}
                />
              </div>
            )}
            {world.setting && (
              <div className="text-gray-300 prose">
                <Markdown content={world.setting} />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Lore Section */}
      {world.lore && (
        <div className="wiki-card p-6 md:p-8">
          <h2 className="wiki-section-header">
            <i className="fas fa-book-open text-purple-400"></i>
            Lore
          </h2>
          <div className="text-gray-300 prose">
            <Markdown content={world.lore} />
          </div>
        </div>
      )}

      {/* World Information */}
      {(world.genre || world.power_systems || world.races_species || world.culture || world.government) && (
        <div className="wiki-card p-6 md:p-8">
          <h2 className="wiki-section-header">
            <i className="fas fa-globe text-amber-400"></i>
            World Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-300">
            {world.genre && (
              <div>
                <h3 className="font-semibold text-gray-200 mb-2 flex items-center gap-2">
                  <i className="fas fa-tags text-xs text-gray-400"></i>
                  Genre
                </h3>
                <p>{world.genre}</p>
              </div>
            )}
            {world.power_systems && (
              <div>
                <h3 className="font-semibold text-gray-200 mb-2 flex items-center gap-2">
                  <i className="fas fa-magic text-xs text-gray-400"></i>
                  Power Systems
                </h3>
                <p>{world.power_systems}</p>
              </div>
            )}
            {world.races_species && (
              <div>
                <h3 className="font-semibold text-gray-200 mb-2 flex items-center gap-2">
                  <i className="fas fa-users text-xs text-gray-400"></i>
                  Races & Species
                </h3>
                <p>{world.races_species}</p>
              </div>
            )}
            {world.culture && (
              <div>
                <h3 className="font-semibold text-gray-200 mb-2 flex items-center gap-2">
                  <i className="fas fa-monument text-xs text-gray-400"></i>
                  Culture
                </h3>
                <p>{world.culture}</p>
              </div>
            )}
            {world.government && (
              <div>
                <h3 className="font-semibold text-gray-200 mb-2 flex items-center gap-2">
                  <i className="fas fa-landmark text-xs text-gray-400"></i>
                  Government
                </h3>
                <p>{world.government}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Additional Details - Always show */}
      <div className="wiki-card p-6 md:p-8">
        <h2 className="wiki-section-header">
          <i className="fas fa-cogs text-teal-400"></i>
          Additional Details
        </h2>
        <div className="space-y-4 text-gray-300 prose">
          {world.technology ? (
            <div>
              <h3 className="text-lg font-bold text-gray-100 mb-2 flex items-center gap-2">
                <i className="fas fa-laptop-code text-sm"></i>
                Technology
              </h3>
              <p>{world.technology}</p>
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-bold text-gray-100 mb-2 flex items-center gap-2">
                <i className="fas fa-laptop-code text-sm"></i>
                Technology
              </h3>
              <p className="text-gray-400 italic">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            </div>
          )}
          {world.environment ? (
            <div>
              <h3 className="text-lg font-bold text-gray-100 mb-2 flex items-center gap-2">
                <i className="fas fa-mountain text-sm"></i>
                Environment
              </h3>
              <p>{world.environment}</p>
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-bold text-gray-100 mb-2 flex items-center gap-2">
                <i className="fas fa-mountain text-sm"></i>
                Environment
              </h3>
              <p className="text-gray-400 italic">Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            </div>
          )}
          {world.religion ? (
            <div>
              <h3 className="text-lg font-bold text-gray-100 mb-2 flex items-center gap-2">
                <i className="fas fa-place-of-worship text-sm"></i>
                Religion
              </h3>
              <p>{world.religion}</p>
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-bold text-gray-100 mb-2 flex items-center gap-2">
                <i className="fas fa-place-of-worship text-sm"></i>
                Religion
              </h3>
              <p className="text-gray-400 italic">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
            </div>
          )}
        </div>
      </div>

      {/* Notes Section */}
      {world.notes && (
        <div className="wiki-card p-6 md:p-8">
          <h2 className="wiki-section-header">
            <i className="fas fa-sticky-note text-yellow-400"></i>
            Notes
          </h2>
          <div className="text-gray-300 prose">
            <Markdown content={world.notes} />
          </div>
        </div>
      )}
    </div>
  );
}
