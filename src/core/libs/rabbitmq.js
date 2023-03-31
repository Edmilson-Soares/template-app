import amqplib from 'amqplib';

export default async(env) => {

    try {
        const conn = await amqplib.connect(process.env.RABBITMQ_URL);
        return await conn.createChannel();
    } catch (error) {

        //   console.log(error)

    }

}