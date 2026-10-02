import { createClient } from "./llm-client.js";

const MODEL = "llama3.2:3b";
const client = createClient({ provider: "ollama", model: MODEL });

async function main() {
  const response = await client.chat({
    model: MODEL,
    messages: [
      {
        role: "user",
        content:
          "Give top 5 tips for learning JavaScript effectively.",
      },
    ],
    options: {
      num_predict: -1,
    },
  });

  console.log(response.raw);
}

main();
