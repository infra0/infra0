export enum ChatRole {
  USER = "user",
  ASSISTANT = "assistant",
  SYSTEM = "system",
}


export interface ChatMessage {
  id: string
  type: ChatRole
  content: string
  timestamp: Date
  isStreaming?: boolean
}

export interface ChatSession {
  id: string
  title: string
  messages: ChatMessage[]
  nodes: any[]
  edges: any[]
  createdAt: Date
  updatedAt: Date
}
