export default function ChatBoard({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <article
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
      }}
    >
      {children}
    </article>
  );
}
