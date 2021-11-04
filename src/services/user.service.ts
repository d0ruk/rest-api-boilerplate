import * as util from "node:util";

import {
  IHandlerContext,
  addPaginationData,
  getPaginationParams,
  errors,
} from "util/";
import { UserEntity, sequelize } from "database";
import { UserCreationParams, UserUpdateParams } from "dtos/index";
import { createMailJob } from "queue";

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

    try {
      createMailJob(
        { to: user?.email, template: "welcome" },
        { name: user?.name }
      );
    } catch (error) {
      throw error;
    }
  },
  async update(this: IHandlerContext): Promise<void> {
    const data: UserUpdateParams = this.req!.body;
    const { id } = this.req!.params;

    const [updated] = await UserEntity.update(data, { where: { id } });

    this.res!.status(200).json({ updated });
  },
  async delete(this: IHandlerContext): Promise<void> {
    const { id } = this.req!.params;

    const deleted = await UserEntity.destroy({ where: { id } });

    this.res!.status(200).json({ deleted });
  },
};
