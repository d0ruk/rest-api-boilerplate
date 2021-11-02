import * as process from "node:process";
import * as util from "node:util";
import config from "config";
import Queue, { Job } from "bee-queue";

import { logger } from "util/";
import { ICreateMailJob } from "queue";

const redisConfig: object = config.get("redis");

const mailQueue = new Queue("mail", { redis: redisConfig });

mailQueue.process(async (job: Job<ICreateMailJob>) => {
  const { id, data } = job;

  logger.info(
    util.format("PID %s processing mail job %d", process.pid, id)
  );
});
