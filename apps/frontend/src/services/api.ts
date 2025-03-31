import { supabase } from "@/config/supabase";
import { ISystemStats, IUser } from "@bitrock/types";

const BASE_URL = import.meta.env.VITE_SERVER_URL;

// *** AUTH

const getURL = () => {
  let url = import.meta?.env?.VITE_REDIRECT_URL ?? "http://localhost:3000/";
  url = url.startsWith("http") ? url : `https://${url}`;
  // Make sure to include a trailing `/`.
  url = url.endsWith("/") ? url : `${url}/`;
  return url;
};

export async function loginUser() {
  const res = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: getURL(),
    },
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
