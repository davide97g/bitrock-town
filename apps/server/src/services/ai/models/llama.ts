const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "llama3.2";

export async function sendMessageLocal(message: string) {
  console.info("sendMessageLocal", message);
  const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      prompt: message,
      stream: false,
    }),
  });

  console.info("sendMessageLocal", response.status);

  const data = await response.json();
  return data.response;
}
