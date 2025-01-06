import { FC, useState } from "react";
import Button from "./Button";
import { signOut } from "next-auth/react";
import toast from "react-hot-toast";
import { Loader2, LogOut } from "lucide-react";

const SignOutButton: FC = ({...props}) => {
    const [isSigningOut, setIsSigninOut] = useState<boolean>(false);
    return (
        <Button {...props} variant={'ghost'} onClick={async()=>{
            setIsSigninOut(true);
            try {
                await signOut()
            } catch (error) {
                console.log(error);
                toast.error('Logout error')
                
            }
            finally{
                setIsSigninOut(false);
            }
        }}>
            {
                isSigningOut? (
                    <Loader2 className="animate-spin h-4 w-4"/>
                ): (
                    <LogOut className="h-4 w-4"/>
                )
            }
        </Button>
    )
}

export default SignOutButton;