import { BufferMemory } from "langchain/memory";
import { BaseLLMCallOptions, LLM } from "langchain/llms/base";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";

import { SESSION_SELECT } from "@/constants";
import prisma from "@/prisma";
import { Role, Talk, TemplateMessage } from "@/types";

export default async function chat<T extends BaseLLMCallOptions>(
  model: LLM<T>,
  id: string
): Promise<Talk> {
  const memory = new BufferMemory({ returnMessages: true });
  const chain = getChain(model, await getPrompt(id), memory);
  const { humanSaid, aiSaid } = saveIn(id);

  return async (input: string) => {
    await memory.loadMemoryVariables({});

    await humanSaid(input);
    const output = await chain.invoke({ input });
    await aiSaid(output);

    await memory.saveContext({ input }, { output });
  };
}

const getHistory = async (id: string): Promise<TemplateMessage[]> => {
  const session = await prisma.session.findUnique({
    where: { id },
    select: SESSION_SELECT,
  });
  if (!session) return [];
  return session.messages.map(({ type, content }) => [type as Role, content]);
};

const getPrompt = async (id: string) =>
  ChatPromptTemplate.fromMessages(await getHistory(id));

const getChain = (
  model: LLM<BaseLLMCallOptions>,
  prompt: ChatPromptTemplate<{ input: string }>,
  memory: BufferMemory
) => {
  return RunnableSequence.from([
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
};

const createMessage = (type: Role, id: string) => (content: string) =>
  prisma.message.create({
    data: {
      type,
      content,
      session: { connect: { id } },
    },
  });

const saveIn = (id: string) => ({
  humanSaid: createMessage(Role.human, id),
  aiSaid: createMessage(Role.ai, id),
});
