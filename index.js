require("dotenv").config();

const amqp = require("amqplib");
const url = process.env.AMQP_URL;
const queue = "buzzle-jobs";

async function main() {
  const connection = await amqp.connect(url);
  const channel = await connection.createChannel();

  // jobs queue
  await channel.assertQueue(queue, { durable: false });
  channel.consume(
    queue,
    ({ content }) => {
      const { data, eventType } = JSON.parse(content.toString());

      switch (eventType) {
        case "created":
          console.log("Send Job created mail");
          break;
        case "updated":
          console.log("Send job updated mail");
          break;
        case "deleted":
          console.log("Send job deleted mail");
      }
    },
    {
      noAck: true,
    }
  );

  // creators queue
  await channel.assertQueue(queue, { durable: false });
  channel.consume("buzzle-creators", ({ content }) => {
    const { data, eventType } = JSON.parse(content.toString());

    switch (eventType) {
      case "created":
        console.log("Send creator created mail");
        break;
      case "updated":
        console.log("Send creator updated mail");
        break;
      case "deleted":
        console.log("Send creator deleted mail");
    }
  });
}

main().catch(console.log);
