"use client"

import { useState, useEffect } from "react"
import { CheckCircle, Circle, Loader2, Zap } from "lucide-react"

interface WorkflowStep {
  id: string
  title: string
  status: "pending" | "active" | "completed"
}

interface CompactWorkflowProps {
  prompt: string
}

export default function CompactWorkflow({ prompt }: CompactWorkflowProps) {
  const [steps, setSteps] = useState<WorkflowStep[]>([
    { id: "analyze", title: "Analyzing", status: "pending" },
    { id: "vpc", title: "VPC Setup", status: "pending" },
    { id: "subnets", title: "Subnets", status: "pending" },
    { id: "database", title: "Database", status: "pending" },
    { id: "compute", title: "Compute", status: "pending" },
    { id: "finalize", title: "Finalizing", status: "pending" },
  ])

  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    if (isComplete) return

    const interval = setInterval(() => {
      setSteps((prevSteps) => {
        const newSteps = [...prevSteps]

        // Mark previous steps as completed
        for (let i = 0; i < currentStepIndex; i++) {
          newSteps[i].status = "completed"
        }

        // Mark current step as active
        if (currentStepIndex < newSteps.length) {
          newSteps[currentStepIndex].status = "active"
        }

        return newSteps
      })

      if (currentStepIndex < steps.length - 1) {
        setCurrentStepIndex((prev) => prev + 1)
      } else {
        // Complete the workflow
        setTimeout(() => {
          setSteps((prevSteps) => prevSteps.map((step) => ({ ...step, status: "completed" })))
          setIsComplete(true)
        }, 1000)
        clearInterval(interval)
      }
    }, 800)

    return () => clearInterval(interval)
  }, [currentStepIndex, steps.length, isComplete])

  if (isComplete) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-green-400">
          <CheckCircle className="w-4 h-4" />
          <span className="text-sm font-medium">Infrastructure Created Successfully!</span>
        </div>
        <div className="text-sm text-white/80 leading-relaxed">
          I've successfully created your infrastructure with VPC, subnets, database, and compute resources. You can now
          see the diagram on the right and configure individual components by clicking on them.
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {steps.map((step) => (
            <div
              key={step.id}
              className="flex items-center gap-1 text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded-md"
            >
              <CheckCircle className="w-3 h-3" />
              {step.title}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-white/90">
        <Zap className="w-4 h-4" />
        <span className="text-sm font-medium">Building Infrastructure...</span>
      </div>

      <div className="text-sm text-white/60 mb-3">
        Creating infrastructure based on: <span className="text-white/80">"{prompt}"</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`flex items-center gap-1 text-xs px-2 py-1 rounded-md transition-all ${
              step.status === "completed"
                ? "text-green-400 bg-green-400/10"
                : step.status === "active"
                  ? "text-white bg-white/10"
                  : "text-white/40 bg-white/5"
            }`}
          >
            {step.status === "completed" ? (
              <CheckCircle className="w-3 h-3" />
            ) : step.status === "active" ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Circle className="w-3 h-3" />
            )}
            {step.title}
          </div>
        ))}
      </div>

      {!isComplete && (
        <div className="flex items-center gap-2 text-xs text-white/40 mt-2">
          <div className="w-1 h-1 bg-white rounded-full animate-bounce" />
          <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
          <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
          <span className="ml-1">This may take a moment...</span>
        </div>
      )}
    </div>
  )
}
