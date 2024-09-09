"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { PrimaryButton, TabButton } from "./Button";
import { useState } from "react";
import { useTokens } from "../hooks/useTokens";
import Tokens from "./Tokens";
import { Swap } from "./Swap";
import { Send } from "./Send";



export const ProfileCard=({publicKey})=>{
    const session = useSession();
  const router = useRouter();

  const [selectedtab,setSelectedTab] = useState("tokens");

  const Tabs = ["tokens","send","add_funds","swap","withdraw"];   

  
  const {loading, tokensBalance} = useTokens(publicKey);

  if(session.status === "loading"){
    return <div>
      Loading......
    </div>
  }

  if(!session.data?.user){
    router.push("/")
    return null;
  }



  return (
    <div className="p-2 flex flex-col items-center">
      <div className="max-w-xl bg-white rounded shadow w-full p-6 ">
        <Greeting image={session.data?.user?.image} name={session.data?.user?.name}/>
        <div className="pt-5 w-full flex">
        {Tabs.map((tab,index)=>{
          return <TabButton key={index} active={tab===selectedtab} onClick={()=>setSelectedTab(tab)}>{tab?.toLocaleUpperCase('en-US')}</TabButton>
        })}
        </div>
        <div className={` ${selectedtab==="tokens" ? "visible" : "hidden" } `}>
                      <Assets publicKey={publicKey} loading={loading} tokensBalance={tokensBalance}/>
        </div>
        <div className={` ${selectedtab==="swap" ? "visible" : "hidden" } `}>
                      {console.log(tokensBalance)}
                      <Swap publicKey={publicKey} loading={loading} tokensBalance={tokensBalance}/>
        </div>
        <div className={` ${selectedtab==="send" ? "visible" : "hidden" } `}>
                      {console.log(tokensBalance)}
                      <Send publicKey={publicKey} loading={loading} tokensBalance={tokensBalance}/>
        </div>

      </div>
      Dashboard
      </div>
  )
}


function Assets({publicKey, loading, tokensBalance}){

  const [coppied, setCoppied] = useState(false)


  if(loading){
    return <>
    loading.......
    </>
  }else{
  return <div className="text-slate-500 mt-4 justify-between">

    <div className="flex justify-between py-2">
    <div className="py-4">
    Account Assets
    <br/>
    <div className="text-green-500 text-3xl ">
      {"$ "+tokensBalance?.totalBalance}
      <br/>
    </div>
    </div>
    <div className="mt-5">
      <PrimaryButton onClick={function(){
        navigator.clipboard.writeText(publicKey)
        setCoppied(true);

        setTimeout(function(){
          setCoppied(false);
        },2000)

      }}>{ coppied? "Coppied" : "Your Wallet Address"}</PrimaryButton>
      </div>
      </div>
      <br/>


            <div>
        {tokensBalance?.tokens.map((element,index) => {
          return <Tokens key={index} prop={element}/>
        })}
        </div>
  </div>
}
}


function Greeting({image,name}){


  return <div className="w-full flex justify-center items-center" >
    <img src={image} className="rounded-full w-15 h-15"/>
    <div className="p-8 text-xl flex items-center  font-bold">
      Welcome back, {name} !
    </div>

  </div>
}
