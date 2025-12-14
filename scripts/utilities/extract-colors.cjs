const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, "..", "..", "Ruu's OC List 2025 - Copy of [OC List].csv");
const csvContent = fs.readFileSync(csvPath, 'utf-8');
const lines = csvContent.trim().split('\n');

// Parse CSV line
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
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
const eyeColorIndex = headers.indexOf('EYE COLOR');
const hairColorIndex = headers.indexOf('HAIR COLOR');

const eyeColors = new Set();
const hairColors = new Set();

for (let i = 1; i < lines.length; i++) {
  const values = parseCSVLine(lines[i]);
  const eyeColor = values[eyeColorIndex] || '';
  const hairColor = values[hairColorIndex] || '';
  
  if (eyeColor && eyeColor.trim()) {
    if (eyeColor.includes(';')) {
      eyeColor.split(';').forEach(v => {
        const trimmed = v.trim();
        if (trimmed) eyeColors.add(trimmed);
      });
    } else {
      eyeColors.add(eyeColor.trim());
    }
  }
  
  if (hairColor && hairColor.trim()) {
    if (hairColor.includes(';')) {
      hairColor.split(';').forEach(v => {
        const trimmed = v.trim();
        if (trimmed) hairColors.add(trimmed);
      });
    } else {
      hairColors.add(hairColor.trim());
    }
  }
}

console.log('Eye Colors:', Array.from(eyeColors).sort());
console.log('Hair Colors:', Array.from(hairColors).sort());



