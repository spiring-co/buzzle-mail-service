import fs from "fs";
import _ from "lodash";
import amqp from "amqplib";
import Mustache from "mustache";
import dotenv from "dotenv";
import mailer from "@sendgrid/mail";
import subjects from "./helpers/subjectByEvent";

dotenv.config();

const {
  SENDGRID_API_KEY = "",
  FROM_EMAIL = "noreply@spiring.co",
} = process.env;

if (!SENDGRID_API_KEY) {
  throw new Error("Sendgrid API Key missing!");
}

mailer.setApiKey(SENDGRID_API_KEY);

export default function (channel: amqp.Channel) {
  return async (message: amqp.ConsumeMessage) => {
    const { fields, content, properties } = message;
    const { routingKey = "buzzle-users" } = fields;

    let data: any;
    let eventType: string;

    try {
      ({ data, eventType } = JSON.parse(content.toString()));
    } catch (e) {
      console.error("Invalid message format");
      return channel.reject(message, false);
    }

    const templatePath = `./templates/${routingKey}.${eventType}.html`;

    if (!fs.existsSync(templatePath)) {
      return channel.reject(message, false);
    }

    try {
      const template = fs.readFileSync(templatePath, "utf8");

      const result = await mailer.send({
        to: data.user.email,
        from: FROM_EMAIL,
        subject: subjects[`${routingKey}.${eventType}`],
        html: Mustache.render(template, data),
      });

      console.log(result);
    } catch (e) {
      console.error(e);
      return channel.reject(message, false);
    }

    return channel.ack(message);
  };
}
