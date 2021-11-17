import express, { Response, Request, NextFunction, Router } from "express";
import expressWinston from "express-winston";

import routes from "routes/";
import { logger, errors } from "util/";
import { errorMiddleware } from "middleware/";
import { sequelize } from "database";

const app: express.Application = express();
const v1Route = Router();

app.use(express.json());
app.use(
  expressWinston.logger({
    winstonInstance: logger,
    expressFormat: true,
    ignoredRoutes: ["/"],
    meta: process.env.NODE_ENV === "development",
  })
);

for (const [path, router] of Object.entries(routes)) {
  v1Route.use(path, router);
}

app.get("/", async (_, res: Response) => {
  await sequelize.authenticate();
  res.status(200).end();
});
app.use("/v1", v1Route);

app.use(() => {
  throw errors.notFound("Route not found");
});

app.use(errorMiddleware());

export default app;
