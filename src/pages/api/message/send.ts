import { fetchRedis } from '@/helper/redis'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { messageValidator } from '@/lib/validations /message'
import { nanoid } from 'nanoid'
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    
    const { text, chatId }: { text: string; chatId: string } = req.body
    const session = await getServerSession(req, res,authOptions)
    
    if (!session) return res.status(401).json({ error: "Unauthorized" }); 

    const [userId1, userId2] = chatId.split('--')

    if (session.user.id !== userId1 && session.user.id !== userId2) {
        return res.status(401).json({ error: "Unauthorized" }); 
    }

    const friendId = session.user.id === userId1 ? userId2 : userId1

    const friendList = (await fetchRedis(
      'smembers',
      `user:${session.user.id}:friends`
    )) as string[]
    const isFriend = friendList.includes(friendId)

    if (!isFriend) {
        return res.status(401).json({ error: "Unauthorized" }); 
    }

    const rawSender = (await fetchRedis(
      'get',
      `user:${session.user.id}`
    )) as string
    const sender = JSON.parse(rawSender) as User

    const timestamp = Date.now()

    const messageData: Message = {
        id: nanoid(),
        senderId: session.user.id,
        text,
        timestamp,
        receiverId: ''
    }

    const message = messageValidator.parse(messageData)
    // all valid, send the message
    await db.zadd(`chat:${chatId}:messages`, {
      score: timestamp,
      member: JSON.stringify(message),
    })

    return res.status(200).json({ message: "Sent successfully." });
  } catch (error) {
    if (error instanceof Error) {
        return res.status(406).json({ error: error.message }); 
    }
    return res.status(500).json({ error:"Internal Server Error" }); 
  }
}