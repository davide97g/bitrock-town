export interface IUser {
  id: string;
  name: string;
  email: string;
  avatar_url: string;
}

export interface ICreateUser {
  name: string;
  email: string;
  avatar_url: string;
}

export interface IUserStatus extends IUser {
  status: "online" | "offline";
  lastUpdated: number;
}

export interface IUserPosition {
  x: number;
  y: number;
}
