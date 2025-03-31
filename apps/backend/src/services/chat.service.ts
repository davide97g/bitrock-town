import { v4 as uuidv4 } from "uuid";
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
  // Generate a unique file name
  const filePath = `chat-audio/${uuidv4()}`;

  // Upload file to Supabase Storage
  const { error } = await supabase.storage
    .from("chat-audio") // Storage bucket name
    .upload(filePath, buffer, {
      contentType: mimetype || "audio/webm",
      upsert: true,
    });

  if (error) throw error;

  // TODO: change this from public url to private url
  // Get the public URL of the uploaded file
  const { data: publicURLData } = supabase.storage
    .from("chat-audio")
    .getPublicUrl(filePath);
  const publicURL = publicURLData.publicUrl;

  // Send audio message to chat
  await sendAudio({
    audioFileUrl: publicURL,
    authorId,
    replyToId,
  });
}
