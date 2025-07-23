import { Request, Response } from "express";
import { pulumiCode } from "../constants/pulumi";
import { createConversation } from "../services/conversation.service";
import { IUser } from "../model/user.model";
import { ChatType, CLAUDE_MODELS, conversationHelper, Message } from "../llm";
import { createInfra0 } from "../helpers/createInfra0";
import { AppError } from "../errors/app-error";
import httpStatus from "http-status";
import { createMessages, InputMessage } from "../services/message.service";

/*

Flows 

1. conversation start
    - with already existing files
    - with initial prompt

2. conversation continues

*/

const create = async (req: Request, res: Response) => {
    let { userPrompt } = req.body;
    if (!userPrompt) {
        userPrompt = 'Here\'s my pulumi code: ' + pulumiCode;
    }
    const user = req.user as IUser;

    const content: Message[] = [
        {
            role: 'user',
            content: userPrompt
        }
    ];

    const title = await conversationHelper.generateTitleForConversation({
        messages: content,
        chatType: ChatType.TITLE,
        model: CLAUDE_MODELS.SONNET_4,
        maxTokens: 1000
    });

    if (!title) {
        console.error('Failed to generate title');
        throw new AppError('Failed to generate title', httpStatus.INTERNAL_SERVER_ERROR);
    }

    const conversation = await createConversation(title, user._id);

    const messages: InputMessage[] = [
        {
            role: 'user',
            content: userPrompt,
            conversation: conversation._id
        },
    ];

    await createMessages(messages);
    try {
        
        // Step 1: Stream response immediately to client
        const { streamResult } = await conversationHelper.streamAndCollectResponse({
            messages: content,
            chatType: ChatType.CREATE,
            model: CLAUDE_MODELS.SONNET_4,
            maxTokens: 64000,
            
        });

        return streamResult.toDataStreamResponse();
    } catch (error) {
        console.error('Error in conversation create:', error);
        if (error instanceof Error) {
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
        }
        throw error;
    }
}

export { create };