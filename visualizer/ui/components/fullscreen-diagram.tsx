"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Maximize2, Minimize2, X } from "lucide-react"
import FlowDiagram from "./flow-diagram"
import type { Infra0Node, Infra0Edge } from "@/types/infrastructure"

interface FullscreenDiagramProps {
  nodes: Infra0Node[]
  edges: Infra0Edge[]
  onNodeClick?: (node: Infra0Node) => void
}

export default function FullscreenDiagram({ nodes, edges, onNodeClick }: FullscreenDiagramProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)

  return (
    <>
      {/* Fullscreen Button */}
      <Button
        onClick={() => setIsFullscreen(true)}
        variant="outline"
        size="sm"
        className="border-gray-600/50 text-gray-300 hover:bg-gray-800/50 bg-gray-800/30 backdrop-blur"
      >
        <Maximize2 className="w-4 h-4 mr-2" />
        Fullscreen
      </Button>

      {/* Fullscreen Modal */}
      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className="max-w-none w-screen h-screen p-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 border-0">
          {/* Fullscreen Header */}
          <div className="absolute top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-xl border-b border-gray-700/50 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Maximize2 className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Infrastructure Diagram</h2>
                  <p className="text-sm text-gray-400">
                    Fullscreen view - {nodes.length} nodes, {edges.length} connections
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setIsFullscreen(false)}
                  variant="outline"
                  size="sm"
                  className="border-gray-600/50 text-gray-300 hover:bg-gray-800/50 bg-gray-800/30 backdrop-blur"
                >
                  <Minimize2 className="w-4 h-4 mr-2" />
                  Exit Fullscreen
                </Button>
                <Button
                  onClick={() => setIsFullscreen(false)}
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white hover:bg-gray-800/50"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Fullscreen Diagram */}
          <div className="w-full h-full pt-20">
            <FlowDiagram nodes={nodes} edges={edges} onNodeClick={onNodeClick} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
