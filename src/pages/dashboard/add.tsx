import AddFriendButton from '@/components/AddFriendButton';
import {FC} from 'react'
import Layout from './layout';

const Page: FC = () => {
    return (
        <Layout>
            <main className='pt-8'>
                <h1 className='font-bold text-5xl mb-8'>Add a friend</h1>
                <AddFriendButton/>
            </main>
        </Layout>
    )
}
export default Page;