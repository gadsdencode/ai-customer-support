/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useCopilotReadableState.ts
import { useCopilotReadable } from '@copilotkit/react-core';
import { useContext, useMemo } from 'react';
import { InteleosContext } from '@/app/contexts/InteleosContext';
import { ExtendedCopilotContextParams } from '@/app/types/copilot';
// import { createReadableConfigs } from '@/app/configs/copilotReadableConfigs';

interface CopilotReadableOptions {
  description: string;
  value: any;
  categories?: string[];
}

export const useCopilotReadableState = (
  options: {
    chatState?: {
      visibleMessages: any[];
      isLoading: boolean;
    };
    appState?: any;
    additionalConfigs?: CopilotReadableOptions[];
  } = {}
) => {
  const contextValues = useContext(InteleosContext) as ExtendedCopilotContextParams;

  // Document Context
  useCopilotReadable({
    description: 'Inteleos company information and CX data',
    value: contextValues.addDocumentContext,
    categories: ['documentContext'],
  });

  // Chat Messages
  useCopilotReadable({
    description: "Chat UI State",
    value: {
      messages: options.chatState?.visibleMessages || [],
    },
    categories: ['chatState'],
  });

  // Chat Loading
  useCopilotReadable({
    description: "Chat UI Loading State",
    value: {
      isLoading: options.chatState?.isLoading || false,
    },
    categories: ['chatState'],
  });

  // User Info
  useCopilotReadable({
    description: 'Current user information',
    value: options.appState?.user || null,
    categories: ['userState'],
  });

  // App State
  useCopilotReadable({
    description: 'Application state',
    value: options.appState || null,
    categories: ['appState'],
  });

  // Additional Config 1
  useCopilotReadable({
    description: options.additionalConfigs?.[0]?.description || 'Additional Config 1',
    value: options.additionalConfigs?.[0]?.value || null,
    categories: options.additionalConfigs?.[0]?.categories || [],
  });

  // Additional Config 2
  useCopilotReadable({
    description: options.additionalConfigs?.[1]?.description || 'Additional Config 2',
    value: options.additionalConfigs?.[1]?.value || null,
    categories: options.additionalConfigs?.[1]?.categories || [],
  });

  // Additional Config 3
  useCopilotReadable({
    description: options.additionalConfigs?.[2]?.description || 'Additional Config 3',
    value: options.additionalConfigs?.[2]?.value || null,
    categories: options.additionalConfigs?.[2]?.categories || [],
  });

  // Context Config 1
  useCopilotReadable({
    description: 'Context Config 1',
    value: contextValues || null,
    categories: ['contextConfig'],
  });

  // Memoize the configs for return value
  const allConfigs = useMemo(() => [
    {
      description: 'Inteleos company information and CX data',
      value: contextValues.addDocumentContext,
      categories: ['documentContext'],
    },
    {
      description: "Chat UI State",
      value: {
        messages: options.chatState?.visibleMessages || [],
      },
      categories: ['chatState'],
    },
    {
      description: "Chat UI Loading State",
      value: {
        isLoading: options.chatState?.isLoading || false,
      },
      categories: ['chatState'],
    },
    {
      description: 'Current user information',
      value: options.appState?.user || null,
      categories: ['userState'],
    },
    {
      description: 'Application state',
      value: options.appState || null,
      categories: ['appState'],
    },
    ...(options.additionalConfigs || []).slice(0, 3),
    {
      description: 'Context Config 1',
      value: contextValues || null,
      categories: ['contextConfig'],
    },
  ].filter(config => config.value !== null), [
    contextValues,
    options.chatState?.visibleMessages,
    options.chatState?.isLoading,
    options.appState,
    options.additionalConfigs,
  ]);

  return { configs: allConfigs };
};