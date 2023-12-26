import { useContract, useContractWrite } from "@thirdweb-dev/react";
import { useState } from "react";


export default function YourPage() {
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");

  const { contract } = useContract("0xFEca406dA9727A25E71e732F9961F680059eF1F9");
  const { mutateAsync: transfer, isLoading } = useContractWrite(contract, "transfer");

  const ethereumAddress = "Wallet Address: 0x0967eD6f98A1A60Bb697e1db88d8C077523d3871";
  const usdcAddress = "Contract Address: 0x073djsn8333hddjdsjsdsdsd";
  const combinedAddress = `${ethereumAddress},${usdcAddress}`;

  const call = async () => {
    try {
      const realamount = amount * 1000000;
      const to = "0x28673E49e6a310A0Df68A18c0e9c9d38d986134a";
      const data = await transfer({ args: [to, realamount] });
      console.info("contract call success", data);
    } catch (err) {
      console.error("contract call failure", err);
    }
  };

  return (
    <div className="container mx-auto mt-8 p-8 bg-dark_light rounded shadow-md flex">
      {/* Left Side: Input Field and Connect Button */}
      <div className="flex-1 pr-8">
        <h2 className="text-2xl font-semibold mb-3">Withdraw USDC</h2>
       

        <label className="block mb-4">
          Amount:
          <input
            className="border-2 border-gray-300 p-2 w-full"
            style={{ color: "black" }}
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </label>

        <button
          className="text-white p-3 rounded  hover:bg-indigo-600 focus:outline-none focus:shadow-outline-indigo"
          onClick={call}
          style={{background:'#6820C2'}}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Withdraw Amount"}
        </button>
      </div>

    
      
    </div>
  );
}
