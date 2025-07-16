"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit2, Check, X, Settings } from "lucide-react"
import type { Infra0Node, Infra0Edge } from "../types/infrastructure"

interface DiagramStateProps {
  nodes: Infra0Node[]
  edges: Infra0Edge[]
  onNodeUpdate: (nodeId: string, updatedNode: Infra0Node) => void
  onNodeClick: (node: Infra0Node) => void
}

const getTypeColor = (type: string) => {
  switch (type) {
    case "network":
      return "text-blue-400"
    case "compute":
      return "text-orange-400"
    case "database":
      return "text-purple-400"
    case "storage":
      return "text-green-400"
    case "security":
      return "text-red-400"
    default:
      return "text-gray-400"
  }
}

const nodeTypes = ["network", "compute", "database", "storage", "security"] as const

export default function DiagramState({ nodes, edges, onNodeUpdate, onNodeClick }: DiagramStateProps) {
  const [editingNode, setEditingNode] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Infra0Node | null>(null)

  const handleEditStart = (node: Infra0Node, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingNode(node.id)
    setEditForm({ ...node })
  }

  const handleEditSave = () => {
    if (editForm && editingNode) {
      onNodeUpdate(editingNode, editForm)
      setEditingNode(null)
      setEditForm(null)
    }
  }

  const handleEditCancel = () => {
    setEditingNode(null)
    setEditForm(null)
  }

  const handleNodeClick = (node: Infra0Node) => {
    if (editingNode !== node.id) {
      onNodeClick(node)
    }
  }

  return (
    <div className="h-full bg-gray-900/30 border border-gray-700 rounded-lg flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-sm font-medium text-gray-200">Diagram State</h3>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Nodes Section */}
        <div className="p-4 border-b border-gray-700">
          <div className="text-xs text-gray-400 mb-3">Nodes ({nodes.length})</div>
          <div className="max-h-48 overflow-y-auto space-y-1 pr-2">
            {nodes.map((node) => (
              <div key={node.id} className="bg-gray-800/50 rounded">
                {editingNode === node.id ? (
                  <div className="p-2 space-y-2">
                    <div className="flex items-center gap-2">
                      <Input
                        value={editForm?.id || ""}
                        onChange={(e) => setEditForm((prev) => (prev ? { ...prev, id: e.target.value } : null))}
                        className="h-6 text-xs bg-gray-700 border-gray-600"
                        placeholder="Node ID"
                      />
                      <span className="text-gray-500 text-xs">→</span>
                      <Input
                        value={editForm?.label || ""}
                        onChange={(e) => setEditForm((prev) => (prev ? { ...prev, label: e.target.value } : null))}
                        className="h-6 text-xs bg-gray-700 border-gray-600"
                        placeholder="Label"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Select
                        value={editForm?.type || "network"}
                        onValueChange={(value) =>
                          setEditForm((prev) => (prev ? { ...prev, type: value as any } : null))
                        }
                      >
                        <SelectTrigger className="h-6 text-xs bg-gray-700 border-gray-600">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {nodeTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          onClick={handleEditSave}
                          className="h-6 w-6 p-0 bg-green-600 hover:bg-green-700"
                        >
                          <Check className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={handleEditCancel}
                          className="h-6 w-6 p-0 bg-red-600 hover:bg-red-700"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    className="flex items-center justify-between py-2 px-2 text-xs group cursor-pointer hover:bg-gray-700/50 transition-colors"
                    onClick={() => handleNodeClick(node)}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <Settings className="w-3 h-3 text-gray-500" />
                      <span className="text-gray-300 font-mono truncate">{node.id}</span>
                      <span className="text-gray-500">→</span>
                      <span className="text-gray-200 truncate">{node.label}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`px-2 py-0.5 rounded text-xs ${getTypeColor(node.type)}`}>({node.type})</span>
                      <Button
                        size="sm"
                        onClick={(e) => handleEditStart(node, e)}
                        className="h-5 w-5 p-0 bg-transparent hover:bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Edit2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Edges Section */}
        <div className="flex-1 p-4 overflow-hidden">
          <div className="text-xs text-gray-400 mb-3">Edges ({edges.length})</div>
          <div className="h-full overflow-y-auto space-y-1 pr-2">
            {edges.map((edge, index) => (
              <div key={index} className="flex items-center py-2 px-2 bg-gray-800/50 rounded text-xs">
                <span className="text-gray-300 font-mono truncate">{edge.from}</span>
                <span className="text-gray-500 mx-2 flex-shrink-0">→</span>
                <span className="text-gray-300 font-mono truncate">{edge.to}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
