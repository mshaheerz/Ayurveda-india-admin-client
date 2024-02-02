"use client"
import { CheckCircle2Icon } from "lucide-react"
import Link from "next/link"
import {useRouter} from "next/navigation"
import { useEffect, useState } from "react";


function PasswordChanged({reset}:{reset:any}) {

    const [timer, setTimer] = useState(5);
    const [redirect, setRedirect] = useState(false);
  const router = useRouter()

    useEffect(() => {
          reset(false)
        // Check if the redirect flag is true

          // Set an interval to decrement the timer value every second
          const interval = setInterval(() => {
            setTimer((prevTimer) => prevTimer - 1);
          }, 1000);
    
          // Return a cleanup function to clear the interval
          return () => clearInterval(interval);
        
      }, [redirect]);
    
      // Use another useEffect hook to run the redirect logic
      useEffect(() => {
        // Check if the timer value is zero
        if (timer === 0) {
          // Use the history object to push the login page to the history stack
          router.push("/auth/login");
        }
      }, [timer, history]);
    return (
        <>
            <div className="   dark:border-strokedark bg-boxdark">
                <div className="flex flex-wrap  h-screen  items-center justify-center">


                    <div className="w-full   md:w-1/2 border rounded-3xl bg-[#272729]">
                        <div className="w-full p-4 sm:p-12.5 xl:p-17.5">

                            <div className="flex flex-col items-center justify-center">
                                <h2 className="mb-9 text-2xl font-bold text-center text-primary sm:text-title-xl2">
                                    Your Password are Changed Successfully
                                </h2>
                                <div className=""> <CheckCircle2Icon size={200} color="green" /></div>
                            </div>

                            <p>Password reset successfully. Redirecting to login page in {timer} seconds...</p>

                            <div className="mt-6 text-center">
                                <p>
                                    or Click {" "}
                                    <Link href="/auth/login" className="text-primary">
                                        Login
                                    </Link>
                                    {" "}
                                    here to go login page
                                </p>
                            </div>

                        </div>


                    </div>


                </div>
            </div>
        </>
    )
}

export default PasswordChanged