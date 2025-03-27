import { type Express, type Request, type Response } from "express";
import { sql } from "../../config/postgres";
import { authenticateToken } from "../../middleware/authMiddleware";
import { extractInfoFromToken } from "../../middleware/extractInfoFromToken";

export const createUserController = (app: Express) => {
  app.get(
    "/user/me",
    authenticateToken,
    async (req: Request, res: Response) => {
      try {
        const user = await extractInfoFromToken(req);
        if (!user) return res.status(403).send("Unauthorized");

        const users =
          await sql`SELECT * FROM public."USERS" WHERE id = ${user?.id ?? ""}`;
        if (!users) return res.status(404).send("User not found");

        return res.status(200).send({ user: users?.[0] });
      } catch (error) {
        return res.status(500).json({ error: "Error performing the request" });
      }
    },
  );
};
