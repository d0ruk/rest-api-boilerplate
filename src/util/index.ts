import Boom, { Boom as BoomClass } from "@hapi/boom";
import { ValidationError, CommonErrorProperties } from "sequelize";
import { randomBytes, pbkdf2, BinaryLike } from "crypto";
import config from "config";

const { digest, iterations, keylen } = config.get("app.hash");

export * from "./logger";
export * from "./controller";

export interface IMyError
  extends BoomClass,
    ValidationError,
    CommonErrorProperties {}

export const errors = {
  notFound: (msg: string, data?: any) => Boom.notFound(msg, data),
  internal: (msg: string, data?: any) => Boom.internal(msg, data),
  badData: (msg: string, data?: any) => Boom.badData(msg, data),
  badRequest: (msg: string, data?: any) => Boom.badRequest(msg, data),
  unauthorized: (msg: string) => Boom.unauthorized(msg),
};

export const hashWithSalt = async (
  string: string,
  salt: BinaryLike = randomBytes(16).toString("hex")
): Promise<Array<any>> => {
  return new Promise((resolve, reject) => {
    pbkdf2(string, salt, iterations, keylen, digest, (err, result) => {
      if (err) return reject(err);

      resolve([result, salt]);
    });
  });
};
