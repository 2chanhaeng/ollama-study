import { SESSION_SELECT } from "@/constants";
import prisma from "@/prisma";
import { SESSION_WITH_MESSAGES } from "@/types";

export const createNewSession = async (
  content: string
): Promise<SESSION_WITH_MESSAGES> => {
  return (
    await prisma.message.create({
      data: {
        type: "system",
        content,
        session: {
          create: {},
        },
      },
      select: {
        session: {
          select: SESSION_SELECT,
        },
      },
    })
  ).session;
};
