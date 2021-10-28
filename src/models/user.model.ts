import { Sequelize, DataTypes, Model, FindOptions } from "sequelize";
import jwt from "jsonwebtoken";
import config from "config";

import { hashWithSalt } from "util/";

const { secret, options: jwtOptions } = config.get("app.jwt");

export interface IUser {
  id: number;
  name: string;
  password: string;
  email: string;

  hashPassword(password: string): Promise<Array<any>>;
  comparePassword(password: string): Promise<boolean>;
  getToken(): Promise<string>;
}

export class UserModel extends Model implements IUser {
  public id: number;
  public name: string;
  public password: string;
  public email: string;
  public salt: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;

  public static findByEmail(email: string, options: FindOptions = {}) {
    const opts = Object.assign({}, options, { where: { email } });

    return this.findOne(opts);
  }

  async hashPassword(password: string): Promise<Array<any>> {
    return hashWithSalt(password, this.get("salt") as string);
  }

  async comparePassword(password: string): Promise<boolean> {
    const [hashed] = await this.hashPassword(password);

    return hashed.toString("hex") === this.password;
  }

  async getToken(): Promise<string> {
    return new Promise((resolve, reject) => {
      const { id, email } = this;

      jwt.sign({ id, email }, secret, jwtOptions, (err, result: string) => {
        if (err) reject(err);

        resolve(result);
      });
    });
  }
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
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      salt: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      deletedAt: DataTypes.DATE,
    },
    {
      tableName: "users",
      sequelize,
      indexes: [
        {
          unique: true,
          fields: ["email"],
        },
      ],
      defaultScope: {
        attributes: ["name", "email"],
      },
      scopes: {
        all: {
          include: [{ all: true }],
        },
        detail: {
          attributes: {
            exclude: [
              "password",
              "salt",
              "createdAt",
              "updatedAt",
              "deletedAt",
            ],
          },
        },
      },
    }
  );

  UserModel.addHook("beforeCreate", "beforeUpdate", async (user: UserModel) => {
    if (user.changed("password")) {
      const [hash, salt] = await user.hashPassword(user.password);
      if (salt) user.salt = salt;

      user.password = hash.toString("hex");
    }
  });

  return UserModel;
}
