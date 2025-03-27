import { IUserPosition } from "./user.types";

type ISocketEvent = "position";

export interface ISocketMessage {
  event: ISocketEvent;
  senderId: string;
  data: { position: IUserPosition };
}
