export interface IUser {
  id: string;
  username: string;
  password: string;
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
