import { Sequelize, DataTypes, Model } from "sequelize";

export interface ITag {
  id: number;
  name: string;
}

export class TagModel extends Model implements ITag {
  public id: number;
  public name: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;
}

export default function (sequelize: Sequelize): typeof TagModel {
  TagModel.init(
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      deletedAt: DataTypes.DATE,
    },
    {
      tableName: "tags",
      sequelize,
      indexes: [
        {
          unique: true,
          fields: ["name"],
        },
      ],
      defaultScope: {
        attributes: ["name"],
      },
      scopes: {
        all: {
          include: [{ all: true }],
        },
        detail: {
          attributes: {
            exclude: ["createdAt", "updatedAt", "deletedAt"],
          },
        },
      },
    }
  );

  return TagModel;
}
