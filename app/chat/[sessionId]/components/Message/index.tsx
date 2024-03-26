import { Role } from "@/types";

interface BaseMessageProps {
  style: React.CSSProperties;
  message: string;
}
interface MessageProps {
  message: string;
}

function BaseMessage({ style, message }: BaseMessageProps) {
  return (
    <div
      style={{
        color: "black",
        padding: "0.5rem",
        width: "100%",
        ...style,
      }}
    >
      <p>{message}</p>
    </div>
  );
}

function HumanMessage({ message }: MessageProps) {
  const style: React.CSSProperties = {
    backgroundColor: "lightblue",
    textAlign: "right",
  };
  return <BaseMessage style={style} message={message} />;
}

function AiMessage({ message }: MessageProps) {
  const style: React.CSSProperties = {
    backgroundColor: "lightgreen",
  };
  return <BaseMessage style={style} message={message} />;
}

export default function Message({
  type,
  content,
}: {
  type: Role;
  content: string;
}) {
  switch (type) {
    case Role.human:
      return <HumanMessage message={content} />;
    case Role.ai:
      return <AiMessage message={content} />;
    default:
      return null;
  }
}
