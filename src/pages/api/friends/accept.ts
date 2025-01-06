import { fetchRedis } from "@/helper/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { z } from "zod";

export default async function handler(req: NextApiRequest, res: NextApiResponse)
{
    try {
        const body =  await req.body;
        const {id: idAdd } = z.object({id: z.string()}).parse(body)

        const session = await getServerSession(req, res,authOptions)

        if(!session){
            return res.status(401).json({ error: "Unauthorized" }); 
        }

        const isAlreadyFriends = await fetchRedis(
            "sismember",
            `user:${session.user.id}:friends`,
            idAdd
        );

        if(isAlreadyFriends)    
        {
            return res.status(401).json({ error: "Already friends" }); 
        }

        const hasFriendRequest = await fetchRedis(
            "sismember",
            `user:${session.user.id}:incoming_friend_requests`,
            idAdd
          );


        if(!hasFriendRequest){
            return res.status(400).json({error:'No friend request'})
        }

        pusherServer.trigger(toPusherKey(`user:${idAdd}:friends`), 'new_friend', {})
        await db.sadd(`user:${session.user.id}:friends`, idAdd)

        await db.sadd(`user:${idAdd}:friends`, session.user.id)

        await db.srem(`user:${session.user.id}:incoming_friend_requests`, idAdd)


        return res.status(200).json({ message: "Friend added successfully." });
    } catch (error) {
        console.log(error);
        
    }
}
