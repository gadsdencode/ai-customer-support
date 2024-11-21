import {
    CopilotRuntime,
    OpenAIAdapter,
    copilotRuntimeNextJSAppRouterEndpoint,
  } from '@copilotkit/runtime';
  import OpenAI from 'openai';
  import { NextRequest } from 'next/server';
   
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || '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' });
  const serviceAdapter = new OpenAIAdapter({ openai });
  const runtime = new CopilotRuntime();
   
  export const POST = async (req: NextRequest) => {
    const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
      runtime,
      serviceAdapter,
      endpoint: '/api/copilotkit',
    });
   
    return handleRequest(req);
  };