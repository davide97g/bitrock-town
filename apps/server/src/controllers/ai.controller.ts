import { type Express, type Request, type Response } from "express";
import { authenticateToken } from "../middleware/authMiddleware";
import { sendMessage } from "../services/ai/chat.service";

export const createAIController = (app: Express) => {
  // Send message
  app.post(
    "/ai/message",
    authenticateToken,
    async (req: Request, res: Response) => {
      try {
        const { message } = req.body;

        if (!message) {
          return res.status(400).send({ error: "Message is required" });
        }

        const response = await sendMessage(message);
        return res.send(response);
      } catch (error) {
        return res
          .status(500)
          .send({ error: "There was an error processing the request" });
      }
    },
  );
};
