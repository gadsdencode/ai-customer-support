/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/copilotkit/route.ts

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
import { Action, CopilotAction } from '@/app/types/copilot';
import { MessageRole } from '@copilotkit/runtime-client-gql';

// Enhanced message interface with optional properties
export interface Message {
  role: MessageRole;
  content: string;
  id?: string;
  timestamp?: string;
  metadata?: Record<string, unknown>;
}

// Enhanced state extraction with error handling
function extractStateFromMessages(messages: Message[]): any {
  try {
    return {
      lastMessage: messages[messages.length - 1]?.content || null,
      messageCount: messages.length,
      timestamp: new Date().toISOString(),
      messageHistory: messages.map(msg => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp || new Date().toISOString()
      }))
    };
  } catch (error) {
    logger.error('Error extracting state from messages:', { error });
    return {
      lastMessage: null,
      messageCount: 0,
      timestamp: new Date().toISOString(),
      error: 'Failed to extract state'
    };
  }
}

// Enhanced environment validation with detailed error messages
const EnvSchema = z.object({
  NEXT_PUBLIC_OPENAI_API_KEY: z.string().min(1, 'OpenAI API key is required'),
  NEXT_PUBLIC_REMOTE_ENDPOINT: z.string().url('Valid remote endpoint URL is required'),
});

// Validate environment variables with error handling
const env = (() => {
  try {
    return EnvSchema.parse({
      NEXT_PUBLIC_OPENAI_API_KEY: process.env.NEXT_PUBLIC_OPENAI_API_KEY || '',
      NEXT_PUBLIC_REMOTE_ENDPOINT: process.env.NEXT_PUBLIC_REMOTE_ENDPOINT || '',
    });
  } catch (error) {
    logger.error('Environment validation failed:', { error });
    throw new Error('Invalid environment configuration');
  }
})();

// Initialize OpenAI with error handling
const openai = new OpenAI({ 
  apiKey: env.NEXT_PUBLIC_OPENAI_API_KEY,
  timeout: 30000, // 30 second timeout
  maxRetries: 3
});
const serviceAdapter = new OpenAIAdapter({ openai });

// Enhanced default actions with proper error handling and typing
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
    handler: async (args: { message: string }) => {
      try {
        if (!args.message?.trim()) {
          throw new Error('Message content is required');
        }
        return { 
          success: true, 
          data: args,
          timestamp: new Date().toISOString()
        };
      } catch (error) {
        logger.error('Send message handler error:', { error, args });
        return { 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
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
    handler: async (args: { messages: Message[]; config: any }) => {
      try {
        const state = extractStateFromMessages(args.messages);
        return { 
          success: true, 
          state,
          timestamp: new Date().toISOString()
        };
      } catch (error) {
        logger.error('Emit state handler error:', { error, args });
        return { 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    }
  }
];

// Initialize CopilotRuntime with proper type casting and configuration
const runtime = new CopilotRuntime({
  actions: defaultActions as unknown as Action<CopilotAction[]>[],
  remoteActions: [
    {
      url: env.NEXT_PUBLIC_REMOTE_ENDPOINT,
    }
  ],
});

// Enhanced POST handler with detailed error handling
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
      timestamp: new Date().toISOString()
    });

    const response = await handleRequest(req);
    
    logger.info('Request processed successfully', {
      status: response.status,
      timestamp: new Date().toISOString()
    });

    return response;
  } catch (error) {
    logger.error('API Route Error:', { 
      error, 
      timestamp: new Date().toISOString(),
      stack: error instanceof Error ? error.stack : undefined
    });

    return NextResponse.json(
      { 
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}