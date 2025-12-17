import { config } from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';

// Load environment variables
config({ path: path.resolve(process.cwd(), '.env') });

interface SourceRow {
  'LAST NAME': string;
  'FIRST NAME': string;
  ALIAS: string;
  VERSE: string;
}

interface DBRow {
  name: string;
  first_name: string;
  last_name: string;
}

function normalizeName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s]/g, '');
}

function buildNameFromSource(row: SourceRow): string {
  const firstName = (row['FIRST NAME'] || '').trim();
  const lastName = (row['LAST NAME'] || '').trim();
  
  if (firstName && lastName) {
    return `${firstName} ${lastName}`.trim();
  } else if (firstName) {
    return firstName;
  } else if (lastName) {
    return lastName;
  } else if (row.ALIAS) {
    return row.ALIAS.trim();
  }
  return '';
}

async function compareOCs() {
  // Read source CSV
  const sourcePath = path.join(process.cwd(), "Ruu's OC List 2025 - Copy of [OC List] (1).csv");
  const sourceContent = fs.readFileSync(sourcePath, 'utf-8');
  const sourceRecords = parse(sourceContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as SourceRow[];

  // Read database export CSV
  const dbPath = path.join(process.cwd(), "ocs_rows (1).csv");
  const dbContent = fs.readFileSync(dbPath, 'utf-8');
  const dbRecords = parse(dbContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as DBRow[];

  console.log(`Source CSV: ${sourceRecords.length} rows`);
  console.log(`Database CSV: ${dbRecords.length} rows\n`);

  // Build sets of normalized names from database
  const dbNames = new Set<string>();
  const dbNamesByFirstLast = new Set<string>();
  
  for (const dbRow of dbRecords) {
    if (dbRow.name) {
      dbNames.add(normalizeName(dbRow.name));
    }
    if (dbRow.first_name && dbRow.last_name) {
      const combined = normalizeName(`${dbRow.first_name} ${dbRow.last_name}`);
      dbNamesByFirstLast.add(combined);
    } else if (dbRow.first_name) {
      dbNamesByFirstLast.add(normalizeName(dbRow.first_name));
    } else if (dbRow.last_name) {
      dbNamesByFirstLast.add(normalizeName(dbRow.last_name));
    }
  }

  // Find missing OCs
  const missing: Array<{ name: string; verse: string; reason: string }> = [];
  const found: string[] = [];

  for (const sourceRow of sourceRecords) {
    const sourceName = buildNameFromSource(sourceRow);
    
    if (!sourceName || sourceName === 'Unknown') {
      continue;
    }

    const normalizedSource = normalizeName(sourceName);
    const firstName = normalizeName(sourceRow['FIRST NAME'] || '');
    const lastName = normalizeName(sourceRow['LAST NAME'] || '');
    const fullName = firstName && lastName ? `${firstName} ${lastName}` : (firstName || lastName);

    // Check if exists in database
    const foundByName = dbNames.has(normalizedSource);
    const foundByFirstLast = fullName && dbNamesByFirstLast.has(fullName);

    if (!foundByName && !foundByFirstLast) {
      missing.push({
        name: sourceName,
        verse: sourceRow.VERSE || 'Unknown',
        reason: 'Not found in database',
      });
    } else {
      found.push(sourceName);
    }
  }

  console.log(`\n=== RESULTS ===\n`);
  console.log(`Found in database: ${found.length}`);
  console.log(`Missing from database: ${missing.length}\n`);

  if (missing.length > 0) {
    console.log(`\n=== MISSING OCs ===\n`);
    missing.forEach((oc, index) => {
      console.log(`${index + 1}. ${oc.name} (Verse: ${oc.verse})`);
    });

    // Group by verse
    const byVerse = new Map<string, string[]>();
    missing.forEach(oc => {
      const verse = oc.verse || 'Unknown';
      if (!byVerse.has(verse)) {
        byVerse.set(verse, []);
      }
      byVerse.get(verse)!.push(oc.name);
    });

    console.log(`\n=== MISSING BY VERSE ===\n`);
    Array.from(byVerse.entries())
      .sort((a, b) => b[1].length - a[1].length)
      .forEach(([verse, names]) => {
        console.log(`\n${verse} (${names.length} missing):`);
        names.forEach(name => console.log(`  - ${name}`));
      });
  } else {
    console.log('All OCs found in database!');
  }
}

compareOCs().catch(console.error);

