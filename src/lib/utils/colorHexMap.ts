// Color name to hex mapping for hair and eye colors
// When a color is selected, this provides the default hex value
// Users can adjust the hex while keeping the original color name

export const colorHexMap: Record<string, string> = {
  // BLACK
  'Black; Soft': '#1a1a1a',
  'Black; Jet': '#000000',
  'Black; Raven': '#0a0a0a',
  'Black; Midnight': '#0d0d0d',
  'Black; Onyx': '#0f0f0f',
  'Black; Obsidian': '#0b0b0b',
  'Black; Charcoal': '#1c1c1c',
  'Black; Ash': '#2a2a2a',
  'Black; Black/Silver': '#1a1a2a',

  // BROWN
  'Brown; Light': '#a0826d',
  'Brown; Medium': '#6b4423',
  'Brown; Dark': '#3d2817',
  'Brown; Warm': '#8b4513',
  'Brown; Cool': '#5c4033',
  'Brown; Neutral': '#6b4423',
  'Brown; Chestnut': '#954535',
  'Brown; Chocolate': '#7b3f00',
  'Brown; Mocha': '#6f4e37',
  'Brown; Coffee': '#6f4e37',
  'Brown; Espresso': '#3d2817',
  'Brown; Walnut': '#5c4033',
  'Brown; Hazel': '#8b7355',
  'Brown; Tawny': '#cd853f',
  'Brown; Sepia': '#704214',
  'Brown; Mahogany': '#c04000',
  'Brown; Dark Mahogany': '#8b0000',
  'Brown; Auburn': '#a52a2a',
  'Brown; Caramel': '#af6e4d',
  'Brown; Sandy': '#f4a460',
  'Brown; Copper': '#b87333',
  'Brown; Soft Copper': '#cd7f32',
  'Brown; Rose': '#8b5a5a',

  // BLONDE
  'Blonde; Light': '#faf0be',
  'Blonde; Medium': '#f5deb3',
  'Blonde; Dark': '#daa520',
  'Blonde; Ash': '#e6d3a3',
  'Blonde; Beige': '#f5f5dc',
  'Blonde; Neutral': '#f5deb3',
  'Blonde; Golden': '#ffd700',
  'Blonde; Honey': '#f0c674',
  'Blonde; Butter': '#fff8dc',
  'Blonde; Sandy': '#f4a460',
  'Blonde; Champagne': '#f7e7ce',
  'Blonde; Vanilla': '#f3e5ab',
  'Blonde; Cream': '#fffdd0',
  'Blonde; Lemon': '#fffacd',
  'Blonde; Sunflower': '#ffdb00',
  'Blonde; Platinum': '#e5e4e2',
  'Blonde; White': '#faf0e6',
  'Blonde; Silver': '#c0c0c0',
  'Blonde; Frosted': '#e6e6fa',

  // RED
  'Red; Light': '#ff6b6b',
  'Red; Dark': '#8b0000',
  'Red; Warm': '#dc143c',
  'Red; Cool': '#b22222',
  'Red; Auburn': '#a52a2a',
  'Red; Copper': '#b87333',
  'Red; Deep Copper': '#b87333',
  'Red; Burnt Copper': '#cc5500',
  'Red; Ginger': '#b06500',
  'Red; Strawberry Blonde': '#ffdbcc',
  'Red; Crimson': '#dc143c',
  'Red; Scarlet': '#ff2400',
  'Red; Ruby': '#e0115f',
  'Red; Cherry': '#de3163',
  'Red; Carmine': '#960018',
  'Red; Burgundy': '#800020',
  'Red; Wine': '#722f37',
  'Red; Blood': '#8b0000',
  'Red; Fire': '#ff4500',
  'Red; Raspberry': '#e30b5d',

  // ORANGE
  'Orange; Light': '#ffb347',
  'Orange; Dark': '#ff8c00',
  'Orange; Warm': '#ff7f50',
  'Orange; Peach': '#ffdab9',
  'Orange; Apricot': '#fbceb1',
  'Orange; Tangerine': '#ffa500',
  'Orange; Pumpkin': '#ff7518',
  'Orange; Sunset': '#fd5e53',
  'Orange; Rust': '#b7410e',
  'Orange; Burnt': '#cc5500',
  'Orange; Vermilion': '#e34234',

  // YELLOW
  'Yellow; Light': '#ffff99',
  'Yellow; Dark': '#cccc00',
  'Yellow; Canary': '#ffef00',
  'Yellow; Lemon': '#fff700',
  'Yellow; Mustard': '#ffdb58',
  'Yellow; Saffron': '#f4c430',

  // GOLD
  'Gold; Light': '#ffd700',
  'Gold; Dark': '#b8860b',
  'Gold; Warm': '#ffd700',
  'Gold; Soft': '#f4c430',
  'Gold; Bright': '#ffd700',
  'Gold; Amber': '#ffbf00',
  'Gold; Honey': '#f0c674',
  'Gold; Metallic': '#d4af37',

  // BLUE
  'Blue; Light': '#add8e6',
  'Blue; Dark': '#00008b',
  'Blue; Pale': '#afeeee',
  'Blue; Deep': '#00008b',
  'Blue; Soft': '#87ceeb',
  'Blue; Baby': '#89cff0',
  'Blue; Sky': '#87ceeb',
  'Blue; Azure': '#007fff',
  'Blue; Cyan': '#00ffff',
  'Blue; Aqua': '#00ffff',
  'Blue; Teal': '#008080',
  'Blue; Turquoise': '#40e0d0',
  'Blue; Cerulean': '#007ba7',
  'Blue; Cobalt': '#0047ab',
  'Blue; Royal': '#4169e1',
  'Blue; Sapphire': '#0f52ba',
  'Blue; Navy': '#000080',
  'Blue; Midnight': '#191970',
  'Blue; Denim': '#1560bd',
  'Blue; Steel': '#4682b4',
  'Blue; Slate': '#708090',
  'Blue; Ice': '#b0e0e6',
  'Blue; Storm': '#4f6d7a',
  'Blue; Ultramarine': '#120a8f',
  'Blue; Indigo': '#4b0082',

  // GREEN
  'Green; Light': '#90ee90',
  'Green; Dark': '#006400',
  'Green; Pale': '#98fb98',
  'Green; Soft': '#90ee90',
  'Green; Warm': '#228b22',
  'Green; Cool': '#2e8b57',
  'Green; Mint': '#98ff98',
  'Green; Sage': '#87ae73',
  'Green; Olive': '#808000',
  'Green; Fern': '#4f7942',
  'Green; Forest': '#228b22',
  'Green; Emerald': '#50c878',
  'Green; Jade': '#00a86b',
  'Green; Kelly': '#4cbb17',
  'Green; Lime': '#32cd32',
  'Green; Pistachio': '#93c572',
  'Green; Chartreuse': '#7fff00',
  'Green; Sea': '#2e8b57',
  'Green; Aquatic': '#00ced1',
  'Green; Peacock': '#33a1c9',
  'Green; Neon': '#39ff14',

  // PURPLE
  'Purple; Light': '#d8bfd8',
  'Purple; Dark': '#4b0082',
  'Purple; Deep': '#4b0082',
  'Purple; Soft': '#d8bfd8',
  'Purple; Lavender': '#e6e6fa',
  'Purple; Soft Lavender': '#e6e6fa',
  'Purple; Lilac': '#c8a2c8',
  'Purple; Mauve': '#e0b0ff',
  'Purple; Plum': '#dda0dd',
  'Purple; Eggplant': '#614051',
  'Purple; Mulberry': '#c54b8c',
  'Purple; Grape': '#6f2da8',
  'Purple; Orchid': '#da70d6',
  'Purple; Periwinkle': '#cc99ff',
  'Purple; Amethyst': '#9966cc',
  'Purple; Violet': '#8a2be2',
  'Purple; Indigo': '#4b0082',
  'Purple; Magenta': '#ff00ff',
  'Purple; Raspberry': '#e30b5d',

  // PINK
  'Pink; Light': '#ffb6c1',
  'Pink; Dark': '#c71585',
  'Pink; Soft': '#ffb6c1',
  'Pink; Baby': '#f4c2c2',
  'Pink; Blush': '#de5d83',
  'Pink; Dusty': '#d4a5a5',
  'Pink; Dusty Rose': '#b76e79',
  'Pink; Rose': '#ff007f',
  'Pink; Salmon': '#fa8072',
  'Pink; Coral': '#ff7f50',
  'Pink; Peach': '#ffdab9',
  'Pink; Bubblegum': '#ffc1cc',
  'Pink; Candy': '#ff1493',
  'Pink; Hot': '#ff69b4',
  'Pink; Fuchsia': '#ff00ff',
  'Pink; Magenta': '#ff00ff',
  'Pink; Pastel': '#ffb6c1',
  'Pink; Neon': '#ff1493',

  // GRAY
  'Gray; Light': '#d3d3d3',
  'Gray; Dark': '#696969',
  'Gray; Pale': '#d3d3d3',
  'Gray; Soft': '#c0c0c0',
  'Gray; Warm': '#a9a9a9',
  'Gray; Cool': '#808080',
  'Gray; Ash': '#b2beb5',
  'Gray; Smoke': '#848484',
  'Gray; Smoky': '#848484',
  'Gray; Slate': '#708090',
  'Gray; Steel': '#4682b4',
  'Gray; Gunmetal': '#2a3439',
  'Gray; Charcoal': '#36454f',
  'Gray; Pearl': '#e8e0d9',
  'Gray; Metallic': '#8c8c8c',
  'Gray; Platinum': '#e5e4e2',

  // SILVER
  'Silver; Light': '#c0c0c0',
  'Silver; Dark': '#808080',
  'Silver; Soft': '#c9c0bb',
  'Silver; Ash': '#b2beb5',
  'Silver; Steel': '#a8a8a8',
  'Silver; Metallic': '#aaa9ad',
  'Silver; Platinum': '#e5e4e2',
  'Silver; Ice': '#b0e0e6',
  'Silver; White': '#c0c0c0',

  // WHITE
  'White; Soft': '#fafafa',
  'White; Pure': '#ffffff',
  'White; Warm': '#fdf5e6',
  'White; Cool': '#f0f8ff',
  'White; Ivory': '#fffff0',
  'White; Cream': '#fffdd0',
  'White; Pearl': '#f8f6f0',
  'White; Snow': '#fffafa',
  'White; Frost': '#e8f5e9',
  'White; Ice': '#b0e0e6',
  'White; Ghost': '#f8f8ff',
  'White; Beige': '#f5f5dc',

  // HETEROCHROMIA (EYES ONLY)
  'Heterochromia; L Blue / R Brown': '#4169e1', // Using left eye color
  'Heterochromia; L Brown / R Blue': '#8b4513', // Using left eye color
  'Heterochromia; L Green / R Brown': '#228b22', // Using left eye color
  'Heterochromia; L Brown / R Green': '#8b4513', // Using left eye color
  'Heterochromia; L Blue / R Green': '#4169e1', // Using left eye color
  'Heterochromia; L Green / R Blue': '#228b22', // Using left eye color
  'Heterochromia; L Gray / R Blue': '#808080', // Using left eye color
  'Heterochromia; L Gray / R Green': '#808080', // Using left eye color
  'Heterochromia; L Gray / R Brown': '#808080', // Using left eye color
  'Heterochromia; L Gold / R Brown': '#ffd700', // Using left eye color
  'Heterochromia; L Gold / R Green': '#ffd700', // Using left eye color
  'Heterochromia; L Gold / R Blue': '#ffd700', // Using left eye color
  'Heterochromia; L Hazel / R Blue': '#8b7355', // Using left eye color
  'Heterochromia; L Hazel / R Green': '#8b7355', // Using left eye color
  'Heterochromia; Sectoral': '#808080', // Neutral gray for sectoral
  'Heterochromia; Central': '#808080', // Neutral gray for central

  // SKIN TONES - Realistic human skin colors
  'Albino': '#fff8f0', // Very pale, almost white with slight pink undertone
  'Amber': '#d4a574', // Warm golden-brown, medium tone
  'Ashen': '#c9b99b', // Grayish, pale tone with cool undertones
  'Black': '#3d2817', // Deep dark brown, rich and warm
  'Bronze': '#cd7f32', // Metallic bronze-brown, warm medium-dark
  'Brown': '#8b4513', // Medium brown, classic tan
  'Caramel': '#af6e4d', // Light brown with golden undertones, warm
  'Chestnut': '#954535', // Rich brown with red undertones
  'Copper': '#b87333', // Warm reddish-brown, medium tone
  'Dark Brown': '#5c4033', // Dark brown, deep and rich
  'Deep Brown': '#3d2817', // Very dark brown, almost black
  'Ebony': '#2a1f17', // Deepest dark brown/black, cool undertones
  'Fair': '#f5deb3', // Light beige, common fair skin tone
  'Golden': '#d4a574', // Golden-yellow undertone, warm medium
  'Honey': '#d4a574', // Warm golden-brown, similar to amber
  'Ivory': '#fffff0', // Very pale, off-white with slight yellow
  'Light': '#f5deb3', // Light beige, common light skin
  'Light Beige': '#f5f5dc', // Very light beige, pale tone
  'Mahogany': '#c04000', // Rich reddish-brown, deep warm tone
  'Medium': '#d2b48c', // Medium tan/beige, neutral undertones
  'Olive': '#bab86c', // Yellow-green undertone, Mediterranean skin
  'Pale': '#f5deb3', // Light, pale beige, fair skin
  'Porcelain': '#fef5e7', // Very pale, almost white with slight warmth
  'Rosy': '#e8b4a0', // Light with pink undertones, fair with blush
  'Ruddy': '#c08080', // Reddish, flushed appearance, warm undertones
  'Sable': '#6b4423', // Dark brown, rich and warm
  'Sienna': '#a0522d', // Reddish-brown, warm medium-dark
  'Tan': '#d2b48c', // Medium tan, sun-kissed appearance
};

/**
 * Get hex color for a color name
 * Returns the hex value if found, or null if not found
 */
export function getColorHex(colorName: string): string | null {
  return colorHexMap[colorName] || null;
}

/**
 * Check if a color name exists in the mapping
 */
export function hasColorHex(colorName: string): boolean {
  return colorName in colorHexMap;
}

/**
 * Extract color name from stored value (removes hex codes)
 * Handles multiple formats:
 * - "#hex Color Name" -> "Color Name"
 * - "Color Name|#hex" -> "Color Name"
 * - "Color Name #hex" -> "Color Name"
 * - "Color Name" -> "Color Name" (unchanged)
 */
export function extractColorName(storedValue: string | null | undefined): string {
  if (!storedValue) return '';
  return extractColorNameOnly(storedValue);
}

/**
 * Extract hex from stored value
 * Handles multiple formats:
 * - "#hex Color Name" (hex at beginning)
 * - "Color Name|#hex" (hex after pipe)
 * - "Color Name #hex" (hex at end)
 * Returns hex if found, or null
 */
export function extractColorHex(storedValue: string | null | undefined): string | null {
  if (!storedValue) return null;
  
  // Try format: "#hex Color Name" (hex at beginning)
  const hexAtStartMatch = storedValue.match(/^(#[0-9A-Fa-f]{6})\s+/);
  if (hexAtStartMatch) {
    return hexAtStartMatch[1];
  }
  
  // Try format: "Color Name|#hex" (hex after pipe)
  if (storedValue.includes('|')) {
    const parts = storedValue.split('|');
    const hex = parts[parts.length - 1].trim();
    if (hex && hex.startsWith('#')) {
      return hex;
    }
  }
  
  // Try format: "Color Name #hex" (hex at end)
  const hexAtEndMatch = storedValue.match(/\s+(#[0-9A-Fa-f]{6})$/);
  if (hexAtEndMatch) {
    return hexAtEndMatch[1];
  }
  
  return null;
}

/**
 * Extract color name from stored value (removes hex codes)
 * Handles multiple formats and removes hex codes
 */
export function extractColorNameOnly(storedValue: string | null | undefined): string {
  if (!storedValue) return '';
  
  let colorName = storedValue;
  
  // Remove hex at beginning: "#hex Color Name" -> "Color Name"
  colorName = colorName.replace(/^#[0-9A-Fa-f]{6}\s+/, '');
  
  // Remove hex after pipe: "Color Name|#hex" -> "Color Name"
  if (colorName.includes('|')) {
    colorName = colorName.split('|')[0].trim();
  }
  
  // Remove hex at end: "Color Name #hex" -> "Color Name"
  colorName = colorName.replace(/\s+#[0-9A-Fa-f]{6}$/, '');
  
  return colorName.trim();
}

