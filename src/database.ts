import config from "config";
import Sequelize from "sequelize";

import { User, Post, Tag } from "models/";
import { logger } from "util/";

const dbConfig: object = config.get("database");

export const sequelize = new Sequelize.Sequelize({
  ...dbConfig,
  logQueryParameters: process.env.NODE_ENV === "development",
  logging: (query: string, time: number) => {
    logger.debug(`${time} ms | ${query}`);
  },
  benchmark: true,
});

sequelize.authenticate();

export const UserEntity = User(sequelize);
export const PostEntity = Post(sequelize);
export const TagEntity = Tag(sequelize);

PostEntity.belongsTo(UserEntity, { as: "author", foreignKey: "authorId" });
UserEntity.hasMany(PostEntity, { as: "posts", foreignKey: "authorId" });
TagEntity.belongsToMany(PostEntity, {
  through: "PostTag",
  foreignKey: "tagId",
  as: "posts",
});
PostEntity.belongsToMany(TagEntity, {
  through: "PostTag",
  foreignKey: "postId",
  as: "tags",
});
