import { useContract, useContractWrite } from "@thirdweb-dev/react";
import { useState } from "react";
import QRCode from "qrcode.react";
import { ConnectWallet } from "@thirdweb-dev/react";
import axios from 'axios';
import { useCookies } from "react-cookie";

export default function YourPage() {
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const { contract } = useContract("0xFEca406dA9727A25E71e732F9961F680059eF1F9");
  const { mutateAsync: transfer, isLoading } = useContractWrite(contract, "transfer");
  const [cookie] = useCookies(["token"]);
  const ethereumAddress = "Wallet Address: 0x0967eD6f98A1A60Bb697e1db88d8C077523d3871";
  const usdcAddress = "Contract Address: 0x073djsn8333hddjdsjsdsdsd";
  const combinedAddress = `${ethereumAddress},${usdcAddress}`;

  const finalExecute = async () => {
    try {
      setLoading(true);
      await handleDeposit();
      await call();
    } catch (err) {
      console.error("contract call failure", err);
    }
    finally {
      setLoading(false);
    }
  };



  const handleDeposit = async () => {
    try {
      const response = await axios.post('http://localhost:4000/user/top-up', {
        amount: amount,
      }, {
        headers: {
          Authorization: `Bearer ${cookie.token}`,
        },
      });
  
      console.log(response.data);
     // setCookie("userID", res.data.body.id, { path: "/" });
      // Handle success
    } catch (error) {
      console.error("Failed to add USD balance", error.response?.data);
      // Handle errors
    } 
  };
  

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
      
      <div className="flex-1 pr-8">
        <h2 className="text-2xl font-semibold mb-3"> Deposit USDC</h2>
        <div className="mb-2">
        <ConnectWallet 
      
        />
        </div>
       
        <br />

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
          onClick={finalExecute}
          style={{background:'#6820C2'}}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Deposit Amount"}
        </button>
      </div>

      {/* Right Side: QR Code */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">QR Code</h2>
        <QRCode value={combinedAddress} size={150} />
      </div>
      
    </div>
  );
}
