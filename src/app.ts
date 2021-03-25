import * as dotenv from "dotenv";
import * as amqp from "amqplib";
import messageHandler from "./messageHandler";

dotenv.config();
const { AMQP_URL, EXCHANGE_NAME, ROUTING_KEY, QUEUE_NAME } = process.env;

async function listen() {
  if (!(AMQP_URL && EXCHANGE_NAME && ROUTING_KEY && QUEUE_NAME)) {
    throw new Error("Config missing");
  }
  const connection = await amqp.connect(AMQP_URL);
  process.once("SIGINT", connection.close.bind(connection));
  connection.on("close", () => console.log("Connection closed. 🙅🏻‍♂️"));
  connection.on("error", console.error);
  connection.on("block", console.error);

  const channel = await connection.createChannel();
  await channel.assertExchange(EXCHANGE_NAME, "topic", { durable: false });

  const queue = await channel.assertQueue(QUEUE_NAME, {
    durable: true,
  });

  await channel.bindQueue(queue.queue, EXCHANGE_NAME, ROUTING_KEY);
  channel.prefetch(1);

  // @ts-ignore
  await channel.consume(queue.queue, messageHandler(channel), {
    noAck: false,
  });
}

listen().then(console.log).catch(console.error);
