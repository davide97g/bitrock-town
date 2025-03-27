import { ICreateUser } from "@bitrock-town/types";
import { type Express, type Request, type Response } from "express";
import { sql } from "../../config/postgres";
import { authenticateToken } from "../../middleware/authMiddleware";
import { extractInfoFromToken } from "../../middleware/extractInfoFromToken";
import { createUser, getUserById } from "../../services/user.service";

export const createUserController = (app: Express) => {
  app.post(
    "/user/create",
    authenticateToken,
    async (req: Request, res: Response) => {
      try {
        const user = await extractInfoFromToken(req);
        if (!user) return res.status(403).send("Unauthorized");

        const userAlreadyExists = Boolean(await getUserById(user.id));
        if (userAlreadyExists)
          return res.status(409).send("User already exists");

        const userRequest = req.body as ICreateUser;
        if (!userRequest) return res.status(400).send("User not provided");

        const newUser = createUser(userRequest);

        return res.status(200).send({ user: newUser });
      } catch (error) {
        return res.status(500).json({ error: "Error performing the request" });
      }
    },
  );

  app.get(
    "/user/me",
    authenticateToken,
    async (req: Request, res: Response) => {
      try {
        const user = await extractInfoFromToken(req);
        if (!user) return res.status(403).send("Unauthorized");

        const users =
          await sql`SELECT * FROM public."USERS" WHERE id = ${user?.id ?? ""}`;
        if (!users?.[0]) return res.status(404).send("User not found");

        return res.status(200).send({ user: users?.[0] });
      } catch (error) {
        return res.status(500).json({ error: "Error performing the request" });
      }
    },
  );
};
