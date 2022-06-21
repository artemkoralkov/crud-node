import { IUserData } from "../types/IUser";

export function validatePostRequestBody(userData: IUserData): boolean {
  return (
    "username" in userData &&
    typeof userData.username === "string" &&
    "age" in userData &&
    typeof userData.age === "number" &&
    "hobbies" in userData &&
    Array.isArray(userData.hobbies) &&
    (userData.hobbies.length === 0 || typeof userData.hobbies[0] === "string")
  );
}
