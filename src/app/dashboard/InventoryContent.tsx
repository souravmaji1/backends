"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import InventoryCard from "../components/inventory/inventory-card";
import CustomModal from "../components/modal/modal";
import Kilic from "@/assets/img/kilic.png";

import { HashLoader } from "react-spinners";
import { client } from "../client";

const InventoryContent = () => {
  const [cookie] = useCookies(["token"]);
  const [data, setData] = useState([]);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedChest, setSelectedChest] = useState({} as any);

  const getInventory = async () => {
    try {
      const endpoints = ["/user/ducks", "/user/chests", "/user/potions"];
      const request = endpoints.map((endpoint) =>
        client.get(endpoint, {
          headers: {
            Authorization: `Bearer ${cookie.token}`,
          },
        })
      );
      const data = await Promise.all(request);
      //@ts-ignore
      setData(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getInventory();
  }, []);

  const [visible, setVisible] = useState(true);
  const [earnedItems, setEarnedItems] = useState([] as any);

  const openChest = async () => {
    const res = await client.post('/chest/open', {
      id: selectedChest.id,
    },
      {
        headers: {
          Authorization: `Bearer ${cookie.token}`,
        },
      }
    )
    setEarnedItems(res.data.body)
    location.reload()
  };

  useEffect(() => {
    if (selectedChest.id) {
      setModalIsOpen(true);
    } else {
      return;
    }
  }, [selectedChest]);

  const [open, setOpen] = useState(false);
  const [animate, setAnimate] = useState(true);
  const [openAnimation, setOpenAnimation] = useState(false);

  return (
    <div className="w-full py-4 flex flex-col gap-4">
      <div className="bg-dark_light w-full h-full rounded-lg p-4 flex flex-col justify-around gap-4">
        <CustomModal modalIsOpen={modalIsOpen} setModalIsOpen={setModalIsOpen}>
          <div className="w-full h-full">
            {!visible ? (
              <div className="flex flex-col gap-2">
                <h1 className="text-lg font-bold text-center">
                  Kazanılan Eşyalar
                </h1>
                <div className="grid grid-cols-4 gap-2">
                  {earnedItems.map((item, index) => (
                    <div
                      key={index}
                      className="bg-dark_light_2 rounded-lg flex p-4 h-36 flex-col items-center justify-around w-full gap-2"
                    >
                      <>
                        <img
                          src={process.env.NEXT_PUBLIC_API_URL + '/' + item.photo}
                          alt="earned-item"
                          className="w-14 h-14"
                        />
                        <h1 className="text-center w-full">{item.name}</h1>
                      </>
                      <div className="flex gap-2">
                        <img src={Kilic.src} alt="kilic" className="w-5 h-5" />
                        <h1 className="text-center w-full">
                          {item.base_power}
                        </h1>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-lg font-bold text-center">Sandık Aç</h1>
                <div className="flex flex-col justify-center items-center h-5/6">
                  {selectedChest && (
                    <div className="w-full h-5/6 flex flex-col items-center justify-between">
                      <img
                        src={process.env.NEXT_PUBLIC_API_URL + '/' + selectedChest?.photo}
                        alt="chest-photo"
                        onMouseEnter={() => setAnimate((prev) => !prev)}
                        onAnimationEnd={() => setAnimate((prev) => !prev)}
                        className={`w-28 h-28 ${animate ? "animate-shake" : ""
                          }`}
                      />
                      {selectedChest.name}
                      <button
                        onClick={() => {
                          setOpenAnimation(true);
                          setTimeout(() => {
                            setVisible(false);
                            openChest();
                          }, 3000);
                        }}
                        className="w-1/4 bg-heading py-2 rounded-lg transition-colors duration-300 hover:bg-heading_dark"
                      >
                        <h1 className="font-semibold text-dark text-sm text-center">
                          {openAnimation ? (
                            <HashLoader size={20} color={"#ffffff"} />
                          ) : (
                            "Aç"
                          )}
                        </h1>
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
            {!visible && (
              <div className="w-full flex items-center justify-center">
                <button
                  onClick={() => {
                    setModalIsOpen(false);
                    getInventory();
                  }}
                  className="w-1/4 bg-heading py-2 my-4 rounded-lg transition-colors duration-300 hover:bg-heading_dark"
                >
                  <h1 className="font-semibold text-dark text-sm">Devam Et</h1>
                </button>
              </div>
            )}
          </div>
        </CustomModal>
        <InventoryCard data={data} setSelectedChest={setSelectedChest} />
      </div>
    </div>
  );
};

export default InventoryContent;
