import { ICreateUser, IUser } from "@bitrock/types";
import { sql } from "../config/postgres";

export async function createUserFromAuth(
  authId: string,
  user: ICreateUser,
): Promise<IUser> {
  const res =
    await sql`INSERT INTO public."USERS" (auth_id, name, email, avatar_url) VALUES (${authId}, ${user.name}, ${user.email}, ${user.avatar_url})`;
  return res[0] as IUser;
}

export async function getUserByAuthId(id: string): Promise<IUser | null> {
  const res = await sql`SELECT * FROM public."USERS" WHERE auth_id = ${id}`;
  if (!res) return null;
  return res[0] as IUser;
}

export async function getUsers(): Promise<IUser[]> {
  const res = await sql`SELECT * FROM public."USERS"`;
  return [...res] as IUser[];
}
