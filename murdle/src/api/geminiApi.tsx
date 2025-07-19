
// api/geminiService.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { mysteryPrompt } from "../prompts/mysteryPrompt";
import { conversationPrompt } from "../prompts/conversationPrompt";
import { accusationPrompt } from "../prompts/accusationPrompt";

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY || "");
let chatSession: Awaited<ReturnType<ReturnType<typeof genAI.getGenerativeModel>["startChat"]>> | null = null;

export async function startNewMysteryChat(): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  chatSession = model.startChat({
    history: [{ role: "user", parts: [{text: mysteryPrompt}] }],
  });

  const result = await chatSession.sendMessage("Start the mystery.");
  return result.response.text();
}

// export async function askSuspect(suspect: string, question: string, story: string): Promise<string> {
//   const prompt = conversationPrompt(suspect, question, story);
//   const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
//   const result = await model.generateContent(prompt);
//   return result.response.text();
// }

// export async function accuseSuspect(suspect: string, justification: string, story: string): Promise<string> {
//   const prompt = accusationPrompt(suspect, justification, story);
//   const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
//   const result = await model.generateContent(prompt);
//   return result.response.text();
// }


