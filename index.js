const amqp = require("amqplib");
const url = process.env.AMQP_URL;

async function main() {
  const connection = await amqp.connect(url);
  const channel = await connection.createChannel();

  const queue = "buzzle-jobs";
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
}

main().catch(console.log);
