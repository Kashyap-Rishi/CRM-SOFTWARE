const amqp = require("amqplib");
const { RABBITMQ_URI } = require("../../config/config");

async function sendMessageToQueue(exchange, routingKey, data) {
  try {
    console.log("Connecting to RabbitMQ...");

    const connection = await amqp.connect(RABBITMQ_URI, {
      heartbeat: 30,
    });
    const channel = await connection.createChannel();

    console.log("Connected. Publishing message to exchange:", exchange);

    await channel.assertExchange(exchange, "topic", { durable: true });
    const messageBuffer = Buffer.from(JSON.stringify(data));

    await channel.publish(exchange, routingKey, messageBuffer);

    console.log(` [x] Sent message with routing key ${routingKey}:`, data);

    await channel.close();
    await connection.close();
  } catch (error) {
    console.error(
      `Error sending message with routing key ${routingKey}:`,
      error.message
    );
  }
}

module.exports = sendMessageToQueue;
