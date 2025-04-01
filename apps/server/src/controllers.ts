import { type Express, type Request, type Response } from "express";

import { version } from "../package.json";
import { createAIController } from "./controllers/ai.controller";
import { createChatController } from "./controllers/chat.controller";
import { createSystemController } from "./controllers/system.controller";
import { createUserController } from "./controllers/user.controller";

const isLocal = process.env.MODE === "local";

export const addPublicRoutes = (app: Express) => {
  app.get("/", (_: Request, res: Response) => {
    res.send({ message: "Bitrock Town Server", local: isLocal, version });
  });

  createSystemController(app);
  createAIController(app);
  createChatController(app);
  createUserController(app);
};
