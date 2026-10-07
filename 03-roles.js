import { createClient } from "./llm-client.js";

const MODEL = "llama3.2:3b";
const client = createClient({ provider: "ollama", model: MODEL });

const codeToReview = `
app.get('/users/:id', async (req, res) => {
  const user = await db.query('SELECT * FROM users WHERE id = ' + req.params.id);
  res.json(user);
});`;

async function main() {
  const result = await client.chat({
    model: MODEL,
    messages: [
      {
        role: "system",
        content: `You are a senior backend engineer reviewing code.
Be concise, be specific, and always name the exact line or pattern you're flagging.
Also flag any security concerns. Make sure the response stays under 50 words.`,
      },
      {
        role: "user",
        content: `Review this:\n${codeToReview}`,
      },
      {
        role: "assistant",
        content:
          "**Security Concern:** Vulnerable to SQL injection attacks. \n" +
          "\n" +
          "**Code Improvement:**\n" +
          "Use parameterized queries instead of concatenating user input:\n" +
          "```javascript\n" +
          "app.get('/users/:id', async (req, res) => {\n" +
          "  const userId = parseInt(req.params.id);\n" +
          "  const user = await db.query('SELECT * FROM users WHERE id = ?', [userId]);\n" +
          "  res.json(user);\n" +
          "});\n" +
          "```\n" +
          "**Best Practice Tip:** Use a consistent naming convention throughout the codebase, e.g., `PascalCase` or `camelCase`. Consistent naming conventions make code easier to read and maintain.",
      },
      {
        role: "user",
        content: `Give a random tip of software engineering best practices. Refer to the above past response and generate a new tip this time`,
      },
    ],
    options: {
      num_predict: -1,
    },
  });

  console.log(result.raw);
}

main();
