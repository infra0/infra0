import { describe, it, expect, vi, beforeEach } from "vitest";

import {
  createConversation,
  getConversation,
  getAllConversations,
  getConversationWithMessages,
} from "../src/services/conversation.service";
import { ConversationModel } from "../src/model/conversation.model";

vi.mock("../src/model/conversation.model", () => {
  return {
    ConversationModel: {
      create: vi.fn(),
      findById: vi.fn(),
      find: vi.fn(),
    },
  };
});

describe("conversation.service", () => {
  const mockUser = "507f1f77bcf86cd799439011";
  const mockConversation = {
    _id: "60c72b2f9af1f2c1d8f1e8c3",
    title: "Test Conversation",
    user: mockUser,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create a conversation", async () => {
    (ConversationModel.create as any).mockResolvedValue(mockConversation);

    const result = await createConversation("Test Conversation", mockUser as any);

    expect(ConversationModel.create).toHaveBeenCalledWith({
      title: "Test Conversation",
      user: mockUser,
    });
    expect(result).toEqual(mockConversation);
  });

  it("should get a conversation by id", async () => {
    (ConversationModel.findById as any).mockResolvedValue(mockConversation);

    const result = await getConversation("someId");

    expect(ConversationModel.findById).toHaveBeenCalledWith("someId");
    expect(result).toEqual(mockConversation);
  });

  it("should get all conversations for a user", async () => {
    const mockList = [mockConversation];
    const mockPopulate = vi.fn().mockReturnThis();
    const mockSort = vi.fn().mockResolvedValue(mockList);

    (ConversationModel.find as any).mockReturnValue({
      populate: mockPopulate,
      sort: mockSort,
    });

    const result = await getAllConversations(mockUser as any);

    expect(ConversationModel.find).toHaveBeenCalledWith({ user: mockUser });
    expect(mockPopulate).toHaveBeenCalledWith("total_messages_count");
    expect(mockSort).toHaveBeenCalledWith("-createdAt");
    expect(result).toEqual(mockList);
  });

  it("should get a conversation with messages", async () => {
    const mockPopulate = vi.fn().mockResolvedValue(mockConversation);

    (ConversationModel.findById as any).mockReturnValue({
      populate: mockPopulate,
    });

    const result = await getConversationWithMessages(mockConversation._id as any);

    expect(ConversationModel.findById).toHaveBeenCalledWith(mockConversation._id);
    expect(mockPopulate).toHaveBeenCalledWith("messageList");
    expect(result).toEqual(mockConversation);
  });

  it("returns null if conversation not found", async () => {
  (ConversationModel.findById as any).mockResolvedValue(null);
  const result = await getConversation("invalidId");
  expect(result).toBeNull();
  });
  
});
