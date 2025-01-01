import { FC, ReactNode} from 'react'
import { Toaster } from 'react-hot-toast'

interface ProvidersProp{
    children: ReactNode
}

const Providers : FC<ProvidersProp> = ({children})=>
{
    return (
        <>
        <Toaster position='top-center' reverseOrder={false}/>
        {children}
        </>
    )
}

export default Providers;