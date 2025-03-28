import { Message } from "@/pages/Chat";
import { type MessagePart, parseMarkdownMessage } from "@/services/formatter";
import SyntaxHighlighter from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import ThinkingLoader from "./ThinkingLoader";

function MessagePart({ part }: { part: MessagePart }) {
  switch (part.type) {
    case "code":
      return (
        <div style={{ position: "relative" }}>
          <span
            style={{
              position: "absolute",
              top: 1,
              left: 5,
              color: "white",
            }}
            className="text-xs"
          >
            {part.language}
          </span>
          <SyntaxHighlighter
            language={part.language ?? "plaintext"}
            style={oneDark}
          >
            {part.content}
          </SyntaxHighlighter>
        </div>
      );
    case "title":
      return <h2>{part.content}</h2>;
    case "list":
      return (
        <ul>
          <li>{part.content}</li>
        </ul>
      );
    default:
      switch (part.markdownType) {
        case "Header":
          return <h1>{part.content}</h1>;
        case "List Item":
          return <li>{part.content}</li>;
        case "Paragraph":
          return <p>{part.content}</p>;
        case "Blockquote":
          return <blockquote>{part.content}</blockquote>;
        case "Bold Text":
          return <strong>{part.content}</strong>;
        case "Italic Text":
          return <em>{part.content}</em>;
        case "Formatted Text":
          return <code>{part.content}</code>;
        case "Link":
          return (
            <a
              href={part.content.split("(")[1].replace(")", "")}
              target="_blank"
              rel="noreferrer"
              style={{ textDecoration: "underline", color: "blue" }}
            >
              {part.content.split("(")[1].replace(")", "")}
            </a>
          );
        case "Image":
          return <img src={part.content} alt="image" />;
        case "Table":
          return <table>{part.content}</table>;
        default:
          return <p>{part.content}</p>;
      }
  }
}

export function ChatMessage({
  message,
  loading,
}: {
  message: Message;
  loading?: boolean;
}) {
  if (loading) return <ThinkingLoader />;
  const parsedMessages = parseMarkdownMessage(message.content);
  return (
    <div
      key={message.id}
      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[80%] rounded-lg px-4 py-2 ${
          message.role === "user"
            ? "bg-primary text-primary-foreground"
            : "bg-muted"
        }`}
      >
        {message.role === "assistant" &&
          parsedMessages.map((part, index) => (
            <MessagePart key={index} part={part} />
          ))}
        {message.role === "user" && <p>{message.content}</p>}
      </div>
    </div>
  );
}
