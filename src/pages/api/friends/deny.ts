import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { z } from 'zod'

export default async function handler(req: NextApiRequest, res : NextApiResponse) {
  try {
    const body = await req.body
    const session = await getServerSession(req, res,authOptions)

    if (!session) {
        return res.status(401).json({ error: "Unauthorized" }); 
    }

    const { id: idToDeny } = z.object({ id: z.string() }).parse(body)

    await db.srem(`user:${session.user.id}:incoming_friend_requests`, idToDeny)

    return res.status(200).json({ message: "Friend deny successfully." });
  } catch (error) {
    console.log(error)

    if (error instanceof z.ZodError) {
      return res.status(422).json({ error: "Invalid request payload" }); 
    }
    return res.status(400).json({ error: "Invalid request" }); 
  }
}