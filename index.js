require("dotenv").config();

const amqp = require("amqplib");
const url = process.env.AMQP_URL;
const queue = "buzzle-jobs";
const queueCreator = "buzzle-creators";
const spiringemail = "shivam.119966@yahoo.com";
const creator = "shivam.119966@yahoo.com";
const mailer = require("@sendgrid/mail");

const accountSid = process.env.accountSid;
const authToken = process.env.authToken;
const client = require("twilio")(accountSid, authToken);

const { SENDGRID_API_KEY } = process.env;
mailer.setApiKey(SENDGRID_API_KEY);

async function main() {
  const connection = await amqp.connect(url);
  const channel = await connection.createChannel();

  // jobs queue
  // await channel.assertQueue(queue, { durable: false });
  // channel.consume(
  //   queue,
  //   async ({ content }) => {
  //     const { data, eventType } = JSON.parse(content.toString());
  //     console.log(data);

  //     switch (eventType) {
  //       case "created":
  //         try {
  //           await mailer.send({
  //             to: spiringemail,
  //             from: "noreply@spiring.co",
  //             subject: "job created",
  //             text: "a job was just created",
  //           });
  //         } catch (e) {
  //           console.log(e);
  //         }
  //         console.log("Send Job created mail");
  //         break;
  //       case "updated":
  //         try {
  //           await mailer.send({
  //             to: spiringemail,
  //             from: "noreply@spiring.co",
  //             subject: "job updated",
  //             text: "a job was just updated",
  //           });
  //         } catch (e) {
  //           console.log(e);
  //         }
  //         console.log("Send job updated mail");
  //         break;
  //       case "deleted":
  //         try {
  //           await mailer.send({
  //             to: spiringemail,
  //             from: "noreply@spiring.co",
  //             subject: "job deleted",
  //             text: "a job was just deleted",
  //           });
  //         } catch (e) {
  //           console.log(e);
  //         }
  //         console.log("Send job deleted mail");
  //     }
  //   },
  //   {
  //     noAck: true,
  //   }
  // );

  // creators queue
  await channel.assertQueue(queueCreator, { durable: false });
  channel.consume("buzzle-creators", async ({ content }) => {
    try {
      const { data, eventType } = JSON.parse(content.toString());
      console.log(data, eventType);
      switch (eventType) {
        case "created":
          const { email } = data;
          console.log(email);
          await mailer.send({
            to: email,
            from: "noreply@spiring.co",
            subject: "account created",
            text: "Your buzzle account has been succesfully created",
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
    } catch (e) {
      console.log(e);
    }
  });

  //webhook queue
  // await channel.assertQueue(queue, { durable: false });
  // channel.consume("buzzle-creators", async ({ content }) => {
  //   const { data, eventType } = JSON.parse(content.toString());

  //   switch (eventType) {
  //     case "created":
  //       try {
  //         await mailer.send({
  //           to: creator.email,
  //           from: "noreply@spiring.co",
  //           subject: "job created",
  //           text: "a job of your video templated was just created",
  //         });
  //       } catch (e) {
  //         console.log(e);
  //       }
  //       console.log("Send creator created mail");
  //       break;
  //     case "updated":
  //       try {
  //         await mailer.send({
  //           to: creator.email,
  //           from: "noreply@spiring.co",
  //           subject: "job updated",
  //           text: "a job of your video templated was just updated",
  //         });
  //       } catch (e) {
  //         console.log(e);
  //       }
  //       console.log("Send creator updated mail");
  //       break;
  //     case "deleted":
  //       try {
  //         await mailer.send({
  //           to: creator.email,
  //           from: "noreply@spiring.co",
  //           subject: "job deleted",
  //           text: "a job of your video templated was just deleted",
  //         });
  //       } catch (e) {
  //         console.log(e);
  //       }
  //       console.log("Send creator deleted mail");
  //   }
  // });
}

main().catch(console.log);
