import { ISystemStats, IUserPosition } from "@bitrock-town/types";

const BASE_URL = import.meta.env.VITE_SERVER_URL;

export async function getUserPositions({ token }: { token: string }) {
  return fetch(`${BASE_URL}/users/positions`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json() as Promise<IUserPosition[]>);
}

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

export async function loginUser({
  username,
  password,
}: {
  username: string;
  password: string;
}) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });
  return res.json();
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
