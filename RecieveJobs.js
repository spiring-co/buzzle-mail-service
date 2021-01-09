var amqp = require("amqplib/callback_api");
var queue = "task_queue";
const mailer = require("@sendgrid/mail");

const { SENDGRID_API_KEY } = process.env;
// mailer.setApiKey(SENDGRID_API_KEY);

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
      channel.assertQueue(queue, {
        durable: true,
      });

      channel.consume(
        queue,
        async function (msg) {
          var message = msg.content.toString().split(":");
          console.log(message);
          if (message[0] === "job") {
            if (message[1] == "state") {
              switch (message[2]) {
                case "finished":
                  console.log("job finished", message[3]);
                  // try {
                  //   await mailer.send({
                  //     to: creator.email,
                  //     from: "noreply@spiring.co",
                  //     subject: "job finished",
                  //     text: "a job of your video templated was just finished",
                  //   });
                  // } catch (e) {
                  //   console.log(e);
                  // }
                  break;
                case "error":
                  console.log("job error", message[3]);
                  // await mailer.send({
                  //   to: "support@bulaava.in",
                  //   from: "noreply@spiring.co",
                  //   subject: "job failed",
                  //   text: "Hi platform, a job failed",
                  // });
                  break;
              }
            }
          } else if (n[0] === "videoTemplate") {
            if (message[1] == "add") {
              // await mailer.send({
              //   to: "support@bulaava.in",
              //   from: "noreply@spiring.co",
              //   subject: "New Template Uploaded",
              //   text: "Hi platform, new template is waiting for approval",
              // });
            }
          } else if (n[0] === "creator") {
            if (message[1] == "pass") {
              // await mailer
              //   .send({
              //     to: message[2],
              //     from: "noreply@spiring.co",
              //     subject: "Password Reset",
              //     text: "The otp for your password reset is : " + message[3],
              //   })
              //   .finally(console.log("otp email sent"));
            }
            if (message[1] == "add") {
              // await mailer.send({
              //   to: email,
              //   from: "noreply@spiring.co",
              //   subject: "welcome",
              //   text: "you have registered yourself at buzzle platform",
              //   templateId: "d-6f7fe33141184ba2ad73260c1b6c1009",
              // });
            }
          }
        },
        {
          noAck: true,
        }
      );
    });
  }
);
