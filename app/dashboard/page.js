import { getServerSession } from "next-auth";
import {ProfileCard} from "../Components/ProfileCard.js";
import db from "@/app/db"
import { authConfig } from "../lib/authConfig";


async function getUserWallet(){
  const session =  await getServerSession(authConfig);

  const userWallet = await db.solWallet.findFirst({
    where:{
      userId: session.uid,
    },
    select:{
      publickey: true,
    }
  })


  if(!userWallet){
    return {
      error:"No solana wallet found "
    }
  }


  return userWallet.publickey;
}

export default async function(){
  const userWallet = await getUserWallet();
  
  if(userWallet.error){
    return <div>
      No Sol Wallet Found
    </div>
  }
  
  return <div>

    
    <ProfileCard publicKey={userWallet}/>
  </div>

}