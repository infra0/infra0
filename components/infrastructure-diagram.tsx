"use client"

import type { Infra0Node, Infra0Edge } from "../types/infrastructure"

interface InfrastructureDiagramProps {
  nodes: Infra0Node[]
  edges: Infra0Edge[]
  onNodeClick: (node: Infra0Node) => void
}

const getNodeColor = (type: string) => {
  switch (type) {
    case "network":
      return "bg-blue-600 border-blue-500 hover:bg-blue-700"
    case "compute":
      return "bg-orange-600 border-orange-500 hover:bg-orange-700"
    case "database":
      return "bg-purple-600 border-purple-500 hover:bg-purple-700"
    case "storage":
      return "bg-green-600 border-green-500 hover:bg-green-700"
    case "security":
      return "bg-red-600 border-red-500 hover:bg-red-700"
    default:
      return "bg-gray-600 border-gray-500 hover:bg-gray-700"
  }
}

export default function InfrastructureDiagram({ nodes, edges, onNodeClick }: InfrastructureDiagramProps) {
  // Create a simple layout based on the reference image
  const getNodePosition = (nodeId: string) => {
    switch (nodeId) {
      case "vpc":
        return { x: 400, y: 50 }
      case "public-subnet":
        return { x: 300, y: 150 }
      case "nat-gateway":
        return { x: 500, y: 200 }
      case "private-subnet":
        return { x: 400, y: 300 }
      case "rds":
        return { x: 300, y: 400 }
      case "ecs":
        return { x: 500, y: 400 }
      case "load-balancer":
        return { x: 400, y: 500 }
      case "internet-gateway":
        return { x: 400, y: 600 }
      default:
        return { x: 400, y: 300 }
    }
  }

  return (
    <div className="w-full h-full bg-gray-950/50 rounded-lg border border-gray-800 relative overflow-hidden">
      <svg width="100%" height="100%" className="absolute inset-0">
        {/* Render edges */}
        {edges.map((edge, index) => {
          const fromNode = nodes.find((n) => n.id === edge.from)
          const toNode = nodes.find((n) => n.id === edge.to)
          if (!fromNode || !toNode) return null

          const fromPos = getNodePosition(edge.from)
          const toPos = getNodePosition(edge.to)

          return (
            <line
              key={index}
              x1={fromPos.x + 60}
              y1={fromPos.y + 25}
              x2={toPos.x + 60}
              y2={toPos.y + 25}
              stroke="#6b7280"
              strokeWidth="2"
              markerEnd="url(#arrowhead)"
            />
          )
        })}

        {/* Arrow marker definition */}
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#6b7280" />
          </marker>
        </defs>
      </svg>

      {/* Render nodes */}
      {nodes.map((node) => {
        const position = getNodePosition(node.id)
        return (
          <div
            key={node.id}
            className={`absolute px-4 py-2 rounded border-2 text-white text-sm font-medium cursor-pointer transition-colors ${getNodeColor(node.type)}`}
            style={{
              left: position.x,
              top: position.y,
              width: "120px",
              textAlign: "center",
            }}
            onClick={() => onNodeClick(node)}
          >
            {node.label}
          </div>
        )
      })}
    </div>
  )
}
