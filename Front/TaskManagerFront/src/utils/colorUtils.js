// colorUtils.js

export const DEP_COLORS = [
  // Original palette
  "#FFD93D", "#FF6B6B", "#6BCB77", "#4D96FF", "#845EC2",
  "#FF9671", "#FFC75F", "#0081CF", "#B39CD0", "#3705dc",
  "#00C9A7", "#F9F871", "#FF8066", "#A1C181", "#FF5DA2",
  "#6A4C93", "#1982C4", "#8AC926", "#FFCA3A", "#D81159",

  // Additional warm colors
  "#FFB400", "#FF4E00", "#E63946", "#F3722C", "#FF9F1C",

  // Additional cool colors
  "#3A86FF", "#0077B6", "#00B4D8", "#06D6A0", "#118AB2",

  // Neon / vibrant accents
  "#FF00C8", "#00FFD1", "#39FF14", "#F5B700", "#FF5E78",

  // Pastels & soft tones
  "#A0E7E5", "#B4F8C8", "#FBE7C6", "#FFAEBC", "#A9DEF9",

  // Deep & contrasting colors
  "#2E294E", "#011627", "#8338EC", "#FF006E", "#FB5607",
];

// Track assigned colors
let assignedColors = new Map(); // taskId → color
let usedColors = new Set();     // colors already taken

// Reset all assignments
export function resetColors() {
  assignedColors.clear();
  usedColors.clear();
}

// Hash function → converts string into a stable integer
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

// Deterministic color: same task name → same color, unique until all are used
export function getDeterministicColor(taskId) {
  // Return previously assigned color if exists
  if (assignedColors.has(taskId)) {
    return assignedColors.get(taskId);
  }

  // Create deterministic base index from taskId
  const hashIndex = hashString(taskId) % DEP_COLORS.length;

  // Try to find a color that is not yet used (starting from hashIndex)
  let index = hashIndex;
  for (let i = 0; i < DEP_COLORS.length; i++) {
    const color = DEP_COLORS[index];
    if (!usedColors.has(color)) {
      assignedColors.set(taskId, color);
      usedColors.add(color);
      return color;
    }
    index = (index + 1) % DEP_COLORS.length; // move to next color if taken
  }

  // If all colors are used → reset and assign again
  resetColors();
  return getDeterministicColor(taskId);
}
