/**
 * Generate a seed based on the current date in EST (same seed for the same day)
 * This ensures consistent randomization across page loads on the same day
 */
export function getDaySeed(): number {
  const today = new Date();
  // Get date components in EST timezone
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York', // EST/EDT
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const parts = formatter.formatToParts(today);
  const year = parts.find(p => p.type === 'year')?.value || '';
  const month = parts.find(p => p.type === 'month')?.value || '';
  const day = parts.find(p => p.type === 'day')?.value || '';
  const dateString = `${year}-${month}-${day}`;
  
  // Better hash function to convert date string to number
  let hash = 0;
  for (let i = 0; i < dateString.length; i++) {
    const char = dateString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Improved seeded random number generator (Linear Congruential Generator)
 * Returns a function that generates random numbers based on the seed
 */
export function seededRandom(seed: number): () => number {
  let value = seed;
  return function() {
    // LCG parameters (from Numerical Recipes)
    value = (value * 1664525 + 1013904223) % Math.pow(2, 32);
    return value / Math.pow(2, 32);
  };
}

/**
 * Fisher-Yates shuffle with seeded random
 * Shuffles an array deterministically based on a seed
 */
export function seededShuffle<T>(array: T[], seed: number): T[] {
  const shuffled = [...array];
  const random = seededRandom(seed);
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled;
}

/**
 * Helper function to shuffle array and get random items using day-based seed
 * Returns a random subset of the array, shuffled consistently for the same day
 */
export function getRandomItems<T>(array: T[], count: number): T[] {
  if (array.length === 0) return [];
  
  // Use day-based seed for consistent daily randomization
  const seed = getDaySeed();
  const shuffled = seededShuffle(array, seed);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}
