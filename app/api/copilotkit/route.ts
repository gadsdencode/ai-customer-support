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
