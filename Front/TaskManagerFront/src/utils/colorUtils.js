// utils/colorUtils.js
export const DEP_COLORS = [
  "#FFD93D",
  "#FF6B6B",
  "#6BCB77",
  "#4D96FF",
  "#845EC2",
  "#FF9671",
  "#FFC75F",
  "#0081CF",
  "#B39CD0",
  "#3705dcff",
];

export function hashStringToIndex(str, mod) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % mod;
}

export function getParentColor(parentId) {
  const idx = hashStringToIndex(parentId, DEP_COLORS.length);
  return DEP_COLORS[idx];
}