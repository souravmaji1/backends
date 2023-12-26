"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { Key } from "react-hook-form/dist/types/path/common";
import CustomModal from "../modal/modal";
import { useCookies } from "react-cookie";
import { client } from "@/app/client";

const TeamCard = ({
  team,
  index,
  refreshState,
  setRefreshState,
  disabled,
}: any) => {
  const [cookie] = useCookies(["token"]);
  const [modalOpen, setModalOpen] = useState(false);
  const [duckData, setDuckData] = useState([]);
  const [onRequestDuck, setOnRequestDuck] = useState();

  const getDucks = async () => {
    const res = await client.get('/user/ducks', {
      headers: {
        Authorization: `Bearer ${cookie.token}`,
      },
    })

    setDuckData(res.data.body)
  };

  const selectDuck = async (duck: any) => {
    const existingDuckIds = team.ducks.map((d: any) => d.id);

    const updatedDucks = existingDuckIds.includes(duck.id)
      ? existingDuckIds
      : [...existingDuckIds, duck.id];

    await client.put('user/team', {
      id: team.id,
      ducks: updatedDucks,
    },
      {
        headers: {
          Authorization: `Bearer ${cookie.token}`,
        },
      }
    )

    setModalOpen(false);
    setRefreshState(true)
  };

  useEffect(() => {
    getDucks();
  }, [modalOpen === true]);

  return (
    <div key={index} className="bg-dark_light_2 w-full p-4 rounded-lg flex">
      <div className="w-2/5 flex flex-col gap-4 mx-10 bg-dark_light p-4 rounded-lg">
        <h1 className="text-xl font-bold">{team?.name}</h1>
        <div className="flex">
          <div className="w-1/2 flex flex-col gap-2">
            <h1 className="text-lg font-semibold opacity-70">Battle Points</h1>
            <h1 className="font-semibold text-yellow-500">
              {team?.battlePoint}
            </h1>
          </div>
          <div className="w-1/2 flex flex-col gap-2">
            <h1 className="text-lg font-semibold opacity-70">Mine Points</h1>
            <h1 className="font-semibold text-yellow-500">{team?.minePoint}</h1>
          </div>
        </div>
      </div>
      <div className="w-3/5 bg-dark_light grid grid-cols-3 grid-rows-1 rounded-2xl">
        {team?.ducks.map((duck: any, index: Key) => (
          <button
            disabled={disabled}
            key={index}
            onClick={() => {
              setModalOpen(true);
              setOnRequestDuck(duck.id);
            }}
            className="flex flex-col items-center justify-center bg-dark_light_2 rounded-lg m-2 transition-all duration-300 hover:brightness-90"
          >
            <img
              src={process.env.NEXT_PUBLIC_API_URL + '/' + duck.photo}
              className="w-14 h-14"
            />
            <h1 className="font-bold text-sm">{duck.name}</h1>
          </button>
        ))}
        <CustomModal modalIsOpen={modalOpen} setModalIsOpen={setModalOpen}>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h1 className="font-black text-2xl text-center">Select Duck</h1>
              <button
                disabled={disabled}
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 fill-heading hover:fill-heading_dark duration-300 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  id="close"
                >
                  <path d="M13.41,12l6.3-6.29a1,1,0,1,0-1.42-1.42L12,10.59,5.71,4.29A1,1,0,0,0,4.29,5.71L10.59,12l-6.3,6.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0L12,13.41l6.29,6.3a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42Z"></path>
                </svg>
              </button>
            </div>
            <div className="h-full grid grid-cols-4 gap-4">
              {duckData?.map((duck, index) => (
                <button
                  disabled={disabled}
                  onClick={() => selectDuck(duck)}
                  key={index}
                  className="bg-dark flex flex-col items-center justify-center rounded-lg py-2"
                >
                  <img
                    //@ts-ignore
                    src={process.env.NEXT_PUBLIC_API_URL + '/' + duck?.photo}
                    className="w-12 h-12"
                  />
                  <h1 className="font-semibold text-sm">
                    {
                      //@ts-ignore
                      duck.name
                    }
                  </h1>
                </button>
              ))}
            </div>
          </div>
        </CustomModal>
        {team?.ducks &&
          Array(3 - team?.ducks.length)
            .fill(null)
            .map((_, idx) => (
              <button
                disabled={disabled}
                onClick={() => setModalOpen(true)}
                key={idx}
                className="flex flex-col items-center justify-center bg-dark_light_2 rounded-lg m-2 transition-all duration-300 hover:brightness-90"
              >
                <h1 className="font-black text-4xl">?</h1>
              </button>
            ))}
      </div>
    </div>
  );
};

export default TeamCard;
