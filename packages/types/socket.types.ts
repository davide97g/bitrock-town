import { IUserPosition } from "./user.types";

type ISocketEvent = "position";

export interface ISocketMessage {
  event: ISocketEvent;
  sender?: string;
  data?: IUserPosition;
}
