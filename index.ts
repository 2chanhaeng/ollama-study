import { Ollama } from "ollama-node";

const ollama = new Ollama();
await ollama.setModel("phi");

// callback to print each word
const print = (word: string) => {
  process.stdout.write(word);
};
await ollama.streamingGenerate("why is the sky blue", print);
