import { sendMessageGemini } from "./models/gemini";
import { sendMessageLocal } from "./models/llama";

const isLocal = process.env.MODE === "local";

export async function sendMessage(message: string): Promise<string> {
  if (isLocal) return sendMessageLocal(message);
  return sendMessageGemini(message);
}
