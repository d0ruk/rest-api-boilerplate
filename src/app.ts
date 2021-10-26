import express, { Response, Request, NextFunction } from "express";
import expressWinston from "express-winston";
import { ValidationError } from "sequelize";

import routes from "routes/";
import { logger, errors, IMyError } from "util/";

const isProd = process.env.NODE_ENV === "production";
export const app: express.Application = express();

app.use(express.json());
app.use(
  expressWinston.logger({ winstonInstance: logger, expressFormat: true })
);

for (const [path, router] of Object.entries(routes)) {
  app.use(path, router);
}

app.use(() => {
  throw errors.notFound("Route not found");
});

app.use((error: IMyError, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof ValidationError) {
    error = errors.badData(error.original.message, error) as IMyError;
  }

  if (error instanceof SyntaxError) {
    error = errors.badRequest(error.message, error) as IMyError;
  }

  if (error.name === "UnauthorizedError") {
    error = errors.unauthorized(error.message) as IMyError;
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
});
