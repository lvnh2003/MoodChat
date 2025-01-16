import { db } from "@/lib/db";
import { messageValidator } from "@/lib/validations/message";
import { nanoid } from "nanoid";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { id, messages } = req.body;

    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.id) {
      return res
        .status(401)
        .json({ error: "Unauthorized access. Please log in." });
    }

    const timestamp = Date.now();

    const savedMessages = [];
    for (const msg of messages) {
      if (!msg.content || !msg.role) {
        return res
          .status(400)
          .json({ error: "Each message must have 'role' and 'content'." });
      }

      const messageData: Message = {
        id: nanoid(),
        senderId: session.user.id,
        text: msg.content,
        timestamp,
        receiverId: id,
      };
        const validatedMessage = messageValidator.parse(messageData);
        pusherServer.trigger(toPusherKey(`aichat:${session.user.id}`), 'incoming-message', validatedMessage)
        
        await db.zadd(`aichat:${session.user.id}:messages`, {
            score: timestamp,
            member: JSON.stringify(validatedMessage),
        });

      savedMessages.push(validatedMessage);
    }

    const fakeResponse = {
      id: "chatcmpl-abc123",
      object: "chat.completion",
      created: Date.now(),
      model: "gpt-4-0125-preview",
      choices: [
        {
          index: 0,
          message: {
            role: "assistant",
            content: "Whats up dude it my time.",
          },
          finish_reason: "stop",
        },
      ],
      usage: {
        prompt_tokens: 10 * messages.length,
        completion_tokens: 10,
        total_tokens: 10 * messages.length + 10,
      },
    };
    const messageDataAI: Message = {
      id: nanoid(),
      senderId: "ai",
      text: fakeResponse.choices[0].message.content,
      timestamp,
      receiverId: id,
    };
    pusherServer.trigger(toPusherKey(`aichat:${session.user.id}`), 'incoming-message', messageDataAI)

    await db.zadd(`aichat:${session.user.id}:messages`, {
      score: timestamp+1,
      member: JSON.stringify(messageDataAI),
    });
    return res.status(200).json(fakeResponse);
  } catch (error) {
    console.error("Error in API handler:", error);
    return res.status(500).json({ error: "Internal server error1." });
  }
}
// const response = await openai.chat.completions.create({
//     model: "gpt",
//     messages:[
//         {
//             role:"system",
//             content:"You are a helpful assistant."
//         },
//         ...message.messages
//     ],
//     stream: true,
//     temperature: 1,
// });