import { NextRequest, NextResponse } from "next/server";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { connection, getSupportedTokens } from "@/app/lib/constants";
import { getAssociatedTokenAddress, getAccount, getMint } from "@solana/spl-token";
import { SUPPORTED_TOKENS } from "@/app/lib/SupportedTokens";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const address = searchParams.get('address');

    const supportedTokens = await getSupportedTokens();

    const balances = await Promise.all(supportedTokens.map(async (token) => {
        return await getAccountBalance(token, address);
    }));

    var tokens= supportedTokens.map((token, index) => ({
        ...token,
        balance: balances[index],
        usd: balances[index] * Number(token.price)
    }));

    return NextResponse.json({
        tokens: tokens,
        totalBalance: tokens.reduce((sum, token) =>  sum + token.usd, 0 )
    });
}

async function getAccountBalance(token, address) {
    if (token.native) {
        let balance = await connection.getBalance(new PublicKey(address));
        return balance / LAMPORTS_PER_SOL;
    }

    const ata = await getAssociatedTokenAddress(new PublicKey(token.mint), new PublicKey(address));
    try {
        const account = await getAccount(connection, ata);
        const mint = await getMint(connection, new PublicKey(token.mint));
        return Number(account.amount) / (10 ** mint.decimals);
    } catch (e) {
        return 0;
    }
}
