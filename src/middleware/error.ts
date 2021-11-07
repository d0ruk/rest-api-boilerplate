import { Response, Request, NextFunction } from "express";
import { ValidationError } from "sequelize";
import { ForbiddenError } from "@casl/ability";
import { UnauthorizedError } from "express-jwt";

import { logger, errors, IMyError } from "util/";

const isProd = process.env.NODE_ENV === "production";

const errorMiddleware =
  () => (error: IMyError, req: Request, res: Response, next: NextFunction) => {
    if (error instanceof ValidationError) {
      error = errors.badData(
        error.original?.message || error.message,
        error
      ) as IMyError;
    }

    if (error instanceof SyntaxError) {
      error = errors.badRequest(error.message, error) as IMyError;
    }

    if (error instanceof UnauthorizedError) {
      error = errors.unauthorized(error.message) as IMyError;
    }

    if (error instanceof ForbiddenError) {
      error = errors.forbidden("Forbidden", error) as IMyError;
    }

    if (error.isBoom) {
      const {
        output: { statusCode, payload },
        data,
      } = error;

      res
        .status(statusCode)
        .json(Object.assign({ ...payload }, !isProd && { data }));
    } else {
      const {
        output: { statusCode, payload },
      } = errors.internal("Oops");

      res.status(statusCode).json(payload);
      logger.error(error.message);
    }
  };

export default errorMiddleware;
