"use server";

import { revalidatePath } from "next/cache";
import { Role, TemplateMessage } from "@/types";
import prisma from "@/prisma";
import chat from "@/utils/chat";
import models from "@/model";

export async function getMessages(id: string): Promise<TemplateMessage[]> {
  const session = await prisma.session.findUnique({
    where: { id },
    select: {
      messages: {
        select: { type: true, content: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });
  return (
    session?.messages.map(({ type, content }) => [type as Role, content]) ?? []
  );
}

export async function sendMessage(formData: FormData) {
  const content = formData.get("content") as string;
  const sessionId = formData.get("sessionId") as string;
  const model = "llama2";
  const talk = await chat(models[model], sessionId);

  talk(content);
  revalidatePath(`/chat/${sessionId}`, "page");
}
