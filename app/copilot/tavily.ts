// /components/Copilot/tavily.ts

import OpenAI from "openai";

const TAVILY_API = process.env.NEXT_PUBLIC_TAVILY_API_KEY;

export async function research(query: string) {

  const response = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      api_key: TAVILY_API,
      query,
      search_depth: "basic",
      include_answer: true,
      include_images: true,
      include_raw_content: false,
      max_results: 20,
    }),
  });

  const responseJson = await response.json();
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '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';
  const openai = new OpenAI({ apiKey: OPENAI_API_KEY, dangerouslyAllowBrowser: true });

  console.log("TAVILY RESPONSE", responseJson);

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `Summarize the following JSON to answer the research query \`"${query}"\`: ${JSON.stringify(
          responseJson,
        )} in plain English. Make sure to include the links to all images and the sources of the information you provide.`,
      },
    ],
    model: "gpt-4o",
  });

  console.log("SUMMARY", completion.choices[0].message.content);

  return completion.choices[0].message.content;
}