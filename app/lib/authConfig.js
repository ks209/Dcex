import GoogleProvider from "next-auth/providers/google";
import db from "@/app/db"
import { Keypair } from "@solana/web3.js";
import {Session} from "next-auth";

export const authConfig = {
    secret: process.env.AUTH_SECRET ?? "Secret",
        providers: [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
          }),
        ],
        callbacks: {
            async session({ session, token, user }) {
                session.uid=token.uid;
                console.log(session.uid);

                return session;
            },
            async jwt({token, account}){
                const user = await db.user.findFirst({
                    where:{
                        sub: account?.providerAccountId ?? ""
                    }
                })

                if(user){
                    token.uid = user.id;
                }

                return token;
            },
          async signIn({ user, account, profile, credentials }) {
          //   console.log(user, account);
            if (account?.provider === "google") {
              if (!user?.email) {
                return false;
              }
      
              const userDb = await db.user.findFirst({
                where: {
                  username: user?.email,
                },
              });
      
              if (userDb) {
                return true;
              }
      
              const keypair = Keypair.generate();
              const publicKey = keypair.publicKey.toBase58();
              const privateKey = keypair.secretKey;
      
      
              await db.user.create({
                data: {
                  username: user.email,
                  provider: "Google",
                  sub: account.providerAccountId,
                  name:user?.name,
                  profilepicture: user?.image,
                  solWallet: {
                    create: {
                      publickey: publicKey,
                      privatekey: privateKey.toString(),
                    },
                  },
      
                  inrWallet: {
                    create: {
                      balance: 0,
                    },
                  },
                },
              });
      
              return true;
            }
            return false;
          },
        },
      };