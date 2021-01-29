var amqp = require("amqplib/callback_api");
require("dotenv").config();

const url = process.env.AMQP_URL;
const exchange = "buzzle-test";
const queueCreator = "buzzle-test";
const spiringemail = "shivam.119966@yahoo.com";
const creator = "shivam.119966@yahoo.com";
const mailer = require("@sendgrid/mail");

const accountSid = process.env.accountSid;
const authToken = process.env.authToken;
const client = require("twilio")(accountSid, authToken);

const { SENDGRID_API_KEY } = process.env;
mailer.setApiKey(SENDGRID_API_KEY);

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
      var exchange = "buzzle-test";

      channel.assertExchange(exchange, "fanout", {
        durable: false,
      });

      channel.assertQueue(
        "",
        {
          exclusive: true,
        },
        function (error2, q) {
          if (error2) {
            throw error2;
          }
          console.log(" [*] Waiting for logs. To exit press CTRL+C");
          channel.bindQueue(q.queue, exchange, "");

          // args.forEach(function(severity) {
          //   channel.bindQueue(q.queue, exchange, severity);
          // });

          channel.consume(
            q.queue,
            async function (msg) {
              const { data, eventType } = JSON.parse(msg.content.toString());
              console.log(data, eventType);
              switch (eventType) {
                case "created":
                  const { email } = data;
                  console.log(email);
                  await mailer.send({
                    to: "tyagiboii96@gmail.com",
                    from: "noreply@spiring.co",
                    subject: "account created",
                    html: Mustache.render(template, data2),
                  });
                  try {
                    console.log("here in verify mail");
                    const v = await mailer.send({
                      to: email,
                      from: "noreply@spiring.co",
                      subject: "welcome",
                      text: "you have registered yourself at buzzle platform",
                      templateId: "d-6f7fe33141184ba2ad73260c1b6c1009",
                    });
                    if (!v) {
                      console.log("problem");
                    }
                  } catch (e) {
                    console.log(e);
                  }
                  break;
                case "updated":
                  const { otp } = data;
                  const emailUpdate = data.email;
                  await mailer.send({
                    to: emailUpdate,
                    from: "noreply@spiring.co",
                    subject: "Password Reset",
                    text: "The otp for your password reset is : " + otp,
                  });
                  break;
                case "deleted":
                  const emailDel = data.email;
                  await mailer.send({
                    to: emailDel,
                    from: "noreply@spiring.co",
                    subject: "account deleted",
                    text: "Your account has been deleted",
                  });
              }
              console.log(
                " [x] %s: '%s'",
                msg.fields.routingKey,
                msg.content.toString()
              );
            },
            {
              noAck: true,
            }
          );
        }
      );
    });
  }
);
