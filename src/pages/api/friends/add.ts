import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import type { NextApiRequest, NextApiResponse } from "next";
import { addFriendValidator } from "@/lib/validations /add-friend";
import { fetchRedis } from "@/helper/redis";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    
    const body = req.body;

    const { email: emailToAdd } = addFriendValidator.parse(body);

    const idAdd = await fetchRedis('get',`user:email:${emailToAdd}`) as string 

    if (!idAdd) {
      return res.status(400).json({ error: "This person does not exist." });
    }

    const session = await getServerSession(req, res, authOptions);
 
    if (!session) {
      return res.status(401).json({ error: "Unauthorized" }); 
    }

    if (idAdd === session.user.id) {
      return res.status(400).json({ error: "You can't add yourself as a friend." });
    }

    const isAlreadyAdded = (await fetchRedis('sismember',`user:${idAdd}:incoming_friend_requests`, session.user.id)) as 0 | 1

    if(isAlreadyAdded){
      return res.status(400).json({error: "Already added this user"})
    }

    const isAlreadyFriend = (await fetchRedis('sismember',`user:${session.user.id}:friends`, idAdd)) as 0 | 1

    if(isAlreadyFriend){
      return res.status(400).json({error: "Already friend"})
    }
    
    pusherServer.trigger(
      toPusherKey(`user:${idAdd}:incoming_friend_requests`),'incoming_friend_requests',{
        senderId: session.user.id,
        senderEmail : session.user.email
      }
    )
    db.sadd(`user:${idAdd}:incoming_friend_requests`, session.user.id)
    return res.status(200).json({ message: "Friend added successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
