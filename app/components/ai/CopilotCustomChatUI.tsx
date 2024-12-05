/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
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
import { Loader2, Trash2, RotateCcw } from "lucide-react";
import { gsap } from "gsap";
import { motion, AnimatePresence } from "framer-motion";
import ErrorBoundary from "@/app/components/errors/ErrorBoundary";
import { useToast } from "@/hooks/use-toast";
// import { useExecuteAction } from "@/app/services/actionService";
import { HumanApprovalModal } from "./HumanApprovalModal";
import { useAgentUI } from "@/hooks/useAgentUI";
import { useRealtimeActions } from "@/hooks/useRealTimeActions";
import { useCoAgentStateRender } from "@/hooks/useCoAgentStateRender";
import { ActionContext, ActionResult, AgentUIState } from "@/app/types/agent";
import { ENDPOINTS } from "@/app/configs/endpoints";
import { AgentUIProvider } from '@/app/providers/AGUIProvider';
import AGUIShowcase from '@/app/components/ai/views/AGUIShowcase';

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
  const viewportRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { isProcessing } = useRealtimeActions();

  // CoAgent State with proper typing
  const {
    needsApproval,
    setNeedsApproval,
    pendingAction,
    setPendingAction,
    executeAction,
    renderDynamicUI: renderCoAgentUI,
    status,
    state,
    streamState
  } = useCoAgentStateRender({
    name: "weather_agent",
    streamEndpoint: `${ENDPOINTS.LOCAL.BASE}${ENDPOINTS.LOCAL.ACTIONS}`,
    render: ({ status, state }) => {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4"
        >
          {status === 'thinking' && (
            <div className="flex items-center space-x-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Thinking...</span>
            </div>
          )}
          {status === 'response' && (
            <div className="bg-secondary rounded-lg p-4">
              <pre className="whitespace-pre-wrap text-sm">
                {JSON.stringify(state, null, 2)}
              </pre>
            </div>
          )}
        </motion.div>
      );
    }
  });

  // Agent UI State
  const { uiState, updateUIState, renderDynamicUI: renderAgentUI } = useAgentUI();

  // Update state based on CoAgent changes
  useEffect(() => {
    // Skip if no meaningful state change
    if (!status || !state) return;

    // Create the new state based on current conditions
    const newState: Partial<AgentUIState> = state && Object.keys(state).length > 0
      ? {
          currentView: 'action' as const,
          actions: ['process', 'ignore'],
          context: state
        }
      : {
          currentView: 'thinking' as const,
          context: { step: streamState.currentStep }
        };

    // Update UI state with the new state
    updateUIState(newState);
  }, [status, state, streamState.currentStep, updateUIState]);

  // Ensure hooks are called before any conditional returns
  // Move any hooks above this line

  // Handle early return after hooks are called

  // Add action handling
  const handleRealtimeAction = useCallback(
    async (actionName: string, parameters: Record<string, any>): Promise<ActionResult> => {
      const MAX_RETRIES = 3;
      const RETRY_DELAY = 1000;

      const makeRequest = async (
        attempt: number = 1
      ): Promise<ActionResult> => {
        try {
          if (!actionName) {
            throw new Error("Action name is required");
          }

          const requestOptions: RequestInit = {
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
          };

          const response = await fetch(
            `${ENDPOINTS.LOCAL.BASE}${ENDPOINTS.LOCAL.ACTIONS}`,
            requestOptions
          );

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
              errorData.message ||
                `Server responded with status: ${response.status}`
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
          } as ActionResult;
        } catch (error) {
          console.error(`Attempt ${attempt} failed:`, error);

          if (attempt < MAX_RETRIES) {
            console.log(`Retrying... Attempt ${attempt + 1} of ${MAX_RETRIES}`);
            await new Promise((resolve) =>
              setTimeout(resolve, RETRY_DELAY * attempt)
            );
            return makeRequest(attempt + 1);
          }

          return {
            success: false,
            error:
              error instanceof Error
                ? error.message
                : "Unknown error occurred",
            timestamp: new Date().toISOString(),
          } as ActionResult;
        }
      };

      return makeRequest();
    },
    []
  );
  
  // Add error handling utility
  const handleError = useCallback(
    (error: unknown) => {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";

      console.error("Message send failed:", errorMessage);

      toast({
        title: "Communication Error",
        description: `Failed to send message: ${errorMessage}`,
        variant: "destructive",
        duration: 5000,
      });
    },
    [toast]
  );

  const sendMessageHandler = useCallback(
    async (content: string) => {
      if (!content?.trim()) return;

      try {
        // Create message with safe defaults
        const message = new TextMessage({
          content,
          role: Role.User,
          id: `msg-${Date.now()}`,
        });

        // Ensure visibleMessages is initialized
        if (!Array.isArray(visibleMessages)) {
          console.warn("visibleMessages is not initialized properly");
          setMessages([message]);
        } else {
          appendMessage(message);
        }

        setInputValue("");

        // First, trigger the agent state update
        await executeAction(
          { type: "processMessage", payload: { message: content } },
          { type: "processMessage", payload: { message: content } }
        );

        // Then handle the chat response
        const context: ActionContext = {
          type: "sendMessage",
          payload: { message: content }
        };

        const result = await handleRealtimeAction("sendMessage", context);

        if (!result?.success) {
          throw new Error(result?.error || "Message sending failed");
        }

        // Handle successful response
        if (result.data && typeof result.data.response === 'string') {
          const responseMessage = new TextMessage({
            content: result.data.response,
            role: Role.Assistant,
            id: `msg-${Date.now()}-response`,
          });
          appendMessage(responseMessage);

          // Update agent state with response
          await executeAction(
            { type: "processResponse", payload: { response: result.data.response } },
            { type: "processResponse", payload: { response: result.data.response } }
          );
        }
      } catch (error) {
        handleError(error);
      }
    },
    [appendMessage, handleRealtimeAction, setInputValue, setMessages, visibleMessages, handleError, executeAction]
  );

  // Memoize scroll handler
  const scrollToBottom = useCallback(() => {
    if (viewportRef.current) {
      requestAnimationFrame(() => {
        viewportRef.current?.scrollTo({
          top: viewportRef.current.scrollHeight,
          behavior: "smooth",
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

  const messageVariants = useMemo(
    () => ({
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
    }),
    []
  );

  // Memoize the value for useCopilotReadable
  const copilotReadableValue = useMemo(
    () => ({
      messageCount: visibleMessages.length,
      isLoading,
      lastMessage:
        visibleMessages[visibleMessages.length - 1]?.isTextMessage,
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
        title: "AI Action Success",
        description: "The AI action was successful.",
        variant: "default",
        duration: 2000,
      });
      sendMessageHandler(message);
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
    <AgentUIProvider>
      <Card
        ref={chatCardRef}
        className="w-[90vw] mx-auto h-[90vh] flex flex-col bg-gradient-to-br from-gray-900 to-gray-800 shadow-lg rounded-xl overflow-hidden border border-gray-700"
      >
        <CardContent className="flex flex-col h-full p-6">
          <ErrorBoundary>
            <AGUIShowcase />
            {/* Render both UI systems */}
            <div className="mb-4">
              {renderAgentUI()}
              {renderCoAgentUI()}
            </div>
            
            {/* Chat messages */}
            <div className="flex-grow pr-4 custom-scrollbar" ref={scrollAreaRef}>
              {needsApproval && (
                <HumanApprovalModal
                  isOpen={needsApproval}
                  onClose={() => {
                    setNeedsApproval(false);
                    updateUIState({ currentView: 'default' });
                  }}
                  onApprove={async () => {
                    if (pendingAction && uiState.context) {
                      await executeAction(
                        { type: pendingAction, payload: {} },
                        { type: pendingAction, payload: uiState.context }
                      );
                      updateUIState({ currentView: 'default' });
                    }
                  }}
                  onReject={() => {
                    setNeedsApproval(false);
                    setPendingAction(null);
                    updateUIState({ currentView: 'default' });
                  }}
                  data={typeof pendingAction === 'string' ? { action: pendingAction } : {}}
                />
              )}
              
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
                          <AvatarImage
                            src="/generic-support-avatar.png"
                            alt="User"
                          />
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
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isProcessing) {
                  e.preventDefault();
                  sendMessageHandler(inputValue);
                }
              }}
            />
            <Button
              onClick={() => sendMessageHandler(inputValue)}
              disabled={isProcessing || inputValue.trim() === ""}
            >
              {isProcessing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Send"
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
