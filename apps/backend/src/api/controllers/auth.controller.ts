import bcrypt from "bcryptjs";
import { type Express, type Request, type Response } from "express";

import { updateUsersFile, users } from "../../config/database";
import { sign } from "../../features/auth";

export const createAuthController = (app: Express) => {
  // Register route
  app.post("/auth/register", async (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    const existingUser = users.find((user) => user.username === username);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUserId = crypto.randomUUID();
    users.push({ id: newUserId, username, password: hashedPassword });
    updateUsersFile({ users });
    res.status(201).json({ message: "User registered successfully" });
  });

  // Login route
  app.post("/auth/login", async (req: Request, res: Response) => {
    const { username, password } = req.body;

    const user = users.find((user) => user.username === username);
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = sign({ user });
    res.json({ token });
  });
};
