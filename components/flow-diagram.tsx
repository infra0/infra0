"use client"

import { useCallback, useMemo } from "react"
import ReactFlow, {
  type Node,
  type Edge,
  addEdge,
  type Connection,
  useNodesState,
  useEdgesState,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  type NodeTypes,
  MarkerType,
} from "reactflow"

import InfrastructureNode from "./infrastructure-node"
import type { Infra0Node, Infra0Edge } from "../types/infrastructure"

interface FlowDiagramProps {
  nodes: Infra0Node[]
  edges: Infra0Edge[]
  onNodeClick: (node: Infra0Node) => void
  onNodesChange?: (nodes: Infra0Node[]) => void
}

// Convert our nodes to React Flow format
const convertToFlowNodes = (infraNodes: Infra0Node[], onNodeClick: (node: Infra0Node) => void): Node[] => {
  return infraNodes.map((node) => ({
    id: node.id,
    type: "infrastructure",
    position: getNodePosition(node.id),
    data: {
      ...node,
      onClick: () => onNodeClick(node),
    },
    draggable: true,
  }))
}

// Convert our edges to React Flow format with enhanced styling
const convertToFlowEdges = (infraEdges: Infra0Edge[]): Edge[] => {
  return infraEdges.map((edge, index) => ({
    id: `${edge.from}-${edge.to}-${index}`,
    source: edge.from,
    target: edge.to,
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
    labelStyle: {
      fill: "#ffffff",
      fontWeight: 500,
      fontSize: "12px",
    },
  }))
}

// Position nodes in a logical layout
const getNodePosition = (nodeId: string): { x: number; y: number } => {
  const positions: Record<string, { x: number; y: number }> = {
    vpc: { x: 400, y: 50 },
    "public-subnet": { x: 200, y: 200 },
    "private-subnet": { x: 600, y: 200 },
    "nat-gateway": { x: 200, y: 350 },
    "internet-gateway": { x: 400, y: 500 },
    "load-balancer": { x: 400, y: 350 },
    rds: { x: 500, y: 350 },
    ecs: { x: 700, y: 350 },
  }

  return positions[nodeId] || { x: 400, y: 300 }
}

// Define custom node types
const nodeTypes: NodeTypes = {
  infrastructure: InfrastructureNode,
}

export default function FlowDiagram({ nodes, edges, onNodeClick, onNodesChange }: FlowDiagramProps) {
  const flowNodes = useMemo(() => convertToFlowNodes(nodes, onNodeClick), [nodes, onNodeClick])
  const flowEdges = useMemo(() => convertToFlowEdges(edges), [edges])

  const [reactFlowNodes, setNodes, onNodesChangeHandler] = useNodesState(flowNodes)
  const [reactFlowEdges, setEdges, onEdgesChange] = useEdgesState(flowEdges)

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

  // Handle node position changes
  const handleNodesChange = useCallback(
    (changes: any) => {
      onNodesChangeHandler(changes)

      // If onNodesChange callback is provided, convert back to our format
      if (onNodesChange) {
        const updatedNodes = reactFlowNodes.map((flowNode) => ({
          id: flowNode.data.id,
          label: flowNode.data.label,
          type: flowNode.data.type,
          parent: flowNode.data.parent,
          group: flowNode.data.group,
        }))
        onNodesChange(updatedNodes)
      }
    },
    [onNodesChangeHandler, onNodesChange, reactFlowNodes],
  )

  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 rounded-xl border border-gray-700/50 overflow-hidden shadow-2xl backdrop-blur">
      <ReactFlow
        nodes={reactFlowNodes}
        edges={reactFlowEdges}
        onNodesChange={handleNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
        className="bg-transparent"
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
        connectionLineStyle={{
          stroke: "#60a5fa",
          strokeWidth: 2,
        }}
        defaultMarkerColor="#60a5fa"
      >
        <Controls
          className="bg-gray-800/80 backdrop-blur-xl border border-gray-700/50 rounded-lg shadow-xl"
          style={{
            button: {
              backgroundColor: "rgba(55, 65, 81, 0.8)",
              color: "#ffffff",
              borderColor: "rgba(75, 85, 99, 0.5)",
              backdropFilter: "blur(12px)",
            },
          }}
        />
        <MiniMap
          className="bg-gray-800/80 backdrop-blur-xl border border-gray-700/50 rounded-lg shadow-xl"
          nodeColor={(node) => {
            switch (node.data?.type) {
              case "network":
                return "#3b82f6"
              case "compute":
                return "#f97316"
              case "database":
                return "#a855f7"
              case "storage":
                return "#10b981"
              case "security":
                return "#ef4444"
              default:
                return "#6b7280"
            }
          }}
          maskColor="rgba(0, 0, 0, 0.2)"
        />
        <Background variant={BackgroundVariant.Dots} gap={24} size={1.5} color="rgba(75, 85, 99, 0.3)" />
      </ReactFlow>
    </div>
  )
}
