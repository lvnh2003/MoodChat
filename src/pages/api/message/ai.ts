import { db } from "@/lib/db";
import { messageValidator } from "@/lib/validations/message";
import { nanoid } from "nanoid";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { OpenAI } from "openai";


const client = new OpenAI({
  baseURL: process.env.OPENAI_ENDPOINT,
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { id, messages } = req.body;

    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.id) {
      return res.status(401).json({ error: "Unauthorized access. Please log in." });
    }

    const latestMessage = messages[messages.length - 1];
    if (!latestMessage?.content || !latestMessage?.role) {
      return res.status(400).json({ error: "Message must have 'role' and 'content'." });
    }

    const timestamp = Date.now();

    const userMessage = {
      id: nanoid(),
      senderId: session.user.id,
      text: latestMessage.content,
      content: latestMessage.content,
      role: latestMessage.role,
      receiverId: id,
      timestamp,
    };

    const validatedUserMessage = messageValidator.parse(userMessage);
    await db.zadd(`aichat:${session.user.id}:messages`, {
      score: timestamp,
      member: JSON.stringify(validatedUserMessage),
    });

    await pusherServer.trigger(
      toPusherKey(`aichat:${session.user.id}`),
      "incoming-message",
      validatedUserMessage
    );


    const chatCompletion = await client.chat.completions.create({
      model: process.env.OPENAI_API_MODEL || "", 
      messages,
      temperature: 0.7,
      max_tokens: 20,
    });

    const botContent = chatCompletion.choices?.[0]?.message?.content ?? "No response";

    // Save AI message
    const aiMessage = {
      id: nanoid(),
      senderId: "ai",
      text: botContent,
      content: botContent,
      role: "assistant",
      receiverId: id,
      timestamp: timestamp + 1,
    };

    await db.zadd(`aichat:${session.user.id}:messages`, {
      score: aiMessage.timestamp,
      member: JSON.stringify(aiMessage),
    });

    await pusherServer.trigger(
      toPusherKey(`aichat:${session.user.id}`),
      "incoming-message",
      aiMessage
    );

    return res.status(200).json(botContent);
  } catch (error) {
    console.error("Error in chat API:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
}
