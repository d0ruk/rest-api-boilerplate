import { NextFunction, Request, Response } from "express";
import { assert, Struct } from "superstruct";

import { errors } from "util/";

const validateMiddleware =
  (dto: Struct) => (req: Request, res: Response, next: NextFunction) => {
    try {
      assert(req.body, dto);
      return next();
    } catch (error) {
      const message = `.${error.path.join(".")} should be ${error.type}`;

      next(errors.badData(message, error));
    }
  };

export default validateMiddleware;
