import { type Express, type Request, type Response } from "express";
import { authenticateToken } from "../../middleware/authMiddleware";
import { extractInfoFromToken } from "../../middleware/extractInfoFromToken";
import { getMessages, sendMessage } from "../../services/chat.service";

export const createChatController = (app: Express) => {
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
    }
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
    }
  );
};
