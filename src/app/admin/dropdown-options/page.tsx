import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { DropdownOptionsManager } from '@/components/admin/DropdownOptionsManager';
import { csvOptions } from '@/lib/utils/csvOptionsData';

export default async function DropdownOptionsPage() {
  const supabase = await createClient();

  // For now, we'll use csvOptions as the initial data
  // In the future, this could load from a database table
  const initialOptions = csvOptions;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-100">Dropdown Options Manager</h1>
          <p className="text-gray-400 mt-2">
            Manage available options for form dropdown fields (pronouns, gender identity, traits, etc.)
          </p>
        </div>
        <Link
          href="/admin"
          className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
        >
          ← Back to Dashboard
        </Link>
      </div>

      <div className="bg-gray-800 rounded-lg shadow p-6 border border-gray-700">
        <DropdownOptionsManager initialOptions={initialOptions} />
      </div>
    </div>
  );
}








