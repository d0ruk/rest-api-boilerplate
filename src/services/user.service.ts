import { IHandlerContext } from "util/";
import { UserEntity, sequelize } from "database";
import { UserCreationParams } from "dtos/index";

export default {
  async findAll(this: IHandlerContext): Promise<void> {
    const users = await UserEntity.findAll();

    this.res!.status(200).json(users);
  },
  async create(this: IHandlerContext): Promise<void> {
    const data: UserCreationParams = this.req!.body;

    const user = await sequelize.transaction(async transaction => {
      const created = await UserEntity.create(data, { transaction });

      return await UserEntity.findByEmail(created.email, { transaction });
    });

    this.res!.status(201).json(user);
  },
};
