import FriendRequests from "@/components/FriendRequests";
import { fetchRedis } from "@/helper/redis";
import {  ReactElement, useEffect, useState } from "react";
import Layout from "./layout";
import { Session } from "next-auth";

const Page = () =>{
    const [session, setSession] = useState<Session>();
    const [incomingSenderIds, setIncomingSenderIds] = useState<string[]>()
    const [incomingFriendRequests, setIncomingFriendRequests] = useState<IncomingFriendRequest[]>();
    useEffect(() => {
        const fetchSession = async () => {
          try {
            const response = await fetch('/api/session');
            const data = await response.json();
            if (data) {
                const senderIds = await fetchRedis('smembers',`user:${data.user.id}:incoming_friend_requests`) as string[];
                setIncomingSenderIds(senderIds);
                
                setSession(data);
            }
          } catch (error) {
            console.error('Error fetching session:', error);
          } 
        
        };
    
        fetchSession();
    }, []);
    
    useEffect(() => {
        const fetchData = async () => {
            
            if (!incomingSenderIds || incomingSenderIds.length === 0) {
                console.log('No incoming sender IDs available.');
                return;
            }
            
            try {
                const incomingFriend = (await Promise.all(
                    incomingSenderIds.map(async (senderId) => {
                        const sender = await fetchRedis('get', `user:${senderId}`) as string
                        const senderParsed = JSON.parse(sender) as User
                        
                        return {
                            senderId,
                            senderEmail: senderParsed.email,
                        };
                    })
                ))
                setIncomingFriendRequests(incomingFriend)
            } catch (error) {
                console.error('Error fetching friend requests:', error);
            }
        };

        fetchData();
    }, [incomingSenderIds]); 

    

    return (
        <main className="pt-8">
            <h1 className="font-bold text-5xl mb-8">Friend Requests</h1>
            <div className="flex flex-col gap-4">
                {incomingFriendRequests? (
                    <FriendRequests 
                    incomingFriendRequests={incomingFriendRequests}
                    sessionId={session?.user.id || ""}/>): 
                    (
                        <p className='text-sm text-zinc-500'>Nothing to show here...</p>
                    )}
            </div>
        </main>
    )
}
export default Page;
Page.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>;
};
  
