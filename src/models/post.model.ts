import { Sequelize, DataTypes, Model } from "sequelize";

import { UserModel } from "./user.model";
import { getSlug } from "util/";

export interface IPost {
  id: number;
  title: string;
  body: string;
  slug: string;
  published: boolean;
}

export class PostModel extends Model implements IPost {
  public id: number;
  public title: string;
  public body: string;
  public slug: string;
  public published: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;
}

export default function (sequelize: Sequelize): typeof PostModel {
  PostModel.init(
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      title: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      body: {
        allowNull: false,
        type: DataTypes.TEXT,
      },
      published: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      slug: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      authorId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      deletedAt: DataTypes.DATE,
    },
    {
      tableName: "posts",
      indexes: [
        {
          fields: ["author_id"],
        },
      ],
      sequelize,
      defaultScope: {
        attributes: ["title"],
        where: {
          published: true,
        },
      },
      scopes: {
        all: {
          include: [{ all: true }],
        },
        detail: {
          attributes: {
            exclude: [
              "authorId",
              "published",
              "slug",
              "createdAt",
              "updatedAt",
              "deletedAt",
            ],
          },
        },
      },
    }
  );

  PostModel.addHook("beforeValidate", async (post: PostModel) => {
    if (post.changed("title")) {
      const slug = getSlug(post.get("title"));

      post.set({ slug });
    }
  });

  PostModel.belongsTo(UserModel, { as: "author" });

  return PostModel;
}
