import * as util from "node:util";
import config from "config";
import Queue, { Job } from "bee-queue";

import { logger } from "util/";

const redisConfig: object = config.get("redis");

const mailQueue = new Queue("mail", { redis: redisConfig });

mailQueue.on("ready", () => {
  logger.info("Mail queue ready");
});

mailQueue.on("error", err => {
  logger.error(util.format("Mail queue error %O", err));
});

export const closeQueues = async () => {
  await mailQueue.close();
};

export interface ICreateMailJob {
  to: string;
}

export const createMailJob = ({ to = "" }): Job<ICreateMailJob> => {
  const job = mailQueue.createJob({ to });

  job.on("succeeded", result => {
    logger.info(util.format("Completed mail job %s", job.id));
  });

  job.on("failed", err => {
    logger.error(util.format("Mail job %s failed: %O", job.id, err));
  });

  job.save(err => {
    if (err) {
      logger.error(util.format("Mail job %d failed to save %O", job.id, err));
    }

    logger.info(util.format("Saved job %s", job.id));
  });

  return job;
};
