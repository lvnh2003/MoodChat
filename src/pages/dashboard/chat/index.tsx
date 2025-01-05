import { fetchRedis } from "@/helper/redis";
import { useRouter } from "next/router";
import { useEffect, useState } from "react"

interface PageProps{
    params : {

    }
}
const Page = ({params}: PageProps) => {
    const [session, setSession] = useState();
    const router = useRouter();
    useEffect(()=>{
        const fetchSession = async () => {
            try {
              const response = await fetch('/api/session');
              const data = await response.json();
              if (data.user) {
                setSession(data);
                const unseenCount = (await fetchRedis('smembers',`user:${data.user.id}:incoming_friend_requests`) as User[]).length
              } else {
                router.push('/login');
              }
            } catch (error) {
              console.error('Error fetching session:', error);
              router.push('/login');
            }
          };
      
          fetchSession();
        },[])
    const {chatId} = params
    const {user} = session
     
    return <div>page</div>
}
export default Page