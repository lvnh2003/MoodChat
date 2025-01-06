import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
const Loading = () => {
    return (
        <div className="w-full flex h-screen">
            <div className='flex h-full w-full max-w-xs grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6'>
                <Skeleton className='mb-4' height={60} width={150} />
                <Skeleton className='mb-4' height={20} width={100} />
                <Skeleton className='mb-4' height={20} width={100} />
                <Skeleton className='mb-4' height={20} width={100} />
            </div>

            {/* Content Skeleton */}
            <aside className='max-h-screen container py-16 md:py-12 w-full'>
                <Skeleton height={40} width={200} />
                <Skeleton height={300} />
            </aside>
        </div>
    );
};

export default Loading;