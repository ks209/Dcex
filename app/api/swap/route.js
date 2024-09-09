import { authConfig } from "@/app/lib/authConfig";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import db from "@/app/db"
import axios from "axios";
import { Connection, Keypair, VersionedTransaction } from "@solana/web3.js";


export async function POST(req) {

    const connection = new Connection("https://mainnet.helius-rpc.com/?api-key=5935eb6e-9c4e-4031-b4b6-f1290106d2d6")
    const data = await(req.json());
    const session = await getServerSession(authConfig);


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

    
        const {swapTransaction} = await (
            await fetch('https://quote-api.jup.ag/v6/swap',{
                method: 'POST',
                headers:{
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    quoteResponse: data.quoteData,
                    userPublicKey: wallet.publickey,
                    wrapAndUnwrapSol: true,
                })
    
            })).json();


        const   swapTransactionBuf = Buffer.from(swapTransaction, 'base64');

        var transaction = VersionedTransaction.deserialize(swapTransactionBuf);

        const payer = getPrivateKey(wallet.privatekey)
        transaction.sign([payer]);

      const latestBlockHash = await connection.getLatestBlockhash();

      // Execute the transaction
      const rawTransaction = transaction.serialize()
      const txid = await connection.sendRawTransaction(rawTransaction, {
          skipPreflight: true,
          maxRetries: 2
      });
      await connection.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature: txid
      });

      return NextResponse.json({
        txid
    })
}


function getPrivateKey(data){
    
    const arr = data.split(",").map(x=> Number(x));

    const privateKey = Uint8Array.from(arr);

    const payer = Keypair.fromSecretKey(privateKey)

    console.log(payer);
    return payer
}