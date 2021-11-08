import { NextFunction, Request, Response } from "express";
import { Struct, create } from "superstruct";
import { ParsedQs } from "qs";
import { ParamsDictionary } from "express-serve-static-core";

import { errors } from "util/";

const validateMiddleware =
  (dto: Struct, { isQuery = false, isParam = false } = {}) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      if (isQuery) {
        req.query = create(req.query, dto) as ParsedQs;
      } else if (isParam) {
        req.params = create(req.params, dto) as ParamsDictionary;
      } else {
        const valid = create(req.body, dto) as Record<string, any>;

        for (const [k, v] of Object.entries(valid)) {
          if (typeof v === "undefined") delete valid[k];
        }

        req.body = valid;
      }
      return next();
    } catch (error) {
      const message = `.${error.path.join(".")} should be ${error.type}`;

      next(errors.badData(message, error));
    }
  };

export default validateMiddleware;
