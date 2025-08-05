import React from "react"
import { Sparkles, Settings, Eye } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import FlowDiagram from "@/components/flow-diagram"
import DiagramState from "@/components/diagram-state"
import FullscreenDiagram from "@/components/fullscreen-diagram"
import { type Infra0Node, type Infra0Edge } from "@/types/infrastructure"

interface DiagramPanelProps {
  nodes: Infra0Node[]
  edges: Infra0Edge[]
  onNodeClick: (node: Infra0Node) => void
  onNodeUpdate: (nodeId: string, updatedNode: Infra0Node) => void
  className?: string
}

export function DiagramPanel({
  nodes,
  edges,
  onNodeClick,
  onNodeUpdate,
  className = "",
}: DiagramPanelProps) {
  return (
    <div className={`flex flex-col bg-[#0a0a0a] ${className}`}>
      <div className="p-6 border-b border-white/[0.08] flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-black" />
              </div>
              <h2 className="text-lg font-semibold text-white/95">Infrastructure Diagram</h2>
            </div>
            <p className="text-sm text-white/60">
              Interactive flow diagram - click nodes to select, hover to highlight connections
            </p>
          </div>
          <FullscreenDiagram
            nodes={nodes}
            edges={edges}
            onNodeClick={onNodeClick}
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <Tabs defaultValue="diagram" className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-2 bg-white/[0.04] border-b border-white/[0.08]">
            <TabsTrigger
              value="diagram"
              className="flex items-center gap-2 text-white/70 data-[state=active]:text-white/95"
            >
              <Eye className="w-4 h-4" />
              Diagram
            </TabsTrigger>
            <TabsTrigger
              value="state"
              className="flex items-center gap-2 text-white/70 data-[state=active]:text-white/95"
            >
              <Settings className="w-4 h-4" />
              State
            </TabsTrigger>
          </TabsList>
          <TabsContent value="diagram" className="flex-1 p-6 mt-0">
            <FlowDiagram
              nodes={nodes}
              edges={edges}
              onNodeClick={onNodeClick}
            />
          </TabsContent>
          <TabsContent value="state" className="flex-1 p-6 mt-0">
            <DiagramState
              nodes={nodes}
              edges={edges}
              onNodeUpdate={onNodeUpdate}
              onNodeClick={onNodeClick}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 