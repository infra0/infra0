import type { Infra0Node, Infra0Edge } from "@/types/infrastructure"

export interface FlowDiagramProps {
  nodes: Infra0Node[]
  edges: Infra0Edge[]
  onNodeClick?: (node: Infra0Node) => void
}

export interface FlowState {
  hoveredNodeId: string | null
  hoveredEdgeId: string | null
  selectedNodeId: string | null
} 