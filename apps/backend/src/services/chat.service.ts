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
}: {
  message: string;
  authorId: string;
}) {
  const res =
    await sql`INSERT INTO public."MESSAGES" (content, authorId) VALUES (${message}, ${authorId})`;
  return res?.[0] as IChatMessage;
}
