import dotenv from "dotenv";
dotenv.config();

import Groq from "groq-sdk";
import { STORE_KNOWLEDGE } from "./storeKnowledge.js";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * Generates an AI response using the Groq SDK.
 * Includes conversation history and store-specific knowledge.
 */
export async function generateAIResponse(userMessage: string, history: any[]) {
  if (!process.env.GROQ_API_KEY) {
    console.error("Missing GROQ_API_KEY in environment variables.");
    return "I'm currently offline (API key missing). Please contact support at support@spurstore.com.";
  }

  try {
    const messages = [
      { role: "system", content: STORE_KNOWLEDGE },
      ...history.map(m => ({ 
        role: m.role === "assistant" ? "assistant" : "user", 
        content: m.text 
      })),
      { role: "user", content: userMessage }
    ];

    const completion = await groq.chat.completions.create({
      messages: messages as any,
      model: "llama-3.3-70b-versatile", // Upgraded to 70b for better reasoning
      temperature: 0.7,
      max_tokens: 500,
    });

    const reply = completion.choices[0]?.message?.content;
    
    if (!reply) {
      throw new Error("Empty response from LLM");
    }

    return reply;

  } catch (error: any) {
    console.error("LLM Service Error:", error.message || error);
    
    // Handle specific error types
    if (error.status === 429) {
      return "I'm receiving too many requests right now. Please wait a moment and try again.";
    }
    
    if (error.status === 401) {
      return "Authentication error with our AI brain. Support has been notified.";
    }

    return "I'm sorry, I'm having trouble processing that right now. Can you try again?";
  }
}