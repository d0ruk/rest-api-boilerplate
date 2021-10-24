import { IHandlerContext } from "util/";
import { UserEntity } from "database";
import { UserCreationParams } from "dtos/index";

export default {
  async findAll(this: IHandlerContext): Promise<void> {
    const users = await UserEntity.findAll();

    this.res!.status(200).json(users);
  },
  async create(this: IHandlerContext): Promise<void> {
    const data: UserCreationParams = this.req!.body;

    const created = await UserEntity.create(data);

    this.res!.status(201).json(created);
  },
};
