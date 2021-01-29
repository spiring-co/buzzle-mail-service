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

      var queue = "buzzle-creators";
      var msg = "job:state:error:job id";

      // var msg = {
      //     process: "job",
      //     change: "state",
      //     type: "error",
      //     data: { email: "shivam.119966@yahoo.com" },
      //   };

      // channel.assertQueue("buzzle-creators", {
      //   durable: true,
      // });
      channel.sendToQueue(
        "buzzle-creators",
        Buffer.from(
          JSON.stringify({
            data: {
              adminPushTokens: [
                "cUosg6jzoVdSxyHA0zUnRp:APA91bFzc0NoLzhJh1CBDowotAeB4eJ8jYnf7aTwT363TZaOUtFhPB7G9wsvwK7bd2vOyphbB_fkMyoORryfZ05jkmwL36BZ-4UhDgS0FncOtwd4KNzJof3QfhknNQVAbYC1rhqiMBDm",
              ],
            },
            eventType: "created",
          })
        ),
        {
          persistent: true,
        }
      );
      console.log(" [x] Sent '%s'", msg);
    });
  }
);
