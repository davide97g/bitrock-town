import hljs from "highlight.js";

type MarkdownType =
  | "Header"
  | "Formatted Text"
  | "List Item"
  | "Blockquote"
  | "Table"
  | "Link"
  | "Image"
  | "Bold Text"
  | "Italic Text"
  | "Paragraph";

export type MessagePart = {
  type: "text" | "code" | "title" | "list";
  markdownType?: MarkdownType;
  content: string;
  language?: string;
};

function classifyMarkdownLine(line: string): MarkdownType {
  if (/^#{1,6} /.test(line)) return "Header";
  if (/^\*{1,3}[^*].*\*{1,3}$/.test(line)) return "Formatted Text";
  if (/^\*{1} .*/.test(line) || /^- .*/.test(line)) return "List Item";
  if (/^> /.test(line)) return "Blockquote";
  if (/\|.*\|/.test(line)) return "Table";
  if (/\[.*\]\(.*\)/.test(line)) return "Link";
  if (/!\[.*\]\(.*\)/.test(line)) return "Image";
  if (/^\*\*[^*]+\*\*$/.test(line)) return "Bold Text";
  if (/^\*[^*]+\*$/.test(line)) return "Italic Text";
  return "Paragraph";
}

export function parseMarkdownMessage(input: string): MessagePart[] {
  const lines = input.split("\n");
  const parsedLines: MessagePart[] = [];
  let currentCodeBlock: string[] = [];
  let currentCodeBlockType = "";

  for (const line of lines) {
    if (line.startsWith("#")) {
      parsedLines.push({ type: "title", content: line.replace(/^#+\s*/, "") });
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      parsedLines.push({ type: "list", content: line.replace(/^[-*]\s*/, "") });
    } else if (line.startsWith("```") && !currentCodeBlock.length) {
      currentCodeBlockType = line.replace(/^```/, "").trim();
      currentCodeBlock.push(
        line
          .replace(/^```/, "")
          .replace(currentCodeBlockType, "")
          .replace("\n", "")
          .replace("/s", "")
          .trim(),
      );
    } else if (line.startsWith("```") && currentCodeBlock.length) {
      currentCodeBlock.push(line.replace(/^```/, ""));
      parsedLines.push({
        type: "code",
        content: currentCodeBlock.join("\n"),
        language: currentCodeBlockType,
      });
      currentCodeBlock = [];
      currentCodeBlockType = "";
    } else if (currentCodeBlock.length) {
      currentCodeBlock.push(line);
    } else {
      const markdownType = classifyMarkdownLine(line);
      parsedLines.push({ type: "text", markdownType, content: line });
    }
  }

  return parsedLines;
}

export function formatCodeMessage(message: string, language: string) {
  return hljs.highlight(message, {
    language,
  }).value;
}
