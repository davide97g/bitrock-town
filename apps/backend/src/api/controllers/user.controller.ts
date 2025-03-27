import { type Express, type Request, type Response } from "express";
import { sql } from "../../config/postgres";
import { authenticateToken } from "../../middleware/authMiddleware";

export const createUserController = (app: Express) => {
  app.get(
    "/auth/me",
    authenticateToken,
    async (req: Request, res: Response) => {
      try {
        const users = await sql`SELECT * FROM public."USERS"`;

        return res.status(200).send(users);
      } catch (error) {
        return res.status(500).json({ error: "Error performing the request" });
      }
    },
  );
};
