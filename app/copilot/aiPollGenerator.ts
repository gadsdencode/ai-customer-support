// app/copilot/aiPollGenerator.ts

import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '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',
  dangerouslyAllowBrowser: true,
});

interface GeneratedPoll {
  question: string;
  options: string[];
}

export async function generatePollWithAI(topic: string): Promise<GeneratedPoll> {
  const prompt = `Generate a poll question and four answer options about the topic: "${topic}". 
  Respond with a JSON object containing "question" and "options" fields. 
  The "options" field should be an array of four strings. Do not include any markdown formatting.`;

  const messages: ChatCompletionMessageParam[] = [
    { role: "system", content: "You are a poll generation assistant. Respond only with valid JSON." },
    { role: "user", content: prompt },
  ];

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Changed from "gpt-4o" which seems to be a typo
      messages: messages,
    });

    const generatedContent = response.choices[0]?.message?.content;

    if (!generatedContent) {
      throw new Error("No content generated from AI");
    }

    // Strip any potential markdown formatting
    const cleanedContent = generatedContent.replace(/```json\n?|\n?```/g, '').trim();

    const parsedContent: GeneratedPoll = JSON.parse(cleanedContent);

    if (!parsedContent.question || !Array.isArray(parsedContent.options) || parsedContent.options.length !== 4) {
      throw new Error("Invalid AI response format");
    }

    return parsedContent;
  } catch (error) {
    console.error("Error generating poll with AI:", error);
    throw new Error("Failed to generate poll with AI");
  }
}