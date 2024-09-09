"use client";

import { useRouter } from "next/navigation";
import { SecondaryButton } from "./Button"
import { signIn, useSession } from "next-auth/react"
const Hero = () => {

    const session = useSession();
    const router = useRouter();
  return (
    <div className="flex flex-col p-20 items-center  w-full">
        <div className="text-5xl p-10 font-medium">
            The Indian Crypto <span className="text-blue-500">
                Revolution
                </span>
        </div>
        <div className="text-3xl p-5 font-medium">
            Create a Frictionless Wallet in <span className="text-blue-500">  INDIA  </span> just from Google account
        </div>
        <div className="text-2xl font-medium">
            Convert your Crypto Into <span className="text-blue-500">  INR  </span> 
        </div>
        <div className="p-10">
            {session.data?.user ? <SecondaryButton onClick={()=>router.push("/dashboard")}>Go To Dashboard</SecondaryButton>:<SecondaryButton onClick={()=>signIn("google")}>Login With Google</SecondaryButton>}
        </div>
    </div>
  )
}

export default Hero