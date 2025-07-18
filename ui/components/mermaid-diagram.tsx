"use client"

import { useEffect, useRef } from "react"

interface MermaidDiagramProps {
  chart: string
}

export default function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const renderDiagram = async () => {
      if (!elementRef.current) return

      try {
        // Dynamically import mermaid to avoid SSR issues
        const mermaid = (await import("mermaid")).default

        // Configure mermaid with dark theme
        mermaid.initialize({
          startOnLoad: false,
          theme: "dark",
          themeVariables: {
            primaryColor: "#3b82f6",
            primaryTextColor: "#ffffff",
            primaryBorderColor: "#1e40af",
            lineColor: "#6b7280",
            sectionBkgColor: "#1f2937",
            altSectionBkgColor: "#111827",
            gridColor: "#374151",
            secondaryColor: "#10b981",
            tertiaryColor: "#f59e0b",
            background: "#000000",
            mainBkg: "#1a1a1a",
            secondBkg: "#262626",
            tertiaryBkg: "#374151",
            // Text color fixes
            textColor: "#ffffff",
            nodeTextColor: "#ffffff",
            clusterTextColor: "#ffffff",
            edgeLabelBackground: "#1f2937",
            // Additional text styling
            fontFamily: "ui-monospace, SFMono-Regular, Consolas, monospace",
            fontSize: "14px",
          },
          flowchart: {
            useMaxWidth: true,
            htmlLabels: true,
            curve: "basis",
          },
          // Add specific styling for better text visibility
          themeCSS: `
            .node-label, .edge-label {
              fill: #ffffff !important;
              font-family: ui-monospace, SFMono-Regular, Consolas, monospace !important;
              font-size: 12px !important;
              font-weight: 500 !important;
            }
            .cluster-label {
              fill: #ffffff !important;
              font-size: 14px !important;
              font-weight: 600 !important;
            }
            .subgraph-title {
              fill: #ffffff !important;
              font-size: 16px !important;
              font-weight: 700 !important;
            }
          `,
        })

        // Clear previous content
        elementRef.current.innerHTML = ""

        // Generate unique ID for this diagram
        const id = `mermaid-${Date.now()}`

        // Render the diagram
        const { svg } = await mermaid.render(id, chart)

        if (elementRef.current) {
          elementRef.current.innerHTML = svg

          // Style the SVG for better dark theme integration
          const svgElement = elementRef.current.querySelector("svg")
          if (svgElement) {
            svgElement.style.width = "100%"
            svgElement.style.height = "100%"
            svgElement.style.maxWidth = "100%"
            svgElement.style.background = "transparent"
          }
        }
      } catch (error) {
        console.error("Error rendering mermaid diagram:", error)
        if (elementRef.current) {
          elementRef.current.innerHTML = `
            <div class="flex items-center justify-center h-full text-red-400">
              <div class="text-center">
                <div class="text-lg mb-2">⚠️ Diagram Error</div>
                <div class="text-sm opacity-75">Failed to render diagram</div>
              </div>
            </div>
          `
        }
      }
    }

    renderDiagram()
  }, [chart])

  return (
    <div
      ref={elementRef}
      className="w-full h-full flex items-center justify-center p-4 overflow-auto"
      style={{ minHeight: "400px" }}
    />
  )
}
