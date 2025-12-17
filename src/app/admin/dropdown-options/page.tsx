import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { DropdownOptionsManager } from '@/components/admin/DropdownOptionsManager';
import { csvOptions } from '@/lib/utils/csvOptionsData';

export default async function DropdownOptionsPage() {
  const supabase = await createClient();

  // Always fetch from database first, fallback to generated TypeScript file
  let initialOptions = csvOptions;
  let initialHexCodes: Record<string, Record<string, string>> = {};
  
  try {
    console.log('[Server] Fetching dropdown options from database...');
    const { data, error } = await supabase
      .from('dropdown_options')
      .select('field, option, hex_code')
      .order('field', { ascending: true })
      .order('option', { ascending: true });

    if (error) {
      console.error('[Server] Error fetching from database:', error);
      console.warn('[Server] Falling back to generated file');
    } else if (data) {
      // Group options by field, and include hex codes
      const dbOptions: Record<string, string[]> = {};
      const dbHexCodes: Record<string, Record<string, string>> = {};
      for (const row of data) {
        if (!dbOptions[row.field]) {
          dbOptions[row.field] = [];
        }
        dbOptions[row.field].push(row.option);
        
        // Store hex code if present
        if (row.hex_code) {
          if (!dbHexCodes[row.field]) {
            dbHexCodes[row.field] = {};
          }
          dbHexCodes[row.field][row.option] = row.hex_code;
        }
      }
      
      // Sort options within each field
      Object.keys(dbOptions).forEach(field => {
        dbOptions[field].sort();
      });
      
      const totalOptions = Object.values(dbOptions).reduce((sum, opts) => sum + opts.length, 0);
      console.log(`[Server] Loaded ${Object.keys(dbOptions).length} fields with ${totalOptions} total options from database`);
      initialOptions = dbOptions;
      initialHexCodes = dbHexCodes;
    } else {
      console.warn('[Server] No data returned from database, using generated file');
    }
  } catch (error) {
    // Fallback to generated file if database query fails
    console.error('[Server] Failed to load options from database, using generated file:', error);
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
        <DropdownOptionsManager initialOptions={initialOptions} initialHexCodes={initialHexCodes} />
      </div>
    </div>
  );
}









