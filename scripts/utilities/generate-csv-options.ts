import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Get the directory of the current script (works with both CommonJS and ES modules)
let scriptDir: string;
try {
  // ES module
  scriptDir = path.dirname(fileURLToPath(import.meta.url));
} catch {
  // CommonJS fallback
  scriptDir = __dirname || path.dirname(process.argv[1] || '');
}

// Find project root by looking for package.json (go up from scripts/utilities/ directory)
function findProjectRoot(startPath: string): string {
  let currentPath = startPath;
  while (currentPath !== path.dirname(currentPath)) {
    const packageJsonPath = path.join(currentPath, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      return currentPath;
    }
    currentPath = path.dirname(currentPath);
  }
  // Fallback: go up two levels from scripts/utilities/ directory
  return path.resolve(scriptDir, '../..');
}

// Get project root
const projectRoot = findProjectRoot(scriptDir);

console.log('Script directory:', scriptDir);
console.log('Project root:', projectRoot);
console.log('Current working directory:', process.cwd());

// Read the CSV file
const csvPath = path.join(projectRoot, "Ruu's OC List 2025 - [INFO] (1).csv");
const outputPath = path.join(projectRoot, 'src/lib/utils/csvOptionsData.ts');

console.log('Looking for CSV at:', csvPath);
console.log('Output will be written to:', outputPath);

if (!fs.existsSync(csvPath)) {
  console.error(`CSV file not found at: ${csvPath}`);
  process.exit(1);
}

const csvContent = fs.readFileSync(csvPath, 'utf-8');
const lines = csvContent.trim().split('\n');

if (lines.length < 2) {
  console.error('CSV file is empty or has no data rows');
  process.exit(1);
}

// Parse CSV line - improved to handle edge cases
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = i < line.length - 1 ? line[i + 1] : '';
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        current += '"';
        i++; // Skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

const headers = parseCSVLine(lines[0]);
const columnData = new Map<string, Set<string>>();

// Initialize sets for each column
headers.forEach(header => {
  columnData.set(header, new Set<string>());
});

// Process data rows
for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue; // Skip empty lines
  
  const values = parseCSVLine(line);
  headers.forEach((header, index) => {
    const value = values[index] || '';
    if (value && value.trim() !== '') {
      // Handle semicolon-separated values (like in COLORS)
      if (value.includes(';')) {
        value.split(';').forEach(v => {
          const trimmed = v.trim();
          if (trimmed) columnData.get(header)?.add(trimmed);
        });
      } else {
        columnData.get(header)?.add(value.trim());
      }
    }
  });
}

// CSV column mapping to form field names
const csvColumnMapping: Record<string, string> = {
  'PRONOUNS': 'pronouns',
  'GENDER IDENTITY ': 'gender_identity',
  'ROMANTIC ORIENTATION': 'romantic',
  'SEXUAL ORIENTATION ': 'sexual',
  'RELATIONSHIP STRUCTURE': 'relationship_type',
  'SEX': 'sex',
  'ACCENT ': 'accent',
  'NATIONALITY': 'nationality',
  'RACE / ETHNICITY': 'ethnicity_race',
  'SPECIES': 'species',
  'SKIN TONE': 'skin_tone',
  'OCCUPATION': 'occupation',
  'JUNG': 'mbti',
  'MORAL': 'moral',
  'POS PERSONALITY': 'positive_traits',
  'NUE PERSONALITY': 'neutral_traits',
  'NEG PERSONALITY': 'negative_traits',
};

// Generate TypeScript file
const options: Record<string, string[]> = {};

Object.entries(csvColumnMapping).forEach(([csvCol, formField]) => {
  const values = columnData.get(csvCol);
  if (values) {
    options[formField] = Array.from(values).sort();
  } else {
    options[formField] = [];
  }
});

// Add "gender" as an alias for "gender_identity" (same values)
if (options.gender_identity) {
  options.gender = [...options.gender_identity];
}

// Generate the TypeScript file content
const fileContent = `// Auto-generated file - do not edit manually
// Generated from: Ruu's OC List 2025 - [INFO] (1).csv
// Run: npx tsx scripts/utilities/generate-csv-options.ts

export const csvOptions: Record<string, string[]> = ${JSON.stringify(options, null, 2)};

// Individual exports for convenience
${Object.entries(options).map(([key, values]) => 
  `export const ${key}Options: string[] = ${JSON.stringify(values)};`
).join('\n')}
`;

fs.writeFileSync(outputPath, fileContent, 'utf-8');
console.log(`Generated CSV options file at: ${outputPath}`);
console.log(`Extracted options for ${Object.keys(options).length} fields`);
