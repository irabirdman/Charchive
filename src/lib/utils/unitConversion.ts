/**
 * Converts imperial height to metric (cm)
 * Handles formats like:
 * - "5'10\"" or "5'10" -> 178 cm
 * - "5 ft 10 in" -> 178 cm
 * - "70 in" -> 178 cm
 * - Already in cm (if contains "cm") -> returns as-is
 */
export function convertHeightToMetric(height: string | null | undefined): string {
  if (!height) return '';

  const trimmed = height.trim();
  if (!trimmed) return '';

  // If already in metric, return as-is
  if (trimmed.toLowerCase().includes('cm')) {
    return trimmed;
  }

  let totalInches = 0;

  // Try parsing feet and inches format: "5'10\"" or "5'10"
  const feetInchesMatch = trimmed.match(/^(\d+)\s*['']\s*(\d+)\s*[""]?$/);
  if (feetInchesMatch) {
    const feet = parseInt(feetInchesMatch[1], 10);
    const inches = parseInt(feetInchesMatch[2], 10);
    totalInches = feet * 12 + inches;
  }
  // Try parsing "X ft Y in" format
  else {
    const ftInMatch = trimmed.match(/(\d+)\s*ft\s*(\d+)\s*in/i);
    if (ftInMatch) {
      const feet = parseInt(ftInMatch[1], 10);
      const inches = parseInt(ftInMatch[2], 10);
      totalInches = feet * 12 + inches;
    }
    // Try parsing just inches: "70 in"
    else {
      const inchesMatch = trimmed.match(/^(\d+(?:\.\d+)?)\s*in$/i);
      if (inchesMatch) {
        totalInches = parseFloat(inchesMatch[1]);
      }
      // Try parsing just a number (assume inches if reasonable, otherwise assume feet)
      else {
        const numberMatch = trimmed.match(/^(\d+(?:\.\d+)?)$/);
        if (numberMatch) {
          const num = parseFloat(numberMatch[1]);
          // If number is less than 10, assume feet; otherwise assume inches
          totalInches = num < 10 ? num * 12 : num;
        }
      }
    }
  }

  if (totalInches > 0) {
    const cm = Math.round(totalInches * 2.54);
    return `${cm} cm`;
  }

  // If parsing failed, return original
  return trimmed;
}

/**
 * Converts imperial weight to metric (kg)
 * Handles formats like:
 * - "150 lbs" or "150lb" -> 68 kg
 * - "150 pounds" -> 68 kg
 * - Already in kg (if contains "kg") -> returns as-is
 */
export function convertWeightToMetric(weight: string | null | undefined): string {
  if (!weight) return '';

  const trimmed = weight.trim();
  if (!trimmed) return '';

  // If already in metric, return as-is
  if (trimmed.toLowerCase().includes('kg')) {
    return trimmed;
  }

  // Try parsing pounds: "150 lbs", "150lb", "150 pounds"
  const lbsMatch = trimmed.match(/^(\d+(?:\.\d+)?)\s*(?:lbs?|pounds?)$/i);
  if (lbsMatch) {
    const lbs = parseFloat(lbsMatch[1]);
    const kg = Math.round(lbs * 0.453592);
    return `${kg} kg`;
  }

  // Try parsing just a number (assume pounds if reasonable)
  const numberMatch = trimmed.match(/^(\d+(?:\.\d+)?)$/);
  if (numberMatch) {
    const num = parseFloat(numberMatch[1]);
    // If number is reasonable for pounds (between 50 and 500), convert
    if (num >= 50 && num <= 500) {
      const kg = Math.round(num * 0.453592);
      return `${kg} kg`;
    }
  }

  // If parsing failed, return original
  return trimmed;
}

/**
 * Formats height with both imperial and metric
 * Returns format: "imperial / metric"
 */
export function formatHeightWithMetric(height: string | null | undefined): string {
  if (!height) return '';

  const trimmed = height.trim();
  if (!trimmed) return '';

  const metric = convertHeightToMetric(trimmed);
  
  // If already in metric format or conversion failed, return as-is
  if (metric === trimmed || metric.toLowerCase().includes('cm')) {
    return trimmed;
  }

  return `${trimmed} / ${metric}`;
}

/**
 * Formats weight with both imperial and metric
 * Returns format: "imperial / metric"
 */
export function formatWeightWithMetric(weight: string | null | undefined): string {
  if (!weight) return '';

  const trimmed = weight.trim();
  if (!trimmed) return '';

  const metric = convertWeightToMetric(trimmed);
  
  // If already in metric format or conversion failed, return as-is
  if (metric === trimmed || metric.toLowerCase().includes('kg')) {
    return trimmed;
  }

  return `${trimmed} / ${metric}`;
}

