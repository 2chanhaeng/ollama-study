import { Ollama } from "@langchain/community/llms/ollama";

const llama2 = new Ollama({
  baseUrl: "http://localhost:11434", // Default value
  model: "llama2",
});

export default llama2;
