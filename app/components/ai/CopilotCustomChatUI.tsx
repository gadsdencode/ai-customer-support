/* eslint-disable @typescript-eslint/no-explicit-any */
// File: src/components/ai/CopilotCustomChatUI.tsx
"use client";

import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import {
  useCopilotAction,
  useCopilotChat,
  useCopilotReadable,
} from "@copilotkit/react-core";
import { Role, TextMessage } from "@copilotkit/runtime-client-gql";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Trash2, RotateCcw, Send } from "lucide-react";
import { gsap } from "gsap";
import { motion, AnimatePresence } from "framer-motion";
import ErrorBoundary from "@/app/components/errors/ErrorBoundary";
import { useToast } from "@/hooks/use-toast";
import { HumanApprovalModal } from "./HumanApprovalModal";
import { useAgentUI } from "@/hooks/useAgentUI";
import { useCoAgentStateRender } from "@/hooks/useCoAgentStateRender";
import { ActionContext, ActionResult, ViewTypeEnum } from "@/app/types/agent";
import { AgentUIProvider } from "@/app/providers/AGUIProvider";
import { DynamicUIRenderer } from "@/app/components/ai/views/DynamicUIRenderer";
import { useAgentStore } from "@/app/store/AgentStateStore";
import { ENDPOINTS } from "@/app/configs/endpoints";
import { ProcessingAnimation } from "@/app/components/ai/views/ProcessingAnimation";
import logger from "@/app/utils/logger"; // Import logger utility

// Define chat state enum for consolidated state management
enum ChatState {
  IDLE = "idle",
  RESPONDING = "responding",
  RENDERED = "rendered",
}

export function CopilotCustomChatUI() {
  const { toast } = useToast();
  const [inputValue, setInputValue] = useState<string>("");
  const chatCardRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Consolidated chat state management
  const [chatState, setChatState] = useState<ChatState>(ChatState.IDLE);

  // Get showDynamicUI and isThinking from the store with explicit typing
  const showDynamicUI = useAgentStore((state) => state.state.showDynamicUI);
  const isThinking = useAgentStore((state) => state.state.isThinking);

  const {
    visibleMessages,
    appendMessage,
    setMessages,
    reloadMessages,
    stopGeneration,
    isLoading,
  } = useCopilotChat();

  const {
    needsApproval,
    setNeedsApproval,
    pendingAction,
    setPendingAction,
    executeAction,
    renderDynamicUI: renderCoAgentUI,
  } = useCoAgentStateRender({
    name: "inteleos_agent",
    streamEndpoint: `${ENDPOINTS.PRODUCTION.BASE}${ENDPOINTS.PRODUCTION.ACTIONS}`,
    render: ({ status, state }) => (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg backdrop-blur-sm"
      >
        {status === "thinking" && (
          <div className="flex items-center space-x-2">
            <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
            <span className="text-blue-500 font-medium">Processing request...</span>
          </div>
        )}
        {status === "response" && (
          <div className="bg-white/10 rounded-lg p-4 shadow-lg">
            <pre className="whitespace-pre-wrap text-sm text-gray-200">
              {JSON.stringify(state, null, 2)}
            </pre>
          </div>
        )}
      </motion.div>
    ),
  });

  const renderDynamicContent = useCallback(() => {
    if (isThinking) {
      return (
        <React.Fragment key="dynamic-ui">
          {renderCoAgentUI()}
          <DynamicUIRenderer />
        </React.Fragment>
      );
    }
    return null;
  }, [isThinking, renderCoAgentUI]);

  const { uiState, updateUIState } = useAgentUI();

  const handleRealtimeAction = useCallback(
    async (actionName: string, parameters: Record<string, any>): Promise<ActionResult> => {
      const MAX_RETRIES = 3;
      const RETRY_DELAY = 1000;

      const makeRequest = async (attempt: number = 1): Promise<ActionResult> => {
        try {
          if (!actionName) {
            throw new Error("Action name is required");
          }

          const response = await fetch(
            `${ENDPOINTS.PRODUCTION.BASE}${ENDPOINTS.PRODUCTION.ACTIONS}`,
            {
              method: "POST",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Origin: window.location.origin,
              },
              body: JSON.stringify({
                action_name: actionName,
                parameters: parameters || {},
              }),
            }
          );

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
              errorData.message || `Server responded with status: ${response.status}`
            );
          }

          const data = await response.json();
          return {
            success: true,
            data: {
              response: data.response,
              metadata: data.metadata,
            },
            timestamp: new Date().toISOString(),
          };
        } catch (error) {
          logger.error(`Attempt ${attempt} failed in handleRealtimeAction:`, { error, actionName, parameters });

          if (attempt < MAX_RETRIES) {
            await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY * attempt));
            return makeRequest(attempt + 1);
          }

          return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error occurred",
            timestamp: new Date().toISOString(),
          };
        }
      };

      return makeRequest();
    },
    []
  );

  const sendMessageHandler = useCallback(
    async (content: string) => {
      if (!content.trim()) return;

      try {
        setChatState(ChatState.RESPONDING);
        setInputValue("");

        const userMessage = new TextMessage({
          content,
          role: Role.User,
          id: `msg-${Date.now()}`,
        });
        appendMessage(userMessage);

        await executeAction(
          { type: "processMessage", payload: { message: content } },
          { type: "processMessage", payload: { message: content } }
        );

        const context: ActionContext = {
          type: "sendMessage",
          payload: { message: content },
        };

        const result = await handleRealtimeAction("sendMessage", context);

        if (!result?.success) {
          throw new Error(result?.error || "Message sending failed");
        }

        if (result.data && typeof result.data.response === "string") {
          const responseMessage = new TextMessage({
            content: result.data.response,
            role: Role.Assistant,
            id: `msg-${Date.now()}-response`,
          });
          appendMessage(responseMessage);
          setChatState(ChatState.RENDERED);
        }
      } catch (error) {
        logger.error("Message send failed:", { error, content });
        const errorMessage = new TextMessage({
          content: "An error occurred while processing your request.",
          role: Role.Assistant,
          id: `error-${Date.now()}`,
        });
        appendMessage(errorMessage);
        setChatState(ChatState.RENDERED);
      }
    },
    [appendMessage, handleRealtimeAction, executeAction]
  );

  useEffect(() => {
    if (chatState === ChatState.RENDERED) {
      const timer = setTimeout(() => setChatState(ChatState.IDLE), 1000);
      return () => clearTimeout(timer);
    }
  }, [chatState]);

  const scrollToBottom = useCallback(() => {
    if (viewportRef.current) {
      gsap.to(viewportRef.current, {
        scrollTop: viewportRef.current.scrollHeight,
        duration: 0.5,
        ease: "power2.out",
      });
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timeoutId);
  }, [visibleMessages, scrollToBottom]);

  const messageVariants = useMemo(
    () => ({
      hidden: { opacity: 0, y: 20, scale: 0.95 },
      visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { type: "spring", stiffness: 260, damping: 20 },
      },
      exit: {
        opacity: 0,
        y: -20,
        scale: 0.95,
        transition: { duration: 0.2, ease: "easeInOut" },
      },
    }),
    []
  );

  const copilotReadableValue = useMemo(
    () => ({
      messageCount: visibleMessages.length,
      isLoading,
      lastMessage: visibleMessages[visibleMessages.length - 1]?.isTextMessage,
    }),
    [visibleMessages, isLoading]
  );

  useCopilotReadable({
    description: "Chat UI State",
    value: copilotReadableValue,
  });

  const sendJokeMessageHandler = useCallback(
    async ({ message }: { message: string }) => {
      toast({
        title: "AI Action Success",
        description: "The AI action was successful.",
        variant: "default",
        duration: 2000,
      });
      await sendMessageHandler(message);
    },
    [toast, sendMessageHandler]
  );

  const clearChatHandler = useCallback(async () => {
    setMessages([]);
    toast({
      title: "AI Action Success",
      description: "The AI action was successful.",
      variant: "default",
      duration: 2000,
    });
    return "Chat cleared successfully";
  }, [setMessages, toast]);

  useCopilotAction({
    name: "sendJokeMessage",
    description: "Send a clever joke to the chat",
    parameters: [{ name: "message", type: "string", description: "The message to send" }],
    handler: sendJokeMessageHandler,
  });

  useCopilotAction({
    name: "clearChat",
    description: "Clear all chat messages",
    parameters: [],
    handler: clearChatHandler,
  });

  return (
    <AgentUIProvider>
      <Card
        ref={chatCardRef}
        className="w-[90vw] mx-auto h-[90vh] flex flex-col bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 shadow-2xl rounded-xl overflow-hidden border border-blue-500/30"
      >
        <CardContent className="flex flex-col h-[70vh] p-6">
          <ErrorBoundary>
            <div
              className="flex-grow pr-4 custom-scrollbar overflow-y-auto"
              ref={scrollAreaRef}
            >
              <AnimatePresence initial={false} mode="sync">
                {visibleMessages.map((message, index) => {
                  const { role, content } = message as TextMessage;
                  if (!content || content.trim() === "") return null;

                  return (
                    <motion.div
                      key={message.id || index}
                      variants={messageVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className={`flex items-start space-x-4 mb-4 ${
                        role === Role.User ? "justify-end" : "justify-start"
                      }`}
                    >
                      {role !== Role.User && (
                        <Avatar className="border-2 border-blue-500 shadow-glow-blue">
                          <AvatarImage src="/support-avatar.png" alt="AI" />
                          <AvatarFallback>AI</AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`rounded-lg p-3 max-w-[70%] ${
                          role === Role.User
                            ? "bg-blue-600 text-white"
                            : "bg-gray-800/30 text-gray-200"
                        } shadow-md transition-all duration-300 ease-in-out hover:shadow-lg relative overflow-hidden backdrop-blur-sm`}
                      >
                        <p className="text-sm leading-relaxed">{content}</p>
                        {role !== Role.User && (
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 animate-shimmer" />
                        )}
                      </div>
                      {role === Role.User && (
                        <Avatar className="border-2 border-purple-500 shadow-glow-purple">
                          <AvatarImage src="/generic-support-avatar.png" alt="User" />
                          <AvatarFallback>You</AvatarFallback>
                        </Avatar>
                      )}
                    </motion.div>
                  );
                })}

                <AnimatePresence mode="wait">
                  {chatState === ChatState.RESPONDING && (
                    <motion.div
                      key="processing"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ProcessingAnimation />
                    </motion.div>
                  )}
                </AnimatePresence>

                {showDynamicUI && (
                  <React.Fragment key="dynamic-ui">
                    {renderCoAgentUI()}
                    {renderDynamicContent()}
                  </React.Fragment>
                )}

                {needsApproval && (
                  <HumanApprovalModal
                    isOpen={needsApproval}
                    onClose={() => {
                      setNeedsApproval(false);
                      updateUIState({ currentView: ViewTypeEnum.APPROVAL });
                    }}
                    onApprove={async () => {
                      if (pendingAction && uiState.context) {
                        await executeAction(
                          { type: pendingAction, payload: {} },
                          { type: pendingAction, payload: uiState.context }
                        );
                        updateUIState({ currentView: ViewTypeEnum.APPROVAL });
                      }
                    }}
                    onReject={() => {
                      setNeedsApproval(false);
                      setPendingAction(null);
                      updateUIState({ currentView: ViewTypeEnum.APPROVAL });
                    }}
                    data={
                      typeof pendingAction === "string" ? { action: pendingAction } : {}
                    }
                  />
                )}
              </AnimatePresence>
            </div>
          </ErrorBoundary>

          <div className="flex items-center space-x-2 mt-4">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && chatState !== ChatState.RESPONDING) {
                  e.preventDefault();
                  sendMessageHandler(inputValue);
                }
              }}
              disabled={chatState === ChatState.RESPONDING}
              className="bg-gray-800/50 border-gray-700 text-gray-200 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Type your message..."
            />
            <Button
              onClick={() => sendMessageHandler(inputValue)}
              disabled={chatState === ChatState.RESPONDING || inputValue.trim() === ""}
              className="bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-300 flex items-center justify-center"
            >
              {chatState === ChatState.RESPONDING ? (
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
    </AgentUIProvider>
  );
}