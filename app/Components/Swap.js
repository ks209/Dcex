import { useEffect, useState } from "react";
import { SUPPORTED_TOKENS } from "../lib/SupportedTokens";
import { PrimaryButton } from "./Button";
import axios from "axios";

export function Swap({publicKey, loading, tokensBalance}) {
  const [baseAsset, setBaseAsset] = useState(SUPPORTED_TOKENS[0]); // Correct initialization
  const [quoteAsset, setQuoteAsset] = useState(SUPPORTED_TOKENS[2]); 
  const [baseAmount, setBaseAmount] = useState();
  const [qouteAmount, setQouteAmount] = useState();
  const [quoteData, setQuoteData] = useState(null);
  

  useEffect(() => {
    if(!baseAmount){
        return;
    }

    axios.get(`https://quote-api.jup.ag/v6/quote?inputMint=${baseAsset.mint}&outputMint=${quoteAsset.mint}&amount=${Number(baseAmount)*(10**baseAsset?.decimal)}&slippageBps=50`).then(res=>{
        setQouteAmount((Number(res.data.outAmount)/(10**quoteAsset.decimal)).toString())
        setQuoteData(res.data);
    })
  }, [baseAsset,quoteAsset,baseAmount])
  

  return (
    <div className="flex flex-col itmes-center justify-center relative p-4">
      <div className="p-2 border-grey-200 border-2">
        <div className="text-sm semi-bold text-black">
        You Pay
        </div>
        <SwapInput amount={baseAmount}
          selectedToken={baseAsset}
          onAmountChange={(value)=>{
            setBaseAmount(value)
          }}
          onSelect={(asset) => setBaseAsset(asset)} 
        />

        <div className="text-sm text-slate-800">
        Current Balance = {tokensBalance?.tokens.find(x=> x.name === baseAsset.name).balance}
        </div>
      </div>
      <div onClick={()=>{
        let temp = baseAsset;
        setBaseAsset(quoteAsset);
        setQuoteAsset(temp);
      }} className="w-[40px] h-[40px] rounded-full items-center absolute bg-white  flex justify-center top-[32%] left-[50%] translate-x-[-50%]">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
                </svg>
      </div>
      <div className="p-2 border-grey-200 border-2">
        <div className="text-sm semi-bold text-black">
        You Recieve
        </div>
        <SwapInput q={true} amount={qouteAmount}
        onAmountChange={(value)=>{
            setQouteAmount(value)
          }}
          selectedToken={quoteAsset}
          onSelect={(asset) => setQuoteAsset(asset)}
        />
        <div className="text-sm text-slate-800">
        Current Balance = {tokensBalance?.tokens.find(x=> x.name === quoteAsset.name).balance}
        </div>
      </div>

      <div className="flex p-4 items-center justify-center">
      <PrimaryButton onClick={()=>{try {
        
          const res = axios.post("/api/swap",{quoteData})

          console.log(res);
      } catch (error) {
        console.log(error)
      }
      }}>Swap</PrimaryButton>
    </div>

      </div>
  );
}

function SwapInput({ amount, selectedToken, onSelect, onAmountChange, q }) {
  return (
    <div className="flex justify-content w-[fit-content]">
      <AssetSelector selectedToken={selectedToken} onSelect={onSelect} />
      <input disabled={q} onChange={(e)=>{
        onAmountChange(e.target.value)
      }}type="text" placeholder="0" className="outline-none text-right w-[90%] text-4xl px-10 text-slate-700" value={amount} dir="rtl"></input>
    </div>
  );
}

function AssetSelector({ selectedToken, onSelect }) {
  return (
    <div className="w-[fit-content] h-[8vh]">
      <select onChange={(e) => {
            const selectedToken = SUPPORTED_TOKENS.find(x => x.name === e.target.value);
            if (selectedToken) {
                onSelect(selectedToken);
            }
        }} id="countries" className="bg-white border border-gray-300 text-gray-900 text-md bold  rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 border-none">
            {SUPPORTED_TOKENS.map(token => <option className="border-none rounded-none" key={token.name} selected={selectedToken.name == token.name}>
                {token.name}
            </option>)}
        </select>
      {selectedToken.balance}
    </div>
  );
}
