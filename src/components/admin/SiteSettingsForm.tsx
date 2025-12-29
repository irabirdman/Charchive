'use client';

import { useState, useEffect } from 'react';

interface SiteSettings {
  websiteName: string;
  websiteDescription: string;
  iconUrl: string;
  siteUrl: string;
  authorName: string;
  shortName: string;
  themeColor: string;
  backgroundColor: string;
}

export function SiteSettingsForm() {
  const [settings, setSettings] = useState<SiteSettings>({
    websiteName: '',
    websiteDescription: '',
    iconUrl: '',
    siteUrl: '',
    authorName: '',
    shortName: '',
    themeColor: '',
    backgroundColor: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      const response = await fetch('/api/admin/site-settings');
      const result = await response.json();

      if (result.success && result.data) {
        setSettings({
          websiteName: result.data.website_name || '',
          websiteDescription: result.data.website_description || '',
          iconUrl: result.data.icon_url || '',
          siteUrl: result.data.site_url || '',
          authorName: result.data.author_name || '',
          shortName: result.data.short_name || '',
          themeColor: result.data.theme_color || '',
          backgroundColor: result.data.background_color || '',
        });
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      setMessage({ type: 'error', text: 'Failed to load settings' });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      const response = await fetch('/api/admin/site-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      const result = await response.json();

      if (result.success) {
        setMessage({ type: 'success', text: 'Settings saved successfully!' });
        // Clear message after 3 seconds
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to save settings' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred while saving settings' });
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-700 rounded w-1/4"></div>
          <div className="h-10 bg-gray-700 rounded"></div>
          <div className="h-10 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
      <h2 className="text-2xl font-bold text-gray-100 mb-6">Site Settings</h2>
      <p className="text-gray-400 mb-6 text-sm">
        Configure your site's name, description, colors, and other settings. These values will be used throughout the site.
      </p>

      {message && (
        <div
          className={`mb-4 p-4 rounded ${
            message.type === 'success'
              ? 'bg-green-900/50 border border-green-700 text-green-200'
              : 'bg-red-900/50 border border-red-700 text-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="websiteName" className="block text-sm font-medium text-gray-300 mb-2">
              Website Name *
            </label>
            <input
              id="websiteName"
              type="text"
              required
              value={settings.websiteName}
              onChange={(e) => setSettings({ ...settings, websiteName: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="My OC Wiki"
            />
          </div>

          <div>
            <label htmlFor="shortName" className="block text-sm font-medium text-gray-300 mb-2">
              Short Name *
            </label>
            <input
              id="shortName"
              type="text"
              required
              value={settings.shortName}
              onChange={(e) => setSettings({ ...settings, shortName: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="OC Wiki"
            />
            <p className="text-xs text-gray-500 mt-1">Used in navigation and compact displays</p>
          </div>

          <div className="md:col-span-2">
            <label htmlFor="websiteDescription" className="block text-sm font-medium text-gray-300 mb-2">
              Website Description *
            </label>
            <textarea
              id="websiteDescription"
              required
              rows={3}
              value={settings.websiteDescription}
              onChange={(e) => setSettings({ ...settings, websiteDescription: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="A place to store and organize information on original characters, worlds, lore, and timelines."
            />
          </div>

          <div>
            <label htmlFor="siteUrl" className="block text-sm font-medium text-gray-300 mb-2">
              Site URL *
            </label>
            <input
              id="siteUrl"
              type="url"
              required
              value={settings.siteUrl}
              onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="https://example.com"
            />
          </div>

          <div>
            <label htmlFor="iconUrl" className="block text-sm font-medium text-gray-300 mb-2">
              Icon URL *
            </label>
            <input
              id="iconUrl"
              type="text"
              required
              value={settings.iconUrl}
              onChange={(e) => setSettings({ ...settings, iconUrl: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="/icon.png"
            />
            <p className="text-xs text-gray-500 mt-1">Path to your site icon (e.g., /icon.png)</p>
          </div>

          <div>
            <label htmlFor="authorName" className="block text-sm font-medium text-gray-300 mb-2">
              Author Name *
            </label>
            <input
              id="authorName"
              type="text"
              required
              value={settings.authorName}
              onChange={(e) => setSettings({ ...settings, authorName: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Your Name"
            />
          </div>

          <div>
            <label htmlFor="themeColor" className="block text-sm font-medium text-gray-300 mb-2">
              Theme Color *
            </label>
            <div className="flex gap-2">
              <input
                id="themeColor"
                type="color"
                required
                value={settings.themeColor}
                onChange={(e) => setSettings({ ...settings, themeColor: e.target.value })}
                className="h-10 w-20 bg-gray-700 border border-gray-600 rounded-md cursor-pointer"
              />
              <input
                type="text"
                value={settings.themeColor}
                onChange={(e) => setSettings({ ...settings, themeColor: e.target.value })}
                className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="#8b5cf6"
              />
            </div>
          </div>

          <div>
            <label htmlFor="backgroundColor" className="block text-sm font-medium text-gray-300 mb-2">
              Background Color *
            </label>
            <div className="flex gap-2">
              <input
                id="backgroundColor"
                type="color"
                required
                value={settings.backgroundColor}
                onChange={(e) => setSettings({ ...settings, backgroundColor: e.target.value })}
                className="h-10 w-20 bg-gray-700 border border-gray-600 rounded-md cursor-pointer"
              />
              <input
                type="text"
                value={settings.backgroundColor}
                onChange={(e) => setSettings({ ...settings, backgroundColor: e.target.value })}
                className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="#111827"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t border-gray-700">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}

