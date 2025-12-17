import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { DropdownOptionsManager } from '@/components/admin/DropdownOptionsManager';
import { csvOptions } from '@/lib/utils/csvOptionsData';

export default async function DropdownOptionsPage() {
  const supabase = await createClient();

  // Fetch options from database, fallback to generated TypeScript file
  let initialOptions = csvOptions;
  
  try {
    const { data, error } = await supabase
      .from('dropdown_options')
      .select('field, option')
      .order('field', { ascending: true })
      .order('option', { ascending: true });

    if (!error && data) {
      // Group options by field
      const dbOptions: Record<string, string[]> = {};
      for (const row of data) {
        if (!dbOptions[row.field]) {
          dbOptions[row.field] = [];
        }
        dbOptions[row.field].push(row.option);
      }
      
      // Sort options within each field
      Object.keys(dbOptions).forEach(field => {
        dbOptions[field].sort();
      });
      
      initialOptions = dbOptions;
    }
  } catch (error) {
    // Fallback to generated file if database query fails
    console.warn('Failed to load options from database, using generated file:', error);
  }

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









