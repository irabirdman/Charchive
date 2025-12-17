import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';

// Load environment variables from .env file
config({ path: path.resolve(process.cwd(), '.env') });

// Run with: npx tsx scripts/import-csv.ts
// Make sure to set SUPABASE_SERVICE_ROLE_KEY in your environment

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // Use service role key for admin operations

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

interface CSVRow {
  'LAST NAME': string;
  'FIRST NAME': string;
  ALIAS: string;
  AGE: string;
  'D.O.B.': string;
  OCCUPATION: string;
  GENDER: string;
  SEX: string;
  PRONOUNS: string;
  ROMANTIC: string;
  SEXUAL: string;
  'RELATIONSHIP TYPE': string;
  NATIONALITY: string;
  'ETHNICITY / RACE': string;
  SPECIES: string;
  HEIGHT: string;
  WEIGHT: string;
  'EYE COLOR': string;
  'HAIR COLOR': string;
  'SKIN TONE': string;
  BUILD: string;
  NOTES: string;
  HOMETOWN: string;
  'CURRENT HOME': string;
  LANGUAGES: string;
  'MATERNAL PARENT': string;
  'PATERNAL PARENT': string;
  SHIP: string;
  RELATIONSHIPS: string;
  'STAR SIGN': string;
  LIKES: string;
  DISLIKES: string;
  'VOICE ACTOR': string;
  SEIYUU: string;
  'THEME SONG': string;
  VERSE: string;
  'VERSE ALT': string;
  CREATION: string;
  OTHER: string;
  'FRIENDLY-RESERVED': string;
  'POLITE-BLUNT': string;
  'CLEVER-FOOLISH': string;
  'SENSITIVE-TOUGH': string;
  'BRAVE-TIMID': string;
  'CAREFUL-RECKLESS': string;
  'SINCERE-DECEPTIVE': string;
  'DILIGENT-LAZY': string;
  'CALM-IRRITABLE': string;
  'HUMOROUS-SERIOUS': string;
  PERSONALITY: string;
  'POSITIVE TRAITS': string;
  'NEUTRAL TRAITS': string;
  'NEGATIVE TRAITS': string;
  MBTI: string;
  Enneagram: string;
  "D&D Alignment": string;
  HISTORY: string;
  TRIVIA: string;
  MB1: string;
  MB2: string;
  MB3: string;
  MB4: string;
  MB5: string;
  MB6: string;
  MB7: string;
  MB8: string;
  MB9: string;
  PROFILE: string;
  DESIGN: string;
  HISTORYIMG: string;
  TRIVIAIMG: string;
}

// Map verse names to world slugs
const verseToSlug: Record<string, string> = {
  'Naruto': 'naruto',
  'Final Fantasy': 'final-fantasy-vii',
  'FF7': 'final-fantasy-vii',
  'Inuyasha': 'inuyasha',
  'Shaman King': 'shaman-king',
  'Zelda': 'zelda',
  'Dragon Ball Z': 'dragon-ball-z',
  'DBZ': 'dragon-ball-z',
  'Pokemon': 'pokemon',
  'Pokémon': 'pokemon',
  'Nier': 'nier',
  'Kismet': 'kismet',
  'Moirai': 'moirai',
  'Pluviophile': 'pluviophile',
  'Tiderift': 'tiderift',
  'Vieulx': 'vieulx',
  'None': 'none',
  'Not Accessible': 'not-accessible',
  'DND': 'none', // Default to none for DND
};

// Determine template type from world
function getTemplateType(worldSlug: string): string {
  const templateMap: Record<string, string> = {
    'naruto': 'naruto',
    'final-fantasy-vii': 'ff7',
    'inuyasha': 'inuyasha',
    'shaman-king': 'shaman-king',
    'zelda': 'zelda',
    'dragon-ball-z': 'dragonball',
    'pokemon': 'pokemon',
    'nier': 'nier',
    'kismet': 'original',
    'moirai': 'original',
    'pluviophile': 'original',
    'tiderift': 'original',
    'vieulx': 'original',
    'none': 'none',
    'not-accessible': 'none',
  };
  return templateMap[worldSlug] || 'none';
}

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

function parseAge(ageStr: string): number | null {
  if (!ageStr || ageStr.trim() === '') return null;
  const age = parseInt(ageStr.trim());
  return isNaN(age) ? null : age;
}

function buildExtraFields(row: CSVRow, templateType: string): Record<string, any> {
  const extra: Record<string, any> = {};

  switch (templateType) {
    case 'naruto':
      extra.village = row.NATIONALITY || '';
      extra.clan = row['ETHNICITY / RACE'] || '';
      extra.rank = row.OCCUPATION || '';
      extra.chakra_natures = [];
      extra.kekkei_genkai = row.OTHER || '';
      break;
    case 'ff7':
      extra.affiliation = row.NATIONALITY || '';
      extra.role = row.OCCUPATION || '';
      extra.mako_exposure = '';
      extra.materia_skill = row.OTHER || '';
      break;
    case 'inuyasha':
      extra.species = row.SPECIES || '';
      extra.youkai_type = row.SPECIES || '';
      extra.era = '';
      extra.weapon_or_ability = row.OTHER || '';
      break;
    case 'shaman-king':
      extra.spirit_type = '';
      extra.spirit_name = '';
      extra.oversoul_style = '';
      extra.medium_type = '';
      break;
    case 'zelda':
      extra.race = row.SPECIES || '';
      extra.region = row.NATIONALITY || '';
      extra.deity_or_blessing = '';
      extra.weapon_style = row.OTHER || '';
      break;
    case 'dragonball':
      extra.race = row.SPECIES || '';
      extra.power_level = '';
      extra.transformation_stages = [];
      break;
    case 'pokemon':
      extra.species = row.SPECIES || '';
      extra.typing = [];
      extra.trainer_class = row.OCCUPATION || '';
      extra.region = row.NATIONALITY || '';
      break;
    case 'nier':
      extra.model_type = row.SPECIES || '';
      extra.role = row.OCCUPATION || '';
      extra.weapon_specialty = row.OTHER || '';
      extra.faction = '';
      break;
    case 'original':
      extra.role = row.OCCUPATION || '';
      extra.species = row.SPECIES || '';
      extra.ability_type = row.OTHER || '';
      extra.region = row.NATIONALITY || '';
      break;
  }

  return extra;
}

function buildBio(personality: string, history: string): string {
  const parts: string[] = [];
  if (personality && personality.trim()) {
    parts.push(`## Personality\n\n${personality.trim()}`);
  }
  if (history && history.trim()) {
    parts.push(`## History\n\n${history.trim()}`);
  }
  return parts.join('\n\n');
}

async function importOCs() {
  // Try multiple possible CSV file locations
  const possiblePaths = [
    path.join(process.cwd(), "Ruu's OC List 2025 - Copy of [OC List] (1).csv"),
    path.join(process.cwd(), "Ruu's OC List 2025 - Copy of [OC List].csv"),
    "e:\\Users\\Ruu\\Downloads\\Ruu's OC List 2025 - Copy of [OC List] (1).csv",
  ];
  
  let csvPath = possiblePaths.find(p => fs.existsSync(p));
  
  if (!csvPath) {
    console.error(`CSV file not found. Tried:`);
    possiblePaths.forEach(p => console.error(`  - ${p}`));
    process.exit(1);
  }
  
  if (!fs.existsSync(csvPath)) {
    console.error(`CSV file not found at: ${csvPath}`);
    process.exit(1);
  }

  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as CSVRow[];

  console.log(`Found ${records.length} rows to process`);

  // First, get all worlds to create a lookup
  const { data: worlds } = await supabase.from('worlds').select('id, slug');
  if (!worlds) {
    console.error('Failed to fetch worlds');
    process.exit(1);
  }

  const worldMap = new Map(worlds.map((w) => [w.slug, w.id]));

  let successCount = 0;
  let errorCount = 0;

  for (const row of records) {
    try {
      // Skip empty rows
      if (!row['FIRST NAME'] && !row['LAST NAME']) {
        continue;
      }

      const firstName = (row['FIRST NAME'] || '').trim();
      const lastName = (row['LAST NAME'] || '').trim();
      const name = `${firstName} ${lastName}`.trim() || row.ALIAS?.trim() || 'Unknown';

      if (!name || name === 'Unknown') {
        console.warn(`Skipping row with no name`);
        continue;
      }

      const verse = (row.VERSE || '').trim();
      const worldSlug = verseToSlug[verse] || 'none';
      const worldId = worldMap.get(worldSlug);

      if (!worldId) {
        console.warn(`World not found for verse "${verse}", using "none"`);
        continue;
      }

      const templateType = getTemplateType(worldSlug);
      const slug = slugify(name);
      const age = parseAge(row.AGE);
      const extraFields = buildExtraFields(row, templateType);
      const fullBio = buildBio(row.PERSONALITY || '', row.HISTORY || '');

      // Parse tags from various fields
      const tags: string[] = [];
      if (row.OTHER) tags.push(row.OTHER);
      if (row.OCCUPATION) tags.push(row.OCCUPATION);

      const ocData = {
        name, // Full name from first_name + last_name
        slug,
        world_id: worldId,
        series_type: worldSlug === 'none' || worldSlug === 'not-accessible' ? 'original' : (worldSlug.includes('-') ? 'canon' : 'original'),
        template_type: templateType,
        first_name: firstName || null,
        last_name: lastName || null,
        alias: row.ALIAS?.trim() || null,
        age,
        pronouns: row.PRONOUNS?.trim() || null,
        gender_identity: row.GENDER?.trim() || null,
        gender: row.GENDER?.trim() || null,
        sex: row.SEX?.trim() || null,
        status: 'alive' as const,
        image_url: row.PROFILE?.trim() || null,
        icon_url: null,
        tags: tags.filter(Boolean),
        short_bio: row.PERSONALITY?.substring(0, 200) || null,
        full_bio_markdown: fullBio || null,
        extra_fields: extraFields,
        is_public: true,
        // Additional fields from CSV
        date_of_birth: row['D.O.B.']?.trim() || null,
        occupation: row.OCCUPATION?.trim() || null,
        romantic: row.ROMANTIC?.trim() || null,
        sexual: row.SEXUAL?.trim() || null,
        relationship_type: row['RELATIONSHIP TYPE']?.trim() || null,
        nationality: row.NATIONALITY?.trim() || null,
        ethnicity_race: row['ETHNICITY / RACE']?.trim() || null,
        species: row.SPECIES?.trim() || null,
        height: row.HEIGHT?.trim() || null,
        weight: row.WEIGHT?.trim() || null,
        eye_color: row['EYE COLOR']?.trim() || null,
        hair_color: row['HAIR COLOR']?.trim() || null,
        skin_tone: row['SKIN TONE']?.trim() || null,
        build: row.BUILD?.trim() || null,
        notes: row.NOTES?.trim() || null,
        hometown: row.HOMETOWN?.trim() || null,
        current_home: row['CURRENT HOME']?.trim() || null,
        languages: row.LANGUAGES ? row.LANGUAGES.split(',').map(l => l.trim()).filter(Boolean) : null,
        maternal_parent: row['MATERNAL PARENT']?.trim() || null,
        paternal_parent: row['PATERNAL PARENT']?.trim() || null,
        ship: row.SHIP?.trim() || null,
        relationships: row.RELATIONSHIPS?.trim() || null,
        star_sign: row['STAR SIGN']?.trim() || null,
        likes: row.LIKES?.trim() || null,
        dislikes: row.DISLIKES?.trim() || null,
        voice_actor: row['VOICE ACTOR']?.trim() || null,
        seiyuu: row.SEIYUU?.trim() || null,
        theme_song: row['THEME SONG']?.trim() || null,
        personality: row.PERSONALITY?.trim() || null,
        positive_traits: row['POSITIVE TRAITS']?.trim() || null,
        neutral_traits: row['NEUTRAL TRAITS']?.trim() || null,
        negative_traits: row['NEGATIVE TRAITS']?.trim() || null,
        mbti: row.MBTI?.trim() || null,
        history: row.HISTORY?.trim() || null,
        trivia: row.TRIVIA?.trim() || null,
      };

      // Check if OC already exists - try multiple matching strategies
      let existing = null;
      
      // First, try matching by slug
      const { data: bySlug } = await supabase
        .from('ocs')
        .select('id, name, first_name, last_name, identity_id')
        .eq('slug', slug)
        .maybeSingle();
      
      if (bySlug) {
        existing = bySlug;
      } else {
        // Try matching by name
        const { data: byName } = await supabase
          .from('ocs')
          .select('id, name, first_name, last_name, identity_id')
          .eq('name', name)
          .maybeSingle();
        
        if (byName) {
          existing = byName;
        } else if (firstName && lastName) {
          // Try matching by first_name + last_name combination
          const { data: byFirstLast } = await supabase
            .from('ocs')
            .select('id, name, first_name, last_name, identity_id')
            .eq('first_name', firstName)
            .eq('last_name', lastName)
            .maybeSingle();
          
          if (byFirstLast) {
            existing = byFirstLast;
          }
        }
      }

      // Handle identity_id - create or reuse identity
      let identityId = existing?.identity_id || null;
      if (!identityId) {
        // Check if an identity with this name already exists
        const { data: existingIdentity } = await supabase
          .from('oc_identities')
          .select('id')
          .eq('name', name)
          .maybeSingle();
        
        if (existingIdentity) {
          identityId = existingIdentity.id;
        } else {
          // Create new identity
          const { data: newIdentity, error: identityError } = await supabase
            .from('oc_identities')
            .insert({ name })
            .select('id')
            .single();
          
          if (identityError) {
            console.warn(`Failed to create identity for ${name}:`, identityError.message);
          } else {
            identityId = newIdentity.id;
          }
        }
      }

      if (existing) {
        console.log(`Updating existing OC: ${existing.name || name} (ID: ${existing.id})`);
        console.log(`  Setting first_name: "${firstName}", last_name: "${lastName}", name: "${name}"`);
        const { error } = await supabase
          .from('ocs')
          .update({ ...ocData, identity_id: identityId })
          .eq('id', existing.id);
        if (error) throw error;
      } else {
        console.log(`Creating new OC: ${name}`);
        const { error } = await supabase.from('ocs').insert({ ...ocData, identity_id: identityId });
        if (error) throw error;
      }

      successCount++;
    } catch (error: any) {
      console.error(`Error processing row:`, error.message);
      errorCount++;
    }
  }

  console.log(`\nImport complete!`);
  console.log(`Success: ${successCount}`);
  console.log(`Errors: ${errorCount}`);
}

importOCs().catch(console.error);
