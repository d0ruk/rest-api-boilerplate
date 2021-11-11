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
    ForbiddenError.from(this.req!.ability).throwUnlessCan("list", "PostModel");

    const { limit, offset } = getPaginationParams(this.req!.query);
    const posts = await PostEntity.findAndCountAll({ limit, offset });
    const result = addPaginationData(posts, this.req!.query);

    this.res!.status(200).json(result);
  },
  async findOne(this: IHandlerContext): Promise<void> {
    const { id } = this.req!.params;
    const post = await PostEntity.scope(["withAuthor", "detail"]).findByPk(id);

    if (!post) throw errors.notFound("Post not found");
    ForbiddenError.from(this.req!.ability).throwUnlessCan("read", post);

    this.res!.status(200).json(post);
  },
  async create(this: IHandlerContext): Promise<void> {
    ForbiddenError.from(this.req!.ability).throwUnlessCan(
      "create",
      "PostModel"
    );

    const data: PostCreationParams = this.req!.body;
    const toCreate = Object.assign(data, { authorId: this.req!.user?.id });
    const post = await sequelize.transaction(async transaction => {
      const created = await PostEntity.create(toCreate, {
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
    ForbiddenError.from(this.req!.ability).throwUnlessCan("update", post);

    post.set(data);
    await post.save();

    this.res!.status(200).json(post);
  },
  async delete(this: IHandlerContext): Promise<void> {
    const { id } = this.req!.params;
    const post = await PostEntity.scope("detail").findByPk(id);

    if (!post) throw errors.notFound("Post not found");
    ForbiddenError.from(this.req!.ability).throwUnlessCan("delete", post);

    await post.destroy();

    this.res!.status(200).end();
  },
};
