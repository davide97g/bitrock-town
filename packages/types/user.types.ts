export interface IUser {
  id: string;
  auth_id?: string; // authenticator provider ID
  name: string;
  email: string;
  avatar_url?: string;
}

export interface ICreateUser {
  name: string;
  email: string;
  avatar_url?: string;
}

export interface IUpdateUser {
  name?: string;
  avatar_url?: string;
  auth_id?: string; // authenticator provider ID
}

export interface IUserStatus extends IUser {
  status: "online" | "offline";
  lastUpdated: number;
}

export interface IUserPosition {
  x: number;
  y: number;
}
