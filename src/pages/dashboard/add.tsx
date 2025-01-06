import AddFriendButton from '@/components/AddFriendButton';
import {ReactElement} from 'react'
import Layout from './layout';

const Page = () => {
    return (
        <main className='pt-8'>
            <h1 className='font-bold text-5xl mb-8'>Add a friend</h1>
            <AddFriendButton/>
        </main>
    )
}
Page.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>;
};
export default Page;