import { IUser } from "@bitrock-town/types";
import { User } from "@supabase/supabase-js";
import { sql } from "../config/postgres";

export function createUser(user: User): IUser {
  // TODO: Implement this function
  return {
    id: "",
    name: "",
    email: "",
    avatar_url: "",
  };
}

export async function getUserById(id: string): Promise<IUser | null> {
  const res = await sql`SELECT * FROM public."USERS" WHERE id = ${id}`;
  if (!res) return null;
  return res[0] as IUser;
}
