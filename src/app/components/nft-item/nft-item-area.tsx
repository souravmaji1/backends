"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import nft_data from "@/data/nft-data";
import NftItemBox from "./nft-item-box";
import { useCookies } from "react-cookie";
import { client } from "@/app/client";

const NftItemArea = () => {
  const [cookie] = useCookies(["token"]);
  const [data, setData] = useState([]);

  //TODO:Burası User'dan Degil, MarketPlace'den Cekilecek!
  const getDucks = async () => {
    const res = await client.get('user/ducks', {
      headers: {
        Authorization: `Bearer ${cookie.token}`,
      },
    })
    setData(res.data.body)
  };

  useEffect(() => {
    getDucks();
  }, []);

  return (
    <section className="nft-item__area">
      <div className="container custom-container">
        <div className="row justify-content-center">
          {data.slice(0, 3).map((item) => (
            //@ts-ignore
            <div key={item.id} className="col-xxl-4 col-xl-5 col-lg-6 col-md-9">
              <NftItemBox item={item} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NftItemArea;
