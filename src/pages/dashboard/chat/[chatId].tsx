import { fetchRedis } from "@/helper/redis";
import { db } from "@/lib/db";
import { messageArrayValidator } from "@/lib/validations /message";
import { useRouter } from "next/router";
import { ReactElement, useEffect, useState } from "react";
import Layout from "../layout";
import Image from "next/image";
import Messages from "@/components/Messages";
import ChatInput from "@/components/ChatInput";

interface PageProps {
  params: { chatId: string };
}

const Page = () => {
 
  
  const [session, setSession] = useState<any>(null);
  const [chatPartner, setChatPartner] = useState<User>();
  const [initialMessages, setInitialMessages] = useState<any[]>([]);
  const router = useRouter();
  const { chatId } = router.query;
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch("/api/session");
        const data = await response.json();
        if (data?.user) {
          setSession(data);
        } else {
          router.push("/login");
        }
      } catch (error) {
        console.error("Error fetching session:", error);
        router.push("/login");
      }
    };

    fetchSession();
  }, [router]);

  useEffect(() => {
    const fetchChatData = async () => {
      if (!session) return;
      const { user } = session;

      const [userId1, userId2] = (chatId as string).split("--");

      if (user.id !== userId1 && user.id !== userId2) {
        router.push("/dashboard");
        return;
      }

      const chatPartnerId = user.id === userId1 ? userId2 : userId1;

      try {
        const partner = await db.get(`user:${chatPartnerId}`);
        setChatPartner(partner);

        const results: string[] = await fetchRedis(
          "zrange",
          `chat:${chatId}:messages`,
          0,
          -1
        );
        const dbMessages = results.map((message) => JSON.parse(message));
        const validatedMessages = messageArrayValidator.parse(dbMessages.reverse());
        setInitialMessages(validatedMessages);
      } catch (error) {
        console.error("Error fetching chat data:", error);
        router.push("/dashboard");
      }
    };

    fetchChatData();
  }, [session,chatId, router]);

  if (!session) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex-1 justify-between flex flex-col h-full max-h-[calc(100vh-6rem)]">
      <div className="flex sm:items-center justify-between py-3 border-b-2 border-gray-200">
        <div className="relative flex items-center space-x-4">
          <div className="relative">
            <div className="relative w-8 sm:w-12 h-8 sm:h-12">
              <Image 
                fill
                referrerPolicy="no-referrer"
                src={chatPartner?.image || ''}
                alt={`${chatPartner?.image} profile`}
               />
            </div>
          </div>
          <div className="flex flex-col leading-tight">
            <div className="text-xl flex items-center">
              <span>{chatPartner?.name}</span>
            </div>
              <span className="text-sm text-gray-600">{chatPartner?.email}</span>
          </div>
        </div>
      </div>
      <Messages
        chatId={chatId}
        chatPartner={chatPartner}
        sessionImg={session.user.image}
        sessionId={session.user.id}
        initialMessages={initialMessages} />

      <ChatInput chatPartner={chatPartner} chatId={chatId}/>
    </div>
  );
};

export default Page;

Page.getLayout = function getLayout(page: ReactElement){
  return (
    <Layout>{page}</Layout>
  )
}
