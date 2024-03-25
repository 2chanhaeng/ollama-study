import prisma from "@/prisma";
import Link from "next/link";

export default async function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const sessions = await prisma.session.findMany({
    select: {
      id: true,
      messages: {
        where: { type: "human" },
        take: 1,
      },
    },
  });
  return (
    <main
      style={{
        display: "flex",
        alignItems: "stretch",
        minHeight: "100vh",
      }}
    >
      <nav
        style={{
          display: "flex",
          flexDirection: "column",
          paddingLeft: "2rem",
          width: "10rem",
          backgroundColor: "#888",
        }}
      >
        {sessions.map(({ id, messages: [{ content }] }) => (
          <Link
            key={id}
            href={`/chat/${id}`}
            style={{
              overflow: "hidden",
            }}
          >
            {content}
          </Link>
        ))}
        <a
          href="/chat"
          style={{
            marginTop: "auto",
          }}
        >
          + New Chat
        </a>
      </nav>
      {children}
    </main>
  );
}
