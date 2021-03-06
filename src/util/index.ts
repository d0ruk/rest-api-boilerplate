import { randomBytes, pbkdf2, BinaryLike } from "node:crypto";
import Boom, { Boom as BoomClass } from "@hapi/boom";
import { ValidationError, CommonErrorProperties, Model } from "sequelize";
import config from "config";
import slugify from "slugify";

import { IPagination } from "dtos/";

const { digest, iterations, keylen } = config.get("app.hash");

export * from "./logger";
export * from "./controller";
export * from "./abilities";

export enum UserRoles {
  "admin",
  "user",
}

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
  forbidden: (msg: string, data?: any) => Boom.forbidden(msg, data),
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

export const addPaginationData = (
  data: { rows: Model[]; count: number },
  query: IPagination
) => {
  const { page = 1, size = 20 } = query;
  const { count, rows } = data;
  const totalPages = Math.ceil(count / size);

  return { totalItems: count, totalPages, page, rows };
};

export const getPaginationParams = (query: IPagination) => {
  const { page = 1, size = 20 } = query;

  return { limit: size, offset: (page - 1) * size };
};

export const getSlug = (string: string): string => {
  return slugify(string, {
    strict: true,
    locale: "en",
  });
};

export const filterAsync = async (
  array: any[],
  callback: (value: any, index: number) => Promise<boolean>
): Promise<any[]> => {
  const results: boolean[] = await Promise.all(
    array.map((value, index) => callback(value, index))
  );

  return array.filter((_, i) => results[i]);
};
