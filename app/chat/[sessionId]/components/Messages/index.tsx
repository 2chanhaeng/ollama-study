"use client";

import { TemplateMessage } from "@/types";
import Message from "../Message";

export default function Messages({
  messages,
}: {
  messages: TemplateMessage[];
  sessionId: string;
}) {
  return (
    <div
      style={{
        flex: 1,
        overflowY: "scroll",
      }}
    >
      {messages.map(([type, content], index) => (
        <Message key={index} type={type} content={content} />
      ))}
    </div>
  );
}
