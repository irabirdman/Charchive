import type { Metadata } from 'next';
import { SiteSettingsForm } from '@/components/admin/SiteSettingsForm';

export const metadata: Metadata = {
  title: 'Site Settings',
};

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-100">Site Settings</h1>
        <p className="text-gray-400 mt-2 text-sm md:text-base">
          Configure your site's appearance and information
        </p>
      </div>

      <SiteSettingsForm />
    </div>
  );
}

