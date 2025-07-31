"use client"

import { Handle, Position, type NodeProps } from "reactflow"
import { Database, Server, Globe, Shield, HardDrive, Settings } from "lucide-react"
import type { Infra0Node } from "../types/infrastructure"

interface InfrastructureNodeData extends Infra0Node {
  onClick: () => void
  isHighlighted?: boolean
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  nodeColor?: string
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

// Convert hex color to HSL for lighter variants
const hexToHsl = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0, s = 0, l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      case b: h = (r - g) / d + 4; break
    }
    h /= 6
  }

  return [h * 360, s * 100, l * 100]
}

const getNodeColors = (nodeColor: string, isHighlighted: boolean = false) => {
  const [h, s, l] = hexToHsl(nodeColor)
  
  if (isHighlighted) {
    return {
      gradient: "from-yellow-400 to-yellow-500",
      shadow: "shadow-yellow-400/60 shadow-2xl",
      glow: "shadow-yellow-400/80",
      border: "border-yellow-400/80 border-2",
      bgColor: nodeColor,
    }
  }

  // Create gradient using the node's unique color
  return {
    gradient: `from-[${nodeColor}] to-[${nodeColor}]`,
    shadow: `shadow-[${nodeColor}]/25`,
    glow: `shadow-[${nodeColor}]/40`,
    border: `border-[${nodeColor}]/50`,
    bgColor: nodeColor,
  }
}

export default function InfrastructureNode({ data }: NodeProps<InfrastructureNodeData>) {
  const nodeColor = data.nodeColor || "#6b7280"
  const colors = getNodeColors(nodeColor, data.isHighlighted)
  const icon = getNodeIcon(data.type)

  return (
    <div
      className={`
        relative px-5 py-4 rounded-xl border cursor-pointer transition-all duration-300
        min-w-[160px] max-w-[220px] backdrop-blur-sm
        hover:scale-105 hover:shadow-xl transform-gpu
        group
        ${data.isHighlighted ? 'scale-110 z-50' : ''}
        ${colors.border}
      `}
      style={{
        background: `linear-gradient(135deg, ${nodeColor}, ${nodeColor}dd)`,
        boxShadow: data.isHighlighted 
          ? `0 15px 20px -5px ${nodeColor}40, 0 8px 8px -3px ${nodeColor}25` 
          : `0 10px 15px -3px ${nodeColor}40, 0 4px 6px -2px ${nodeColor}20`,
      }}
      onClick={data.onClick}
      onMouseEnter={data.onMouseEnter}
      onMouseLeave={data.onMouseLeave}
    >
      {/* Enhanced glow effect for highlighted nodes */}
      <div
        className="absolute inset-0 rounded-xl transition-opacity duration-300 blur-xl"
        style={{
          background: `linear-gradient(135deg, ${nodeColor}, ${nodeColor})`,
          opacity: data.isHighlighted ? 0.3 : 0,
        }}
      />

      {/* Pulsing ring for highlighted nodes */}
      {data.isHighlighted && (
        <div className="absolute -inset-2 rounded-xl border-2 opacity-40 animate-pulse" 
             style={{ borderColor: `${nodeColor}80` }} />
      )}

      {/* Top Handle */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 border-2 shadow-lg transition-colors"
        style={{
          backgroundColor: data.isHighlighted ? '#fcd34d' : '#f9fafb',
          borderColor: data.isHighlighted ? '#fbbf24' : nodeColor,
        }}
      />

      {/* Node Content */}
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-2">
          <div 
            className="p-1.5 rounded-lg backdrop-blur transition-colors"
            style={{
              backgroundColor: data.isHighlighted ? 'rgba(251, 191, 36, 0.3)' : 'rgba(255, 255, 255, 0.2)',
            }}
          >
            {icon}
          </div>
          <span className="font-semibold text-white text-sm truncate flex-1">{data.label}</span>
        </div>

        <div 
          className="text-xs text-white/80 font-mono truncate px-2 py-1 rounded backdrop-blur transition-colors"
          style={{
            backgroundColor: data.isHighlighted ? 'rgba(251, 191, 36, 0.2)' : 'rgba(0, 0, 0, 0.2)',
          }}
        >
          {data.id}
        </div>
      </div>

      {/* Bottom Handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 border-2 shadow-lg transition-colors"
        style={{
          backgroundColor: data.isHighlighted ? '#fcd34d' : '#f9fafb',
          borderColor: data.isHighlighted ? '#fbbf24' : nodeColor,
        }}
      />

      {/* Side Handles */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 border-2 shadow-lg transition-colors"
        style={{
          backgroundColor: data.isHighlighted ? '#fcd34d' : '#f9fafb',
          borderColor: data.isHighlighted ? '#fbbf24' : nodeColor,
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 border-2 shadow-lg transition-colors"
        style={{
          backgroundColor: data.isHighlighted ? '#fcd34d' : '#f9fafb',
          borderColor: data.isHighlighted ? '#fbbf24' : nodeColor,
        }}
      />
    </div>
  )
}
