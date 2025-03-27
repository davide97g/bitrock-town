import { ICreateUser, IUser } from "@bitrock-town/types";
import { sql } from "../config/postgres";

export async function createUser(
  id: string,
  user: ICreateUser,
): Promise<IUser> {
  // TODO: add query here
  return {
    id,
    name: user.name,
    email: user.email,
    avatar_url: user.avatar_url,
  } as IUser;
}

export async function getUserById(id: string): Promise<IUser | null> {
  const res = await sql`SELECT * FROM public."USERS" WHERE id = ${id}`;
  if (!res) return null;
  return res[0] as IUser;
}
