import { Sequelize, DataTypes, Model } from "sequelize";

export interface IUser {
  id: number;
  name: string;
  password: string;
  email: string;
}

export class UserModel extends Model implements IUser {
  public id: number;
  public name: string;
  public password: string;
  public email: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;
}

export default function (sequelize: Sequelize): typeof UserModel {
  UserModel.init(
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      name: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      deleted_at: DataTypes.DATE,
    },
    {
      tableName: "users",
      sequelize,
    }
  );

  return UserModel;
}
