import { createClient } from "./llm-client.js";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const MODEL = "llama3.2:3b";
const client = createClient({ provider: "ollama", model: MODEL });

const codeToReview = `
app.get('/users/:id', async (req, res) => {
  const user = await db.query('SELECT * FROM users WHERE id = ' + req.params.id);
  res.json(user);
});`;

const SYSTEM_MESSAGE = `You are a senior backend engineer reviewing code.
Be concise, be specific, and always name the exact line or pattern you're flagging.
Also flag any security concerns. Make sure the response stays under 50 words.`;

const messages = [{ role: "system", content: SYSTEM_MESSAGE }];

const askModel = async (userText) => {
  const userMessage = { role: "user", content: userText };
  messages.push(userMessage);

  const result = await client.chat({
    model: MODEL,
    messages: messages,
    options: {
      num_ctx: 400,
    },
  });
  messages.push(result.raw.message);
  return result.raw;
};

const main = async () => {
  const userInput = readline.createInterface({ input, output });
  while (true) {
    const userText = (await userInput.question("\nYou: ")).trim();
    if (!userText || userText === "exit") break;
    const modelRawResponse = await askModel(userText);
    console.log("\nReviewer:", modelRawResponse.message.content);
    console.log(
      `[input: ${modelRawResponse.prompt_eval_count} tokens | output: ${modelRawResponse.eval_count} tokens | messages sent: ${messages.length - 1}]`,
    );
  }
  userInput.close();
};

main();
