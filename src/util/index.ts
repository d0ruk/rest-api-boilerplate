import Boom, { Boom as BoomClass } from "@hapi/boom";
import { ValidationError, CommonErrorProperties } from "sequelize";

export * from "./logger";
export * from "./controller";
export * from "./validate";

export interface IMyError
  extends BoomClass,
    ValidationError,
    CommonErrorProperties {}

export const errors = {
  notFound: (msg: string, data?: any) => Boom.notFound(msg, data),
  internal: (msg: string, data?: any) => Boom.internal(msg, data),
  badData: (msg: string, data?: any) => Boom.badData(msg, data),
  badRequest: (msg: string, data?: any) => Boom.badRequest(msg, data),
};
