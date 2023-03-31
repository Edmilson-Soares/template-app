import { createClient } from 'redis';

/*

///https://www.npmjs.com/package/redis

createClient({
  url: 'redis://alice:foobared@awesome.redis.server:6380'
});





client.on('error', err => console.log('Redis Client Error', err));

await client.connect();

await client.set('key', 'value');
const value = await client.get('key');
await client.disconnect();
*/
export default async(env) => {
    try {
        const client = createClient();
        await client.connect();
        return client
    } catch (error) {

    }

}