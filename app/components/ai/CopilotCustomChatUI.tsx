// /app/components/ai/CopilotCustomChatUI.tsx

"use client";

import React from "react";
import {
  useCopilotAction,
  useCopilotChat,
  useCopilotReadable,
} from "@copilotkit/react-core";
import { Role, TextMessage } from "@copilotkit/runtime-client-gql";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Loader2, Trash2, RotateCcw } from "lucide-react";
import { gsap } from "gsap";
import { motion, AnimatePresence } from "framer-motion";
import ErrorBoundary from "@/app/components/errors/ErrorBoundary";
import { useToast } from "@/hooks/use-toast";
export function CopilotCustomChatUI() {
  const { toast } = useToast();
  const {
    visibleMessages,
    appendMessage,
    setMessages,
    reloadMessages,
    stopGeneration,
    isLoading,
  } = useCopilotChat();

  const [inputValue, setInputValue] = useState("");
  const chatCardRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);

  const sendMessage = useCallback(
    (content: string) => {
      if (content.trim()) {
        appendMessage(new TextMessage({ content, role: Role.User }));
        setInputValue("");
      }
    },
    [appendMessage]
  );

  // Memoize scroll handler
  const scrollToBottom = useCallback(() => {
    if (viewportRef.current) {
      requestAnimationFrame(() => {
        viewportRef.current?.scrollTo({
          top: viewportRef.current.scrollHeight,
          behavior: 'smooth'
        });
      });
    }
  }, []);

  // Update scroll effect with debounce
  useEffect(() => {
    const timeoutId = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timeoutId);
  }, [visibleMessages, scrollToBottom]);


  useEffect(() => {
    gsap.from(chatCardRef.current, {
      duration: 0.8,
      y: 50,
      opacity: 0,
      ease: "power3.out",
    });
  }, []);

  const messageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  // Memoize the value for useCopilotReadable
  const copilotReadableValue = useMemo(
    () => ({
      messageCount: visibleMessages.length,
      isLoading,
      lastMessage: visibleMessages[visibleMessages.length - 1]?.isTextMessage,
    }),
    [visibleMessages, isLoading]
  );

  // Copilot readable state
  useCopilotReadable({
    description: "Chat UI State",
    value: copilotReadableValue,
  });

  // Memoize handler functions for useCopilotAction
  const sendJokeMessageHandler = useCallback(
    async ({ message }: { message: string }) => {
      toast({
        title: 'AI Action Success',
        description: 'The AI action was successful.',
        variant: 'default',
        duration: 2000,
      });
      sendMessage(message);
    },
    [sendMessage]
  );

  const clearChatHandler = useCallback(async () => {
    setMessages([]);
    toast({
      title: 'AI Action Success',
      description: 'The AI action was successful.',
      variant: 'default',
      duration: 2000,
    });
    return "Chat cleared successfully";
  }, [setMessages]);

  // Copilot actions
  useCopilotAction({
    name: "sendJokeMessage",
    description: "Send a clever joke to the chat",
    parameters: [
      {
        name: "message",
        type: "string",
        description: "The message to send",
      },
    ],
    handler: sendJokeMessageHandler,
  });

  useCopilotAction({
    name: "clearChat",
    description: "Clear all chat messages",
    parameters: [],
    handler: clearChatHandler,
  });

  return (
    <Card
      ref={chatCardRef}
      className="w-[90vw] mx-auto h-[90vh] flex flex-col bg-gradient-to-br from-gray-900 to-gray-800 shadow-lg rounded-xl overflow-hidden border border-gray-700"
      style={{
        boxShadow:
          "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      }}
    >
      <CardContent className="flex flex-col h-full p-6">
        <ErrorBoundary>
        <div
          className="flex-grow pr-4 custom-scrollbar"
          ref={scrollAreaRef}
        >
          <AnimatePresence initial={false}>
            {visibleMessages.map((message, index) => {
              const { role, content } = message as TextMessage;

              if (!content || content.trim() === "") {
                return null;
              }

              return (
                <motion.div
                  key={message.id || index}
                  variants={messageVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{
                    duration: 0.4,
                    ease: "easeOut",
                    delay: index * 0.1,
                  }}
                  className={`flex items-start space-x-4 mb-4 ${
                    role === Role.User ? "justify-end" : "justify-start"
                  }`}
                >
                  {role !== Role.User && (
                    <Avatar className="border-2 border-primary shadow-glow">
                      <AvatarImage src="/support-avatar.png" alt="AI" />
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`rounded-lg p-3 max-w-[70%] ${
                      role === Role.User
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                    } shadow-md transition-all duration-300 ease-in-out hover:shadow-lg relative overflow-hidden`}
                    style={
                      role !== Role.User
                        ? { position: "relative", overflow: "hidden" }
                        : undefined
                    }
                  >
                    <p className="text-sm leading-relaxed">{content}</p>
                    {role !== Role.User && (
                      <div className="absolute inset-0 bg-shimmer" />
                    )}
                  </div>
                  {role === Role.User && (
                    <Avatar className="border-2 border-secondary shadow-glow">
                      <AvatarImage src="/generic-support-avatar.png" alt="User" />
                      <AvatarFallback>You</AvatarFallback>
                    </Avatar>
                  )}
                </motion.div>
              );
            })}
            {isLoading && (
              <motion.div
                key="loading-message"
                variants={messageVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="flex items-start space-x-4 mb-4 justify-start"
              >
                <Avatar className="border-2 border-primary shadow-glow">
                  <AvatarImage src="/generic-support-avatar.png" alt="AI" />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
                <div className="rounded-lg p-3 max-w-[70%] bg-secondary text-secondary-foreground shadow-md flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <p className="text-sm leading-relaxed">Thinking...</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        </ErrorBoundary>
        <div className="flex items-center space-x-2 mt-4">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setInputValue(e.target.value)
            }
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === "Enter") sendMessage(inputValue);
            }}
            placeholder="Type your message here..."
            className="flex-grow bg-gray-700 text-white placeholder-gray-400 border-gray-600 focus:border-primary transition-all duration-300"
          />
          <Button
            onClick={() => sendMessage(inputValue)}
            disabled={isLoading || !inputValue.trim()}
            className="bg-primary hover:bg-primary-dark transition-colors duration-300"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
        <div className="flex justify-between mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMessages([])}
            title="Clear chat"
            className="text-gray-300 border-gray-600 hover:bg-gray-700 transition-colors duration-300"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={reloadMessages}
            title="Reload messages"
            className="text-gray-300 border-gray-600 hover:bg-gray-700 transition-colors duration-300"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          {isLoading && (
            <Button
              variant="destructive"
              size="sm"
              onClick={stopGeneration}
              title="Stop generation"
              className="bg-red-600 hover:bg-red-700 transition-colors duration-300"
            >
              Stop
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
