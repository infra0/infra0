"use client"

import { Handle, Position, type NodeProps } from "reactflow"
import { Database, Server, Globe, Shield, HardDrive, Settings } from "lucide-react"
import type { Infra0Node } from "../types/infrastructure"

interface InfrastructureNodeData extends Infra0Node {
  onClick: () => void
}

const getNodeIcon = (type: string) => {
  switch (type) {
    case "network":
      return <Globe className="w-5 h-5" />
    case "compute":
      return <Server className="w-5 h-5" />
    case "database":
      return <Database className="w-5 h-5" />
    case "storage":
      return <HardDrive className="w-5 h-5" />
    case "security":
      return <Shield className="w-5 h-5" />
    default:
      return <Settings className="w-5 h-5" />
  }
}

const getNodeColors = (type: string) => {
  switch (type) {
    case "network":
      return {
        gradient: "from-blue-500 to-blue-600",
        shadow: "shadow-blue-500/25",
        glow: "hover:shadow-blue-500/40",
        border: "border-blue-400/50",
      }
    case "compute":
      return {
        gradient: "from-orange-500 to-orange-600",
        shadow: "shadow-orange-500/25",
        glow: "hover:shadow-orange-500/40",
        border: "border-orange-400/50",
      }
    case "database":
      return {
        gradient: "from-purple-500 to-purple-600",
        shadow: "shadow-purple-500/25",
        glow: "hover:shadow-purple-500/40",
        border: "border-purple-400/50",
      }
    case "storage":
      return {
        gradient: "from-green-500 to-green-600",
        shadow: "shadow-green-500/25",
        glow: "hover:shadow-green-500/40",
        border: "border-green-400/50",
      }
    case "security":
      return {
        gradient: "from-red-500 to-red-600",
        shadow: "shadow-red-500/25",
        glow: "hover:shadow-red-500/40",
        border: "border-red-400/50",
      }
    default:
      return {
        gradient: "from-gray-500 to-gray-600",
        shadow: "shadow-gray-500/25",
        glow: "hover:shadow-gray-500/40",
        border: "border-gray-400/50",
      }
  }
}

export default function InfrastructureNode({ data }: NodeProps<InfrastructureNodeData>) {
  const colors = getNodeColors(data.type)
  const icon = getNodeIcon(data.type)

  return (
    <div
      className={`
        relative px-5 py-4 rounded-xl border cursor-pointer transition-all duration-300
        bg-gradient-to-br ${colors.gradient} ${colors.border} ${colors.shadow} ${colors.glow}
        min-w-[160px] max-w-[220px] backdrop-blur-sm
        hover:scale-105 hover:shadow-xl transform-gpu
        group
      `}
      onClick={data.onClick}
    >
      {/* Glow effect */}
      <div
        className={`absolute inset-0 rounded-xl bg-gradient-to-br ${colors.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl`}
      />

      {/* Top Handle */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-white/90 border-2 border-gray-300 shadow-lg hover:bg-white transition-colors"
      />

      {/* Node Content */}
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur">{icon}</div>
          <span className="font-semibold text-white text-sm truncate flex-1">{data.label}</span>
        </div>

        <div className="text-xs text-white/80 font-mono truncate bg-black/20 px-2 py-1 rounded backdrop-blur">
          {data.id}
        </div>
      </div>

      {/* Bottom Handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-white/90 border-2 border-gray-300 shadow-lg hover:bg-white transition-colors"
      />

      {/* Side Handles */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-white/90 border-2 border-gray-300 shadow-lg hover:bg-white transition-colors"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-white/90 border-2 border-gray-300 shadow-lg hover:bg-white transition-colors"
      />
    </div>
  )
}
