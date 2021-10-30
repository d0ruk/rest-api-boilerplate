import { object, string, Describe } from "superstruct";

import { IUser } from "models/user.model";

export type UserCreationParams = Pick<IUser, "email" | "name" | "password">;
export type UserUpdateParams = Pick<IUser, "name">;

export const UserCreateDto: Describe<UserCreationParams> = object({
  name: string(),
  password: string(),
  email: string(),
});

export const UserUpdateDto: Describe<UserUpdateParams> = object({
  name: string(),
});
