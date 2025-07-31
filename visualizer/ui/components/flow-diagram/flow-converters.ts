import type { Node, Edge } from "reactflow"
import { MarkerType } from "reactflow"
import type { Infra0Node, Infra0Edge } from "@/types/infrastructure"
import type { FlowState } from "./types"
import { generateNodeColor, getEdgeColor } from "./node-coloring"
import { getLayoutedElements } from "./layout-helpers"

export const convertToFlowNodes = (
  infraNodes: Infra0Node[], 
  infraEdges: Infra0Edge[], 
  flowState: FlowState,
  onNodeClick: (node: Infra0Node) => void,
  onNodeHover: (nodeId: string | null) => void,
  layoutDirection: "TB" | "LR" = "TB"
): Node[] => {
  const { nodes: layoutedNodes } = getLayoutedElements(infraNodes, infraEdges, layoutDirection)
  
  return layoutedNodes.map((node, index) => {
    const isConnectedToHovered = flowState.hoveredNodeId && infraEdges.some(
      edge => (edge.from === flowState.hoveredNodeId && edge.to === node.id) || 
               (edge.to === flowState.hoveredNodeId && edge.from === node.id)
    )
    const isHovered = flowState.hoveredNodeId === node.id
    const isSelected = flowState.selectedNodeId === node.id
    const nodeColor = generateNodeColor(node.id, index)
    
    return {
      id: node.id,
      type: "infrastructure",
      position: node.position,
      data: {
        ...node,
        onClick: () => onNodeClick(node),
        isHighlighted: isHovered || isConnectedToHovered || isSelected,
        isSelected: isSelected,
        onMouseEnter: () => onNodeHover(node.id),
        onMouseLeave: () => onNodeHover(null),
        nodeColor: nodeColor,
      },
      draggable: true,
      style: {
        opacity: flowState.hoveredNodeId && !isHovered && !isConnectedToHovered ? 0.5 : 1,
        transition: 'opacity 0.2s ease-out',
        zIndex: isHovered ? 1000 : isConnectedToHovered ? 100 : isSelected ? 500 : 1,
      }
    }
  })
}

export const convertToFlowEdges = (
  infraEdges: Infra0Edge[], 
  infraNodes: Infra0Node[], 
  flowState: FlowState
): Edge[] => {
  return infraEdges.map((edge, index) => {
    const fromNode = infraNodes.find(n => n.id === edge.from)
    const toNode = infraNodes.find(n => n.id === edge.to)
    const edgeId = `${edge.from}-${edge.to}-${index}`
    
    const isConnectedToHovered = flowState.hoveredNodeId && 
      (edge.from === flowState.hoveredNodeId || edge.to === flowState.hoveredNodeId)
    const isEdgeHovered = flowState.hoveredEdgeId === edgeId
    const isHighlighted = isConnectedToHovered || isEdgeHovered
    
    const isFromHoveredNode = flowState.hoveredNodeId === edge.from
    const sourceNodeIndex = infraNodes.findIndex(n => n.id === edge.from)
    const edgeColor = getEdgeColor(edge.from, sourceNodeIndex, isHighlighted)
    
    // Determine stroke width based on connection type
    let strokeWidth = 2 // default
    if (isHighlighted) {
      strokeWidth = isFromHoveredNode ? 6 : 4 // Outgoing edges are thicker
    }
    
    return {
      id: edgeId,
      source: edge.from,
      target: edge.to,
      type: "smoothstep",
      animated: isHighlighted,
      // label: isHighlighted ? `${fromNode?.label} → ${toNode?.label}` : undefined,
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: isHighlighted ? (isFromHoveredNode ? 10 : 24) : 20,
        height: isHighlighted ? (isFromHoveredNode ? 10 : 24) : 20,
        color: edgeColor,
      },
      style: {
        stroke: edgeColor,
        strokeWidth: strokeWidth,
        opacity: flowState.hoveredNodeId && !isConnectedToHovered ? 0.15 : 1,
        filter: isHighlighted 
          ? `drop-shadow(0 0 ${isFromHoveredNode ? 12 : 8}px ${edgeColor}80)` 
          : `drop-shadow(0 0 4px ${edgeColor}40)`,
        transition: 'all 0.2s ease-out',
        strokeDasharray: isFromHoveredNode && isHighlighted ? '0' : undefined,
        strokeLinecap: 'round' as const,
        strokeLinejoin: 'round' as const,
      },
      labelStyle: {
        fill: "#ffffff",
        fontWeight: isFromHoveredNode ? 700 : 600,
        fontSize: isHighlighted ? (isFromHoveredNode ? "16px" : "14px") : "12px",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: "4px 8px",
        borderRadius: "4px",
        border: `2px solid ${edgeColor}`,
        boxShadow: isFromHoveredNode ? `0 0 8px ${edgeColor}60` : undefined,
      },
    }
  })
} 