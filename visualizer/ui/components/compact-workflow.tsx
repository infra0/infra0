"use client";

import { useState, useEffect, useMemo } from "react";
import { CheckCircle, Circle, Loader2, Zap } from "lucide-react";
import {
  InfrastructureResponseParser,
  ResponseSection,
} from "@/lib/response-parser";
import { Message } from "ai";

interface WorkflowStep {
  id: string;
  title: string;
  status: "pending" | "active" | "completed";
}

interface CompactWorkflowProps {
  message: Message;
  isWorking: boolean;
}

enum WorkflowStepStatus {
  PENDING = "pending",
  ACTIVE = "active",
  COMPLETED = "completed",
}

export default function CompactWorkflow({
  message,
}: CompactWorkflowProps) {
  const parsedState = useMemo(
    () => InfrastructureResponseParser.parseStreamingResponse(message.content),
    [message.content]
  );

  const { sections, activeSection } = parsedState;


  const steps = useMemo(() => {
    return [
      {
        id: "gathering_data",
        title: "Gathering Data",
        status:
          activeSection === ResponseSection.INTRO
            ? WorkflowStepStatus.ACTIVE
            : sections.intro
            ? WorkflowStepStatus.COMPLETED
            : WorkflowStepStatus.PENDING,
      },
      {
        id: "generating_code",
        title: "Generating Code",
        status:
          activeSection === ResponseSection.PULUMI_CODE
            ? WorkflowStepStatus.ACTIVE
            : sections.pulumiCode
            ? WorkflowStepStatus.COMPLETED
            : sections.intro
            ? WorkflowStepStatus.PENDING
            : WorkflowStepStatus.PENDING,
      },
      {
        id: "generating_diagram",
        title: "Generating Diagram",
        status:
          activeSection === ResponseSection.INFRA0_SCHEMA
            ? WorkflowStepStatus.ACTIVE
            : sections.infra0Schema
            ? WorkflowStepStatus.COMPLETED
            : sections.pulumiCode
            ? WorkflowStepStatus.PENDING
            : WorkflowStepStatus.PENDING,
      },
      {
        id: "finalizing",
        title: "Finalizing",
        status:
          activeSection === ResponseSection.OUTRO
            ? WorkflowStepStatus.ACTIVE
            : sections.outro
            ? WorkflowStepStatus.COMPLETED
            : sections.infra0Schema
            ? WorkflowStepStatus.PENDING
            : WorkflowStepStatus.PENDING,
      },
    ];
  }, [
    activeSection,
    sections.intro,
    sections.pulumiCode,
    sections.infra0Schema,
    sections.outro,
  ]);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-white/90">
        <Zap className="w-4 h-4" />
        <span className="text-sm font-medium">Building Infrastructure...</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`flex items-center gap-1 text-xs px-2 py-1 rounded-md transition-all ${
              step.status === WorkflowStepStatus.COMPLETED
                ? "text-green-400 bg-green-400/10"
                : step.status === WorkflowStepStatus.ACTIVE
                ? "text-white bg-white/10"
                : "text-white/40 bg-white/5"
            }`}
          >
            {step.status === WorkflowStepStatus.COMPLETED ? (
              <CheckCircle className="w-3 h-3" />
            ) : step.status === WorkflowStepStatus.ACTIVE ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Circle className="w-3 h-3" />
            )}
            {step.title}
          </div>
        ))}
      </div>

      {/* {!isWorking && (
        <div className="flex items-center gap-2 text-xs text-white/40 mt-2">
          <div className="w-1 h-1 bg-white rounded-full animate-bounce" />
          <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
          <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
          <span className="ml-1">This may take a moment...</span>
        </div>
      )} */}
    </div>
  );
}
