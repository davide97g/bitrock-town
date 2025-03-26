import { ChatSession, GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey ?? "");

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseModalities: [],
  responseMimeType: "text/plain",
};

let chatSession: ChatSession;

export function run() {
  console.info("*** Starting Chat for GEMINI ***");
  chatSession = model.startChat({
    generationConfig,
    history: [],
  });
}

export async function sendMessageGemini(message: string) {
  if (!chatSession) run();
  const result = await chatSession.sendMessage(message);
  return result.response.text();
}
