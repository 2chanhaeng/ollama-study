import { Ollama } from "@langchain/community/llms/ollama";

import { BufferMemory } from "langchain/memory";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";

const model = new Ollama({
  baseUrl: "http://localhost:11434", // Default value
  model: "mistral",
});
const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a helpful chatbot"],
  new MessagesPlaceholder("history"),
  ["human", "{input}"],
]);
const memory = new BufferMemory({
  returnMessages: true,
});

await memory.loadMemoryVariables({});

const chain = RunnableSequence.from([
  {
    input: ({ input }) => input,
    memory: () => memory.loadMemoryVariables({}),
  },
  {
    input: ({ input }) => input,
    history: ({ memory: { history } }) => history,
  },
  prompt,
  model,
]);

const inputs = {
  input: "Hey, I'm Bob!",
};

const response = await chain.invoke(inputs);

console.log(response);

await memory.saveContext(inputs, {
  output: response,
});
console.log(await memory.loadMemoryVariables({}));

const inputs2 = {
  input: "What's my name?",
};
const response2 = await chain.invoke(inputs2);

console.log(response2);
await memory.saveContext(inputs, {
  output: response2,
});
console.log(await memory.loadMemoryVariables({}));
