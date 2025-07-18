"use client"

import { useState, useEffect } from "react"
import { CheckCircle, Circle, Loader2 } from "lucide-react"

interface WorkflowStep {
  id: string
  title: string
  description: string
  status: "pending" | "active" | "completed"
}

interface StreamingWorkflowProps {
  prompt: string
}

export default function StreamingWorkflow({ prompt }: StreamingWorkflowProps) {
  const [steps, setSteps] = useState<WorkflowStep[]>([
    {
      id: "analyze",
      title: "Analyzing Requirements",
      description: "Understanding your infrastructure needs",
      status: "pending",
    },
    {
      id: "vpc",
      title: "Creating VPC",
      description: "Setting up Virtual Private Cloud",
      status: "pending",
    },
    {
      id: "subnets",
      title: "Configuring Subnets",
      description: "Creating public and private subnets",
      status: "pending",
    },
    {
      id: "database",
      title: "Setting up Database",
      description: "Configuring RDS PostgreSQL instance",
      status: "pending",
    },
    {
      id: "compute",
      title: "Creating Compute Resources",
      description: "Setting up ECS cluster and services",
      status: "pending",
    },
    {
      id: "networking",
      title: "Configuring Networking",
      description: "Setting up load balancer and gateways",
      status: "pending",
    },
    {
      id: "finalize",
      title: "Finalizing Infrastructure",
      description: "Generating Pulumi code and diagram",
      status: "pending",
    },
  ])

  useEffect(() => {
    let currentStep = 0
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setSteps((prevSteps) =>
          prevSteps.map((step, index) => {
            if (index < currentStep) {
              return { ...step, status: "completed" }
            } else if (index === currentStep) {
              return { ...step, status: "active" }
            }
            return step
          }),
        )
        currentStep++
      } else {
        clearInterval(interval)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [steps.length])

  return (
    <div className="max-w-2xl w-full">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
          <Loader2 className="w-8 h-8 text-black animate-spin" />
        </div>
        <h2 className="text-2xl font-semibold text-white/95 mb-2">Creating Your Infrastructure</h2>
        <p className="text-white/60 max-w-lg mx-auto">
          Building infrastructure based on: <span className="text-white/80">"{prompt}"</span>
        </p>
      </div>

      <div className="space-y-3">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.08]"
          >
            <div className="flex-shrink-0">
              {step.status === "completed" ? (
                <CheckCircle className="w-5 h-5 text-green-400" />
              ) : step.status === "active" ? (
                <Loader2 className="w-5 h-5 text-white animate-spin" />
              ) : (
                <Circle className="w-5 h-5 text-white/30" />
              )}
            </div>
            <div className="flex-1">
              <h3
                className={`font-medium text-sm ${
                  step.status === "completed"
                    ? "text-green-400"
                    : step.status === "active"
                      ? "text-white/95"
                      : "text-white/50"
                }`}
              >
                {step.title}
              </h3>
              <p className="text-sm text-white/40 mt-0.5">{step.description}</p>
            </div>
            {step.status === "active" && (
              <div className="flex gap-1">
                <div className="w-1 h-1 bg-white rounded-full animate-bounce" />
                <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <div className="inline-flex items-center gap-2 text-sm text-white/50 bg-white/[0.02] px-4 py-2 rounded-full border border-white/[0.08]">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          This may take a few moments...
        </div>
      </div>
    </div>
  )
}
