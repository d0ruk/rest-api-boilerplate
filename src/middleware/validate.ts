import { NextFunction, Request, Response } from "express";
import { Struct, create } from "superstruct";
import { ParsedQs } from "qs";

import { errors } from "util/";

const validateMiddleware =
  (dto: Struct, isQuery = false) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      if (isQuery) {
        req.query = create(req.query, dto) as ParsedQs;
      } else {
        req.body = create(req.body, dto);
      }
      return next();
    } catch (error) {
      const message = `.${error.path.join(".")} should be ${error.type}`;

      next(errors.badData(message, error));
    }
  };

export default validateMiddleware;
