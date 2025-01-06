import FriendRequestsSidebarOption from '@/components/FriendRequestsSidebarOption'
import { Icon, Icons } from '@/components/Icon'
import SideBarChatList from '@/components/SideBarChatList'
import SignOutButton from '@/components/SignOutButton'
import { getFriendsByUserId } from '@/helper/getFriendsByUserId'
import { fetchRedis } from '@/helper/redis'
import { Session } from 'next-auth'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ReactNode, useEffect, useState } from 'react'
import Loading from './loading'

interface LayoutProps {
  children: ReactNode
}

interface SidebarOption{
  id: number,
  name: string,
  href: string,
  Icon: Icon
}
const sidebarOption: SidebarOption[] = [
  {
    id: 1,
    name: 'Add friend',
    href:'/dashboard/add',
    Icon: 'UserPlus'
  },
]
const Layout = ({ children}:LayoutProps) => {
  const [session, setSession] = useState<Session | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [unseenRequestCount, setUnseenRequestCount] = useState<number>();
  const [friends, setFriends] = useState<User[]>()
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch('/api/session');
        const data = await response.json();
        if (data.user) {
          setSession(data);
          const unseenCount = (await fetchRedis('smembers',`user:${data.user.id}:incoming_friend_requests`) as User[]).length
          setUnseenRequestCount(unseenCount)
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error('Error fetching session:', error);
        router.push('/login');
      } finally {
        setLoading(false); 
      }
    };

    fetchSession();
  }, [router, unseenRequestCount]);

  useEffect(() => {
    const fetchFriends = async () => {
      if (!session) return;
      try {
        const data = await getFriendsByUserId(session.user.id);
        setFriends(data);
      } catch (error) {
        console.error('Error fetching friends:', error);
      }
    };

    fetchFriends();
  }, [session]);

  if (loading) {
    return <Loading /> ;
  }
  return (
    <div className='w-full flex h-screen'>
      <div className='flex h-full w-full max-w-xs grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6'>
        <Link className='flex h-16 shrink-0 items-center' href='/dashboard'>
          <Icons.Logo className='h-8 w-auto text-indigo-600' />
        </Link>
        {friends && friends.length > 0 ? (
          <div className='text-xs font-semibold leading-6 text-gray-400'>Your chats</div>
        ) : null}

      <nav className='flex flex-1 flex-col'>
        <ul className='flex flex-1 flex-col gap-y-7' role='list'>
          {friends && friends?.length > 0 ? (<li>
            <SideBarChatList friends={friends} sessionId={(session?.user.id) as string} />
          </li>): null}
          
          <li>
            <div className='text-xs font-semibold leading-6 text-gray-400'>
              Overview
            </div>
            <ul role='list' className='-mx-2 mt-2 space-y-1'>
              {sidebarOption.map((option)=>{
                const Icon = Icons[option.Icon]
                return (
                  <li key={option.id}>
                    <Link href={option.href} className='text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex gap-3 rounded p-2 text-sm leading-3 font-semibold'>
                      <span className='text-gray-400 border-gray-200 group-hover:border-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white'>
                        <Icon className='h-4 w-4'/>
                      </span>

                      <span className='truncate'>{option.name}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </li> 
          <li>
            <FriendRequestsSidebarOption sessionId={session?.user?.id as string} initialUnseenRequestCount={unseenRequestCount || 0}/>
          </li>
          <li className='-mx-6 mt-auto flex items-center'>
              <div className='flex flex-1 items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900'>
                <div className='relative h-8 w-8 bg-gray-50'>
                  <Image
                    fill
                    referrerPolicy='no-referrer'
                    className='rounded-full'
                    src={session?.user?.image || ''}
                    alt='Your profile picture'
                  />
                </div>

                <span className='sr-only'>Your profile</span>
                <div className='flex flex-col'>
                  <span aria-hidden='true'>{session?.user?.name}</span>
                  <span className='text-xs text-zinc-400' aria-hidden='true'>
                    {session?.user?.email}
                  </span>
                </div>
              </div>

              <SignOutButton/>
            </li>

        </ul>

      </nav>
    </div>
    <aside className='max-h-screen container py-16 md:py-12 w-full'>
      {children}
    </aside>
   
    </div>
  );
};

export default Layout;
