import Redis from 'ioredis'
import os from 'os';

import dotenv from 'dotenv';
dotenv.config({path: './keys/.env'});

const mappings = {
    "normalised": "lobEvents",
    "trades": "trades"
}

class RedisSubscriber {
    constructor(exchange, feed, pubsub) {
        this.pubsub = pubsub;
        this.streamName = `${exchange}-${feed}`;
        this.feed = mappings[feed];
        this.redis = new Redis({host: process.env.REDIS_HOST});
        this.id = os.hostname();
        this.createGroup();
        // try {
        //     this.redis.xgroup('CREATE', this.streamName, 'graphql-server-consumer-group', '$', 'MKSTREAM').catch(err => console.log(err));
        // } catch (e) {
        //     console.log(e);
        // }
    }

    async createGroup() {
        try {
            await this.redis.xgroup('CREATE', this.streamName, 'graphql-server-consumer-group', '$', 'MKSTREAM').catch(err => console.log(err));
        } catch (e) {
            console.log(e);
        }
    }

    async consume() {
        try {
            const stream = await this.redis.xreadgroup('GROUP', 'graphql-server-consumer-group', this.id, 'COUNT', 1000, 'BLOCK', 0, 'NOACK', 'STREAMS', this.streamName, '>');
            if (stream.length > 0) {
                const [, messages] = stream[0];
                for (const message of messages) {
                    this.pubsub.publish(this.streamName,
                        {[this.feed]: JSON.parse(message[1][1])
                        });
                }
            }
        } catch (e) {
            console.log(e);
        }
    }

    async run() {
        while (true) {
            await this.consume();
        }
    }
}

async function main() {
    const streamName = 'binance-trades';
    const pubsub = new PubSub();
    const subscriber = new RedisSubscriber(streamName, pubsub);
    while (1) {
        await subscriber.consume();
    }
}

if (typeof require !== 'undefined' && require.main === module) {
    main();
}


export default RedisSubscriber;