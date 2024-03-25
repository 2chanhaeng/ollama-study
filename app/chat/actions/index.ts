"use server";

import { redirect } from "next/navigation";
import { Role } from "@/types";
import prisma from "@/prisma";
import mistral from "@/model/mistral";
import chat from "@/utils/chat";

export async function newChat(formData: FormData) {
  const content = formData.get("content") as string;
  const { id } = await createNewSession(content);
  (await chat(mistral, id))(content);
  redirect(`/chat/${id}`);
}

async function createNewSession(system = "You are a helpful chatbot.") {
  return await prisma.session.create({
    data: {
      messages: {
        create: [{ type: Role.system, content: system }],
      },
    },
    select: { id: true },
  });
}
