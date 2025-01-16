import { ReactElement, useEffect, useState } from "react";
import Layout from "./layout";
import { useRouter } from "next/router";
import { Session } from "next-auth";
import ChatInputAI from "@/components/ChatInputAI";
import MessagesAI from "@/components/MessageAI";
import { fetchRedis } from "@/helper/redis";
import { messageArrayValidator } from "@/lib/validations/message";
import Image from "next/image";

const Page = () => {
    const [session, setSession] = useState<Session | null>(null);
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [initialMessages, setInitialMessages] = useState<Message[]>([]);
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
    
          try {
    
            const results: string[] = await fetchRedis(
              "zrange",
              `aichat:${user.id}:messages`,
              0,
              -1
            );
            console.log(results);
            
            const dbMessages = results.map((message) => JSON.parse(message));
            const validatedMessages = messageArrayValidator.parse(dbMessages.reverse()) as Message[];
            setInitialMessages(validatedMessages);
          } catch (error) {
            console.error("Error fetching chat data:", error);
            router.push("/dashboard");
          }
        };
    
        fetchChatData();
      }, [session, router]);
    
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
                        src="https://static.vecteezy.com/system/resources/previews/021/820/175/original/computer-chip-with-ai-letters-3d-artificial-intelligence-icon-png.png"
                        alt="AI BOT"
                       />
                    </div>
                  </div>
                  <div className="flex flex-col leading-tight">
                    <div className="text-xl flex items-center">
                      <span>AI Chatbot</span>
                    </div>
                  </div>
                </div>
              </div>
        <MessagesAI
            chatId={session?.user.id}
            sessionId={session?.user.id}
            initialMessages={initialMessages || []} />
        <ChatInputAI chatId={`ai--${session?.user.id}`}/>
        </div>
    );
}
export default Page
Page.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>
}