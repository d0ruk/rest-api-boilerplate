import * as util from "node:util";
import { Worker } from "node:worker_threads";
import * as path from "node:path";
import * as fs from "node:fs/promises";

import { logger } from "util/";

const WORKERS_DIR = path.resolve(__dirname);

fs.readdir(WORKERS_DIR)
  .then(files => {
    const workers = files.filter(name => name.includes(".worker."));

    workers.forEach(filename => {
      const worker = new Worker(path.resolve(WORKERS_DIR, filename));

      worker.on("error", error => {
        logger.error(util.format("%d error: %o", filename, error));
      });

      worker.on("exit", exitCode => {
        logger.error(util.format("%d exited with code %s", filename, exitCode));
      });
    });

    logger.info(`Started ${workers.length} workers`);
  })
  .catch(err => {
    logger.error(util.format("Failed to start workers %o", err));
  });
