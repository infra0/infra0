import dagre from "dagre"
import type { Infra0Node, Infra0Edge } from "@/types/infrastructure"

const dagreGraph = new dagre.graphlib.Graph()
dagreGraph.setDefaultEdgeLabel(() => ({}))

const NODE_WIDTH = 172
const NODE_HEIGHT = 100

export const getLayoutedElements = (
  nodes: Infra0Node[], 
  edges: Infra0Edge[], 
  direction: "TB" | "LR" = "TB"
) => {
  dagreGraph.setGraph({ rankdir: direction })

  dagreGraph.nodes().forEach(nodeId => dagreGraph.removeNode(nodeId))

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT })
  })

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.from, edge.to)
  })

  dagre.layout(dagreGraph)

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id)
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - NODE_WIDTH / 2,
        y: nodeWithPosition.y - NODE_HEIGHT / 2,
      },
    }
  })

  return { nodes: layoutedNodes, edges }
} 