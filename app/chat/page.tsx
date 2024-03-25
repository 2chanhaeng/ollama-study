import { newChat } from "./actions";
import ChatBoard from "./components/Chat/Board";
import ChatForm from "./components/Chat/Form";

export default async function ChatPage() {
  return (
    <ChatBoard>
      <ChatForm action={newChat} />
    </ChatBoard>
  );
}
