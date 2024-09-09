import axios from "axios";
import { PrimaryButton } from "./Button";
import { useState } from "react";

export function Send({publicKey, loading, tokensBalance}) {
  // State to store input values
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");

  // Function to handle sending transaction
  const handleSend = async () => {
    try {
      const response = await axios.post("/api/send", { address, amount });
      console.log("Transaction successful:", response.data);
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  };

  return (
    <div className="flex mt-5 flex-col p-5 text-xl text-blue-950 border-2">
        Send Solana
        <div className="flex flex-col p-5 w-full">
      <input
        type="text"
        placeholder="Recipient Address"
        value={address}
        className="outline-none text-right w-[90%] text-4xl px-10 text-slate-700"
        onChange={(e) => setAddress(e.target.value)}
      />
        </div>
        <div className="flex flex-col p-5 w-full">
      <input
        type="String"
        placeholder="0"
        value={amount}
        className="outline-none text-right w-[90%] text-4xl px-10 text-slate-700"
        onChange={(e) => setAmount(e.target.value)}
        />
        </div>
      <PrimaryButton onClick={handleSend}>Send</PrimaryButton>
    </div>
  );
}
