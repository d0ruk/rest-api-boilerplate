import * as util from "node:util";
import { Worker } from "node:worker_threads";
import * as path from "node:path";
import * as fs from "node:fs/promises";
import os from "node:os";
import Pool from "worker-threads-pool";

import { logger } from "util/";

const WORKERS_DIR = path.resolve(__dirname);
const pool = new Pool({ max: os.cpus().length - 1 });
const acquire = util.promisify(pool.acquire.bind(pool));

fs.readdir(WORKERS_DIR)
  .then(files => {
    const workers = files.filter(name => name.includes(".worker."));

    workers.forEach(async filename => {
      const worker: Worker = await acquire(path.resolve(WORKERS_DIR, filename));

      worker.on("online", () => {
        logger.info(
          util.format("%s online. Pool size is %d", filename, pool.size)
        );
      });

      worker.on("error", error => {
        logger.error(util.format("%s error: %o", filename, error));
      });

      worker.on("exit", exitCode => {
        if (exitCode) {
          logger.error(
            util.format("%s exited with code %s", filename, exitCode)
          );
        } else {
          logger.info(
            util.format(
              "%s exited cleanly. Pool size is %d",
              filename,
              pool.size
            )
          );
        }
      });
    });

    logger.info(`Started ${workers.length} workers`);
  })
  .catch(err => {
    logger.error(util.format("Failed to start workers %o", err));
  });
