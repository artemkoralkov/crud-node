import { createServer, IncomingMessage, ServerResponse } from "http";
import { basename } from "path";
import { config } from "dotenv";
import { v4, validate } from "uuid";
import {
  getReqData,
  validatePostRequestBody,
  validatePutRequestBody,
} from "./utils/index";
import { responseNotFound } from "./responses/index";
import { IUser } from "./types/IUser";

config();

const PORT: number = parseInt(process.env.PORT as string, 10);

const users: IUser[] = [];
const server = createServer(
  async (request: IncomingMessage, response: ServerResponse) => {
    const url = request.url;
    const method = request.method;
    const id: string | undefined = basename(url as string);
    const user: IUser | undefined = users.find((user) => user.id === id);

    switch (method) {
      case "GET":
        if (url === "/api/users" || url === "/api/users/") {
          response.writeHead(200, { "Content-Type": "application/json" });
          response.write(JSON.stringify(users));
          response.end();
        } else if (url?.startsWith("/api/users") && validate(id)) {
          if (user) {
            response.writeHead(200, { "Content-Type": "application/json" });
            response.write(JSON.stringify(user));
            response.end();
          } else {
            response.writeHead(404, { "Content-Type": "application/json" });
            response.write(
              JSON.stringify({
                error: "No user with such id",
              })
            );
            response.end();
          }
        } else if (url?.startsWith("/api/users") && !validate(id)) {
          response.writeHead(400, { "Content-Type": "application/json" });
          response.write(
            JSON.stringify({
              error: "Invalid id",
            })
          );
          response.end();
        } else {
          responseNotFound(response);
        }
        break;
      case "POST":
        if (url === "/api/users" || url === "/api/users/") {
          const userData = JSON.parse((await getReqData(request)) as string);
          if (validatePostRequestBody(userData)) {
            const newUser: IUser = {
              id: v4(),
              ...userData,
            };
            users.push(newUser);
            response.writeHead(201, { "Content-Type": "application/json" });
            response.write(JSON.stringify(newUser));
            response.end();
          } else {
            response.writeHead(400, { "Content-Type": "application/json" });
            response.write(
              JSON.stringify({
                error: "Missing reuired fields or invalid body field types",
              })
            );
            response.end();
          }
        }

        break;
      case "PUT":
        if (url?.startsWith("/api/users") && validate(id)) {
          const userData = JSON.parse((await getReqData(request)) as string);
          if (validatePutRequestBody(userData)) {
            users[users.indexOf(user as IUser)].username =
              userData.username || user?.username;
            users[users.indexOf(user as IUser)].age = userData.age || user?.age;
            users[users.indexOf(user as IUser)].hobbies =
              userData.hobbies || user?.hobbies;

            response.writeHead(201, { "Content-Type": "application/json" });
            response.write(JSON.stringify(user));
            response.end();
          } else {
            response.writeHead(400, { "Content-Type": "application/json" });
            response.write(
              JSON.stringify({ error: "missing required body field" })
            );
            response.end();
          }
        } else if (url?.startsWith("/api/users") && !validate(id)) {
          response.writeHead(400, { "Content-Type": "application/json" });
          response.write(
            JSON.stringify({
              error: "Invalid id",
            })
          );
          response.end();
        } else {
          responseNotFound(response);
        }
        break;
      case "DELETE":
        if (url?.startsWith("/api/users") && validate(id)) {
          if (user) {
            users.splice(users.indexOf(user));
            response.writeHead(204, { "Content-Type": "application/json" });
            response.end();
          } else {
            response.writeHead(404, { "Content-Type": "application/json" });
            response.write(
              JSON.stringify({
                error: "No user with such id",
              })
            );
            response.end();
          }
        } else if (url?.startsWith("/api/users") && !validate(id)) {
          response.writeHead(400, { "Content-Type": "application/json" });
          response.write(
            JSON.stringify({
              error: "Invalid id",
            })
          );
          response.end();
        } else {
          responseNotFound(response);
        }
        break;

      default:
        responseNotFound(response);
    }
  }
);

server.listen(PORT, () => {
  console.log(`Server running on Port ${PORT}`);
});
