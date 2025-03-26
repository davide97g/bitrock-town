import { type Express, type Request, type Response } from "express";
import { sendMessage } from "../../features/chat";

export const createChatController = (app: Express) => {
  // Send message
  app.post("/message", async (req: Request, res: Response) => {
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
  });
};
