import { UserModel } from "../../src/models/user.model";

declare module "express" {
  interface Request {
    user: UserModel;
  }
}
