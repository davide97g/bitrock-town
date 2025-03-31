import { IChatMessage } from "@bitrock-town/types";
import { sql } from "../config/postgres";

export async function getMessages() {
  const res =
    await sql`SELECT * FROM public."MESSAGES" ORDER BY created_at DESC LIMIT 100`;
  return [...res] as IChatMessage[];
}

export async function sendMessage({
  message,
  authorId,
  replyToId,
}: {
  message: string;
  authorId: string;
  replyToId?: string;
}) {
  const res = replyToId
    ? await sql`INSERT INTO public."MESSAGES" (content, "authorId", "replyToId") VALUES (${message}, ${authorId}, ${replyToId});`
    : await sql`INSERT INTO public."MESSAGES" (content, "authorId") VALUES (${message}, ${authorId});`;
  return res?.[0] as IChatMessage;
}

export async function deleteMessage(messageId: string, userId: string) {
  const message =
    await sql`SELECT * FROM public."MESSAGES" WHERE id = ${messageId};`;
  if (!message) {
    throw new Error("Message not found");
  }
  if (message[0].authorId !== userId) {
    throw new Error("You are not the author of this message");
  }
  // TODO: remove the message id from the replies
  const res = await sql`DELETE FROM public."MESSAGES" WHERE id = ${messageId};`;
  return res?.[0] as IChatMessage;
}
