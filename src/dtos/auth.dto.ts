import { object, string, Describe } from "superstruct";

export interface ILogin {
  password: string;
  email: string;
}

export const AuthLoginDto: Describe<ILogin> = object({
  email: string(),
  password: string(),
});
