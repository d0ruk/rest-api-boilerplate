import { Sequelize, DataTypes, Model } from "sequelize";
import slugify from "slugify";

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
      deletedAt: DataTypes.DATE,
    },
    {
      tableName: "posts",
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
      const slug = slugify(post.title, {
        strict: true,
        locale: "en",
      });

      post.slug = slug;
    }
  });

  return PostModel;
}
