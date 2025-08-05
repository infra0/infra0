"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ArrowUp,
  Sparkles,
  User,
  Bot,
  Loader2,
  CheckCircle,
  File,
} from "lucide-react";
import CompactWorkflow from "./compact-workflow";
import type { Message } from "ai";
import { ChatRole } from "@/types/chat";
import { InfrastructureResponseParser } from "@/lib/response-parser";

interface ChatInterfaceProps {
  updateDiagram: (message_id: string) => void;
  messages: Message[];
  onSendMessage: (message: string) => void;
  isGenerating: boolean;
  initialInput?: string;
  readOnly?: boolean;
  demoMode?: boolean;
}

export default function ChatInterface({
  updateDiagram,
  messages,
  onSendMessage,
  isGenerating,
  initialInput = "",
  readOnly = false,
  demoMode = false,
}: ChatInterfaceProps) {
  const [input, setInput] = useState(initialInput);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, isGenerating]);

  const handleSend = () => {
    if (!input.trim() || isGenerating) return;
    onSendMessage(input.trim());
    setInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatMessage = (message: Message) => {
    if (message.role === ChatRole.USER) {
      const userPrompt = InfrastructureResponseParser.parseUserPrompt(message.content);
      return userPrompt?.prompt;
    }

    if (message.role === ChatRole.ASSISTANT) {
      return InfrastructureResponseParser.getConclusion(message.content);
    }

    return null;
  };


  return (
    <div className="h-full flex flex-col bg-white/[0.02] border border-white/[0.08] rounded-xl">
      {/* Chat Header */}
      <div className="p-4 border-b border-white/[0.08] flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-black" />
          </div>
          <div>
            <h3 className="font-semibold text-white/95 text-sm">
              Infrastructure Assistant
            </h3>
            <p className="text-xs text-white/60">
              Continue the conversation about your infrastructure
            </p>
          </div>
        </div>
      </div>

      {/* Messages - Scrollable */}
      <ScrollArea
        className="flex-1 p-4 max-h-[calc(100vh-300px)]"
        ref={scrollAreaRef}
      >
        <div className="space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className="w-12 h-12 bg-white/[0.08] rounded-full flex items-center justify-center mx-auto mb-4">
                <Bot className="w-6 h-6 text-white/60" />
              </div>
              <p className="text-white/50 text-sm">
                Continue building your infrastructure...
              </p>
            </div>
          )}

          {messages.map((message, index) => {
            const isLastMessage = index === messages.length - 1;
            const isLastMessageGenerating =
              isGenerating &&
              isLastMessage &&
              message.role === ChatRole.ASSISTANT;

            return (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-black" />
                  </div>
                )}

                <div className="max-w-[85%] rounded-xl px-4 py-3 bg-white/[0.04] text-white/95 border border-white/[0.08]">
                  {isLastMessageGenerating ? (
                    <CompactWorkflow
                      message={message}
                      isWorking={isGenerating}
                    />
                  ) : (
                    <>
                      <div className="text-sm leading-relaxed">
                        {formatMessage(message)}
                      </div>
                      
                      {/* Files display for user messages */}
                      {message.role === ChatRole.USER && (() => {
                        const userPrompt = InfrastructureResponseParser.parseUserPrompt(message.content);
                        const files = userPrompt?.files || [];
                        return files.length > 0 ? (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {files.map((file, fileIndex) => (
                              <div
                                key={fileIndex}
                                className="inline-flex items-center gap-1.5 text-xs font-medium text-white/80 bg-white/[0.08] border border-white/[0.12] px-2.5 py-1 rounded-md hover:bg-white/[0.12] hover:border-white/[0.16] transition-all duration-200"
                              >
                                <File className="w-3 h-3 text-white/60" />
                                <span className="truncate max-w-[120px]">{file.name}</span>
                              </div>
                            ))}
                          </div>
                        ) : null;
                      })()}
                      
                      {/* View Diagram button for assistant messages */}
                      {message.role === ChatRole.ASSISTANT && (
                        <div
                          onClick={() => updateDiagram(message.id)}
                          className="inline-flex mt-2 items-center gap-1 text-sm text-green-400 bg-green-400/10 border border-green-400/20 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-green-400/20 hover:border-green-400/40 transition-all duration-200 hover:scale-[1.02] w-full"
                        >
                          <CheckCircle className="w-3 h-3" />
                          View Diagram
                        </div>
                      )}
                      
                      <div className="text-xs mt-2 text-white/50">
                        {formatTimestamp(message.createdAt ?? new Date())}
                      </div>
                    </>
                  )}
                </div>

                {message.role === "user" && (
                  <div className="w-8 h-8 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-sm border border-slate-200/60">
                    <User className="w-4 h-4 text-slate-600" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* Fixed Input at Bottom */}
      <div className="border-t border-white/[0.08] p-4 flex-shrink-0">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={readOnly ? undefined : (e) => setInput(e.target.value)}
              onKeyDown={readOnly ? undefined : handleKeyPress}
              placeholder="Ask infrastructure assistant to build..."
              className={`min-h-[50px] max-h-[100px] bg-white/[0.04] border-white/[0.12] text-white/95 placeholder:text-white/40 resize-none text-sm leading-relaxed focus:border-white/[0.2] focus:ring-1 focus:ring-white/[0.1] rounded-lg pr-12 ${
                readOnly ? 'cursor-not-allowed opacity-80' : ''
              }`}
              disabled={isGenerating || readOnly}
              readOnly={readOnly}
            />
            <div className="absolute bottom-2 right-2">
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isGenerating || readOnly}
                className="bg-white text-black hover:bg-white/90 disabled:opacity-50 h-8 w-8 p-0 rounded-lg"
              >
                <ArrowUp className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
        {demoMode && (
          <div className="mt-2 text-xs text-white/40 text-center">
            Demo Mode - Click "Send" to see the follow-up response
          </div>
        )}
      </div>
    </div>
  );
}
