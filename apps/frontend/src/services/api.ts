import { supabase } from "@/config/supabase";
import { ISystemStats } from "@bitrock-town/types";

const BASE_URL = import.meta.env.VITE_SERVER_URL;

// *** AUTH

export async function registerUser({
  username,
  password,
}: {
  username: string;
  password: string;
}) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });
  return res.json();
}

export async function loginUser() {
  const res = await supabase.auth.signInWithOAuth({
    provider: "google",
  });

  return res;
}

export async function getUserInfo({ token }: { token: string }) {
  const res = await fetch(`${BASE_URL}/auth/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
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

// *** CHAT

export async function sendMessage({
  token,
  message,
}: {
  token: string;
  message: string;
}) {
  const res = await fetch(`${BASE_URL}/message`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ message }),
  });
  return res;
}
