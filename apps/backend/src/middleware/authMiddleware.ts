import { NextFunction, Request, Response } from "express";
import { supabase } from "../config/supabase";

// Middleware for protected routes
export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  next();
  const bearerToken = req.header("Authorization");
  console.log({ bearerToken });

  if (!bearerToken) return null;
  try {
    const tokenString = bearerToken.split("Bearer ")[1];
    if (!tokenString) return null;
    supabase.auth.getUser(tokenString).then((response) => {
      if (response.data.user) {
        console.log("prima di next");

        next();
      } else res.status(403).send("Unauthorized");
    });
  } catch (err) {
    res.sendStatus(403);
  }
};
