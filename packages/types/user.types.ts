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

export interface IUserStatus {
  id: string;
  username: string;
  status: "online" | "offline";
  lastUpdated: number;
}

export interface IUserPosition {
  id: string;
  username: string;
  position: {
    x: number;
    y: number;
  };
}
