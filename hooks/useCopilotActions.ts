// hooks/useCopilotActions.ts
import { useCallback } from 'react';
import { useCopilotAction } from '@copilotkit/react-core';
import { useToast } from "@/hooks/use-toast";

export const useCopilotActions = (sendMessage?: (content: string) => void) => {
  const { toast } = useToast();

  const sendJokeMessageHandler = useCallback(
    async ({ message }: { message: string }) => {
      toast({
        title: "AI Action Success",
        description: "The AI action was successful.",
        variant: "default",
        duration: 2000,
      });
      sendMessage?.(message);
    },
    [sendMessage, toast]
  );

  const clearChatHandler = useCallback(async () => {
    toast({
      title: "AI Action Success",
      description: "The AI action was successful.",
      variant: "default",
      duration: 2000,
    });
    return "Chat cleared successfully";
  }, [toast]);

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

  return { sendJokeMessageHandler, clearChatHandler };
};