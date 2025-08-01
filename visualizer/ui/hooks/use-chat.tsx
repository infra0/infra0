import { useChat as useLLMChat, type UseChatHelpers } from '@ai-sdk/react';
import type { Message as AIMessage } from 'ai';
import { useRef, useMemo, useState } from 'react';
import { InfrastructureResponseParser } from '@/lib/response-parser';
import type { ParsedResponseState } from '@/types/infrastructure';
import { addAssistantMessage } from '@/services/conversation/conversation.service';
import type { Infra0 } from '@/types/infrastructure';


type ExtendedUseChatHelpers = UseChatHelpers & {
    isWorking: boolean;
    currentInfrastructureResponse?: ParsedResponseState;
    currentConversationId: string;
    setCurrentConversationId: (id: string) => void;
    messagesToInfra0Map: Record<string, Infra0>;
    setMessagesToInfra0Map: (map: Record<string, Infra0>) => void;
    latestMessageIdToRender: string | null; // HACK - remove in future
    setLatestMessageIdToRender: (id: string) => void; // HACK - remove in future
};



export function useChat(id: string): ExtendedUseChatHelpers {
    const lastMessageRef = useRef<AIMessage | null>(null); 
    const conversationIdRef = useRef<string>(id);
    const [currentConversationId, setCurrentConversationIdState] = useState<string>(id);

    const [messagesToInfra0Map, setMessagesToInfra0Map] = useState<Record<string, Infra0>>({});

    const [latestMessageIdToRender, setLatestMessageIdToRender] = useState<string | null>(null);

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
          setLatestMessageIdToRender(data._id);
          setMessagesToInfra0Map((prev) => ({
            ...prev,
            [data._id]: data.infra0
          }))
        // }
      },
      onError: (error) => {
        console.error('❌ Chat error:', error);
        lastMessageRef.current = null;
      },
      onResponse: (response) => {
        console.log('📡 Response received:', response.status, response.headers);
        console.log('🌊 Streaming response:', response);
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
      messagesToInfra0Map,
      setMessagesToInfra0Map,
      latestMessageIdToRender,
      setLatestMessageIdToRender

    };
}