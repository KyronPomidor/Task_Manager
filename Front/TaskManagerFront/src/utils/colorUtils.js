// colorUtils.js
export const DEP_COLORS = [
  "#FFD93D", "#FF6B6B", "#6BCB77", "#4D96FF", "#845EC2",
  "#FF9671", "#FFC75F", "#0081CF", "#B39CD0", "#3705dc",
  "#00C9A7", "#F9F871", "#FF8066", "#A1C181", "#FF5DA2",
  "#6A4C93", "#1982C4", "#8AC926", "#FFCA3A", "#D81159",
];

let assignedColors = new Map();

export function resetColors() {
  assignedColors = new Map();
}

export function getDeterministicColor(taskId) {
  if (assignedColors.has(taskId)) {
    return assignedColors.get(taskId);
  }
  const index = assignedColors.size % DEP_COLORS.length;
  const color = DEP_COLORS[index];
  assignedColors.set(taskId, color);
  return color;
}
