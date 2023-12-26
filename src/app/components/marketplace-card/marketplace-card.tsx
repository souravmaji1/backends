import React from "react";
import { Key } from "react-hook-form/dist/types/path/common";
import Kilic from "@/assets/img/kilic.png";
import Heart from "@/assets/img/heart.png";
import axios from "axios";
import { useCookies } from "react-cookie";
import { client } from "@/app/client";

const MarketplaceCard = ({ data, name }: any) => {
  const [cookie] = useCookies(["token"]);

  const handleBuy = async (x: any, type: string) => {
    const endpoint = type === "chest" ? "/marketplace/chest/buy" : "/marketplace/duck/buy";
    const res = await client.post(
      endpoint,
      {
        id: x.id,
      },
      {
        headers: {
          Authorization: `Bearer ${cookie.token}`,
        },
      }
    )

    if (res.data.body)
      alert("Başarıyla Satın Alındı!");
  };
  return (
    <>
      <div className="bg-dark_light_2 rounded-lg shadow-lg flex flex-col p-4 h-1/2 gap-2">
        <h1 className="font-bold">Chests</h1>
        <div className="grid grid-cols-4 grid-rows-auto gap-4 h-full overflow-y-auto overflow-x-hidden px-2">
          {/* Chests */}
          {data[0]?.data.body.length ? (
            data[0]?.data.body.map((x: any, index: Key) => (
              <div
                key={index}
                className="rounded-lg h-full bg-dark flex flex-col items-center justify-around"
              >
                <img
                  src={process.env.NEXT_PUBLIC_API_URL + '/' + x.photo}
                  className="w-1/3"
                />
                <div className="flex flex-col gap-2 items-center justify-center w-full">
                  <h1 className="font-bold text-sm">{x.name}</h1>
                  <h1 className="font-black text-xl">{x.price}</h1>
                  <button
                    onClick={() => handleBuy(x, "chest")}
                    className="w-3/4 bg-heading py-2 rounded-lg transition-colors duration-300 hover:bg-heading_dark"
                  >
                    <h1 className="font-semibold text-dark text-sm">Buy</h1>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <h1 className="font-semibold opacity-50">Item Not Found!</h1>
          )}
        </div>
      </div>
      <div className="bg-dark_light_2 rounded-lg shadow-lg flex flex-col px-4 py-2 h-1/2 gap-2">
        <h1 className="font-bold text-lg">Ducks</h1>
        <div className="grid grid-cols-4 grid-rows-auto gap-4 h-full overflow-y-auto overflow-x-hidden pr-2">
          {/* Potions */}
          {data[1]?.data.body.length ? (
            data[1]?.data.body.map((x: any, index: Key) => (
              <div
                key={index}
                className="rounded-lg h-full bg-dark flex flex-col items-center justify-around gap-2 py-4"
              >
                <h1 className={`bg-heading px-2 rounded-lg text-dark font-semibold text-sm h-fit ${x.gender ? 'bg-cyan-500' : 'bg-pink-500'}`}>
                  {x.gender ? "Male" : "Female"}
                </h1>
                <h1 className="font-semibold text-sm">Breed Count: {x.duck.breed}</h1>
                <img
                  src={process.env.NEXT_PUBLIC_API_URL + '/' + x.duck.photo}
                  className="w-1/3"
                />
                <h1 className="font-bold text-sm">{x.name}</h1>
                <div className="flex w-full px-2 pt-2 items-center justify-center gap-2">
                  <span className="flex gap-1 justify-center items-center">
                    <img src={Heart.src} className="w-5 h-5" />
                    <h1 className="text-sm font-bold">{x.duck.base_power}</h1>
                  </span>
                  <span className="flex gap-1 justify-center items-center">
                    <img src={Kilic.src} className="w-5 h-5" />
                    <h1 className="text-sm font-bold">{x.duck.base_power}</h1>
                  </span>
                </div>
                <h1 className="text-sm font-bold">Price: {x.price}</h1>
              </div>
            ))
          ) : (
            <h1 className="font-semibold opacity-50">Item Not Found!</h1>
          )}
        </div>
      </div>
    </>
  );
};

export default MarketplaceCard;
