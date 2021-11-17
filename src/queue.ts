import * as util from "node:util";
import config from "config";
import Queue, { Job } from "bee-queue";
import { SendMailOptions } from "nodemailer";

import { logger } from "util/";

const redisConfig: object = config.get("redis");

const mailQueue = new Queue("mail", { redis: redisConfig });

mailQueue.on("ready", () => logger.info("Mail queue ready"));
mailQueue.on("error", err => {
  logger.error(util.format("Mail queue error %O", err));
});
mailQueue.on("failed", (job: Job<any>, err: Error) => {
  logger.error(util.format("Mail queue job %s failed: %O", job?.id, err));
});

export const closeQueues = async () => {
  await mailQueue.close();
};

export const createMailJob = (
  args: SendMailOptions & { template: string },
  locals: object
) => {
  const to = args?.to ?? "";

  const job = mailQueue.createJob({ ...args, to, locals });

  job.on("succeeded", () => {
    logger.info(util.format("Completed mail job %s", job.id));
  });

  job.on("failed", err => {
    logger.error(util.format("Mail job %s failed: %s", job.id, err?.message));
  });

  job.save(err => {
    if (err) {
      logger.error(util.format("Mail job %d failed to save %O", job.id, err));
    } else {
      logger.debug(util.format("Saved mail job %s", job.id));
    }
  });

  return job;
};
