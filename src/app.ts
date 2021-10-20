import express, { Response, Request, NextFunction } from "express";
import { Boom } from "@hapi/boom";
import expressWinston from "express-winston";

import routes from "routes/";
import { logger, errors } from "util/";

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

app.use((error: Boom, req: Request, res: Response, next: NextFunction) => {
  if (error.isBoom) {
    const { statusCode, payload } = error.output;

    res.status(statusCode).json(payload);
  } else {
    const {
      output: { statusCode, payload },
    } = errors.internal("Oops");

    res.status(statusCode).json(payload);
    logger.error(error.message);
  }
});
