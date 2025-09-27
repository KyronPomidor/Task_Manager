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
  "#FFB5E8",
  "#FF9CEE",
  "#FFABAB",
  "#FFDAC1",
  "#E2F0CB",
  "#B5EAD7",
  "#C7CEEA",
  "#A0E7E5",
  "#B4F8C8",
  "#FBE7C6",
  "#A5DEE5",
  "#E0BBE4",
  "#957DAD",
  "#D291BC",
  "#FEC8D8",
  "#FFDFD3",
  "#D5ECC2",
  "#FFC09F",
  "#ADF7B6",
  "#FFFFD1",

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