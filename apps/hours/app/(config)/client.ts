import axios from "axios";

const BACKEND_URL = process.env.NEXT_SERVER_URL;

const api = axios.create({
  baseURL: BACKEND_URL,
  timeout: 1000,
  headers: {
    "Content-Type": "application/json",
  },
});

export { api };
