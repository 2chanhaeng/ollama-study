import { BufferMemory } from "langchain/memory";
import { BaseLLMCallOptions, LLM } from "langchain/llms/base";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { PrismaClient } from "@prisma/client";

import { SESSION_SELECT } from "@/constants";
import prisma from "@/prisma";
import { Role, SESSION_WITH_MESSAGES, Talk, TemplateMessage } from "@/types";
import { createNewSession } from "./utils";

export default async function chat<T extends BaseLLMCallOptions>(
  model: LLM<T>,
  id_or_init: string = "You are a helpful chatbot."
): Promise<Talk> {
  let session: SESSION_WITH_MESSAGES | null = await prisma.session.findUnique({
    where: { id: id_or_init },
    select: SESSION_SELECT,
  });
  if (session === null) {
    session = await createNewSession(id_or_init);
  }
  console.log(`Session: ${session.id}`);
  const messages = session.messages.map(
    ({ type, content }) => [type, content] as TemplateMessage
  );
  const prompt = ChatPromptTemplate.fromMessages(messages);
  const memory = new BufferMemory({
    returnMessages: true,
  });

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
  const { humanSaid, aiSaid } = chatWith(prisma, session.id);
  return async function (input: string) {
    await memory.loadMemoryVariables({});

    const inputs = { input };
    await humanSaid(input);
    const output = await chain.invoke(inputs);
    await aiSaid(output);

    await memory.saveContext(inputs, { output });
  };
}

const createMessage = (type: Role, content: string, id: string) => ({
  type,
  content,
  session: { connect: { id } },
});
const chatWith = (prisma: PrismaClient, sessionId: string) => ({
  async humanSaid(input: string) {
    await prisma.message.create({
      data: createMessage(Role.human, input, sessionId),
    });
    console.log(`Human: ${input}`);
  },
  async aiSaid(output: string) {
    await prisma.message.create({
      data: createMessage(Role.ai, output, sessionId),
    });
    console.log(`AI: ${output}`);
  },
});
