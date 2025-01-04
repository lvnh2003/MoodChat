import {FC, useState} from 'react'
import Button from './Button';
import { addFriendValidator } from '@/lib/validations /add-friend';
import axios, { AxiosError } from 'axios';
import {z} from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
interface AddFriendButtonProps{}
type FormData = z.infer<typeof addFriendValidator>
const AddFriendButton: FC<AddFriendButtonProps> = ({}) =>{

    const [successState, setSuccessState] = useState<boolean>(false);
    const  {register , handleSubmit, setError, formState: {errors}} = useForm<FormData>({
        resolver: zodResolver(
            addFriendValidator
        )
    })
    const addFriend = async (email: string) =>
    {
        try {
            const validatedEmail = addFriendValidator.parse({email});
            await axios.post("/api/friends/add", {
                email: validatedEmail.email,
              });

            setSuccessState(true)
        } catch (error) {
                if(error instanceof z.ZodError){
                   setError('email',{message: error.message})
                   return
                }

                if(error instanceof AxiosError){
                    setError('email',{message: error.response?.data})
                    return
                }
            
                setError('email',{message:'Something went wrong'})
            
        }
    }

    const onSubmit = (data: FormData) => {
        addFriend(data.email)
    }
    
    return(
        <form className='max-w-sm' onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="email" className='block text-sm font-medium leading-6 text-gray-900'>
                Add friend by email
            </label>
            <div className='flex mt-2 gap-4'>
                <input {...register('email')} type="text" className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6' 
                placeholder='example@gmail.com'/>
                <Button>Add</Button>
            </div>
            <p className='mt-1 text-sm text-red-600'>{errors.email?.message.error || errors.email?.message}</p>
            {successState? ( <p className='mt-1 text-sm text-green-600'>Friend Request Sent</p>): null}
        </form>
    )
}

export default AddFriendButton;