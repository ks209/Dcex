import { Connection } from "@solana/web3.js"
import axios from "axios"
import { SUPPORTED_TOKENS } from "./SupportedTokens";

let prices={};
const Token_Price_Refresh_Interval = 60 * 1000;
let LAST_UPDATED = null;


export  const  connection = new  Connection("https://api.devnet.solana.com")

// export  const  connection = new  Connection("https://solana-mainnet.g.alchemy.com/v2/EspGgEsKtp6xdG1-P32lj9raEFUlgXNc")

// console.log(connection);

export async  function getSupportedTokens(){
    try {
        if(!LAST_UPDATED || new Date().getTime() - LAST_UPDATED < Token_Price_Refresh_Interval){
            const response = await axios.get("https://price.jup.ag/v6/price?ids=SOL,USDC,USDT");
            prices = response.data.data;
            LAST_UPDATED =  new Date().getTime();
        }
    } catch (error) {
        console.log(error);
    }

    return SUPPORTED_TOKENS.map(t=>({
        ...t,
        prices: prices[t.name].price,
    }))
}

getSupportedTokens();