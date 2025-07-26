import { useChat as useLLMChat, type UseChatHelpers } from '@ai-sdk/react';
import type { Message } from 'ai';
import { useRef, useMemo } from 'react';
import { InfrastructureResponseParser } from '@/lib/response-parser';
import type { ParsedResponseState } from '@/types/infrastructure';

type ExtendedUseChatHelpers = UseChatHelpers & {
    isWorking: boolean;
    currentInfrastructureResponse?: ParsedResponseState;
};

export function useChat(id: string): ExtendedUseChatHelpers {
    const lastMessageRef = useRef<Message | null>(null);
  
    const chat = useLLMChat({
      id,
      api: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/chat/completions`,
      streamProtocol: 'text',
      maxSteps: 20,
      onFinish: (message, { finishReason }) => {
        console.log('🔚 Stream finished:', finishReason, message);
        lastMessageRef.current = null;
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
      isWorking: chat.status === 'streaming' || chat.status === 'submitted',
      currentInfrastructureResponse,
    };
  }