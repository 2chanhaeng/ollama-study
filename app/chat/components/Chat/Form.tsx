export default function ChatForm({
  sessionId = "",
  action,
}: {
  sessionId?: string;
  action: (formData: FormData) => void;
}) {
  return (
    <form
      action={action}
      style={{
        alignSelf: "stretch",
        display: "flex",
      }}
    >
      <input type="hidden" name="sessionId" value={sessionId} />
      <input
        type="text"
        name="content"
        style={{
          flex: 1,
        }}
      />
      <button type="submit">Send</button>
    </form>
  );
}
