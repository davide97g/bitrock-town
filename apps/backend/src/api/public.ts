import { type Express, type Request, type Response } from "express";

import { version } from "../../package.json";
import { createAuthController } from "./controllers/auth.controller";
import { createChatController } from "./controllers/chat.controller";
import { createSystemController } from "./controllers/system.controller";

const isLocal = process.env.MODE === "local";

export const addPublicRoutes = (app: Express) => {
  app.get("/", (_: Request, res: Response) => {
    res.send({ message: "Bitrock Town Server", local: isLocal, version });
  });

  createAuthController(app);
  createSystemController(app);
  createChatController(app);
};
