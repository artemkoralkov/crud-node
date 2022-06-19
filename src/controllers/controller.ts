import { v4 } from "uuid";
import { users } from "../db";
import { IUser, IUserData } from "../types/IUser";
import { validatePostRequestBody, validatePutRequestBody } from "../utils";

export class Controller {
  async getUsers(): Promise<IUser[]> {
    return new Promise((resolve) => resolve(users));
  }
  async getUser(id: string): Promise<IUser | object> {
    return new Promise((resolve, reject) => {
      const user: IUser | undefined = users.find((user) => user.id === id);
      if (user !== undefined) {
        resolve(user);
      } else {
        reject({
          message: "No user with such id",
        });
      }
    });
  }
  async createUser(userData: IUserData): Promise<IUser | object> {
    return new Promise((resolve, reject) => {
      if (validatePostRequestBody(userData)) {
        const newUser: IUser = {
          id: v4(),
          ...userData,
        };
        users.push(newUser);

        resolve(newUser);
      } else {
        reject({
          message: "Missing required fields or invalid body field types.",
        });
      }
    });
  }
  async updateUser(id: string, userData: IUserData): Promise<IUser | object> {
    return new Promise((resolve, reject) => {
      const user: IUser | undefined = users.find((user) => user.id === id);
      if (user === undefined) {
        reject({
          message: "No user with such id",
        });
      } else {
        if (validatePutRequestBody(userData)) {
          users[users.indexOf(user as IUser)].username =
            userData.username || user?.username;
          users[users.indexOf(user as IUser)].age = userData.age || user?.age;
          users[users.indexOf(user as IUser)].hobbies =
            userData.hobbies || user?.hobbies;
          resolve(user);
        } else {
          reject({
            message: "Missing required fields or invalid body field types.",
          });
        }
      }
    });
  }
  async deleteUser(id: string): Promise<object> {
    return new Promise((resolve, reject) => {
      const user = users.find((user) => user.id === id);
      if (user === undefined) {
        reject({ message: "No user with such id" });
      } else {
        users.splice(users.indexOf(user));
        resolve({ message: "Success" });
      }
    });
  }
}
