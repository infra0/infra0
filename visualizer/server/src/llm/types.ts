export enum LLMProvider {
  ANTHROPIC = "anthropic",
  // Future providers can be added here:
  // OPENAI = 'openai',
  GOOGLE = "google",
  // BEDROCK = 'bedrock',
}

export enum CLAUDE_MODELS {
  SONNET_4 = "claude-sonnet-4-20250514",
  SONNET_3_7 = "claude-3-7-sonnet-20250219",
  HAIKU = "claude-3-5-haiku-20241022",
}

// Future model enums can be added here:
// export enum OPENAI_MODELS {
//     GPT_4O = 'gpt-4o',
//     GPT_4O_MINI = 'gpt-4o-mini',
// }
//
export enum GEMINI_MODELS {
  GEMINI_2_FLASH = "gemini-2.0-flash",
  GEMINI_1_5_PRO = "gemini-1.5-pro",
}

export enum ChatType {
  CREATE = "create",
  ASK = "ask",
  EDIT = "edit",
  TITLE = "title",
}

export interface Message {
  role: "user" | "assistant" | "system";
  content: string | Array<{ type: string; text?: string; [key: string]: any }>;
}

// Scalable model mapping for type safety
interface ModelMapping {
  [LLMProvider.ANTHROPIC]: CLAUDE_MODELS;
  // Future mappings:
  // [LLMProvider.OPENAI]: OPENAI_MODELS;
  [LLMProvider.GOOGLE]: GEMINI_MODELS;
}

export type InitialModelPayload = {
  [K in keyof ModelMapping]: {
    provider: K;
    model: ModelMapping[K];
  };
}[keyof ModelMapping];
