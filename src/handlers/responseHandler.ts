import { ServerResponse } from "http";
import { IUser } from "../types/IUser";

export function responseHandler(
  response: ServerResponse,
  statusCode: number,
  payload: IUser | object | IUser[]
): void {
  response.writeHead(statusCode, { "Content-Type": "application/json" });
  response.write(JSON.stringify(payload));
  response.end();
}
