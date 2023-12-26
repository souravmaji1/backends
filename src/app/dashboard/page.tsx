"use client";

import Wrapper from "@/layout/wrapper";
import { useEffect, useState } from "react";
import DashboardContent from "./DashboardContent";
import InventoryContent from "./InventoryContent";
import MarketplaceContent from "./MarketplaceContent";
import ManageTeamsContent from "./ManageTeamsContent";
import UsdcPayment from '../components/deposit/depositusdc';
import SettingPage from '../components/deposit/update';
import BreedingPage from '../components/deposit/breeding';
import BuyDucky from '../components/deposit/purchase';
import ExploreContent from "./ExploreContent";
import { useCookies } from "react-cookie";
import { useAppContext } from "@/context/app-context";
import axios from "axios";
import { client } from "../client";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [cookie, setCookie, removeCookie] = useCookies(["token"]);
  const [selectedButton, setSelectedButton] = useState("Dashboard");
  const [parite, setParite] = useState<any>({});

 

  const buttonData = [
    {
      name: "Dashboard",
    },
    {
      name: "Inventory",
    },
    {
      name: "Marketplace",
    },
    {
      name: "Manage Teams",
    },
    {
      name: "Explore",
    },
    {
      name: "Payment",
    },
    {
      name: "Buyducky",
    },
    {
      name: "Breeding",
    },
    {
      name: "Setting",
    },
  ];

  const getUser = async () => {
    const res = await client.get('/user/me', {
      headers: {
        Authorization: `Bearer ${cookie.token}`,
      },
    })

    if (res?.data?.body)
      setUser(res.data.body)
  }

  if (!user)
    getUser()

  const getParite = async () => {
    const res = await client.get('/parite')
    setParite(res.data.body)
  }

  useEffect(() => {
    getParite()
  }, [])

  return (
    <Wrapper>
      <div className="container mx-auto h-[100vh] flex gap-4">
        <div className="w-2/6 h-full py-4 flex flex-col gap-4">
          <div className="w-full h-auto bg-dark_light flex flex-col gap-4 p-6 rounded-t-xl">
            {buttonData.map((item, index) => (
             <button
             key={index}
             onClick={() => setSelectedButton(item.name)}
             className={`${
                 selectedButton === item.name ? "btn-selected" : "btn"
             } `}
             style={{
                 backgroundColor: selectedButton === item.name ? '#222242' : '#6820C2',
                 borderColor: selectedButton === item.name ? '#893DFA' : 'transparent',
                 color: selectedButton === item.name ? '#893DFA' : 'white', // Added text color
             }}
            
         >
             {item.name}
         </button>
            ))}
            <button
              style={{background:'#6820C2'}}
              onClick={() => {
                removeCookie("token");
                window.location.href = "/";
              }}
              className="w-full h-[10%]  text-white rounded-lg font-semibold transition-all duration-300 hover:border-red-400 border-2 border-transparent hover:bg-red-500"
            >
              Log Out
            </button>
          </div>
          <div className="w-full h-1/3 bg-dark_light p-4 flex flex-col rounded-b-xl">
            <p className="text-center font-bold text-white mb-4">
              Wallet Balance
            </p>
            <div className="w-full flex">
              <div className="flex flex-col gap-2 w-1/2">
                <h1 className="font-bold text-lg">CRA</h1>
                <h1 className="font-bold text-lg">Balance</h1>
              </div>
              <div className="gap-2 w-1/2 flex flex-col items-end">
                <h1 className="font-bold text-lg">0</h1>
                <h1 className="font-bold text-lg">{user?.balance || 0}</h1>
              </div>
            </div>
            <center className="mt-2">
              <h1 className="font-bold text-lg">$DUCKY</h1>
              <h1 className="font-bold text-lg text-center">{parite?.value || 0}</h1>

              <h1 className="font-bold text-lg">DUCKY/USD</h1>
              <h1 className="font-bold text-lg text-center">{(user?.balance || 0) * (parite?.value || 0)}</h1>
            </center>
          </div>
        </div>
        {selectedButton === "Dashboard" ? (
          <DashboardContent />
        ) : selectedButton === "Inventory" ? (
          <InventoryContent />
        ) : selectedButton === "Marketplace" ? (
          <MarketplaceContent />
        ) : selectedButton === "Manage Teams" ? (
          <ManageTeamsContent />
        ) : selectedButton === "Explore" ? (
          <ExploreContent /> 
        ) : selectedButton === "Payment" ? (
          <UsdcPayment />  
        ) : selectedButton === "Buyducky" ? (
          <BuyDucky />  
        ) : selectedButton === "Breeding" ? (
          <BreedingPage />       
        ) : (
          <SettingPage />
        )}
      </div>
    </Wrapper>
  );
}
