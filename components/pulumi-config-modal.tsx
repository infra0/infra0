"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Save, X, Code, Settings, Copy, Sparkles } from "lucide-react"
import type { Infra0Node } from "../types/infrastructure"

interface PulumiConfigModalProps {
  node: Infra0Node | null
  isOpen: boolean
  onClose: () => void
  onSave: (nodeId: string, config: Record<string, any>) => void
}

// Sample Pulumi configurations for different node types
const getSampleConfig = (nodeType: string, nodeId: string): Record<string, any> => {
  switch (nodeType) {
    case "network":
      if (nodeId.includes("vpc")) {
        return {
          cidrBlock: "10.0.0.0/16",
          enableDnsHostnames: true,
          enableDnsSupport: true,
          tags: {
            Name: "main-vpc",
            Environment: "production",
            ManagedBy: "pulumi",
          },
        }
      } else if (nodeId.includes("subnet")) {
        return {
          cidrBlock: nodeId.includes("public") ? "10.0.1.0/24" : "10.0.2.0/24",
          availabilityZone: "us-east-1a",
          mapPublicIpOnLaunch: nodeId.includes("public"),
          tags: {
            Name: nodeId.includes("public") ? "public-subnet" : "private-subnet",
            Type: nodeId.includes("public") ? "Public" : "Private",
            Environment: "production",
          },
        }
      } else if (nodeId.includes("gateway")) {
        return {
          tags: {
            Name: `${nodeId}-gateway`,
            Environment: "production",
          },
        }
      } else if (nodeId.includes("load-balancer")) {
        return {
          loadBalancerType: "application",
          scheme: "internet-facing",
          securityGroups: ["sg-12345678"],
          subnets: ["subnet-12345678", "subnet-87654321"],
          enableDeletionProtection: false,
          tags: {
            Name: "main-alb",
            Environment: "production",
          },
        }
      }
      break
    case "compute":
      if (nodeId.includes("ecs")) {
        return {
          name: "main-cluster",
          capacityProviders: ["FARGATE", "FARGATE_SPOT"],
          defaultCapacityProviderStrategy: [
            {
              capacityProvider: "FARGATE",
              weight: 1,
              base: 0,
            },
          ],
          settings: [
            {
              name: "containerInsights",
              value: "enabled",
            },
          ],
          configuration: {
            executeCommandConfiguration: {
              logging: "DEFAULT",
            },
          },
          tags: {
            Name: "ecs-cluster",
            Environment: "production",
          },
        }
      }
      break
    case "database":
      if (nodeId.includes("rds")) {
        return {
          allocatedStorage: 20,
          maxAllocatedStorage: 100,
          storageType: "gp3",
          storageEncrypted: true,
          engine: "postgres",
          engineVersion: "15.4",
          instanceClass: "db.t3.micro",
          dbName: "myapp",
          username: "admin",
          passwordSecretArn: "arn:aws:secretsmanager:us-east-1:123456789012:secret:rds-password",
          vpcSecurityGroupIds: ["sg-12345678"],
          dbSubnetGroupName: "main-db-subnet-group",
          backupRetentionPeriod: 7,
          backupWindow: "03:00-04:00",
          maintenanceWindow: "sun:04:00-sun:05:00",
          multiAz: false,
          publiclyAccessible: false,
          monitoringInterval: 60,
          performanceInsightsEnabled: true,
          tags: {
            Name: "main-database",
            Environment: "production",
          },
        }
      }
      break
    case "storage":
      return {
        bucket: `${nodeId}-bucket-${Date.now()}`,
        acl: "private",
        versioning: {
          enabled: true,
        },
        serverSideEncryptionConfiguration: {
          rule: {
            applyServerSideEncryptionByDefault: {
              sseAlgorithm: "AES256",
            },
          },
        },
        publicAccessBlock: {
          blockPublicAcls: true,
          blockPublicPolicy: true,
          ignorePublicAcls: true,
          restrictPublicBuckets: true,
        },
        tags: {
          Name: `${nodeId}-storage`,
          Environment: "production",
        },
      }
    default:
      return {
        tags: {
          Name: nodeId,
          Environment: "production",
        },
      }
  }
  return {}
}

export default function PulumiConfigModal({ node, isOpen, onClose, onSave }: PulumiConfigModalProps) {
  const [config, setConfig] = useState<string>("")
  const [isValid, setIsValid] = useState(true)
  const [error, setError] = useState<string>("")
  const [lineCount, setLineCount] = useState(1)

  useEffect(() => {
    if (node) {
      const sampleConfig = getSampleConfig(node.type, node.id)
      const formattedConfig = JSON.stringify(sampleConfig, null, 2)
      setConfig(formattedConfig)
      setLineCount(formattedConfig.split("\n").length)
      setIsValid(true)
      setError("")
    }
  }, [node])

  const handleConfigChange = (value: string) => {
    setConfig(value)
    setLineCount(value.split("\n").length)
    try {
      JSON.parse(value)
      setIsValid(true)
      setError("")
    } catch (err) {
      setIsValid(false)
      setError("Invalid JSON syntax")
    }
  }

  const handleSave = () => {
    if (!node || !isValid) return

    try {
      const parsedConfig = JSON.parse(config)
      onSave(node.id, parsedConfig)
      onClose()
    } catch (err) {
      setError("Failed to save configuration")
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(config)
  }

  const getNodeTypeColor = (type: string) => {
    switch (type) {
      case "network":
        return "from-blue-500 to-blue-600"
      case "compute":
        return "from-orange-500 to-orange-600"
      case "database":
        return "from-purple-500 to-purple-600"
      case "storage":
        return "from-green-500 to-green-600"
      case "security":
        return "from-red-500 to-red-600"
      default:
        return "from-gray-500 to-gray-600"
    }
  }

  const getNodeTypeIcon = (type: string) => {
    switch (type) {
      case "network":
        return "🌐"
      case "compute":
        return "⚡"
      case "database":
        return "🗄️"
      case "storage":
        return "💾"
      case "security":
        return "🔒"
      default:
        return "⚙️"
    }
  }

  if (!node) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 text-white shadow-2xl">
        <DialogHeader className="border-b border-gray-700/50 pb-6">
          <DialogTitle className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getNodeTypeColor(node.type)} flex items-center justify-center text-2xl shadow-lg`}
              >
                {getNodeTypeIcon(node.type)}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xl font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    Pulumi Configuration
                  </span>
                  <Sparkles className="w-5 h-5 text-yellow-400" />
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-gray-300 border-gray-600 bg-gray-800/50 backdrop-blur">
                    {node.id}
                  </Badge>
                  <Badge className={`bg-gradient-to-r ${getNodeTypeColor(node.type)} text-white border-0 shadow-lg`}>
                    {node.type}
                  </Badge>
                </div>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-100 mb-1">{node.label}</h3>
              <p className="text-sm text-gray-400">
                Configure the Pulumi resource properties for this infrastructure component
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={handleCopy}
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-gray-800/50 backdrop-blur"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Code className="w-4 h-4" />
                <span>JSON Configuration</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Resource Configuration
              </label>
              <div className="flex items-center gap-4">
                {!isValid && (
                  <span className="text-sm text-red-400 flex items-center gap-1">
                    <X className="w-3 h-3" />
                    {error}
                  </span>
                )}
                <span className="text-xs text-gray-500">{lineCount} lines</span>
              </div>
            </div>

            <div className="relative">
              <div className="absolute left-0 top-0 bottom-0 w-12 bg-gray-800/50 backdrop-blur border-r border-gray-700/50 flex flex-col text-xs text-gray-500 pt-3 font-mono">
                {Array.from({ length: lineCount }, (_, i) => (
                  <div key={i + 1} className="h-6 flex items-center justify-center">
                    {i + 1}
                  </div>
                ))}
              </div>
              <Textarea
                value={config}
                onChange={(e) => handleConfigChange(e.target.value)}
                className={`w-full h-96 pl-16 bg-gray-900/50 backdrop-blur border-gray-600/50 text-white font-mono text-sm resize-none leading-6 ${
                  !isValid ? "border-red-500/50" : "focus:border-blue-500/50"
                } shadow-inner`}
                placeholder="Enter Pulumi configuration as JSON..."
                style={{
                  background: "linear-gradient(135deg, rgba(17, 24, 39, 0.8) 0%, rgba(31, 41, 55, 0.6) 100%)",
                }}
              />
              <div className="absolute bottom-3 right-3 text-xs text-gray-500 bg-gray-800/80 backdrop-blur px-2 py-1 rounded">
                {isValid ? "✓ Valid JSON" : "✗ Invalid JSON"}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-gray-700/50">
            <div className="text-xs text-gray-400 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              This configuration will be used to generate the Pulumi resource definition
            </div>
            <div className="flex gap-3">
              <Button
                onClick={onClose}
                variant="outline"
                className="border-gray-600/50 text-gray-300 hover:bg-gray-800/50 bg-gray-800/30 backdrop-blur"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={!isValid}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white disabled:opacity-50 shadow-lg disabled:shadow-none transition-all duration-200"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Configuration
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
