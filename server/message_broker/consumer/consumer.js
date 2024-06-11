const amqp = require("amqplib");
const { RABBITMQ_URI } = require("../../config/config");

async function consumeMessagesFromQueue(exchange, queue, routingKey, callback) {
  try {
    const connection = await amqp.connect(RABBITMQ_URI);
    const channel = await connection.createChannel();

    await channel.assertExchange(exchange, "topic", { durable: true });
    await channel.assertQueue(queue, { durable: false });
    await channel.bindQueue(queue, exchange, routingKey);

    await channel.consume(queue, async (message) => {
      if (message !== null) {
        const data = JSON.parse(message.content.toString());
        console.log(` [x] Received message from ${queue} queue:`, data);
        console.log("Hello",routingKey,exchange);
        await callback(data);
        channel.ack(message);
      }
    });
  } catch (error) {
    console.error(`Error consuming messages from ${queue} queue:`, error.message);
  }
}

module.exports = consumeMessagesFromQueue;
