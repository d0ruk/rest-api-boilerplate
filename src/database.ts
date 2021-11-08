import config from "config";
import Sequelize from "sequelize";

import { User, Post } from "models/";
import { logger } from "util/";

const dbConfig: object = config.get("database");

export const sequelize = new Sequelize.Sequelize({
  ...dbConfig,
  logQueryParameters: process.env.NODE_ENV === "development",
  logging: (query: string, time: number) => {
    logger.info(`${time} ms | ${query}`);
  },
  benchmark: true,
});

sequelize.authenticate();

export const UserEntity = User(sequelize);
export const PostEntity = Post(sequelize);
