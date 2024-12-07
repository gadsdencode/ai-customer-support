// /components/Copilot/tavily.ts

import OpenAI from "openai";

const TAVILY_API = process.env.NEXT_PUBLIC_TAVILY_API_KEY || '';
if (!TAVILY_API) {
  throw new Error("Missing TAVILY_API_KEY environment variable.");
}

export async function research(query: string) {
  if (!query) {
    throw new Error('Query cannot be empty.');
  }

  const response = await fetch('https://api.tavily.com/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TAVILY_API}`
    },
    body: JSON.stringify({
      query: query,
      api_key: TAVILY_API,
      search_depth: "advanced",
      include_answer: true,
      include_images: true,
      include_raw_content: false,
      max_results: 25,
    }),
  });

  // Check if the response was successful
  if (!response.ok) {
    const errorData = await response.json();
    console.error("Tavily API response error:", errorData);
    throw new Error(`Tavily API request failed with status ${response.status}: ${JSON.stringify(errorData)}`);
  }

  const responseJson = await response.json();
  const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY || '';

  if (!OPENAI_API_KEY) {
    throw new Error("Missing NEXT_PUBLIC_OPENAI_API_KEY environment variable.");
  }

  const openai = new OpenAI({ apiKey: OPENAI_API_KEY, dangerouslyAllowBrowser: true });

  console.log("TAVILY RESPONSE", responseJson);

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `Provide detailed answers based on the following JSON to answer the research query \`"${query}"\`: ${JSON.stringify(
          responseJson,
        )} in plain English. Note your sources and links as you would for a professional research paper.`,
      },
    ],
    model: "gpt-4o-mini",
  });

  console.log("SUMMARY", completion.choices[0].message.content);

  return completion.choices[0].message.content;
}