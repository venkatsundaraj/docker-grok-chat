import { streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { NextRequest } from "next/server";

const groq = createOpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: NextRequest) {
  const { messages } = await req.json();
  const result = streamText({
    model: groq("llama-3.1-8b-instant"),
    messages,
  });
  return result.toDataStreamResponse();
}
