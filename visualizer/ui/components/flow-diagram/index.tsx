"use client"

import { useState, useCallback, useMemo, useRef } from "react"
import type { Node } from "reactflow"

import type { Infra0Node } from "@/types/infrastructure"
import type { FlowDiagramProps, FlowState } from "./types"
import FlowControls from "./flow-controls"
import FlowCanvas from "./flow-canvas"
import { getLayoutedElements } from "./layout-helpers"

export default function FlowDiagram({ nodes, edges, onNodeClick }: FlowDiagramProps) {
  const [layoutDirection, setLayoutDirection] = useState<"TB" | "LR">("TB")
  const [flowState, setFlowState] = useState<FlowState>({
    hoveredNodeId: null,
    hoveredEdgeId: null,
    selectedNodeId: null,
  })
  
  // Track user-positioned nodes to preserve their positions
  const userPositionedNodes = useRef<Map<string, { x: number; y: number }>>(new Map())
  const lastAutoLayoutTrigger = useRef<string>("")

  // Only auto-layout when nodes/edges change or layout direction changes
  const layoutedNodes = useMemo(() => {
    const currentTrigger = `${nodes.length}-${edges.length}-${layoutDirection}`
    
    // If this is a new auto-layout trigger, clear user positions and apply layout
    if (currentTrigger !== lastAutoLayoutTrigger.current) {
      userPositionedNodes.current.clear()
      lastAutoLayoutTrigger.current = currentTrigger
      const { nodes: positioned } = getLayoutedElements(nodes, edges, layoutDirection)
      return positioned
    }
    
    // Otherwise, preserve user positions and only auto-layout new nodes
    const { nodes: autoPositioned } = getLayoutedElements(nodes, edges, layoutDirection)
    
    return autoPositioned.map(node => {
      const userPosition = userPositionedNodes.current.get(node.id)
      if (userPosition) {
        return {
          ...node,
          position: userPosition
        }
      }
      return node
    })
  }, [nodes, edges, layoutDirection])

  const handleNodeClick = useCallback((node: Infra0Node) => {
    // Handle internal selection state
    setFlowState(prev => ({
      ...prev,
      selectedNodeId: prev.selectedNodeId === node.id ? null : node.id
    }))
    
    // Call parent callback if provided
    if (onNodeClick) {
      onNodeClick(node)
    }
  }, [onNodeClick])

  const handleNodeHover = useCallback((nodeId: string | null) => {
    setFlowState(prev => ({
      ...prev,
      hoveredNodeId: nodeId
    }))
  }, [])

  const handleNodeMouseEnter = useCallback((event: React.MouseEvent, node: Node) => {
    setFlowState(prev => ({
      ...prev,
      hoveredNodeId: node.id
    }))
  }, [])

  const handleNodeMouseLeave = useCallback(() => {
    setFlowState(prev => ({
      ...prev,
      hoveredNodeId: null
    }))
  }, [])

  const handleLayoutChange = useCallback((direction: "TB" | "LR") => {
    // Clear user positions when explicitly changing layout
    userPositionedNodes.current.clear()
    setLayoutDirection(direction)
  }, [])

  // Handle node position changes from dragging
  const handleNodePositionChange = useCallback((nodeId: string, position: { x: number; y: number }) => {
    userPositionedNodes.current.set(nodeId, position)
  }, [])

  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 rounded-xl border border-gray-700/50 overflow-hidden shadow-2xl backdrop-blur">
      {/* <FlowControls onLayoutChange={handleLayoutChange} /> */}
      
      <FlowCanvas
        nodes={layoutedNodes}
        edges={edges}
        flowState={flowState}
        layoutDirection={layoutDirection}
        onNodeClick={handleNodeClick}
        onNodeHover={handleNodeHover}
        onNodeMouseEnter={handleNodeMouseEnter}
        onNodeMouseLeave={handleNodeMouseLeave}
        onNodePositionChange={handleNodePositionChange}
      />
    </div>
  )
} 