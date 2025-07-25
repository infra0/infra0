import { Request, Response } from "express";
import { pulumiCode } from "../constants/pulumi";
import * as conversationService from "../services/conversation.service";
import { IUser } from "../model/user.model";
import { ChatType, CLAUDE_MODELS, conversationHelper, Message } from "../llm";
import { createInfra0 } from "../helpers/createInfra0";
import { AppError } from "../errors/app-error";
import httpStatus from "http-status";
import { createMessages, InputMessage } from "../services/message.service";
import { CreateConversationRequest, InitialConversationResponse, InitialConversationsResponse } from "../types/conversation.types";
import { Status } from "../types/base";
import fs from 'fs';

/*

Flows 

1. conversation start
    - with already existing files
    - with initial prompt

2. conversation continues

*/

const continueConversation = async (req: Request, res: Response) => {
    let { userPrompt } = req.body;
    if (!userPrompt) {
        userPrompt = 'Here\'s my pulumi code: ' + pulumiCode;
    }
    const content: Message[] = [
        {
            role: 'user',
            content: userPrompt
        }
    ];

    try {
        
        // Step 1: Stream response immediately to client
        const { streamResult } = await conversationHelper.streamAndCollectResponse({
            messages: content,
            chatType: ChatType.CREATE,
            model: CLAUDE_MODELS.SONNET_4,
            maxTokens: 64000,
            
        });

        // return streamResult.toDataStreamResponse();
        let response = '';
        for await (const chunk of streamResult.textStream) {
            response += chunk;
            res.write(chunk);
        }
        fs.writeFileSync('response.txt', response);
        res.end();
    } catch (error) {
        console.error('Error in conversation create:', error);
        if (error instanceof Error) {
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
        }
        throw error;
    }
}



const create = async (req: Request<{}, {}, CreateConversationRequest>, res: Response<InitialConversationResponse>) => {
    const { prompt } = req.body;

    const messages: Message[] = [
        {
            role: 'user',
            content: prompt
        }
    ];

    const title = await conversationHelper.generateTitleForConversation({
        messages: messages,
        chatType: ChatType.TITLE,
        model: CLAUDE_MODELS.SONNET_4,
        maxTokens: 1000
    });

    if (!title) {
        console.error('Failed to generate title');
        throw new AppError('Failed to generate title', httpStatus.INTERNAL_SERVER_ERROR);
    }
    const user = req.user as IUser;
    const conversation = await conversationService.createConversation(title, user._id);
    const inputMessages: InputMessage[] = [
        {
            role: 'user',
            content: prompt,
            conversation: conversation._id
        }
    ];
    await createMessages(inputMessages);
    res.status(httpStatus.OK).json({
        status: Status.SUCCESS,
        message: 'Conversation created successfully',
        data: {
            _id: conversation._id.toString(),
            title: conversation.title.toString(),
            total_messages_count: 1,
            createdAt: conversation.createdAt,
            updatedAt: conversation.updatedAt
        }
    });
}


const getAllConversations = async (req: Request, res: Response<InitialConversationsResponse>) => {
    const user = req.user as IUser;
    const conversations = await conversationService.getAllConversations(user._id);

    res.status(httpStatus.OK).json({
        status: Status.SUCCESS,
        message: 'Conversations fetched successfully',
        data: {
            conversations: conversations.map((conversation) => ({
                _id: conversation._id.toString(),
                title: conversation.title.toString(),
                total_messages_count: conversation.total_messages_count ?? 0,
                createdAt: conversation.createdAt,
                updatedAt: conversation.updatedAt
            }))
        }
    });
}

export { create, continueConversation, getAllConversations };