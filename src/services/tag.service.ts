import { ForbiddenError } from "@casl/ability";

import {
  IHandlerContext,
  addPaginationData,
  getPaginationParams,
  errors,
} from "util/";
import { TagEntity, sequelize } from "database";
import { TagCreationParams, TagUpdateParams } from "dtos/";

export default {
  async findAll(this: IHandlerContext): Promise<void> {
    ForbiddenError.from(this.req!.ability).throwUnlessCan("list", "TagModel");

    const { limit, offset } = getPaginationParams(this.req!.query);
    const tags = await TagEntity.findAndCountAll({ limit, offset });
    const result = addPaginationData(tags, this.req!.query);

    this.res!.status(200).json(result);
  },
  async findOne(this: IHandlerContext): Promise<void> {
    const { id } = this.req!.params;
    const tag = await TagEntity.scope("detail").findByPk(id);

    if (!tag) throw errors.notFound("Tag not found");
    ForbiddenError.from(this.req!.ability).throwUnlessCan("read", tag);

    this.res!.status(200).json(tag);
  },
  async create(this: IHandlerContext): Promise<void> {
    ForbiddenError.from(this.req!.ability).throwUnlessCan("create", "TagModel");

    const data: TagCreationParams = this.req!.body;
    const tag = await sequelize.transaction(async transaction => {
      const created = await TagEntity.create(data, {
        transaction,
      });

      return await TagEntity.scope("detail").findByPk(created.id, {
        transaction,
      });
    });

    this.res!.status(201).json(tag);
  },
  async update(this: IHandlerContext): Promise<void> {
    const data: TagUpdateParams = this.req!.body;
    const { id } = this.req!.params;
    const tag = await TagEntity.scope("detail").findByPk(id);

    if (!tag) throw errors.notFound("Tag not found");
    ForbiddenError.from(this.req!.ability).throwUnlessCan("update", tag);

    tag.set(data);
    await tag.save();

    this.res!.status(200).json(tag);
  },
  async delete(this: IHandlerContext): Promise<void> {
    const { id } = this.req!.params;
    const tag = await TagEntity.scope("detail").findByPk(id);

    if (!tag) throw errors.notFound("Tag not found");
    ForbiddenError.from(this.req!.ability).throwUnlessCan("delete", tag);

    await tag.destroy();

    this.res!.status(200).end();
  },
};
