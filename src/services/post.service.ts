import { ForbiddenError } from "@casl/ability";

import {
  IHandlerContext,
  addPaginationData,
  getPaginationParams,
  errors,
} from "util/";
import { PostEntity, sequelize } from "database";
import { PostCreationParams, PostUpdateParams } from "dtos/index";

export default {
  async findAll(this: IHandlerContext): Promise<void> {

    const { limit, offset } = getPaginationParams(this.req!.query);
    const posts = await PostEntity.findAndCountAll({ limit, offset });
    const result = addPaginationData(posts, this.req!.query);

    this.res!.status(200).json(result);
  },
  async findOne(this: IHandlerContext): Promise<void> {
    const { id } = this.req!.params;
    const post = await PostEntity.scope("detail").findByPk(id);

    if (!post) throw errors.notFound("Post not found");

    this.res!.status(200).json(post);
  },
  async create(this: IHandlerContext): Promise<void> {
    const data: PostCreationParams = this.req!.body;
    const post = await sequelize.transaction(async transaction => {
      const created = await PostEntity.create(data, {
        transaction,
      });

      return await PostEntity.scope("detail").findByPk(created.id, {
        transaction,
      });
    });

    this.res!.status(201).json(post);
  },
  async update(this: IHandlerContext): Promise<void> {
    const data: PostUpdateParams = this.req!.body;
    const { id } = this.req!.params;
    const post = await PostEntity.scope("detail").findByPk(id);

    if (!post) throw errors.notFound("Post not found");

    post.set(data);
    await post.save();

    this.res!.status(200).json(post);
  },
  async delete(this: IHandlerContext): Promise<void> {
    const { id } = this.req!.params;
    const post = await PostEntity.scope("detail").findByPk(id);

    if (!post) throw errors.notFound("Post not found");

    await post.destroy();

    this.res!.status(200).end();
  },
};
