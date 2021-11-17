import * as process from "node:process";
import * as util from "node:util";
import * as path from "node:path";
import * as fs from "node:fs/promises";
import config from "config";
import Queue, { Job } from "bee-queue";
import nodemailer from "nodemailer";
import MailgunTransport from "mailgun-nodemailer-transport";
import Email from "email-templates";

import { logger } from "util/";

let templates: String[];
const TEMPLATES_DIR = path.resolve(__dirname, "..", "..", "templates");
const redisConfig: object = config.get("redis");
const transportOptions: { domain: string; apiKey: string } =
  config.get("mailgun");
const from = `rest-api <postmaster@${transportOptions.domain}>`;

const mailQueue = new Queue("mail", { redis: redisConfig });
const transporter = nodemailer.createTransport(
  new MailgunTransport({ auth: transportOptions })
);
const email = new Email({ views: { root: TEMPLATES_DIR } });

mailQueue.process(async (job: Job<any>) => {
  const { id, data } = job;
  const { to, locals, template, ...rest } = data;

  if (!templates) {
    templates = await fs.readdir(TEMPLATES_DIR);
  }

  if (!templates.includes(template) || process.env.NODE_ENV === "test") {
    throw new Error(util.format("Skipping job", job.id));
  } else {
    logger.debug(util.format("PID %s processing mail job %d", process.pid, id));
  }

  const { subject, html } = await email.renderAll(template, locals);
  try {
    const sent = await transporter.sendMail({
      to,
      from,
      ...rest,
      html,
      subject,
    });
    logger.debug(util.format("%s mail sent to %s", template, to));
  } catch (error) {
    throw new Error(util.format("Sending %s mail failed: %O", template, error));
  }
});
