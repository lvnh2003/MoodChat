import { getFriendsByUserId } from '@/helper/getFriendsByUserId'
import { fetchRedis } from '@/helper/redis'
import { chatHrefConstructor } from '@/lib/utils'
import { ChevronRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { ReactElement, useEffect, useState } from 'react'
import Layout from './layout'
import { Session } from 'next-auth'
const Page = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [friendsWithLastMessage, setFriendsWithLastMessage] = useState<FriendWithLastMessage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch('/api/session')
        const data = await response.json()
        if (data.user) {
          setSession(data)
        } else {
          window.location.href = '/login'
        }
      } catch (error) {
        console.error('Error fetching session:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSession()
  }, [])

  useEffect(() => {
    const fetchFriendsWithLastMessage = async () => {
      if (!session) return

      try {
        const friends = await getFriendsByUserId(session.user.id)

        const friendsWithLastMessage = await Promise.all(
          friends.map(async (friend) => {
            const [lastMessageRaw] = (await fetchRedis(
              'zrange',
              `chat:${chatHrefConstructor(session.user.id, friend.id)}:messages`,
              -1,
              -1
            )) as string[]

            const lastMessage = JSON.parse(lastMessageRaw) as Message

            return {
              ...friend,
              lastMessage,
            }
          })
        )

        setFriendsWithLastMessage(friendsWithLastMessage)
      } catch (error) {
        console.error('Error fetching friends with last message:', error)
      }
    }

    fetchFriendsWithLastMessage()
  }, [session])

  if (loading) {
    return <div>Loading...</div> 
  }

  return (
    <div className='container py-12'>
      <h1 className='font-bold text-5xl mb-8'>Recent chats</h1>
      {friendsWithLastMessage.length === 0 ? (
        <p className='text-sm text-zinc-500'>Nothing to show here...</p>
      ) : (
        friendsWithLastMessage.map((friend) => (
          <div
            key={friend.id}
            className='relative bg-zinc-50 border border-zinc-200 p-3 rounded-md'>
            <div className='absolute right-4 inset-y-0 flex items-center'>
              <ChevronRight className='h-7 w-7 text-zinc-400' />
            </div>
          {session ? (<Link
              href={`/dashboard/chat/${chatHrefConstructor(
                session.user.id,
                friend.id
              )}`}
              className='relative sm:flex'>
              <div className='mb-4 flex-shrink-0 sm:mb-0 sm:mr-4'>
                <div className='relative h-6 w-6'>
                  <Image
                    referrerPolicy='no-referrer'
                    className='rounded-full'
                    alt={`${friend.name} profile picture`}
                    src={friend.image}
                    fill
                  />
                </div>
              </div>

              <div>
                <h4 className='text-lg font-semibold'>{friend.name}</h4>
                <p className='mt-1 max-w-md'>
                  <span className='text-zinc-400'>
                    {friend.lastMessage.senderId === session?.user.id
                      ? 'You: '
                      : ''}
                  </span>
                  {friend.lastMessage.text}
                </p>
              </div>
            </Link>): null }
            
          </div>
        ))
      )}
    </div>
  )
}

export default Page

Page.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}
