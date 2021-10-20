import Boom from "@hapi/boom";

export * from "./logger";
export * from "./controller";

export const errors = {
  notFound: (msg: string, data?: any) => Boom.notFound(msg, data),
  internal: (msg: string, data?: any) => Boom.internal(msg, data),
};
