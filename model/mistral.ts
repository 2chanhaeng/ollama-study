import { Ollama } from "@langchain/community/llms/ollama";

const mistral = new Ollama({
  baseUrl: "http://localhost:11434", // Default value
  model: "mistral",
});

export default mistral;
