import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables from .env file
config({ path: path.resolve(process.cwd(), '.env') });

// Run with: npx tsx scripts/utilities/migrate-dropdown-options-to-db.ts

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY (or SUPABASE_SERVICE_ROLE_KEY)');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function migrateDropdownOptions() {
  console.log('Starting dropdown options migration...');

  // Read from generated TypeScript file (fallback JSON)
  const tsPath = path.join(process.cwd(), 'src/lib/utils/csvOptionsData.ts');
  let options: Array<{ field: string; option: string }> = [];

  if (!fs.existsSync(tsPath)) {
    console.error('csvOptionsData.ts not found');
    console.error('Please run: npx tsx scripts/utilities/generate-dropdown-options.ts first');
    process.exit(1);
  }

  console.log('Reading from csvOptionsData.ts...');
  const tsContent = fs.readFileSync(tsPath, 'utf-8');
  // Extract the csvOptions object using regex
  const match = tsContent.match(/export const csvOptions: Record<string, string\[\]> = ({[\s\S]*?});/);
  
  if (!match) {
    console.error('Could not parse csvOptions from TypeScript file');
    process.exit(1);
  }

  try {
    const csvOptions = eval(`(${match[1]})`) as Record<string, string[]>;
    
    for (const [field, fieldOptions] of Object.entries(csvOptions)) {
      for (const option of fieldOptions) {
        options.push({ field, option });
      }
    }

    console.log(`Found ${options.length} options in TypeScript file`);
  } catch (error) {
    console.error('Error parsing TypeScript file:', error);
    process.exit(1);
  }

  if (options.length === 0) {
    console.error('No options found to migrate');
    process.exit(1);
  }

  // Check if table already has data
  const { count: existingCount } = await supabase
    .from('dropdown_options')
    .select('*', { count: 'exact', head: true });

  if (existingCount && existingCount > 0) {
    console.log(`\nWarning: Table already contains ${existingCount} options.`);
    console.log('This script will insert new options and skip duplicates.');
    console.log('To start fresh, delete all rows from dropdown_options table first.\n');
  }

  // Insert options in batches
  const batchSize = 100;
  let inserted = 0;
  let skipped = 0;
  let errors = 0;

  for (let i = 0; i < options.length; i += batchSize) {
    const batch = options.slice(i, i + batchSize);
    
    const { data, error } = await supabase
      .from('dropdown_options')
      .upsert(
        batch.map(({ field, option }) => ({
          field,
          option,
          updated_at: new Date().toISOString(),
        })),
        {
          onConflict: 'field,option',
          ignoreDuplicates: false,
        }
      )
      .select();

    if (error) {
      console.error(`Error inserting batch ${Math.floor(i / batchSize) + 1}:`, error.message);
      errors += batch.length;
    } else {
      const newCount = data?.length || 0;
      inserted += newCount;
      skipped += batch.length - newCount;
      console.log(`Processed ${Math.min(i + batchSize, options.length)}/${options.length} options...`);
    }
  }

  console.log('\nMigration complete!');
  console.log(`- Inserted: ${inserted} new options`);
  console.log(`- Skipped: ${skipped} duplicates`);
  if (errors > 0) {
    console.log(`- Errors: ${errors} failed inserts`);
  }

  // Verify final count
  const { count: finalCount } = await supabase
    .from('dropdown_options')
    .select('*', { count: 'exact', head: true });

  console.log(`\nTotal options in database: ${finalCount}`);
}

migrateDropdownOptions()
  .then(() => {
    console.log('\nDone!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });

