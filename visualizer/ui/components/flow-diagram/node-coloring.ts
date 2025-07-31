// Color palette for infrastructure nodes
const COLOR_PALETTE = [
  "#3b82f6", // Blue
  "#ef4444", // Red  
  "#10b981", // Green
  "#f59e0b", // Amber
  "#8b5cf6", // Violet
  "#06b6d4", // Cyan
  "#f97316", // Orange
  "#84cc16", // Lime
  "#ec4899", // Pink
  "#6366f1", // Indigo
  "#14b8a6", // Teal
  "#f43f5e", // Rose
  "#a855f7", // Purple
  "#22c55e", // Green-500
  "#eab308", // Yellow
  "#0ea5e9", // Sky
  "#dc2626", // Red-600
  "#059669", // Emerald
  "#7c3aed", // Violet-600
  "#0891b2", // Cyan-600
]

export const generateNodeColor = (nodeId: string, index: number): string => {
  // Use a combination of node ID hash and index for more variety
  const hash = nodeId.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0)
    return a & a
  }, 0)
  
  // Use hash and index to pick color
  const colorIndex = (Math.abs(hash) + index) % COLOR_PALETTE.length
  return COLOR_PALETTE[colorIndex]
}

export const getEdgeColor = (
  sourceNodeId: string, 
  sourceIndex: number, 
  isHighlighted: boolean = false
): string => {
  const baseColor = generateNodeColor(sourceNodeId, sourceIndex)
  
  // if (isHighlighted) {
  //   return "#fbbf24" // Bright yellow for highlighted
  // }
  
  return baseColor
} 