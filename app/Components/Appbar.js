"use client";
import {PrimaryButton} from './Button';
import{useSession, signIn, signOut} from 'next-auth/react';

const Appbar = () => {
    const session = useSession();
  return (
    <div className='border-b px-2 py-2 flex justify-between'>
        <div className='p-5 text-xl font-bold flex flex-col justify-center '>
            DCEX
        </div>
        <div className='p-5 flex-col justify-center'>
            {session.data?.user ? <PrimaryButton onClick={()=>{
                signOut()
            }}>LogOut</PrimaryButton>:<PrimaryButton onClick={()=>{
                signIn()
            }}>LogIn</PrimaryButton>}
        </div>
    </div>
  )
}

export default Appbar