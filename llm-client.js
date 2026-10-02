import ollama from "ollama";
import OpenAI from "openai";

function createOllamaClient({ model }) {
  return {
    provider: "ollama",
    model,
    async chat({ messages, options } = {}) {
      const response = await ollama.chat({
        model,
        messages,
        options,
      });
      return {
        content: response.message.content,
        raw: response,
      };
    },
  };
}

function createOpenAIClient({ model, apiKey }) {
  const client = new OpenAI({ apiKey: apiKey ?? process.env.OPENAI_API_KEY });
  return {
    provider: "openai",
    model,
    async chat({ messages, options } = {}) {
      const response = await client.responses.create({
        model,
        input: toOpenAIInput(messages),
        temperature: options?.temperature,
        max_output_tokens: options?.num_predict,
        top_p: options?.top_p,
      });
      return {
        content: response.output_text,
        raw: response,
      };
    },
  };
}

export function createClient({ provider, model, apiKey } = {}) {
  if (provider === "ollama") return createOllamaClient({ model });
  if (provider === "openai") return createOpenAIClient({ model, apiKey });
  throw new Error(`Unknown provider: "${provider}". Use "ollama" or "openai".`);
}
