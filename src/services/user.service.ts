import { IHandlerContext } from "util/";
import { UserEntity } from "database";

export default {
  async findAll(this: IHandlerContext) {
    const users = await UserEntity.findAll();

    this.res!.status(200).json(users);
  },
};
