export const SESSION_SELECT = {
  id: true,
  messages: {
    select: { type: true, content: true },
    orderBy: { createdAt: "asc" as const },
  },
};
