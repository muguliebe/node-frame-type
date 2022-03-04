// noinspection JSUnusedGlobalSymbols

const amqp = require('amqplib')
const exchange = 'topic.log'
const queueName = 'topic.log'

export async function initQueue() {
    log.debug(`topic-log.mq] initQueue start`)
    const connection = await amqp.connect(process.env.MQ_URL)
    const channel = await connection.createChannel()
    await channel.assertExchange(exchange, 'topic')
    const { queue } = channel.assertQueue(queueName, { durable: true })
    await channel.bindQueue(queue, queueName)

    channel.consume(queue, async msg => {
        const content = msg.content

        const tr = JSON.parse(msg.content)
        log.debug(`topic-log.mq] received: ${msg.fields.routingKey}, ${tr.date}`)
        channel.ack(msg)
    })
    log.debug(`topic-log.mq] initQueue end`)
}
