"use client"

import { useState, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sparkles, ArrowLeft, Settings, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ChatInterface from "@/components/chat-interface"
import DiagramState from "@/components/diagram-state"
import FlowDiagram from "@/components/flow-diagram"
import FullscreenDiagram from "@/components/fullscreen-diagram"
import PulumiConfigModal from "@/components/pulumi-config-modal"
import { type Infra0Node, type Infra0Edge, Infra0EdgeType } from "@/types/infrastructure"
import type { ChatMessage, ChatSession } from "@/types/chat"
import { generateId } from "@/lib/utils"

// Sample infrastructure state
const sampleNodes: Infra0Node[] = [
  { id: "vpc", label: "VPC", type: "network" },
  { id: "public-subnet", label: "Public Subnet", type: "network" },
  { id: "private-subnet", label: "Private Subnet", type: "network" },
  { id: "rds", label: "RDS Database", type: "database" },
  { id: "ecs", label: "ECS Cluster", type: "compute" },
  { id: "nat-gateway", label: "NAT Gateway", type: "network" },
  { id: "load-balancer", label: "Load Balancer", type: "network" },
  { id: "internet-gateway", label: "Internet Gateway", type: "network" },
]

const sampleEdges: Infra0Edge[] = [
  { from: "vpc", to: "public-subnet", type: Infra0EdgeType.ConnectsTo },
  { from: "vpc", to: "private-subnet", type: Infra0EdgeType.ConnectsTo },
  { from: "private-subnet", to: "rds", type: Infra0EdgeType.ConnectsTo },
  { from: "private-subnet", to: "ecs", type: Infra0EdgeType.ConnectsTo },
  { from: "public-subnet", to: "nat-gateway", type: Infra0EdgeType.ConnectsTo },
  { from: "ecs", to: "load-balancer", type: Infra0EdgeType.ConnectsTo },
  { from: "load-balancer", to: "internet-gateway", type: Infra0EdgeType.ConnectsTo },
]

// Sample sessions (in a real app, this would come from a database or API)
const sampleSessions: ChatSession[] = [
  {
    id: "session-1",
    title: "AWS VPC with ECS and RDS",
    messages: [
      {
        id: "msg-1",
        type: "user",
        content: "Create an AWS VPC with public and private subnets, an RDS database, and an ECS cluster",
        timestamp: new Date(Date.now() - 86400000),
      },
      {
        id: "msg-2",
        type: "assistant",
        content: "I've created an infrastructure with VPC, public/private subnets, RDS, and ECS cluster.",
        timestamp: new Date(Date.now() - 86300000),
      },
    ],
    nodes: sampleNodes,
    edges: sampleEdges,
    createdAt: new Date(Date.now() - 86400000),
    updatedAt: new Date(Date.now() - 86300000),
  },
]

export default function ProjectPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const projectId = params.id

  const [nodes, setNodes] = useState<Infra0Node[]>(sampleNodes)
  const [edges, setEdges] = useState<Infra0Edge[]>(sampleEdges)
  const [selectedNode, setSelectedNode] = useState<Infra0Node | null>(null)
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false)
  const [nodeConfigs, setNodeConfigs] = useState<Record<string, Record<string, any>>>({})
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [projectTitle, setProjectTitle] = useState("Loading project...")

  // Load project data
  useEffect(() => {
    // In a real app, this would be an API call
    const project = sampleSessions.find((s) => s.id === projectId)
    if (project) {
      setNodes(project.nodes.length > 0 ? project.nodes : sampleNodes)
      setEdges(project.edges.length > 0 ? project.edges : sampleEdges)
      setMessages(project.messages)
      setProjectTitle(project.title)
    }
  }, [projectId])

  // Simulate streaming response with workflow
  const simulateStreamingResponse = useCallback((prompt: string) => {
    // Add streaming message immediately
    const streamingMessage: ChatMessage = {
      id: generateId(),
      type: "assistant",
      content: prompt,
      timestamp: new Date(),
      isStreaming: true,
    }

    setMessages((prev) => [...prev, streamingMessage])

    // Complete after workflow finishes
    setTimeout(() => {
      setMessages((prev) => {
        const newMessages = [...prev]
        const lastMessage = newMessages[newMessages.length - 1]
        if (lastMessage && lastMessage.isStreaming) {
          lastMessage.isStreaming = false
          lastMessage.content =
            "Infrastructure has been updated successfully! You can see the changes in the diagram and configure individual components."
        }
        return newMessages
      })
      setIsGenerating(false)
    }, 6000)
  }, [])

  const handleSendMessage = useCallback(
    (content: string) => {
      const userMessage: ChatMessage = {
        id: generateId(),
        type: "user",
        content,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, userMessage])
      setIsGenerating(true)

      // Simulate API call with streaming
      setTimeout(() => {
        simulateStreamingResponse(content)
      }, 500)
    },
    [simulateStreamingResponse],
  )

  const handleNodeUpdate = (nodeId: string, updatedNode: Infra0Node) => {
    setNodes((prevNodes) => prevNodes.map((node) => (node.id === nodeId ? updatedNode : node)))

    if (nodeId !== updatedNode.id) {
      setEdges((prevEdges) =>
        prevEdges.map((edge) => ({
          ...edge,
          from: edge.from === nodeId ? updatedNode.id : edge.from,
          to: edge.to === nodeId ? updatedNode.id : edge.to,
        })),
      )
    }
  }

  const handleNodeClick = (node: Infra0Node) => {
    setSelectedNode(node)
    setIsConfigModalOpen(true)
  }

  const handleConfigSave = (nodeId: string, config: Record<string, any>) => {
    setNodeConfigs((prev) => ({
      ...prev,
      [nodeId]: config,
    }))
  }

  const handleCloseConfigModal = () => {
    setIsConfigModalOpen(false)
    setSelectedNode(null)
  }

  const handleNodesChange = (updatedNodes: Infra0Node[]) => {
    setNodes(updatedNodes)
  }

  return (
    <div className="h-screen bg-[#0a0a0a] text-white flex flex-col overflow-hidden">
      {/* Header */}
      <div className="border-b border-white/[0.08] bg-[#0a0a0a] px-8 py-5 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => router.push("/")}
              variant="ghost"
              className="text-white/60 hover:text-white/90 hover:bg-white/[0.04] -ml-2"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-black" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white/95">{projectTitle}</h1>
              <p className="text-sm text-white/50 mt-0.5">Project ID: {projectId}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Full Height Chat */}
        <div className="w-1/2 border-r border-white/[0.08] flex flex-col bg-[#0a0a0a]">
          <div className="flex-1 p-6">
            <ChatInterface messages={messages} onSendMessage={handleSendMessage} isGenerating={isGenerating} />
          </div>
        </div>

        {/* Right Panel - Infrastructure Diagram with Tabs */}
        <div className="w-1/2 flex flex-col bg-[#0a0a0a]">
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
                  Interactive flow diagram - drag nodes to reposition, click to configure
                </p>
              </div>
              <FullscreenDiagram
                nodes={nodes}
                edges={edges}
                onNodeClick={handleNodeClick}
                onNodesChange={handleNodesChange}
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
                  onNodeClick={handleNodeClick}
                  onNodesChange={handleNodesChange}
                />
              </TabsContent>
              <TabsContent value="state" className="flex-1 p-6 mt-0">
                <DiagramState
                  nodes={nodes}
                  edges={edges}
                  onNodeUpdate={handleNodeUpdate}
                  onNodeClick={handleNodeClick}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Pulumi Config Modal */}
      <PulumiConfigModal
        node={selectedNode}
        isOpen={isConfigModalOpen}
        onClose={handleCloseConfigModal}
        onSave={handleConfigSave}
      />
    </div>
  )
}
