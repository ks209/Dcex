import { useEffect, useState } from "react";


export const useTokens = (address) => {

    const [tokensBalance, setTokensBalance] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        fetch(`/api/tokens?address=${address}`)
        .then(res=>res.json())
        .then(data=>{
            setTokensBalance(data);
            setLoading(false)
        })
    },[])

  return (
    {loading, tokensBalance}
  )
}
