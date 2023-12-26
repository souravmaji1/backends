"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import TeamCard from "../components/teams/team-card";
import { client } from "../client";
import CustomModal from "../components/modal/modal";

const ManageTeamsContent = () => {
  const [cookie] = useCookies(["token"]);
  const [data, setData] = useState([]);
  const [refreshState, setRefreshState] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [duckData, setDuckData] = useState<any[]>([]);
  const [selectedDucks, setSelectedDucks] = useState<any[]>([]);

  const getTeams = async () => {
    const res = await client.get('user/teams', {
      headers: {
        Authorization: `Bearer ${cookie.token}`,
      },
    })
    setData(res.data.body)
    setRefreshState(false)
  };

  const getDucks = async () => {
    const res = await client.get('/user/ducks', {
      headers: {
        Authorization: `Bearer ${cookie.token}`,
      },
    })

    setDuckData(res.data.body)
  };

  const selectDuck = async (duck: any) => {
    if (selectedDucks.includes(duck.id))
      setSelectedDucks(selectedDucks.filter(x => x !== duck.id))
    else {
      if (selectedDucks.length < 3)
        setSelectedDucks(Array.from(new Set([...selectedDucks, duck.id])))
    }
  };

  const addTeam = async () => {
    await client.put('/user/team', { ducks: selectedDucks }, {
      headers: {
        Authorization: `Bearer ${cookie.token}`,
      },
    })

    setRefreshState(true)
    setShowModal(false)
    setSelectedDucks([])
  }

  useEffect(() => {
    getTeams();
    getDucks()
  }, [refreshState === true]);

  return (
    <div className="w-full py-4 flex flex-col gap-5">
      <CustomModal modalIsOpen={showModal} setModalIsOpen={setShowModal}>
        <div className="flex justify-between items-center pb-3">
          <h1 className="font-black text-2xl text-center">Select Duck</h1>
          <button
            onClick={() => setShowModal(false)}
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
        <div className="grid grid-cols-4 gap-4">
          {duckData?.map((duck, index) => (
            <button
              onClick={() => selectDuck(duck)}
              key={index}
              className={`bg-dark flex flex-col items-center justify-center rounded-lg py-2 border ${selectedDucks.includes(duck.id) ? '!border-green-500' : duck.team?.id ? '!border-red-500' : ''}`}
            >
              <img
                src={process.env.NEXT_PUBLIC_API_URL + '/' + duck?.photo}
                className="w-12 h-12"
              />
              <h1 className="font-semibold text-sm">{duck.name}</h1>
            </button>
          ))}
        </div>
        <center>
          <button className="btn mt-3" onClick={() => addTeam()}>
            Add Team
          </button>
        </center>
      </CustomModal>
      <div className="bg-dark_light w-full h-full rounded-lg text-dark font-semibold p-4 flex flex-col gap-4">
        <span className="flex items-center gap-2">
          <h1 className="font-extrabold text-2xl">Team</h1>
          <h1 className="font-semibold text-lg mt-0.5">
            {"(" + data.length.toString() + " / 3)"}
          </h1>
        </span>

        {data.length ? (
          data.map((team, index) => (
            <TeamCard
              key={index}
              team={team}
              index={index}
              refreshState={refreshState}
              setRefreshState={setRefreshState}
            />
          ))
        ) : (
          <h1 className="text-center opacity-50">Team Not Found</h1>
        )}
        <center>
          <button className="btn" onClick={() => setShowModal(true)} disabled={data.length > 2}>
            Add Team
          </button>
        </center>
      </div>
    </div>
  );
};

export default ManageTeamsContent;
