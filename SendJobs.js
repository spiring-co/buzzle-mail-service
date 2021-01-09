var amqp = require("amqplib/callback_api");

amqp.connect(
  "amqps://ldxnupzb:Z-pnESNyvR7yNbtotB7MmWmNsTfr5VcJ@lionfish.rmq.cloudamqp.com/ldxnupzb",
  function (error0, connection) {
    if (error0) {
      throw error0;
    }
    connection.createChannel(function (error1, channel) {
      if (error1) {
        throw error1;
      }

      var queue = "task_queue";
      var msg = "job:state:error:job id";

      // var msg = {
      //     process: "job",
      //     change: "state",
      //     type: "error",
      //     data: { email: "shivam.119966@yahoo.com" },
      //   };

      channel.assertQueue(queue, {
        durable: true,
      });
      channel.sendToQueue(queue, Buffer.from(msg), {
        persistent: true,
      });
      console.log(" [x] Sent '%s'", msg);
    });
  }
);
