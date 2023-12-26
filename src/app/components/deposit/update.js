// components/PostRequestComponent.js
'use client'
import React, { useState } from 'react';
import { client } from "@/app/client";

const PostRequestComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [responseMessage, setResponseMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await client.post('/api/postEndpoint', {
        email,
        password,
        walletAddress,
      });

      setResponseMessage(response.data.message);
    } catch (error) {
      setResponseMessage('Error occurred while making the request.');
      console.error('Error:', error);
    }
  };

  return (
    <div className="container mx-auto mt-8 p-8 bg-dark_light rounded shadow-md flex">
    <div className="max-w-md mx-auto mt-8 p-6  rounded-md shadow-md" style={{background:'#6820C2'}}>
      <h2 className="text-2xl font-semibold mb-4">Update Details</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-white">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 p-2 w-full border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-white">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 p-2 w-full border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-white">Wallet Address:</label>
          <input
            type="text"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            className="mt-1 p-2 w-full border rounded-md"
          />
        </div>
        <button
          type="submit"
          style={{background:'#222242'}}
          className=" text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
        >
          Update
        </button>
      </form>
      {responseMessage && <p className="mt-4 text-green-600">Response: {responseMessage}</p>}
    </div>
    </div>
  );
};

export default PostRequestComponent;
