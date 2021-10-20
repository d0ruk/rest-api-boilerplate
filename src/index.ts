import config from "config";

import { app } from "app";
import { sequelize } from "database";
import { logger } from "util/";

const { host, port } = config.get("app");

(async () => {
  await sequelize.sync({ force: process.env.NODE_ENV === "test" });

  app.listen({ host, port }, () => {
    console.log(`Listening on ${host}:${port} | mode: ${process.env.NODE_ENV}`);
  });
})();

process.once("SIGUSR2", async () => {
  try {
    await sequelize.close();
  } catch (error) {
    logger.emerg(error.message);
    process.kill(process.pid, "SIGUSR2");
  }
});
