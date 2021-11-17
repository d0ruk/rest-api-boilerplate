import { ForbiddenError } from "@casl/ability";

import {
  IHandlerContext,
  addPaginationData,
  getPaginationParams,
  errors,
} from "util/";
import { UserEntity, PostEntity, sequelize, TagEntity } from "database";
import { UserCreationParams, UserUpdateParams } from "dtos/index";
import { createMailJob } from "queue";

export default {
  async findAll(this: IHandlerContext): Promise<void> {
    ForbiddenError.from(this.req!.ability).throwUnlessCan("list", "UserModel");

    const { limit, offset } = getPaginationParams(this.req!.query);
    const users = await UserEntity.findAndCountAll({ limit, offset });
    const result = addPaginationData(users, this.req!.query);

    this.res!.status(200).json(result);
  },
  async findOne(this: IHandlerContext): Promise<void> {
    const { id } = this.req!.params;
    const user = await UserEntity.scope("detail").findByPk(id, {
      include: [
        {
          model: PostEntity.scope("detail"),
          required: false,
          as: "posts",
          include: [
            {
              model: TagEntity.scope("detail"),
              required: false,
              as: "tags",
              through: { attributes: [] },
            },
          ],
        },
      ],
    });

    if (!user) throw errors.notFound("User not found");
    ForbiddenError.from(this.req!.ability).throwUnlessCan("read", user);

    this.res!.status(200).json(user);
  },
  async create(this: IHandlerContext): Promise<void> {
    ForbiddenError.from(this.req!.ability).throwUnlessCan(
      "create",
      "UserModel"
    );

    const data: UserCreationParams = this.req!.body;
    const user = await sequelize.transaction(async transaction => {
      const created = await UserEntity.create(data, {
        transaction,
      });

      return await UserEntity.scope("detail").findByEmail(created.email, {
        transaction,
      });
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
    const user = await UserEntity.scope("detail").findByPk(id);

    if (!user) throw errors.notFound("User not found");
    ForbiddenError.from(this.req!.ability).throwUnlessCan("update", user);

    user.set(data);
    await user.save();

    this.res!.status(200).json(user);
  },
  async delete(this: IHandlerContext): Promise<void> {
    const { id } = this.req!.params;
    const user = await UserEntity.scope("detail").findByPk(id);

    if (!user) throw errors.notFound("User not found");
    ForbiddenError.from(this.req!.ability).throwUnlessCan("delete", user);

    await user.destroy();

    this.res!.status(200).send({});
  },
};
