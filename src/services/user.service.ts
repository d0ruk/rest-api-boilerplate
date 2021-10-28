import {
  IHandlerContext,
  addPaginationData,
  getPaginationParams,
  errors,
} from "util/";
import { UserEntity, sequelize } from "database";
import { UserCreationParams } from "dtos/index";

export default {
  async findAll(this: IHandlerContext): Promise<void> {
    const { limit, offset } = getPaginationParams(this.req!.query);
    const users = await UserEntity.findAndCountAll({ limit, offset });
    const result = addPaginationData(users, this.req!.query);

    this.res!.status(200).json(result);
  },
  async findOne(this: IHandlerContext): Promise<void> {
    const { id } = this.req!.params;

    const user = await UserEntity.scope("detail").findByPk(id);

    if (!user) throw errors.notFound("User not found");

    this.res!.status(200).json(user);
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
