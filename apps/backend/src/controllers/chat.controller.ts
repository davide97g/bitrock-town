import express, { type Express, type Request, type Response } from "express";
import { audioMiddleware } from "../middleware/audioMiddleware";
import { authenticateToken } from "../middleware/authMiddleware";
import { extractInfoFromToken } from "../middleware/extractInfoFromToken";
import {
  deleteMessage,
  getMessages,
  sendMessage,
} from "../repository/chat.repository";
import { createAudioMessage, getAudioMessage } from "../services/chat.service";

export const createChatController = (app: Express) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(audioMiddleware);
  // Get chat messages
  app.get(
    "/chat/messages",
    authenticateToken,
    async (_: Request, res: Response) => {
      try {
        const response = await getMessages();
        return res.send(response);
      } catch (error) {
        return res
          .status(500)
          .send({ error: "There was an error processing the request" });
      }
    },
  );

  // Send message to chat
  app.post(
    "/chat/message",
    authenticateToken,
    async (req: Request, res: Response) => {
      try {
        const { message, replyToId } = req.body as {
          message: string;
          replyToId?: string;
        };

        if (!message) {
          return res.status(400).send({ error: "Message is required" });
        }

        const user = await extractInfoFromToken(req);
        if (!user) {
          return res.status(401).send({ error: "Unauthorized" });
        }

        const response = await sendMessage({
          message,
          authorId: user.id,
          replyToId,
        });
        return res.send(response);
      } catch (error) {
        console.info(error);
        return res
          .status(500)
          .send({ error: "There was an error processing the request" });
      }
    },
  );

  // Send audio message to chat
  app.post(
    "/chat/message/audio",
    authenticateToken,
    async (req: Request, res: Response) => {
      try {
        const user = await extractInfoFromToken(req);
        if (!user) {
          return res.status(401).send({ error: "Unauthorized" });
        }

        if (!(req as any).body.file) {
          return res.status(400).json({ error: "No file uploaded" });
        }

        const { mimetype, buffer } = (req as any).body.file;
        if (!buffer) {
          console.error("Invalid file data", {
            mimetype,
            buffer,
          });
          return res.status(400).json({ error: "Invalid file data" });
        }
        // Check if the file is a valid audio format
        const validAudioTypes = ["audio/webm", "audio/wav", "audio/mp3"];
        if (!validAudioTypes.includes(mimetype)) {
          console.warn(
            "Invalid audio format",
            mimetype,
            "Valid formats are",
            validAudioTypes,
            "using default",
            "audio/webm",
          );
        }
        // Check if the file size is less than 5MB
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (buffer.length > maxSize) {
          return res.status(400).json({ error: "File size exceeds 5MB" });
        }

        await createAudioMessage({
          mimetype: mimetype || "audio/webm",
          buffer,
          authorId: user.id,
          replyToId: req.body.replyToId,
        });

        res.json({ message: "Audio uploaded successfully!" });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: (error as any).message });
      }
    },
  );

  // Get audio chat messages
  app.get(
    "/chat/message/audio/:id",
    authenticateToken,
    async (req: Request, res: Response) => {
      try {
        const { id } = req.params;
        if (!id) {
          return res.status(400).send({ error: "Message ID is required" });
        }

        const response = await getAudioMessage(id);
        return res.send(response);
      } catch (error) {
        return res
          .status(500)
          .send({ error: "There was an error processing the request" });
      }
    },
  );

  // Delete message
  app.delete(
    "/chat/message/:messageId",
    authenticateToken,
    async (req: Request, res: Response) => {
      try {
        const { messageId } = req.params;
        if (!messageId) {
          return res.status(400).send({ error: "Message ID is required" });
        }

        const user = await extractInfoFromToken(req);
        if (!user) {
          return res.status(401).send({ error: "Unauthorized" });
        }

        const response = await deleteMessage(messageId, user.id);
        return res.send(response);
      } catch (error) {
        console.info(error);
        return res
          .status(500)
          .send({ error: "There was an error processing the request" });
      }
    },
  );
};
