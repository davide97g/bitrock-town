import { ICreateUser } from "@bitrock/types";
import { type Express, type Request, type Response } from "express";
import { sql } from "../config/postgres";
import { authenticateToken } from "../middleware/authMiddleware";
import { extractInfoFromToken } from "../middleware/extractInfoFromToken";
import {
  createUser,
  getUserById,
  getUsers,
} from "../repository/user.repository";

export const createUserController = (app: Express) => {
  app.get("/user", authenticateToken, async (req: Request, res: Response) => {
    try {
      const user = await extractInfoFromToken(req);
      if (!user) return res.status(403).send("Unauthorized");

      const users =
        await sql`SELECT * FROM public."USERS" WHERE id = ${user?.id ?? ""}`;

      const userFromDb = users?.[0];
      if (!userFromDb) return res.status(404).send("User not found");

      return res.status(200).send(userFromDb);
    } catch (error) {
      return res.status(500).json({ error: "Error performing the request" });
    }
  });

  app.post("/user", authenticateToken, async (req: Request, res: Response) => {
    try {
      const user = await extractInfoFromToken(req);
      if (!user) return res.status(403).send("Unauthorized");

      const userAlreadyExists = Boolean(await getUserById(user.id));
      if (userAlreadyExists) return res.status(409).send("User already exists");

      const userRequest = req.body as ICreateUser;
      if (!userRequest) return res.status(400).send("User not provided");

      const newUser = await createUser(user.id, userRequest);

      return res.status(200).send({ user: newUser });
    } catch (error) {
      return res.status(500).json({ error: "Error performing the request" });
    }
  });

  app.get("/users", async (_req: Request, res: Response) => {
    try {
      const users = await getUsers();
      return res.status(200).send(users);
    } catch (error) {
      return res.status(500).json({ error: "Error performing the request" });
    }
  });
};
