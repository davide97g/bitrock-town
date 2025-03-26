import { IUser } from "@bitrock-town/types";
import { readdirSync, readFileSync, writeFile } from "fs";

const DATA_PATH = process.env.DATA_PATH ?? "../../data";

// if the data folder does not exist, create it
if (!readdirSync(DATA_PATH).includes("data")) {
  writeFile(DATA_PATH, "", () => {});
}

// if the users file does not exist, create it
if (!readdirSync(DATA_PATH).includes("users.json")) {
  writeFile(`${DATA_PATH}/users.json`, JSON.stringify({ users: [] }), () => {});
}

// *** DATA ***

export const users: IUser[] = JSON.parse(
  readFileSync(`${DATA_PATH}/users.json`, "utf-8"),
).users;

// *** FUNCTIONS ***

export function updateUsersFile({ users }: { users: IUser[] }) {
  writeFile(DATA_PATH, JSON.stringify({ users }), () => {});
}
