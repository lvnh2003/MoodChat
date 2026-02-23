import { fetchRedis } from "@/helper/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { z } from "zod";

const requestSchema = z.object({
  friendId: z.string().min(1),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (req.method !== "POST" && req.method !== "DELETE") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { friendId } = requestSchema.parse(req.body);

    const isFriend = await fetchRedis("sismember", `user:${session.user.id}:friends`, friendId);

    if (!isFriend) {
      return res.status(400).json({ error: "You can only favorite your friends" });
    }

    if (req.method === "POST") {
      await db.sadd(`user:${session.user.id}:favorite_friends`, friendId);
      return res.status(200).json({ message: "Added to favorite friends" });
    }

    await db.srem(`user:${session.user.id}:favorite_friends`, friendId);
    return res.status(200).json({ message: "Removed from favorite friends" });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: "Invalid request" });
  }
}
