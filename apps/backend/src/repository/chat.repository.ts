import { IChatMessage } from "@bitrock/types";
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
    ? await sql`INSERT INTO public."MESSAGES" (content, "authorId", "replyToId",type) VALUES (${message}, ${authorId}, ${replyToId},'text');`
    : await sql`INSERT INTO public."MESSAGES" (content, "authorId",type) VALUES (${message}, ${authorId},'text');`;
  return res?.[0] as IChatMessage;
}

export async function sendAudio({
  messageId,
  authorId,
  replyToId,
}: {
  messageId: string;
  authorId: string;
  replyToId?: string;
}) {
  const res = replyToId
    ? await sql`INSERT INTO public."MESSAGES" (id, "authorId", "replyToId", type) VALUES (${messageId}, ${authorId}, ${replyToId}, 'audio');`
    : await sql`INSERT INTO public."MESSAGES" (id, "authorId", type) VALUES (${messageId}, ${authorId}, 'audio');`;
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
