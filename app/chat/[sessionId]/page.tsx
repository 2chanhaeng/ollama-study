import Messages from "../components/Messages";
import { getMessages, sendMessage } from "./actions";
import ChatBoard from "../components/Chat/Board";
import ChatForm from "../components/Chat/Form";

export default async function SessionPage({
  params: { sessionId },
}: {
  params: { sessionId: string };
}) {
  const messages = await getMessages(sessionId);

  return (
    <ChatBoard>
      <Messages messages={messages} sessionId={sessionId} />
      <ChatForm action={sendMessage} sessionId={sessionId} />
    </ChatBoard>
  );
}
