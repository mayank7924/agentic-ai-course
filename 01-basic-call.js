import ollama from "ollama";

const MODEL = "llama3.2:3b";

async function main() {
  const response = await ollama.chat({
    model: MODEL,
    messages: [
      {
        role: "user",
        content: "In one sentence, explain what is a distributed system.",
      },
    ],
  });

  console.log(response.message.content);
}

main();
