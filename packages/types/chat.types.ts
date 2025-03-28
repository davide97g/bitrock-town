export interface IChatMessage {
  id: string; // uuid
  authorId: string; // user id
  content: string;
  created_at: number;
  replyToId?: string; // uuid
}
