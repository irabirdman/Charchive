'use client';

import { useState } from 'react';
import { useDropdownOptions } from '@/hooks/useDropdownOptions';
import { extractColorName } from '@/lib/utils/colorHexUtils';
import { logger } from '@/lib/logger';

interface GeneratedCharacter {
  species?: string;
  gender?: string;
  pronouns?: string;
  sex?: string;
  romantic_orientation?: string;
  sexual_orientation?: string;
  eye_color?: string;
  hair_color?: string;
  skin_tone?: string;
  occupation?: string;
  ethnicity?: string;
  setting?: string;
  trope?: string;
  weapon?: string;
  element?: string;
  personality_traits: string[];
  background: string;
  age?: number;
}

// Background templates (text-only, not dropdown options)
const backgroundTemplates = [
    // Origin & Upbringing
    'Raised in a small village, discovered their powers after a traumatic event',
    'Raised in isolation by a single guardian who hid the truth of their past',
    'Grew up among traveling merchants, never staying in one place for long',
    'Raised in a strict religious community that feared their abilities',
    'Orphaned young and survived by learning to rely only on themselves',
    'Raised in a border town constantly threatened by war',
    'Grew up in the shadow of a legendary hero they could never match',
    'Raised by non-humans and struggles to understand their own kind',
    'Grew up sheltered, unaware of how dangerous the world truly is',
    'Raised in poverty but rich in stories, myths, and old traditions',
  
    // Fall From Grace / Loss
    'Former noble who lost everything, now seeking redemption',
    'Heir to a powerful family that was destroyed overnight',
    'Once respected and admired, now disgraced and exiled',
    'Lost their homeland to disaster and wanders as a refugee',
    'Betrayed by someone they trusted and left for dead',
    'Once powerful, now weakened by a past mistake',
    'Cast out by their own people for breaking a sacred law',
    'Survivor of a massacre they still blame themselves for',
    'Once part of an elite order that no longer exists',
    'Watched their way of life crumble and refused to let it define them',
  
    // Training & Skill
    'Trained from childhood as a warrior, destined for greatness',
    'Trained brutally with no choice in the matter',
    'Self-taught fighter who learned through survival rather than discipline',
    'Trained in secret after being forbidden from learning at all',
    'Trained by a mentor who vanished without explanation',
    'Part of a long martial lineage with impossible expectations',
    'Trained for one purpose, now questioning that path',
    'Learned their skills on the battlefield rather than in classrooms',
    'Raised as a weapon rather than a person',
    'Trained alongside rivals who later became enemies',
  
    // Wanderers & Outsiders
    'Wanderer with no known origin, searching for their place in the world',
    'Left home by choice and never looked back',
    'Constantly moving to avoid a threat that follows them',
    'Traveler chasing rumors tied to their past',
    'Exile who pretends their wandering is freedom',
    'Nomad by culture, not by circumstance',
    'Runs from attachment, knowing they never stay long',
    'Crosses borders easily but never feels welcome',
    'Searching for someone who may not want to be found',
    'Wanders to escape a fate they refuse to accept',
  
    // Knowledge & Curiosity
    'Scholar who left academia to pursue adventure and discovery',
    'Former researcher whose work was deemed too dangerous',
    'Archivist obsessed with forgotten histories',
    'Librarian who uncovered something that changed everything',
    'Historian chasing proof of a lost civilization',
    'Academic disgraced for challenging accepted truths',
    'Student who learned more outside the classroom than within it',
    'Seeker of knowledge who values truth over safety',
    'Scholar forced into the field by unfolding events',
    'Researcher haunted by what they helped uncover',
  
    // Crime, Survival & Redemption
    'Former criminal seeking redemption through heroic deeds',
    'Grew up in the underworld and never fully escaped it',
    'Once worked as a thief, spy, or assassin for survival',
    'Ex-gang member trying to sever old ties',
    'Former enforcer who followed orders without question',
    'Learned to survive by bending rules and breaking laws',
    'Criminal past that still catches up with them',
    'Once betrayed others to save themselves',
    'Walks a thin line between old habits and new ideals',
    'Trying to prove they are more than their worst actions',
  
    // Fate, Prophecy & Power
    'Chosen one of prophecy, struggling with the weight of destiny',
    'Marked at birth by an omen no one fully understands',
    'Feared as a harbinger of disaster rather than a savior',
    'Destined for greatness but longs for normalcy',
    'Chosen by forces that never asked for consent',
    'Fate seems to bend unnaturally around them',
    'Bound to a prophecy they actively resist',
    'Raised to fulfill a role they never wanted',
    'Their future is written, but the ending is unclear',
    'Haunted by visions of what they might become',
  
    // Sudden Change / Ordinary Life
    'Ordinary person thrust into extraordinary circumstances',
    'Once lived a quiet life before everything changed overnight',
    'Accidentally involved in events far larger than themselves',
    'Reluctant hero who never asked for adventure',
    'Started as an observer and became a participant',
    'Pulled into conflict through no fault of their own',
    'Forced to grow quickly after losing their normal life',
    'Still clings to remnants of who they used to be',
    'Feels unqualified for the role they now fill',
    'Learns strength through necessity rather than ambition',
  
    // Ancient, Supernatural & Secrets
    'Ancient being awakened after centuries of slumber',
    'Immortal who has outlived everyone they cared about',
    'Bound to an ancient power they barely understand',
    'Awakened in a world that no longer feels like theirs',
    'Carries memories of eras long forgotten',
    'Once worshiped, now feared or ignored',
    'Struggles to adapt to modern ways',
    'Has lived many lives under different names',
    'Ancient guardian questioning their original purpose',
    'Awakening signals the return of long-buried threats',
  
    // Guardians & Hidden Truths
    'Guardian of an ancient secret, protecting it from those who would misuse it',
    'Raised to protect something they’ve never fully seen',
    'Knows a truth that could destabilize the world',
    'Last remaining keeper of forbidden knowledge',
    'Sworn to silence by an unbreakable oath',
    'Protects a relic tied directly to their own existence',
    'Caught between secrecy and the need to act',
    'A secret passed down through generations',
    'The secret protects the world—but at great cost',
    'Must decide whether the truth should remain hidden',
  ];
  

function randomElement<T>(array: T[]): T | undefined {
  if (!array || array.length === 0) return undefined;
  return array[Math.floor(Math.random() * array.length)];
}

function randomElements<T>(array: T[], count: number): T[] {
  if (!array || array.length === 0) return [];
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, array.length));
}

// Weighted random selection - higher weight = more likely
function weightedRandomElement<T>(items: T[], weights: number[]): T | undefined {
  if (!items || items.length === 0) return undefined;
  if (items.length !== weights.length) {
    // If weights don't match, fall back to uniform random
    return randomElement(items);
  }
  
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  let random = Math.random() * totalWeight;
  
  for (let i = 0; i < items.length; i++) {
    random -= weights[i];
    if (random <= 0) {
      return items[i];
    }
  }
  
  return items[items.length - 1];
}

// Check if a species is human or human-like
// Based on the race options, only exact "Human" should get human-specific ethnicities
function isHumanLike(species?: string): boolean {
  if (!species) return true; // Default to human-like if no species
  const lower = species.toLowerCase().trim();
  // Only exact match for "Human" or "Humanoid" (though Humanoid is debatable)
  // Half-elf, Half-orc, etc. are their own distinct races and shouldn't get human ethnicities
  return lower === 'human' || lower === 'humanoid';
}

// Filter out human-specific ethnicities for non-human species
function filterEthnicities(ethnicities: string[], species?: string): string[] {
  if (isHumanLike(species)) {
    return ethnicities; // Keep all ethnicities for humans
  }
  
  // Human-specific ethnicities to filter out for non-human species
  // These are real-world human ethnic/racial categories that don't apply to fantasy races
  const humanSpecific = [
    'asian', 'caucasian', 'white', 'black', 'african', 'african-american',
    'hispanic', 'latino', 'latina', 'latinx', 'latin',
    'native american', 'indigenous', 'aboriginal', 'first nations',
    'european', 'middle eastern', 'arab', 'arabic',
    'pacific islander', 'polynesian', 'hawaiian',
    'mixed', 'biracial', 'multiracial', 'multi-racial',
    'east asian', 'south asian', 'southeast asian',
    'mediterranean', 'scandinavian', 'slavic'
  ];
  
  return ethnicities.filter(eth => {
    if (!eth) return false;
    const lower = eth.toLowerCase().trim();
    // Check if ethnicity contains any human-specific term
    const isHumanEthnicity = humanSpecific.some(hs => lower.includes(hs));
    // Also check for exact matches or common patterns
    if (lower === 'human' || lower.startsWith('human ')) return false;
    return !isHumanEthnicity;
  });
}

// Get weighted pronouns based on gender
function getWeightedPronouns(pronouns: string[], gender?: string): string | undefined {
  if (!pronouns || pronouns.length === 0) return undefined;
  if (!gender) return randomElement(pronouns);
  
  const lowerGender = gender.toLowerCase();
  const weights = pronouns.map(pronoun => {
    const lowerPronoun = pronoun.toLowerCase();
    
    // Female-like genders -> prefer she/her (70% chance)
    if (lowerGender.includes('female') || lowerGender.includes('woman') || lowerGender.includes('girl') || lowerGender === 'f') {
      if (lowerPronoun.includes('she') || lowerPronoun.includes('her')) {
        return 7; // Higher weight
      }
      return 1; // Lower weight for others
    }
    
    // Male-like genders -> prefer he/him (70% chance)
    if (lowerGender.includes('male') || lowerGender.includes('man') || lowerGender.includes('boy') || lowerGender === 'm') {
      if (lowerPronoun.includes('he') || lowerPronoun.includes('him')) {
        return 7; // Higher weight
      }
      return 1; // Lower weight for others
    }
    
    // Neutral/other genders -> prefer they/them (50% chance)
    if (lowerGender.includes('non-binary') || lowerGender.includes('nonbinary') || lowerGender.includes('agender') || lowerGender.includes('genderfluid')) {
      if (lowerPronoun.includes('they') || lowerPronoun.includes('them')) {
        return 5; // Higher weight
      }
      return 1; // Lower weight for others
    }
    
    // Default: equal weight
    return 1;
  });
  
  return weightedRandomElement(pronouns, weights) || randomElement(pronouns);
}

// Get weighted sex based on gender
function getWeightedSex(sexes: string[], gender?: string): string | undefined {
  if (!sexes || sexes.length === 0) return undefined;
  if (!gender) return randomElement(sexes);
  
  const lowerGender = gender.toLowerCase();
  const weights = sexes.map(sex => {
    const lowerSex = sex.toLowerCase();
    
    // Female-like genders -> prefer female sex (70% chance)
    if (lowerGender.includes('female') || lowerGender.includes('woman') || lowerGender.includes('girl') || lowerGender === 'f') {
      if (lowerSex.includes('female') || lowerSex === 'f') {
        return 7;
      }
      return 1;
    }
    
    // Male-like genders -> prefer male sex (70% chance)
    if (lowerGender.includes('male') || lowerGender.includes('man') || lowerGender.includes('boy') || lowerGender === 'm') {
      if (lowerSex.includes('male') || lowerSex === 'm') {
        return 7;
      }
      return 1;
    }
    
    // Default: equal weight
    return 1;
  });
  
  return weightedRandomElement(sexes, weights) || randomElement(sexes);
}

function generateWeightedAge(): number {
  const rand = Math.random();
  // 75% chance of being between 10-35 (common human-like ages)
  if (rand < 0.75) {
    return Math.floor(Math.random() * 26) + 10; // 10-35
  }
  // 22% chance of being 36-200 (older human-like ages)
  else if (rand < 0.97) {
    return Math.floor(Math.random() * 165) + 36; // 36-200
  }
  // 3% chance of being 201-5000 (very old, for long-lived species)
  else {
    // Use exponential distribution for very old ages to favor lower end but allow up to 5000
    const ageRange = 4799; // 201-5000
    const exponential = Math.pow(Math.random(), 2); // Square to bias toward lower ages
    return Math.floor(exponential * ageRange) + 201; // 201-5000
  }
}

export function CharacterGenerator({ className = '' }: { className?: string }) {
  const [generated, setGenerated] = useState<GeneratedCharacter | null>(null);
  const [history, setHistory] = useState<GeneratedCharacter[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch dropdown options from database - all dropdown fields from OCForm
  // These match exactly with the dropdown fields in OCForm.tsx
  const genderOptions = useDropdownOptions('gender_identity'); // Gender field
  const pronounsOptions = useDropdownOptions('pronouns'); // Pronouns field
  const speciesOptions = useDropdownOptions('species'); // Species / Race field
  const romanticOptions = useDropdownOptions('romantic'); // Romantic orientation field
  const sexualOptions = useDropdownOptions('sexual'); // Sexual orientation field
  const eyeColorOptions = useDropdownOptions('eye_color'); // Eye color field (FormColorSelect)
  const hairColorOptions = useDropdownOptions('hair_color'); // Hair color field (FormColorSelect)
  const skinToneOptions = useDropdownOptions('skin_tone'); // Skin tone field (FormColorSelect)
  const occupationOptions = useDropdownOptions('occupation'); // Occupation field
  const ethnicityOptions = useDropdownOptions('ethnicity_race'); // Ethnicity / Race field
  const settingOptions = useDropdownOptions('setting'); // Setting / Location field
  const tropeOptions = useDropdownOptions('trope'); // Trope field
  const weaponOptions = useDropdownOptions('weapon'); // Weapon field
  const elementOptions = useDropdownOptions('element'); // Element field
  const positiveTraitsOptions = useDropdownOptions('positive_traits'); // Positive traits (FormMultiSelect)
  const neutralTraitsOptions = useDropdownOptions('neutral_traits'); // Neutral traits (FormMultiSelect)
  const negativeTraitsOptions = useDropdownOptions('negative_traits'); // Negative traits (FormMultiSelect)
  const sexOptions = useDropdownOptions('sex'); // Sex field

  // Get options from database - all options come from database
  const getOptions = (hookResult: ReturnType<typeof useDropdownOptions>): string[] => {
    return hookResult.options || [];
  };

  // Check if any options are still loading
  const isAnyLoading = 
    genderOptions.isLoading ||
    pronounsOptions.isLoading ||
    speciesOptions.isLoading ||
    romanticOptions.isLoading ||
    sexualOptions.isLoading ||
    eyeColorOptions.isLoading ||
    hairColorOptions.isLoading ||
    skinToneOptions.isLoading ||
    occupationOptions.isLoading ||
    ethnicityOptions.isLoading ||
    settingOptions.isLoading ||
    tropeOptions.isLoading ||
    weaponOptions.isLoading ||
    elementOptions.isLoading ||
    positiveTraitsOptions.isLoading ||
    neutralTraitsOptions.isLoading ||
    negativeTraitsOptions.isLoading ||
    sexOptions.isLoading;

  const generate = () => {
    setLoading(true);
    
    // Get options from database - only use if they exist
    const genders = getOptions(genderOptions);
    const pronouns = getOptions(pronounsOptions);
    const species = getOptions(speciesOptions);
    const romantic = getOptions(romanticOptions);
    const sexual = getOptions(sexualOptions);
    const eyeColors = getOptions(eyeColorOptions);
    const hairColors = getOptions(hairColorOptions);
    const skinTones = getOptions(skinToneOptions);
    const occupations = getOptions(occupationOptions);
    const ethnicities = getOptions(ethnicityOptions);
    const settings = getOptions(settingOptions);
    const tropes = getOptions(tropeOptions);
    const weapons = getOptions(weaponOptions);
    const elements = getOptions(elementOptions);
    
    
    const positive = getOptions(positiveTraitsOptions);
    const neutral = getOptions(neutralTraitsOptions);
    const negative = getOptions(negativeTraitsOptions);
    const sexes = getOptions(sexOptions);

    // Combine all trait options
    const allTraits = [...positive, ...neutral, ...negative];

    // Generate species first (needed for ethnicity filtering)
    const selectedSpecies = randomElement(species) || undefined;
    
    // Generate gender first (needed for pronouns/sex weighting)
    const selectedGender = randomElement(genders) || undefined;
    
    // Filter ethnicities based on species - must be done AFTER species is selected
    const filteredEthnicities = filterEthnicities(ethnicities, selectedSpecies);
    
    // Get weighted pronouns and sex based on gender
    const selectedPronouns = getWeightedPronouns(pronouns, selectedGender);
    const selectedSex = getWeightedSex(sexes, selectedGender);

    // Only assign ethnicity if we have valid filtered options
    // For non-humans, if all ethnicities were filtered out, don't assign one
    const selectedEthnicity = filteredEthnicities.length > 0 
      ? randomElement(filteredEthnicities) 
      : undefined;

    const character: GeneratedCharacter = {
      species: selectedSpecies,
      gender: selectedGender,
      pronouns: selectedPronouns,
      sex: selectedSex,
      romantic_orientation: randomElement(romantic) || undefined,
      sexual_orientation: randomElement(sexual) || undefined,
      eye_color: randomElement(eyeColors) || undefined,
      hair_color: randomElement(hairColors) || undefined,
      skin_tone: randomElement(skinTones) || undefined,
      occupation: randomElement(occupations) || undefined,
      ethnicity: selectedEthnicity,
      setting: randomElement(settings) || undefined,
      trope: randomElement(tropes) || undefined,
      weapon: randomElement(weapons) || undefined,
      element: randomElement(elements) || undefined,
      personality_traits: randomElements(allTraits, Math.min(Math.floor(Math.random() * 3) + 2, allTraits.length)), // 2-4 traits, or all if less
      background: randomElement(backgroundTemplates) || 'A character with an unknown past.',
      age: generateWeightedAge(), // Weighted toward 10-35
    };

    // Debug logging removed

    setGenerated(character);
    setHistory((prev) => [character, ...prev].slice(0, 10)); // Keep last 10
    setLoading(false);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header Card with Enhanced Styling */}
      <div className="wiki-card p-4 md:p-6 relative overflow-hidden">
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-pink-900/10 pointer-events-none"></div>
        <div className="relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 flex items-center gap-2">
            <span className="relative">
              <i className="fas fa-dice text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 text-3xl animate-pulse"></i>
              <span className="absolute inset-0 text-purple-400 blur-sm opacity-50">
                <i className="fas fa-dice text-3xl"></i>
              </span>
            </span>
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Character Generator
            </span>
          </h2>
          <p className="text-gray-300 text-sm mb-4 leading-relaxed">
            Generate random character concepts using the same options available in the OC form. Click the button to create a new character!
          </p>
          <button
            onClick={generate}
            disabled={loading || isAnyLoading}
            className="group relative w-full md:w-auto px-6 py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white rounded-lg font-bold text-base shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 overflow-hidden"
          >
            {/* Shimmer effect */}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
            <span className="relative flex items-center gap-2">
              {loading || isAnyLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  {loading ? 'Generating...' : 'Loading options...'}
                </>
              ) : (
                <>
                  <i className="fas fa-magic group-hover:rotate-12 transition-transform duration-300"></i>
                  Generate Character
                </>
              )}
            </span>
          </button>
        </div>
      </div>

      {generated && (
        <div className="wiki-card p-4 md:p-6 border-l-4 border-purple-400 bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-purple-500/10 relative overflow-hidden animate-[fadeIn_0.6s_ease-in-out]">
          {/* Animated background glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          
          <div className="relative z-10">
            <h3 className="text-xl md:text-2xl font-bold text-gray-100 mb-4 flex items-center gap-2">
              <span className="relative">
                <i className="fas fa-user-circle text-purple-400 text-2xl"></i>
                <span className="absolute inset-0 text-purple-400 blur-md opacity-50">
                  <i className="fas fa-user-circle text-2xl"></i>
                </span>
              </span>
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Generated Character
              </span>
            </h3>

            {/* Grouped Layout - Related fields together */}
            <div className="space-y-2">
              {/* Age - Standalone */}
              {generated.age && (
                <div className="p-2 rounded border border-purple-500/20 bg-gray-800/30">
                  <div className="text-gray-500 text-xs mb-0.5">Age</div>
                  <div className="text-gray-100 text-sm font-medium">{generated.age} years</div>
                </div>
              )}

              {/* Species & Ethnicity - Grouped */}
              {(generated.species || generated.ethnicity) && (
                <div className="p-2 rounded border border-purple-500/20 bg-gray-800/30">
                  <div className="grid grid-cols-2 gap-2">
                    {generated.species && (
                      <div>
                        <div className="text-gray-500 text-xs mb-0.5">Species</div>
                        <div className="text-gray-100 text-sm">{generated.species}</div>
                      </div>
                    )}
                    {generated.ethnicity && (
                      <div>
                        <div className="text-gray-500 text-xs mb-0.5">Ethnicity</div>
                        <div className="text-gray-100 text-sm">{generated.ethnicity}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Gender, Pronouns, Sex - Grouped */}
              {(generated.gender || generated.pronouns || generated.sex) && (
                <div className="p-2 rounded border border-purple-500/20 bg-gray-800/30">
                  <div className="grid grid-cols-3 gap-2">
                    {generated.gender && (
                      <div>
                        <div className="text-gray-500 text-xs mb-0.5">Gender</div>
                        <div className="text-gray-100 text-sm">{generated.gender}</div>
                      </div>
                    )}
                    {generated.pronouns && (
                      <div>
                        <div className="text-gray-500 text-xs mb-0.5">Pronouns</div>
                        <div className="text-gray-100 text-sm">{generated.pronouns}</div>
                      </div>
                    )}
                    {generated.sex && (
                      <div>
                        <div className="text-gray-500 text-xs mb-0.5">Sex</div>
                        <div className="text-gray-100 text-sm">{generated.sex}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Appearance - Hair, Eye, Skin - Grouped */}
              {(generated.hair_color || generated.eye_color || generated.skin_tone) && (
                <div className="p-2 rounded border border-purple-500/20 bg-gray-800/30">
                  <div className="grid grid-cols-3 gap-2">
                    {generated.hair_color && (
                      <div>
                        <div className="text-gray-500 text-xs mb-0.5">Hair</div>
                        <div className="text-gray-100 text-sm">{extractColorName(generated.hair_color) || generated.hair_color}</div>
                      </div>
                    )}
                    {generated.eye_color && (
                      <div>
                        <div className="text-gray-500 text-xs mb-0.5">Eyes</div>
                        <div className="text-gray-100 text-sm">{extractColorName(generated.eye_color) || generated.eye_color}</div>
                      </div>
                    )}
                    {generated.skin_tone && (
                      <div>
                        <div className="text-gray-500 text-xs mb-0.5">Skin</div>
                        <div className="text-gray-100 text-sm">{extractColorName(generated.skin_tone) || generated.skin_tone}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Orientation - Romantic & Sexual - Grouped */}
              {(generated.romantic_orientation || generated.sexual_orientation) && (
                <div className="p-2 rounded border border-purple-500/20 bg-gray-800/30">
                  <div className="grid grid-cols-2 gap-2">
                    {generated.romantic_orientation && (
                      <div>
                        <div className="text-gray-500 text-xs mb-0.5">Romantic</div>
                        <div className="text-gray-100 text-sm">{generated.romantic_orientation}</div>
                      </div>
                    )}
                    {generated.sexual_orientation && (
                      <div>
                        <div className="text-gray-500 text-xs mb-0.5">Sexual</div>
                        <div className="text-gray-100 text-sm">{generated.sexual_orientation}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Status & Role - Occupation, Setting, Trope - Grouped */}
              {(generated.occupation || generated.setting || generated.trope) && (
                <div className="p-2 rounded border border-purple-500/20 bg-gray-800/30">
                  <div className="grid grid-cols-3 gap-2">
                    {generated.occupation && (
                      <div>
                        <div className="text-gray-500 text-xs mb-0.5">Occupation</div>
                        <div className="text-gray-100 text-sm">{generated.occupation}</div>
                      </div>
                    )}
                    {generated.setting && (
                      <div>
                        <div className="text-gray-500 text-xs mb-0.5">Setting</div>
                        <div className="text-gray-100 text-sm">{generated.setting}</div>
                      </div>
                    )}
                    {generated.trope && (
                      <div>
                        <div className="text-gray-500 text-xs mb-0.5">Trope</div>
                        <div className="text-gray-100 text-sm">{generated.trope}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Combat & Powers - Weapon & Element - Grouped */}
              {(generated.weapon || generated.element) && (
                <div className="p-2 rounded border border-purple-500/20 bg-gray-800/30">
                  <div className="grid grid-cols-2 gap-2">
                    {generated.weapon && (
                      <div>
                        <div className="text-gray-500 text-xs mb-0.5">Weapon</div>
                        <div className="text-gray-100 text-sm">{generated.weapon}</div>
                      </div>
                    )}
                    {generated.element && (
                      <div>
                        <div className="text-gray-500 text-xs mb-0.5">Element</div>
                        <div className="text-gray-100 text-sm">{generated.element}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Personality Traits - Full Width */}
            {generated.personality_traits.length > 0 && (
              <div className="mt-2 p-2 rounded-lg border border-purple-500/30 bg-gradient-to-br from-gray-800/30 to-gray-900/20">
                <div className="text-purple-400 text-xs uppercase tracking-wider mb-1.5 font-bold flex items-center gap-2">
                  <i className="fas fa-star text-xs"></i>
                  Personality Traits
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {generated.personality_traits.map((trait, index) => (
                    <span
                      key={index}
                      className="px-2 py-0.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-200 rounded text-xs font-medium border border-purple-500/40"
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Background - Full Width */}
            <div className="mt-2 p-2 rounded-lg border border-purple-500/30 bg-gradient-to-br from-gray-800/30 to-gray-900/20">
              <div className="text-purple-400 text-xs uppercase tracking-wider mb-1.5 font-bold flex items-center gap-2">
                <i className="fas fa-book text-xs"></i>
                Background
              </div>
              <div className="text-gray-100 leading-relaxed text-xs p-2 bg-gradient-to-br from-gray-800/40 to-gray-900/40 rounded border border-gray-700/30">
                {generated.background}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* History Section */}
      {history.length > 0 && (
        <div className="wiki-card p-4 md:p-6">
          <h3 className="text-lg md:text-xl font-bold text-gray-100 mb-4 flex items-center gap-2">
            <i className="fas fa-history text-purple-400"></i>
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Recent Generations
            </span>
          </h3>
          <div className="space-y-2">
            {history.map((char, index) => (
              <div
                key={index}
                className="group p-3 bg-gradient-to-r from-gray-800/50 to-gray-800/30 rounded-lg border border-gray-700/50 hover:border-purple-500/50 hover:from-gray-800/70 hover:to-gray-800/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 hover:scale-[1.01]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <span className="text-gray-400 text-sm">
                      {[
                        char.species,
                        char.gender
                      ].filter(Boolean).join(' • ') || 'Character'}
                    </span>
                  </div>
                  <button
                    onClick={() => setGenerated(char)}
                    className="px-3 py-1.5 text-xs font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 shadow-md shadow-purple-500/25 hover:shadow-lg hover:shadow-purple-500/40"
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
