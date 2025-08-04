"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sparkles, ArrowLeft, Settings, Eye, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DemoChatInterface from "@/components/demo-chat-interface"
import DiagramState from "@/components/diagram-state"
import FlowDiagram from "@/components/flow-diagram"
import FullscreenDiagram from "@/components/fullscreen-diagram"
import { type Infra0Node, type Infra0Edge, Infra0EdgeType } from "@/types/infrastructure"
import { ChatRole } from "@/types/chat"
import type { Message } from "ai"
import demoData from "@/data/demo.json"

function DemoPage() {
  const router = useRouter()
  
  // Static demo data from demo.json
  const [messages, setMessages] = useState<Message[]>([])
  const [nodes, setNodes] = useState<Infra0Node[]>([])
  const [edges, setEdges] = useState<Infra0Edge[]>([])
  const [resources, setResources] = useState<Record<string, any>>({})
  const [selectedNode, setSelectedNode] = useState<Infra0Node | null>(null)
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  // Load demo data on component mount
  useEffect(() => {
    // Convert demo data to the expected format
    const demoMessages: Message[] = demoData.conversation.messages.map((msg) => ({
      id: msg.id,
      role: msg.role as ChatRole,
      content: msg.content,
      createdAt: new Date(msg.timestamp),
    }))

    // Set initial state with empty messages (will animate in)
    setMessages([])
    // Don't set diagram initially - let it update as messages appear
  }, [])

  // Auto-play demo messages with workflow simulation
  useEffect(() => {
    if (!isPlaying) return

    const demoMessages: Message[] = demoData.conversation.messages.map((msg) => ({
      id: msg.id,
      role: msg.role as ChatRole,
      content: msg.content,
      createdAt: new Date(msg.timestamp),
    }))

    if (currentMessageIndex < demoMessages.length) {
      const timer = setTimeout(() => {
        if (currentMessageIndex === 0) {
          // Add user message
          setMessages(prev => [...prev, demoMessages[currentMessageIndex]])
          setCurrentMessageIndex(prev => prev + 1)
        } else {
          // Add assistant message with progressive content
          const assistantMessage = demoMessages[currentMessageIndex]
          setMessages(prev => [...prev, {
            ...assistantMessage,
            content: "" // Start with empty content
          }])
          
          // Simulate progressive content building
          let contentIndex = 0
          const fullContent = assistantMessage.content
          const contentChunks = [
            "```introduction\nI'll help you design a scalable e-commerce infrastructure. Let me create a robust architecture that handles high traffic with proper load balancing, database redundancy, and security.\n\nThis architecture provides:\n- **Application Load Balancer** for distributing traffic\n- **Multiple Web Servers** for high availability\n- **Database Cluster** with primary/replica setup\n- **Security Groups** for network protection\n- **Auto Scaling** for handling traffic spikes\n```",
            "\n\n```pulumi_code\nimport * as aws from \"@pulumi/aws\";\nimport * as awsx from \"@pulumi/awsx\";\n\n// Create VPC for secure networking\nconst vpc = new awsx.ec2.Vpc(\"ecommerce-vpc\", {\n    enableDnsHostnames: true,\n    enableDnsSupport: true,\n    cidrBlock: \"10.0.0.0/16\"\n});\n\n// Security Groups\nconst albSecurityGroup = new aws.ec2.SecurityGroup(\"alb-sg\", {\n    vpcId: vpc.vpcId,\n    ingress: [{ protocol: \"tcp\", fromPort: 80, toPort: 80, cidrBlocks: [\"0.0.0.0/0\"] }],\n    egress: [{ protocol: \"-1\", fromPort: 0, toPort: 0, cidrBlocks: [\"0.0.0.0/0\"] }]\n});\n\nconst webSecurityGroup = new aws.ec2.SecurityGroup(\"web-sg\", {\n    vpcId: vpc.vpcId,\n    ingress: [{ protocol: \"tcp\", fromPort: 8080, toPort: 8080, securityGroups: [albSecurityGroup.id] }]\n});\n\nconst dbSecurityGroup = new aws.ec2.SecurityGroup(\"db-sg\", {\n    vpcId: vpc.vpcId,\n    ingress: [{ protocol: \"tcp\", fromPort: 3306, toPort: 3306, securityGroups: [webSecurityGroup.id] }]\n});\n\n// Application Load Balancer\nconst alb = new awsx.elasticloadbalancingv2.ApplicationLoadBalancer(\"ecommerce-alb\", {\n    subnetIds: vpc.publicSubnetIds,\n    securityGroups: [albSecurityGroup.id]\n});\n\n// Target Group and Listener\nconst targetGroup = new aws.lb.TargetGroup(\"web-tg\", {\n    port: 8080,\n    protocol: \"HTTP\",\n    vpcId: vpc.vpcId,\n    healthCheck: { path: \"/health\", matcher: \"200\" }\n});\n\nconst listener = new aws.lb.Listener(\"web-listener\", {\n    loadBalancerArn: alb.loadBalancer.arn,\n    port: 80,\n    defaultActions: [{ type: \"forward\", targetGroupArn: targetGroup.arn }]\n});\n\n// Launch Template for Web Servers\nconst launchTemplate = new aws.ec2.LaunchTemplate(\"web-lt\", {\n    imageId: \"ami-0abcdef1234567890\", // Amazon Linux 2\n    instanceType: \"t3.medium\",\n    vpcSecurityGroupIds: [webSecurityGroup.id],\n    userData: Buffer.from(`#!/bin/bash\nyum update -y\nyum install -y docker\nservice docker start\ndocker run -d -p 8080:8080 your-app:latest`).toString('base64')\n});\n\n// Auto Scaling Group for Web Servers\nconst autoScalingGroup = new aws.autoscaling.Group(\"web-servers\", {\n    vpcZoneIdentifiers: vpc.privateSubnetIds,\n    targetGroupArns: [targetGroup.arn],\n    healthCheckType: \"ELB\",\n    healthCheckGracePeriod: 300,\n    launchTemplate: { id: launchTemplate.id, version: \"$Latest\" },\n    minSize: 2,\n    maxSize: 10,\n    desiredCapacity: 3,\n    tags: [{ key: \"Name\", value: \"ecommerce-web-server\", propagateAtLaunch: true }]\n});\n\n// Database Subnet Group\nconst dbSubnetGroup = new aws.rds.SubnetGroup(\"db-subnet-group\", {\n    subnetIds: vpc.privateSubnetIds,\n    tags: { Name: \"ecommerce-db-subnet-group\" }\n});\n\n// RDS Database Cluster\nconst dbCluster = new aws.rds.Cluster(\"ecommerce-db\", {\n    engine: \"aurora-mysql\",\n    engineVersion: \"8.0.mysql_aurora.3.02.0\",\n    databaseName: \"ecommerce\",\n    masterUsername: \"admin\",\n    manageMasterUserPassword: true,\n    subnetGroupName: dbSubnetGroup.name,\n    vpcSecurityGroupIds: [dbSecurityGroup.id],\n    backupRetentionPeriod: 7,\n    preferredBackupWindow: \"07:00-09:00\",\n    preferredMaintenanceWindow: \"sun:08:00-sun:09:00\",\n    skipFinalSnapshot: true\n});\n\n// Database Instances\nconst dbPrimary = new aws.rds.ClusterInstance(\"db-primary\", {\n    clusterIdentifier: dbCluster.id,\n    instanceClass: \"db.r6g.large\",\n    engine: dbCluster.engine,\n    publiclyAccessible: false\n});\n\nconst dbReplica = new aws.rds.ClusterInstance(\"db-replica\", {\n    clusterIdentifier: dbCluster.id,\n    instanceClass: \"db.r6g.large\", \n    engine: dbCluster.engine,\n    publiclyAccessible: false\n});\n\n// Outputs\nexport const vpcId = vpc.vpcId;\nexport const albDnsName = alb.loadBalancer.dnsName;\nexport const dbEndpoint = dbCluster.endpoint;\n```",
            "\n\n```infra0_schema\n{\n  \"diagram\": {\n    \"nodes\": [\n      {\n        \"id\": \"internet\",\n        \"label\": \"Internet\",\n        \"type\": \"network\",\n        \"group\": \"external\"\n      },\n      {\n        \"id\": \"alb\",\n        \"label\": \"Application Load Balancer\",\n        \"type\": \"network\",\n        \"group\": \"load-balancing\"\n      },\n      {\n        \"id\": \"web-server-1\",\n        \"label\": \"Web Server 1\",\n        \"type\": \"compute\",\n        \"group\": \"application\"\n      },\n      {\n        \"id\": \"web-server-2\",\n        \"label\": \"Web Server 2\",\n        \"type\": \"compute\",\n        \"group\": \"application\"\n      },\n      {\n        \"id\": \"web-server-3\",\n        \"label\": \"Web Server 3\",\n        \"type\": \"compute\",\n        \"group\": \"application\"\n      },\n      {\n        \"id\": \"db-primary\",\n        \"label\": \"Primary Database\",\n        \"type\": \"database\",\n        \"group\": \"data\"\n      },\n      {\n        \"id\": \"db-replica\",\n        \"label\": \"Read Replica\",\n        \"type\": \"database\",\n        \"group\": \"data\"\n      },\n      {\n        \"id\": \"security-group\",\n        \"label\": \"Security Groups\",\n        \"type\": \"security\",\n        \"group\": \"security\"\n      }\n    ],\n    \"edges\": [\n      {\n        \"from\": \"internet\",\n        \"to\": \"alb\",\n        \"type\": \"connectsTo\"\n      },\n      {\n        \"from\": \"alb\",\n        \"to\": \"web-server-1\",\n        \"type\": \"connectsTo\"\n      },\n      {\n        \"from\": \"alb\",\n        \"to\": \"web-server-2\",\n        \"type\": \"connectsTo\"\n      },\n      {\n        \"from\": \"alb\",\n        \"to\": \"web-server-3\",\n        \"type\": \"connectsTo\"\n      },\n      {\n        \"from\": \"web-server-1\",\n        \"to\": \"db-primary\",\n        \"type\": \"connectsTo\"\n      },\n      {\n        \"from\": \"web-server-2\",\n        \"to\": \"db-primary\",\n        \"type\": \"connectsTo\"\n      },\n      {\n        \"from\": \"web-server-3\",\n        \"to\": \"db-primary\",\n        \"type\": \"connectsTo\"\n      },\n      {\n        \"from\": \"db-primary\",\n        \"to\": \"db-replica\",\n        \"type\": \"connectsTo\"\n      },\n      {\n        \"from\": \"security-group\",\n        \"to\": \"alb\",\n        \"type\": \"connectsTo\"\n      },\n      {\n        \"from\": \"security-group\",\n        \"to\": \"web-server-1\",\n        \"type\": \"connectsTo\"\n      },\n      {\n        \"from\": \"security-group\",\n        \"to\": \"web-server-2\",\n        \"type\": \"connectsTo\"\n      },\n      {\n        \"from\": \"security-group\",\n        \"to\": \"web-server-3\",\n        \"type\": \"connectsTo\"\n      },\n      {\n        \"from\": \"security-group\",\n        \"to\": \"db-primary\",\n        \"type\": \"connectsTo\"\n      }\n    ]\n  },\n  \"resources\": {\n    \"ecommerce-vpc\": {\n      \"type\": \"aws:ec2:Vpc\",\n      \"config\": {\n        \"cidrBlock\": \"10.0.0.0/16\",\n        \"enableDnsHostnames\": true,\n        \"enableDnsSupport\": true\n      }\n    },\n    \"ecommerce-alb\": {\n      \"type\": \"aws:elbv2:ApplicationLoadBalancer\",\n      \"config\": {\n        \"loadBalancerType\": \"application\",\n        \"scheme\": \"internet-facing\"\n      },\n      \"dependsOn\": [\"ecommerce-vpc\"]\n    },\n    \"web-servers\": {\n      \"type\": \"aws:autoscaling:Group\",\n      \"config\": {\n        \"minSize\": 2,\n        \"maxSize\": 10,\n        \"desiredCapacity\": 3,\n        \"healthCheckType\": \"ELB\"\n      },\n      \"dependsOn\": [\"ecommerce-alb\"]\n    },\n    \"ecommerce-db\": {\n      \"type\": \"aws:rds:Cluster\",\n      \"config\": {\n        \"engine\": \"aurora-mysql\",\n        \"engineVersion\": \"8.0.mysql_aurora.3.02.0\",\n        \"databaseName\": \"ecommerce\",\n        \"backupRetentionPeriod\": 7\n      },\n      \"dependsOn\": [\"ecommerce-vpc\"]\n    }\n  }\n}\n```",
            "\n\n```conclusion\nYour scalable e-commerce infrastructure is now ready! 🚀\n\n## What I've Created:\n\n**✅ High-Availability Architecture**\n- Application Load Balancer distributing traffic across multiple availability zones\n- Auto Scaling Group with 2-10 web servers based on demand\n- Aurora MySQL cluster with primary and read replica for database redundancy\n\n**✅ Security & Networking**\n- VPC with public and private subnets for proper network isolation\n- Security groups with least-privilege access (ALB → Web → Database)\n- Private database subnets with no internet access\n\n**✅ Scalability Features**\n- Auto scaling based on CPU and memory metrics\n- Read replicas for database load distribution\n- Load balancer health checks ensure only healthy instances receive traffic\n\n**✅ Production Ready**\n- Automated backup retention (7 days)\n- Maintenance windows during low-traffic periods\n- Infrastructure as Code with Pulumi for easy deployment and updates\n\nThis infrastructure can handle significant traffic spikes and provides the foundation for a robust e-commerce platform. The auto-scaling ensures cost efficiency during low traffic while maintaining performance during peak periods.\n```"
          ]
          
          const progressiveTimer = setInterval(() => {
            if (contentIndex < contentChunks.length) {
              setMessages(prev => {
                const newMessages = [...prev]
                const lastMessage = newMessages[newMessages.length - 1]
                if (lastMessage && lastMessage.role === ChatRole.ASSISTANT) {
                  lastMessage.content = contentChunks.slice(0, contentIndex + 1).join('')
                }
                return newMessages
              })
              contentIndex++
            } else {
              clearInterval(progressiveTimer)
              setCurrentMessageIndex(prev => prev + 1)
              setIsPlaying(false)
            }
          }, 2000) // Add new section every 2 seconds
          
          return () => clearInterval(progressiveTimer)
        }
      }, currentMessageIndex === 0 ? 1000 : 1000) // First message after 1s, subsequent after 1s

      return () => clearTimeout(timer)
    } else {
      setIsPlaying(false)
    }
  }, [isPlaying, currentMessageIndex])

  const handleStartDemo = () => {
    setMessages([])
    setCurrentMessageIndex(0)
    setIsPlaying(true)
  }

  const handleNodeClick = (node: Infra0Node) => {
    setSelectedNode(selectedNode?.id === node.id ? null : node)
  }

  const handleNodeUpdate = (nodeId: string, updatedNode: Infra0Node) => {
    setNodes((prevNodes) => prevNodes.map((node) => (node.id === nodeId ? updatedNode : node)))
  }



  return (
    <div className="h-screen bg-[#0a0a0a] text-white flex flex-col overflow-hidden">
      {/* Header */}
      <div className="border-b border-white/[0.08] px-8 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
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
              <h1 className="text-lg font-semibold text-white/95">Infrastructure Demo</h1>
              <p className="text-sm text-white/50 mt-0.5">Interactive demo showcasing AI-powered infrastructure design</p>
            </div>
          </div>
                     <Button
             onClick={handleStartDemo}
             disabled={isPlaying}
             className={`bg-blue-600 hover:bg-blue-700 text-white ${!isPlaying ? 'demo-pulse' : ''}`}
           >
             <Play className="w-4 h-4 mr-2" />
             {isPlaying ? "Playing..." : "Start Demo"}
           </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Chat Interface */}
        <div className="w-1/2 border-r border-white/[0.08] flex flex-col bg-[#0a0a0a]">
          <div className="flex-1 p-6">
            <DemoChatInterface 
              messages={messages} 
              isGenerating={isPlaying}
              onDiagramUpdate={(infra0) => {
                setNodes(infra0.diagram.nodes)
                setEdges(infra0.diagram.edges)
                setResources(infra0.resources || {})
              }}
            />
          </div>
          
          {/* Demo Info Panel */}
          <div className="p-6 border-t border-white/[0.08] bg-white/[0.02]">
            <div className="text-sm text-white/70">
              <h3 className="font-semibold text-white/90 mb-2">Demo Information</h3>
              <p className="mb-2">
                This demo showcases how our AI assistant designs scalable infrastructure.
              </p>
              <ul className="space-y-1 text-xs text-white/60">
                <li>• Predefined conversation about e-commerce infrastructure</li>
                <li>• Interactive diagram with arrows showing data flow</li>
                <li>• Realistic Pulumi code generation</li>
                <li>• Component relationships and dependencies</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Panel - Infrastructure Diagram */}
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
                  Interactive flow diagram showing e-commerce infrastructure with load balancing and database cluster
                </p>
              </div>
              <FullscreenDiagram
                nodes={nodes}
                edges={edges}
                onNodeClick={handleNodeClick}
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
                <div className="demo-diagram">
                  <FlowDiagram
                    nodes={nodes}
                    edges={edges}
                    onNodeClick={handleNodeClick}
                  />
                </div>
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
    </div>
  )
}

export default DemoPage 