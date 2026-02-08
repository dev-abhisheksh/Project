// redis.js
import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const client = new Redis(process.env.REDIS_URL, {
    tls: {},
    family: 0
});

client.on('connect', () => console.log('Connected to Upstash Redis'));
client.on('error', (err) => console.error('Redis error:', err));

const delRedisCache = async (client, patterns) => {
    const patternArray = Array.isArray(patterns) ? patterns : [patterns];

    try {
        for (const pattern of patternArray) {
            let cursor = "0";
            let totalDeleted = 0;

            do {
                const [next, keys] = await client.scan(
                    cursor,
                    "MATCH",
                    pattern,
                    "COUNT", 100
                );

                if (keys.length > 0) {
                    await client.del(...keys);
                    totalDeleted += keys.length;
                }

                cursor = next;
            } while (cursor !== "0");

            if (totalDeleted > 0) {
                console.log(`Cleared cache: ${pattern} (${totalDeleted} keys)`);
            }
        }
    } catch (err) {
        console.error('Redis cache deletion error:', err);
    }
};

export { client, delRedisCache };