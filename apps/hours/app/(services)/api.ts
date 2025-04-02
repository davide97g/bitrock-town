import { ISystemStats, IUser } from "@bitrock/types";
import { supabase } from "../(config)/supabase";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

// *** AUTH

export async function loginUser() {
  const res = await supabase.auth.signInWithOAuth({
    provider: "google",
  });

  return res;
}

export async function logoutUser() {
  const res = await supabase.auth.signOut();
  return res;
}

export async function getUserInfo({ token }: { token: string }) {
  const res = await fetch(`${BASE_URL}/user`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json());
  return res as IUser;
}

// *** SYSTEM

export async function getSystemDetails() {
  const res = await fetch(`${BASE_URL}/system`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());
  return res as ISystemStats;
}
