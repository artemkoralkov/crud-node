import { createServer, IncomingMessage, ServerResponse } from "http";
import { basename } from "path";
import { config } from "dotenv";
import { validate } from "uuid";
import { getReqData, HTTP_STATUS_CODES } from "./utils/index";
import { responseHandler } from "./handlers/index";
import { Controller } from "./controllers/index";
import { IUser } from "./types/IUser";

config();
const controller = new Controller();
const PORT: number = parseInt(process.env.PORT as string, 10) || 3000;

export const server = createServer(
  async (request: IncomingMessage, response: ServerResponse) => {
    const url = request.url;
    const method = request.method;
    const id: string | undefined = basename(url as string);
    try {
      switch (method) {
        case "GET":
          if (url === "/api/users" || url === "/api/users/") {
            const users: IUser[] = await controller.getUsers();
            responseHandler(response, HTTP_STATUS_CODES.OK, users);
          } else if (url?.startsWith("/api/users") && validate(id)) {
            try {
              const user = await controller.getUser(id);
              responseHandler(response, HTTP_STATUS_CODES.OK, user);
            } catch (error) {
              responseHandler(
                response,
                HTTP_STATUS_CODES.NOT_FOUND,
                error as object
              );
            }
          } else if (url?.startsWith("/api/users") && !validate(id)) {
            responseHandler(response, HTTP_STATUS_CODES.BAD_REQUEST, {
              message: "Invalid id",
            });
          } else {
            responseHandler(response, HTTP_STATUS_CODES.NOT_FOUND, {
              message: "Route Not Found",
            });
          }
          break;
        case "POST":
          if (url === "/api/users" || url === "/api/users/") {
            const userData = JSON.parse((await getReqData(request)) as string);
            try {
              const newUser = await controller.createUser(userData);
              responseHandler(response, HTTP_STATUS_CODES.CREATED, newUser);
            } catch (error) {
              responseHandler(
                response,
                HTTP_STATUS_CODES.BAD_REQUEST,
                error as object
              );
            }
          } else {
            responseHandler(response, HTTP_STATUS_CODES.NOT_FOUND, {
              message: "Route Not Found",
            });
          }

          break;
        case "PUT":
          if (url?.startsWith("/api/users") && validate(id)) {
            const userData = JSON.parse((await getReqData(request)) as string);
            try {
              const updateUser = await controller.updateUser(id, userData);
              responseHandler(response, HTTP_STATUS_CODES.OK, updateUser);
            } catch (error) {
              responseHandler(
                response,
                HTTP_STATUS_CODES.BAD_REQUEST,
                error as object
              );
            }
          } else if (url?.startsWith("/api/users") && !validate(id)) {
            responseHandler(response, HTTP_STATUS_CODES.BAD_REQUEST, {
              message: "Invalid id",
            });
          } else {
            responseHandler(response, HTTP_STATUS_CODES.NOT_FOUND, {
              message: "Route Not Found",
            });
          }
          break;
        case "DELETE":
          if (url?.startsWith("/api/users") && validate(id)) {
            try {
              await controller.deleteUser(id);
              response.writeHead(HTTP_STATUS_CODES.NO_CONTENT, {
                "Content-Type": "application/json",
              });
              response.end();
            } catch (error) {
              responseHandler(
                response,
                HTTP_STATUS_CODES.BAD_REQUEST,
                error as object
              );
            }
          } else if (url?.startsWith("/api/users") && !validate(id)) {
            responseHandler(response, HTTP_STATUS_CODES.BAD_REQUEST, {
              message: "Invalid id",
            });
          } else {
            responseHandler(response, HTTP_STATUS_CODES.NOT_FOUND, {
              message: "Route Not Found",
            });
          }
          break;

        default:
          responseHandler(response, HTTP_STATUS_CODES.NOT_FOUND, {
            message: "Route Not Found",
          });
      }
    } catch {
      responseHandler(response, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR, {
        message: "Internal Server Error",
      });
    }
  }
);

server.listen(PORT, () => {
  console.log(`Server running on Port ${PORT}`);
});
