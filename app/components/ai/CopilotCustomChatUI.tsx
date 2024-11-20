'use client'

import { useCopilotChat } from "@copilotkit/react-core";
import { Role, TextMessage } from "@copilotkit/runtime-client-gql";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Loader2, Trash2, RotateCcw } from 'lucide-react';
import { gsap } from "gsap";
import { motion, AnimatePresence } from "framer-motion";

export function CopilotCustomChatUI() {
  const {
    visibleMessages,
    appendMessage,
    setMessages,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    deleteMessage,
    reloadMessages,
    stopGeneration,
    isLoading,
  } = useCopilotChat();

  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatCardRef = useRef<HTMLDivElement>(null);

  const sendMessage = (content: string) => {
    if (content.trim()) {
      // Append user's message
      appendMessage(new TextMessage({ content, role: Role.User }));
      setInputValue("");
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [visibleMessages, isLoading]);

  useEffect(() => {
    // Animate chat card on mount
    gsap.from(chatCardRef.current, {
      duration: 0.5,
      y: 50,
      opacity: 0,
      ease: "power3.out",
    });
  }, []);

  const messageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <Card
      ref={chatCardRef}
      className="w-full max-w-2xl mx-auto h-[600px] flex flex-col bg-gradient-to-br from-gray-900 to-gray-800 shadow-lg rounded-xl overflow-hidden"
    >
      <CardContent className="flex flex-col h-full p-6">
        <ScrollArea className="flex-grow pr-4 custom-scrollbar">
          <AnimatePresence initial={false}>
            {visibleMessages.map((message, index) => {
              // Safely destructuring message content and role
              const { role, content } = message as TextMessage;

              // Skip rendering if content is empty
              if (!content || content.trim() === "") {
                return null;
              }

              return (
                <motion.div
                  key={message.id || index}
                  variants={messageVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`flex items-start space-x-4 mb-4 ${
                    role === Role.User ? "justify-end" : "justify-start"
                  }`}
                >
                  {role !== Role.User && (
                    <Avatar className="border-2 border-primary">
                      <AvatarImage src="/ai-avatar.png" alt="AI" />
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`rounded-lg p-3 max-w-[70%] ${
                      role === Role.User
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                    } shadow-md transition-all duration-300 ease-in-out hover:shadow-lg`}
                  >
                    {/* Safely rendering message content */}
                    <p className="text-sm leading-relaxed">{content}</p>
                  </div>
                  {role === Role.User && (
                    <Avatar className="border-2 border-secondary">
                      <AvatarImage src="/user-avatar.png" alt="User" />
                      <AvatarFallback>You</AvatarFallback>
                    </Avatar>
                  )}
                </motion.div>
              );
            })}
            {/* Display a loading spinner placeholder while waiting for AI response */}
            {isLoading && (
              <motion.div
                key="loading-message"
                variants={messageVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                transition={{ duration: 0.3 }}
                className="flex items-start space-x-4 mb-4 justify-start"
              >
                <Avatar className="border-2 border-primary">
                  <AvatarImage src="/ai-avatar.png" alt="AI" />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
                <div className="rounded-lg p-3 max-w-[70%] bg-secondary text-secondary-foreground shadow-md flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <p className="text-sm leading-relaxed">Thinking...</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </ScrollArea>
        <div className="flex items-center space-x-2 mt-4">
          <Input
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
