import { v4 as uuid } from "uuid";
import { supabase } from "../config/supabase";
import { sendAudio } from "../repository/chat.repository";

export async function createAudioMessage({
  mimetype,
  buffer,
  authorId,
  replyToId,
}: {
  mimetype: string;
  buffer: Buffer;
  authorId: string;
  replyToId?: string;
}) {
  const messageId = uuid();
  // Generate a unique file name
  const filePath = `chat-audio/${messageId}`;

  // Upload file to Supabase Storage
  const { error } = await supabase.storage
    .from("chat-audio") // Storage bucket name
    .upload(filePath, buffer, {
      contentType: mimetype || "audio/webm",
      upsert: true,
    });

  if (error) throw error;

  console.log("File uploaded successfully");

  console.info("Audio message created", messageId);
  // Create a new message record in the database
  await sendAudio({
    messageId,
    authorId,
    replyToId,
  });
}

export async function getAudioMessage(id: string) {
  try {
    const filePath = `chat-audio/${id}`;
    const { data, error } = await supabase.storage
      .from("chat-audio")
      .download(filePath);

    if (error) {
      throw error;
    }

    const buffer = Buffer.from(await data.arrayBuffer());
    return buffer;
  } catch (error) {
    throw error;
  }
}
