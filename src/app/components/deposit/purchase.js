


// components/SwapToken.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { client } from '@/app/client';
import { useContract, useContractWrite } from "@thirdweb-dev/react";
import { ConnectWallet } from "@thirdweb-dev/react";
import { useCookies } from "react-cookie";


const SwapToken = () => {
  const [inputToken1, setInputToken1] = useState('');
  const [selectedToken2, setSelectedToken2] = useState('');
  const [tokenList, setTokenList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [cookie] = useCookies(["token"]);
  const { contract } = useContract("0xFEca406dA9727A25E71e732F9961F680059eF1F9");
  const { mutateAsync: transfer, isLoading } = useContractWrite(contract, "transfer");
  const [duckyCost, setduckyCost] = useState('');

  
   
  useEffect(() => {
    // Calculate the total and update duckyCost when amount changes
    const costPerApple = 3; // Adjust this value as needed
    const numberOfApples = amount / costPerApple;
    
    // If you want to round to the nearest whole number of apples
    const roundedNumberOfApples = Math.floor(numberOfApples);

    setduckyCost(roundedNumberOfApples);
  }, [amount]); // Run this effect only when amount changes

  
 



  const handleBuyDucks = async () => {
    try {
      const response = await axios.post('http://localhost:4000/user/buy-ducks', { amount }
      , {
        headers: {
          Authorization: `Bearer ${cookie.token}`,
        },
      }
      );
      // Handle the response as needed
      console.log(response.data);
    } catch (error) {
      // Handle errors
      console.error('Error buying ducks:', error);
    }
  };
 



  return (
    <div className="flex items-center justify-center h-screen" style={{margin:'auto'}}>
    <div className="bg-dark_light from-teal-400 to-blue-500 p-8 rounded-lg shadow-md w-full sm:w-96">
      <h1 className="text-3xl font-bold mb-4 text-white">Swap Token</h1>

    
      
      <br></br>

      <div className="flex items-center space-x-4 mb-4">
        <input
          type="number"
          className="border p-2 w-full"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <div className=" p-2 w-full" style={{background:'#6820c2'}}>
          <h1 className="text-white">USDC</h1>
        </div>
      </div>

      <div className="flex items-center space-x-4 mb-4">
        <input
          type="number"
          className="border p-2 w-full"
          placeholder="Amount"
          value={duckyCost}
        />
      <div className=" p-2 w-full" style={{background:'#6820c2'}}  >
          <h1 className="text-white">DUCKY</h1>
        </div>
      </div>

      <button
        className="mt-4 bg-white text-blue-500 px-4 py-2 rounded-md hover:bg-blue-600 hover:text-white transition"
        onClick={handleBuyDucks}
        disabled={loading}
      >
        {loading ? 'Executing...' : 'Swap Token'}
      </button>
    </div>
  </div>
  );
};

export default SwapToken;
