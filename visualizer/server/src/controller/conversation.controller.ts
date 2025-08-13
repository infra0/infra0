import { Request, Response } from "express";
import { pulumiCode } from "../constants/pulumi";
import * as conversationService from "../services/conversation.service";
import { IUser } from "../model/user.model";
import {
  ChatType,
  CLAUDE_MODELS,
  GEMINI_MODELS,
  LLMProvider,
  conversationHelper,
  Message,
} from "../llm";
import { createInfra0 } from "../helpers/createInfra0";
import { AppError } from "../errors/app-error";
import httpStatus from "http-status";
import {
  createMessages,
  InputMessage,
  createMessage,
  getMessages,
} from "../services/message.service";
import { asyncHandler } from "../middleware/async-handler";
import {
  CreateConversationRequest,
  IAddAssistantMessageRequest,
  IAddAssistantMessageResponse,
  InitialConversationResponse,
  InitialConversationsResponse,
  IGetAllMessagesRequest,
  IGetAllMessagesResponse,
} from "../types/conversation.types";
import { Status } from "../types/base";
import { getPreferredLLMConfig } from "../helpers/llm";
import { MessageRole } from "../model/Message.model";

/*

Flows 

1. conversation start
    - with already existing files
    - with initial prompt

2. conversation continues

*/

const chatCompletions = asyncHandler(async (req: Request, res: Response) => {
  const { messages, conversation_id } = req.body;
  const { provider, model } = getPreferredLLMConfig();

  try {
    if (conversation_id) {
      const lastMessage = messages[messages.length - 1];

      const inputMessage: InputMessage = {
        role: "user",
        content: lastMessage.content,
        conversation: conversation_id,
      };
      await createMessage(inputMessage);
    }

    const { streamResult } = await conversationHelper.streamAndCollectResponse({
      messages: messages,
      chatType: ChatType.CREATE,
      provider: provider,
      model: model,
      maxTokens: 64000,
    });

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    for await (const chunk of streamResult.textStream) {
      res.write(chunk);
    }

    res.end();
  } catch (error) {
    console.error("Error in conversation create:", error);
    res.status(500).json({ error: "Stream failed" });
  }
});

const create = asyncHandler(
  async (
    req: Request<{}, {}, CreateConversationRequest>,
    res: Response<InitialConversationResponse>
  ) => {
    const { prompt } = req.body;

    const messages: Message[] = [
      {
        role: "user",
        content: prompt,
      },
    ];
    const { provider, model } = getPreferredLLMConfig();

    const title = await conversationHelper.generateTitleForConversation({
      messages: messages,
      chatType: ChatType.TITLE,
      provider: provider,
      model: model,
      maxTokens: 1000,
    });

    if (!title) {
      console.error("Failed to generate title");
      throw new AppError(
        "Failed to generate title",
        httpStatus.INTERNAL_SERVER_ERROR
      );
    }
    const user = req.user as IUser;
    const conversation = await conversationService.createConversation(
      title,
      user._id
    );
    const inputMessages: InputMessage[] = [
      {
        role: "user",
        content: prompt,
        conversation: conversation._id.toString(),
      },
    ];
    await createMessages(inputMessages);
    res.status(httpStatus.OK).json({
      status: Status.SUCCESS,
      message: "Conversation created successfully",
      data: {
        _id: conversation._id.toString(),
        title: conversation.title.toString(),
        total_messages_count: 1,
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt,
      },
    });
  }
);

const getAllConversations = asyncHandler(
  async (req: Request, res: Response<InitialConversationsResponse>) => {
    const user = req.user as IUser;
    const conversations = await conversationService.getAllConversations(
      user._id
    );
    res.status(httpStatus.OK).json({
      status: Status.SUCCESS,
      message: "Conversations fetched successfully",
      data: {
        conversations: conversations.map((conversation) => ({
          _id: conversation._id.toString(),
          title: conversation.title.toString(),
          total_messages_count: conversation.total_messages_count ?? 0,
          createdAt: conversation.createdAt,
          updatedAt: conversation.updatedAt,
        })),
      },
    });
  }
);

const addAssistantMessage = asyncHandler(
  async (
    req: Request<{}, {}, IAddAssistantMessageRequest>,
    res: Response<IAddAssistantMessageResponse>
  ) => {
    const { conversation_id, message } = req.body;
    const user = req.user as IUser;

    // Validating that the conversation exists and belongs to the user
    const conversation =
      await conversationService.getConversation(conversation_id);
    if (!conversation || conversation.user.toString() !== user._id.toString()) {
      throw new AppError(
        "Conversation not found or not authorized",
        httpStatus.NOT_FOUND
      );
    }

    const infra0 = createInfra0(message);

    // Create the assistant message
    const createdMessage = await createMessage({
      role: "assistant" as MessageRole,
      content: message,
      infra0: infra0,
      conversation: conversation_id,
    });

    res.status(httpStatus.OK).json({
      status: Status.SUCCESS,
      message: "Assistant message added successfully",
      data: {
        _id: createdMessage._id.toString(),
        message: createdMessage.content,
        infra0: createdMessage.infra0,
      },
    });
  }
);

const getAllMessages = asyncHandler(
  async (
    req: Request<{}, {}, IGetAllMessagesRequest>,
    res: Response<IGetAllMessagesResponse>
  ) => {
    const { conversation_id } = req.body;
    const user = req.user as IUser;

    const conversation =
      await conversationService.getConversation(conversation_id);
    if (!conversation || conversation.user.toString() !== user._id.toString()) {
      throw new AppError(
        "Conversation not found or not authorized",
        httpStatus.NOT_FOUND
      );
    }

    const messages = await getMessages(conversation_id);

    res.status(httpStatus.OK).json({
      status: Status.SUCCESS,
      message: "Messages fetched successfully",
      data: {
        _id: conversation._id.toString(),
        title: conversation.title.toString(),
        total_messages_count: conversation.total_messages_count ?? 0,
        messages: messages.map((message) => ({
          _id: message._id.toString(),
          role: message.role,
          content: message.content,
          infra0: message.infra0 ?? null,
          createdAt: message.createdAt.toISOString(),
          updatedAt: message.updatedAt.toISOString(),
        })),
      },
    });
  }
);

export {
  create,
  chatCompletions,
  getAllConversations,
  addAssistantMessage,
  getAllMessages,
};
