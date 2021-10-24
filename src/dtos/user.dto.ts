import { object, string, Describe } from "superstruct";

import { IUser } from "models/user.model";

export type UserCreationParams = Pick<IUser, "email" | "name" | "password">;

export const UserCreateDto: Describe<UserCreationParams> = object({
  name: string(),
  password: string(),
  email: string(),
});
