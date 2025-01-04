const upstashRedisRestUrl = process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_URL
const authToken = process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN

type Commands = 'zrange' | 'sismember' | 'get' | 'smembers';

export async function fetchRedis(
    commnad: Commands,
    ...args: (string | number)[]
){
    
    const commandUrl = `${upstashRedisRestUrl}/${commnad}/${args.join('/')}`;

    const response = await fetch(
      commandUrl,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        cache: "no-store",
      }
    );
    if(!response)
        {
            throw new Error('Error excuting Redis command');
        }

    const data = await response.json();
    
    return data.result
}