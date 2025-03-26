import { type Express, type Request, type Response } from "express";
import { sql } from "../../config/postgres";

export const createUserController = (app: Express) => {
  app.get("/users", async (req: Request, res: Response) => {
    try {
      const users = await sql`SELECT * FROM public."USERS"`;
      return res.send(users);
    } catch (error) {
      return res.status(500).json({ error: "Error performing the request" });
    }
  });
};
