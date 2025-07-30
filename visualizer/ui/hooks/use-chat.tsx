import { useChat as useLLMChat, type UseChatHelpers } from '@ai-sdk/react';
import type { Message } from 'ai';
import { useRef, useMemo, useState } from 'react';
import { InfrastructureResponseParser } from '@/lib/response-parser';
import type { ParsedResponseState } from '@/types/infrastructure';
import { addAssistantMessage } from '@/services/conversation/conversation.service';

type ExtendedUseChatHelpers = UseChatHelpers & {
    isWorking: boolean;
    currentInfrastructureResponse?: ParsedResponseState;
    currentConversationId: string;
    setCurrentConversationId: (id: string) => void;
};

export function useChat(id: string): ExtendedUseChatHelpers {
    const lastMessageRef = useRef<Message | null>(null);
    const conversationIdRef = useRef<string>(id);
    const [currentConversationId, setCurrentConversationIdState] = useState<string>(id);

    // Update both ref and state when conversation ID changes
    const setCurrentConversationId = (newId: string) => {
        conversationIdRef.current = newId;
        setCurrentConversationIdState(newId);
    };
  
    const chat = useLLMChat({
      id,
      api: `${process.env.NEXT_PUBLIC_API_URL}/v1/chat/completions`,
      streamProtocol: 'text',
      maxSteps: 20,
      onFinish: async (message, { finishReason }) => {
        console.log('🔚 Stream finished:', finishReason, message);
        lastMessageRef.current = null;
        
        const latestConversationId = conversationIdRef.current;
        // TODO: Avoinding finishReason for sometime, will pick this asap
        // if(finishReason === 'stop') {
          const { data } = await addAssistantMessage({
            conversation_id: latestConversationId,
            message: message.content
          })
        // }
      },
      onError: (error) => {
        console.error('❌ Chat error:', error);
        lastMessageRef.current = null;
      },
      onResponse: (response) => {
        console.log('📡 Response received:', response.status, response.headers);
      },
    });

    const currentInfrastructureResponse = useMemo(() => {
      const lastMessage = chat.messages[chat.messages.length - 1]
      if (!lastMessage || lastMessage.role !== 'assistant') return undefined

      return InfrastructureResponseParser.parseStreamingResponse(lastMessage.content)
    }, [chat.messages])
  
    return {
      ...chat,
      currentConversationId, // Return state value for UI
      setCurrentConversationId, // This updates both ref and state
      isWorking: chat.status === 'streaming' || chat.status === 'submitted',
      currentInfrastructureResponse,
    };
}