"use client"

import { useCallback, useMemo, useEffect } from "react"
import ReactFlow, {
  type Node,
  type Edge,
  addEdge,
  type Connection,
  useNodesState,
  useEdgesState,
  Controls,
  MarkerType,
  type NodeTypes,
  type NodeChange,
} from "reactflow"
import "reactflow/dist/style.css"

import InfrastructureNode from "../infrastructure-node"
import type { Infra0Node, Infra0Edge } from "@/types/infrastructure"
import type { FlowState } from "./types"
import { convertToFlowNodes, convertToFlowEdges } from "./flow-converters"

// Define custom node types
const nodeTypes: NodeTypes = {
  infrastructure: InfrastructureNode,
}

interface FlowCanvasProps {
  nodes: Infra0Node[]
  edges: Infra0Edge[]
  flowState: FlowState
  layoutDirection: "TB" | "LR"
  onNodeClick: (node: Infra0Node) => void
  onNodeHover: (nodeId: string | null) => void
  onNodeMouseEnter: (event: React.MouseEvent, node: Node) => void
  onNodeMouseLeave: () => void
  onNodePositionChange: (nodeId: string, position: { x: number; y: number }) => void
}

export default function FlowCanvas({
  nodes,
  edges,
  flowState,
  layoutDirection,
  onNodeClick,
  onNodeHover,
  onNodeMouseEnter,
  onNodeMouseLeave,
  onNodePositionChange,
}: FlowCanvasProps) {
  const flowNodes = useMemo(() => 
    convertToFlowNodes(nodes, edges, flowState, onNodeClick, onNodeHover, layoutDirection), 
    [nodes, edges, flowState, onNodeClick, onNodeHover, layoutDirection]
  )
  
  const flowEdges = useMemo(() => 
    convertToFlowEdges(edges, nodes, flowState), 
    [edges, nodes, flowState]
  )

  const [reactFlowNodes, setNodes, onNodesChangeHandler] = useNodesState(flowNodes)
  const [reactFlowEdges, setEdges, onEdgesChange] = useEdgesState(flowEdges)

  useEffect(() => {
    setNodes(currentNodes => {
      const currentPositions = new Map(
        currentNodes.map(node => [node.id, node.position])
      )
      return flowNodes.map(flowNode => {
        const currentPosition = currentPositions.get(flowNode.id)
        return {
          ...flowNode,
          position: currentPosition || flowNode.position
        }
      })
    })
  }, [flowNodes, setNodes])


  useEffect(() => {
    setEdges(flowEdges)
  }, [flowEdges, setEdges])

  const handleNodesChange = useCallback((changes: NodeChange[]) => {
    onNodesChangeHandler(changes)
    
    changes.forEach(change => {
      if (change.type === 'position' && change.position && change.dragging === false) {
        onNodePositionChange(change.id, change.position)
      }
    })
  }, [onNodesChangeHandler, onNodePositionChange])

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: "smoothstep",
            animated: true,
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 20,
              height: 20,
              color: "#60a5fa",
            },
            style: {
              stroke: "#60a5fa",
              strokeWidth: 2,
              filter: "drop-shadow(0 0 4px rgba(96, 165, 250, 0.3))",
            },
          },
          eds,
        ),
      ),
    [setEdges],
  )

  return (
    <ReactFlow
      nodes={reactFlowNodes}
      edges={reactFlowEdges}
      onNodeMouseEnter={onNodeMouseEnter}
      onNodeMouseLeave={onNodeMouseLeave}
      onNodesChange={handleNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      fitView
      attributionPosition="bottom-left"
      className="bg-black"
      defaultViewport={{ x: 0, y: 0, zoom: 0.5 }}
      connectionLineStyle={{
        stroke: "#60a5fa",
        strokeWidth: 1,
      }}
      defaultMarkerColor="#60a5fa"
    >
      <Controls
        className="bg-gray-800/80 backdrop-blur-xl border border-gray-700/50 rounded-lg shadow-xl"
        style={{
          backgroundColor: "rgba(31, 41, 55, 0.8)",
          color: "#ffffff",
          borderColor: "rgba(75, 85, 99, 0.5)",
          backdropFilter: "blur(12px)",
        }}
      />
    </ReactFlow>
  )
} 