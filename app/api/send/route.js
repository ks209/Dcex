import { authConfig } from "@/app/lib/authConfig";
import { connection } from "@/app/lib/constants";
import { Keypair, LAMPORTS_PER_SOL, PublicKey, sendAndConfirmRawTransaction, sendAndConfirmTransaction, SystemProgram, Transaction } from "@solana/web3.js";
import { NextResponse } from "next/server";
import db from "@/app/db"
import { getServerSession } from "next-auth";


export async function POST (req){



    const data = await req.json();

    const session = await getServerSession(authConfig);

    console.log(session);
    if(!session?.user){
        return NextResponse.json({
            message: "User Not Logged In"
        },{
            status: 401,
        })
    }

    const wallet = await db.solWallet.findFirst({
        where:{
            userId: session.user.uid
        }
    })

    if(!wallet){
        NextResponse.json({
            message: "wallet not found"
        },{
            status: 402
        })
    }

    console.log(wallet.publickey,data,data.amount)
    const payer = generateKeyPair(wallet.privatekey); 

    const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: payer.publicKey,
          toPubkey: new PublicKey(data.address),
          lamports: LAMPORTS_PER_SOL / 100,
        })
      );

      
    //   const { blockhash } = await connection.getLatestBlockhash();
    //   transaction.recentBlockhash = blockhash;
    //   transaction.feePayer = new PublicKey(wallet.publickey);
      
      console.log(transaction);
      
      const signature = await sendAndConfirmTransaction(connection, transaction, [payer])

      NextResponse.json({
        message: signature},{

            status: 200,
        }
    )

}



function generateKeyPair(data){

    const arr = data.split(",").map(x=>Number(x));

    const privateKey = Uint8Array.from(arr);

    const payer = Keypair.fromSecretKey(privateKey)

    return payer

}