import { Ollama } from "@langchain/community/llms/ollama";
import chat from "@/chat";

const model = new Ollama({
  baseUrl: "http://localhost:11434", // Default value
  model: "mistral",
});

const talk = await chat(model, "clu57tiro0001qmiqmsy7cis7");
await talk("Wow, that's cool!");
