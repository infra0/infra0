import {
  LLMProvider,
  CLAUDE_MODELS,
  GEMINI_MODELS,
  ChatType,
  Message,
  InitialModelPayload,
} from "./types";
import {
  streamText,
  generateText,
  type CoreMessage,
  type StreamTextResult,
} from "ai";
import { initModel } from "./provider";
import * as fs from "fs";
import * as path from "path";
const prompt = fs.readFileSync(
  path.join(__dirname, "../../config/prompt.txt"),
  "utf8"
);
export interface StreamResponseOptions {
  messages: Message[];
  maxSteps?: number;
  chatType?: ChatType;
  provider?: LLMProvider;
  model?: CLAUDE_MODELS | GEMINI_MODELS;
  maxTokens?: number;
}

export class ConversationHelper {
  private model: any = null;
  private currentProvider: LLMProvider | null = null;
  private currentModel: CLAUDE_MODELS | GEMINI_MODELS | null = null;

  constructor() {}

  private async ensureInitialized(
    provider: LLMProvider,
    model: CLAUDE_MODELS | GEMINI_MODELS
  ): Promise<void> {
    if (
      !this.model ||
      this.currentProvider !== provider ||
      this.currentModel !== model
    ) {
      const payload: InitialModelPayload = {
        provider: provider as any,
        model: model as any,
      };
      const { model: aiModel } = await initModel(payload);
      this.model = aiModel;
      this.currentModel = model;
    }
  }

  private formatMessagesForAI(messages: Message[]): CoreMessage[] {
    const formatted = messages
      .map((msg) => ({
        role: msg.role,
        content:
          typeof msg.content === "string"
            ? msg.content
            : JSON.stringify(msg.content),
      }))
      .filter((msg) => msg.content.trim().length > 0);

    return formatted;
  }

  private getSystemPrompt(chatType: ChatType = ChatType.CREATE): string {
    switch (chatType) {
      case ChatType.CREATE:
        return prompt;
      case ChatType.ASK:
        const askPrompt =
          "You are a helpful assistant that answers questions about infrastructure and AWS services.";
        return askPrompt;
      case ChatType.TITLE:
        const titlePrompt =
          "You are a helpful assistant that generates short title for a conversation. Return only the title, no extra text.";
        return titlePrompt;
      default:
        return prompt;
    }
  }

  async streamResponse(options: StreamResponseOptions) {
    const {
      messages,
      maxSteps = 5,
      chatType = ChatType.CREATE,
      provider,
      model,
      maxTokens = 64000,
    } = options;

    await this.ensureInitialized(provider, model);

    const formattedMessages = this.formatMessagesForAI(messages);
    const systemPrompt = this.getSystemPrompt(chatType);

    try {
      const result = streamText({
        model: this.model,
        system: systemPrompt,
        messages: formattedMessages,
        maxSteps,
        maxTokens,
        toolCallStreaming: true,
      });

      return result;
    } catch (error) {
      console.error("Error in streamText:", error);
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      }
      throw error;
    }
  }

  async generateResponse(options: StreamResponseOptions): Promise<string> {
    const {
      messages,
      chatType = ChatType.CREATE,
      provider,
      model,
      maxTokens = 64000,
    } = options;

    await this.ensureInitialized(provider, model);

    const formattedMessages = this.formatMessagesForAI(messages);
    const systemPrompt = this.getSystemPrompt(chatType);

    try {
      const result = await generateText({
        model: this.model,
        system: systemPrompt,
        messages: formattedMessages,
        maxTokens,
      });

      return result.text;
    } catch (error) {
      console.error("Error in generateText:", error);
      throw error;
    }
  }

  async generateTitleForConversation(
    options: StreamResponseOptions
  ): Promise<string | null> {
    const {
      messages,
      chatType = ChatType.TITLE,
      provider,
      model,
      maxTokens = 1000,
    } = options;

    await this.ensureInitialized(provider, model);

    const formattedMessages = this.formatMessagesForAI(messages);
    const systemPrompt = this.getSystemPrompt(chatType);

    try {
      const result = await generateText({
        model: this.model,
        system: systemPrompt,
        messages: formattedMessages,
        maxTokens,
      });

      const title = result.text.trim();
      return title;
    } catch (error) {
      console.error("Error in title generation:", error);
      throw error;
    }
  }

  async streamAndCollectResponse(options: StreamResponseOptions): Promise<{
    streamResult: any;
  }> {
    const {
      messages,
      chatType = ChatType.CREATE,
      provider,
      model,
      maxTokens = 64000,
    } = options;

    await this.ensureInitialized(provider, model);

    const formattedMessages = this.formatMessagesForAI(messages);
    const systemPrompt = this.getSystemPrompt(chatType);

    try {
      const streamResult = streamText({
        model: this.model,
        system: systemPrompt,
        messages: formattedMessages,
        maxTokens: maxTokens || 64000,
        toolCallStreaming: false,
        onError: (error) => {
          console.log("onError", error);
        },
      });
      return {
        streamResult,
      };
    } catch (error) {
      console.error("Error in streamAndCollectResponse:", error);
      throw error;
    }
  }
}

export const conversationHelper = new ConversationHelper();
