/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/copilotkit/route.ts

import {
  CopilotRuntime,
  OpenAIAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from '@copilotkit/runtime';
import OpenAI from 'openai';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import logger from '@/app/utils/logger';
//import { ENDPOINTS } from '@/app/configs/endpoints';
// import { useCopilotAction } from '@copilotkit/react-core';
import { Action, CopilotAction } from '@/app/types/copilot';
// Add interface for message structure
interface Message {
  role: string;
  content: string;
  // Add other message properties as needed
}

// Helper function to extract state from messages
function extractStateFromMessages(messages: Message[]): any {
  return {
    lastMessage: messages[messages.length - 1]?.content || null,
    messageCount: messages.length,
    timestamp: new Date().toISOString()
  };
}

// Environment configuration validation
const EnvSchema = z.object({
  NEXT_PUBLIC_OPENAI_API_KEY: z.string().min(1),
  NEXT_PUBLIC_REMOTE_ENDPOINT: z.string().url(),
});

// Type-safe environment variables
/*const env = EnvSchema.parse({
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  NEXT_PUBLIC_REMOTE_ENDPOINT: `${ENDPOINTS.PRODUCTION.BASE}/copilotkit_remote`,
});*/

const env = EnvSchema.parse({
  NEXT_PUBLIC_OPENAI_API_KEY: process.env.NEXT_PUBLIC_OPENAI_API_KEY || '',
  NEXT_PUBLIC_REMOTE_ENDPOINT: process.env.NEXT_PUBLIC_REMOTE_ENDPOINT || '',
});

// Initialize services
const openai = new OpenAI({ apiKey: env.NEXT_PUBLIC_OPENAI_API_KEY || '' });
const serviceAdapter = new OpenAIAdapter({ openai });

// Define your default actions
const defaultActions: CopilotAction[] = [
  {
    name: "sendMessage",
    description: "Send a message in the chat",
    parameters: [
      {
        name: "message",
        type: "string",
        description: "The message content"
      }
    ],
    handler: async (args: any) => {
      // Implement the handler logic here
      return { success: true, data: args };
    }
  },
  {
    name: "emitState",
    description: "Emit agent state",
    parameters: [
      {
        name: "messages",
        type: "array",
        description: "The list of messages"
      },
      {
        name: "config",
        type: "object",
        description: "The current runnable config"
      }
    ],
    handler: async (args: { messages: Message[]; config: any }) => {  // remove io
      const state = extractStateFromMessages(args.messages);
      return { success: true, state };  // just return the state
    }
  }
];


// Initialize the CopilotRuntime instance with remote action endpoints
const runtime = new CopilotRuntime({
  actions: defaultActions as unknown as Action<CopilotAction[]>[],
  remoteActions: [
    {
      url: env.NEXT_PUBLIC_REMOTE_ENDPOINT,
    },
  ],
});

// Base handler for POST requests
export async function POST(req: NextRequest) {
  try {
    const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
      runtime,
      serviceAdapter,
      endpoint: '/api/copilotkit',
    });

    logger.info('Processing Copilot Runtime Request', {
      method: req.method,
      url: req.url,
    });

    return handleRequest(req);
  } catch (error) {
    logger.error('API Route Error:', { error });

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}