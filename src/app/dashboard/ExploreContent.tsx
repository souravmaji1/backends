"use client";

import React, { useContext, useEffect, useState } from "react";
import CustomModal from "../components/modal/modal";
import axios from "axios";
import { useCookies } from "react-cookie";
import TeamCard from "../components/teams/team-card";
import Kilic from "@/assets/img/kilic.png";
import { HashLoader } from "react-spinners";
import MinerCard from "./MinerCard";
import { useAppContext } from "@/context/app-context";
import { client } from "../client";

export enum ExplorePageEnum {
  HISTORY = 'HISTORY',
  LOOTING = 'LOOTING'
}

const ExploreContent = () => {
  const [cookie] = useCookies(["token", "userID"]);
  const [open, setOpen] = useState(false);
  const [confirmingModal, setConfirmingModal] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [matchHistory, setMatchHistory] = useState([]);
  const [searchMatch, setSearchMatch] = useState(false);

  const [details, setDetails] = useState([]);
  const [currentMatch, setCurrentMatch] = useState<any>(null);
  const [selectedType, setSelectedType] = useState("");
  const [waitingTeam, setWaitingTeam] = useState<any>(null);

  const [selectedTeamID, setSelectedTeamID] = useState(null);
  const [matchStarterLoader, setMatchStarterLoader] = useState(false);
  const [currentPage, setCurrentPage] = useState<ExplorePageEnum>(ExplorePageEnum.HISTORY);
  const [miners, setMiners] = useState<any[]>([]);

  const [selectedPotion, setSelectedPotion] = useState(null);
  const [potions, setPotions] = useState<any[]>([]);

  const [selectedLooting, setSelectedLooting] = useState<any>(null)
  const { updateUser, user } = useAppContext()

  const getTeams = async () => {
    const res = await client.get('user/teams', {
      headers: {
        Authorization: `Bearer ${cookie.token}`,
      },
    })

    setData(res.data.body)
  };

  const getMatchHistoryAndDetails = async () => {
    try {
      const res = await client.get('/user/matchings', {
        headers: {
          Authorization: `Bearer ${cookie.token}`,
        },
      }
      );

      const matchHistories = res.data.body;

      const detailedMatchHistories = await Promise.all(
        matchHistories.map(async (match) => {
          const detail = await getDetail(match.id);
          return {
            ...match,
            detail,
          };
        })
      );

      //@ts-ignore
      setMatchHistory(detailedMatchHistories.reverse());
    } catch (err) {
      console.error(err);
    }
  };

  const getDetail = async (id: number) => {
    try {
      const detailRes = await client.get(`/matching/${id}`, {
        headers: {
          Authorization: `Bearer ${cookie.token}`,
        },
      });

      return detailRes.data.body;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const getCurrentMatch = async () => {
    const res = await client.get('/user/matching', {
      headers: {
        Authorization: `Bearer ${cookie.token}`,
      },
    })

    setCurrentMatch(res.data.body);
  };

  const handleStartGame = async () => {
    setMatchStarterLoader(true);
    if (!selectedTeamID) return;

    if (!selectedLooting) {
      await client.post('/matching/mine', {
        team_id: selectedTeamID,
        potion_id: selectedPotion
      },
        {
          headers: {
            Authorization: `Bearer ${cookie.token}`,
          },
        }
      )

      location.reload()
    }

    else {
      await client.post('matching/loot', {
        matching_id: selectedLooting.id,
        team_id: selectedTeamID
      },
        {
          headers: {
            Authorization: `Bearer ${cookie.token}`,
          },
        }
      )
        .catch((err) => alert(err.response.data.message));

      if (selectedPotion)
        await client.post('matching/potion', {
          id: selectedLooting.id,
          potion: selectedPotion
        },
          {
            headers: {
              Authorization: `Bearer ${cookie.token}`,
            },
          }
        )
          .catch((err) => alert(err.response.data.message));
    }
  };

  const waitingForMatch = async () => {
    const res = await client.get('/user/me', {
      headers: {
        Authorization: `Bearer ${cookie.token}`,
      },
    })
    updateUser(res.data.body)

    if (res.data.body.matchingTeam) {
      setSearchMatch(true);
      setWaitingTeam(res.data.body.matchingTeam);
    }
    else
      setSearchMatch(false);
  };

  const [timeLeft, setTimeLeft] = useState();

  function calculateTimeLeft(end_date = currentMatch.end_date) {
    // @ts-ignore
    let endTime = new Date(end_date).getTime();
    let now = new Date().getTime();
    let distance = endTime - now;

    let hours = Math.floor((distance % (1000 * 60 * 60 * 60)) / (1000 * 60 * 60));
    let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (hours <= 0 && minutes <= 0 && seconds <= 0) {
      // @ts-ignore
      setCurrentMatch(null);
      setTimeout(() => {
        getCurrentMatch();
      }, 1000);
    }
    return { hours, minutes, seconds };
  }

  useEffect(() => {
    if (!currentMatch) {
      return; // currentMatch null veya undefined ise hiçbir şey yapma
    }

    const timer = setInterval(() => {
      // @ts-ignore
      setTimeLeft(calculateTimeLeft());
      // @ts-ignore
      if (timeLeft?.minutes === 0 && timeLeft?.seconds === 0) {
        // @ts-ignore
        setCurrentMatch(null);
        setSearchMatch(false);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [currentMatch]);

  useEffect(() => {
    getTeams();
    getMatchHistoryAndDetails();
    getCurrentMatch();
    waitingForMatch();
    getMiners()
    getPotions()
  }, []);

  useEffect(() => {
    getMiners()
  }, [currentPage])

  async function getMiners() {
    const res = await client.get('/matching/miners', {
      headers: {
        Authorization: `Bearer ${cookie.token}`,
      },
    })

    setMiners(res.data.body);
  }

  function getMatchingTeamDucks() {
    if (!waitingTeam || !currentMatch || !data)
      return []

    const team = data.find(team => team.id === waitingTeam.id)
    return team.ducks
  }

  async function getPotions() {
    const res = await client.get('/user/potions', {
      headers: {
        Authorization: `Bearer ${cookie.token}`,
      },
    })

    setPotions(res.data.body)
  }

  function uniquePotions() {
    const arr: any[] = []
    for (const potion of potions) {
      if (arr.some(x => x?.name?.includes(potion.name)))
        continue

      arr.push(potion)
    }
    return arr
  }

  function onLootingSelect(miner) {
    console.log('looting selected', miner)

    setOpen(true)
    setSelectedLooting(miner)
  }

  function currentStatus() {
    return currentMatch.miner.id === user.id ? 'Mining' : 'Looting'
  }

  return (
    <div className="w-full py-4 flex flex-col gap-4">
      <div className="bg-dark_light w-full h-full rounded-lg text-dark overflow-auto font-semibold p-4 flex flex-col gap-2">
        <div className="flex w-full px-10 justify-between items-center">
          <h1 className="font-extrabold text-2xl">Explore</h1>
          <CustomModal
            width="46%"
            height="58%"
            modalIsOpen={open}
            setModalIsOpen={setOpen}
          >
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h1 className="font-black text-2xl text-center">Select Team</h1>
                <button
                  onClick={() => setOpen(false)}
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
              <div className="h-full w-full">
                {data.length > 0 ? (
                  data.map((team, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        // @ts-ignore
                        if (selectedTeamID === team.id) {
                          // @ts-ignore
                          setSelectedTeamID(null);
                        } else {
                          // @ts-ignore
                          setSelectedTeamID(team.id);
                        }
                      }}
                      className={`border-2 rounded-lg w-full cursor-pointer ${
                        // @ts-ignore
                        selectedTeamID === team.id
                          ? "border-heading"
                          : "border-transparent"
                        } `}
                    >
                      <TeamCard
                        disabled={true}
                        key={index}
                        team={team}
                        index={index}
                      />
                    </div>
                  ))
                ) : <h1 className="text-center opacity-50">Team Not Found</h1>}
                {data.length > 0 ?
                  <div className="flex overflow-x-auto gap-3 p-3 items-center justify-between">
                    {uniquePotions().map(potion =>
                      <div key={potion.id} className={`flex p-3 hover:cursor-pointer ${selectedPotion === potion.id ? 'border' : ''}`} onClick={() => setSelectedPotion(potion.id)}>
                        <img
                          src={process.env.NEXT_PUBLIC_API_URL + '/' + potion.photo}
                          className="w-14 h-14"
                        />
                        <div>
                          <h1 className="font-bold text-sm">{potion.name}</h1>
                          <span className="flex items-center">
                            <img
                              src={Kilic.src}
                              alt="kilic"
                              className="w-8 h-8"
                            />
                            <h1 className="font-bold text-sm">{potion.power}</h1>
                          </span>
                        </div>
                      </div>
                    )}
                  </div> : <></>}
              </div>
              <div className="flex items-center justify-center text-dark">
                <button
                  disabled={!selectedTeamID}
                  onClick={() => {
                    handleStartGame();
                    setTimeout(() => {
                      waitingForMatch();
                      setMatchStarterLoader(false);
                      setOpen(false);
                    }, 2000);
                  }}
                  className="bg-heading py-2.5 px-3 disabled:bg-gray-300 disabled:border-gray-400 disabled:text-gray-800 disabled:cursor-not-allowed rounded-lg hover:text-heading hover:bg-dark border-2 border-transparent hover:border-heading"
                >
                  {matchStarterLoader ? <HashLoader size={20} color="#FFFFFF" /> : "Start"}
                </button>
                <button
                  className="bg-yellow-600 py-2.5 px-3 ml-3 rounded-lg hover:text-heading hover:bg-dark border-2 border-transparent hover:border-heading"
                  onClick={() => {
                    setSelectedPotion(null)
                    setSelectedTeamID(null)
                  }}
                >Clear Selection</button>
              </div>
            </div>
          </CustomModal>
        </div>
        {currentMatch && waitingTeam && data ? (
          <div className="w-full flex flex-col gap-2">
            <h1>Current Matching - {currentStatus()} {currentStatus() === 'Mining' ? currentMatch.looter?.id ? <b className="float-right"> - You are under attack - </b> : '' : ''}</h1>
            <div className="bg-dark_light_2 h-auto rounded-lg flex items-center px-10 justify-between flex-column">
              <div className="w-full flex items-center gap-3 justify-between">
                <h1 className="text-lg">
                  {
                    // @ts-ignore
                    timeLeft?.hours !== undefined &&
                    // @ts-ignore
                    timeLeft?.minutes !== undefined &&
                    // @ts-ignore
                    timeLeft?.seconds !== undefined &&
                    // @ts-ignore
                    `${String(timeLeft?.hours).padStart(2, "0")}:${String(timeLeft?.minutes).padStart(2, "0")}:${String(
                      // @ts-ignore
                      timeLeft?.seconds
                    ).padStart(2, "0")}`
                  }
                </h1>
                <div className={`grid grid-cols-${currentMatch.potions.length > 0 ? 4 : 3} gap-2 w-4/5 h-auto py-2`}>
                  {getMatchingTeamDucks().map(duck =>
                    <div key={duck.id} className="bg-dark_light rounded-lg transition-colors duration-300 hover:bg-dark hover:cursor-pointer pb-3" >
                      <div
                        className="flex flex-col items-center justify-center bg-dark_light_2 rounded-lg m-2 transition-all duration-300 hover:brightness-90 h-full"
                      >
                        <div className="flex flex-col items-center justify-center h-full">
                          <img
                            src={process.env.NEXT_PUBLIC_API_URL + '/' + duck.photo}
                            className="w-14 h-14"
                          />
                          <h1 className="font-bold text-sm text-center">{duck.name}</h1>
                        </div>
                        <div className="flex gap-1 justify-center items-center">
                          <img
                            src={Kilic.src}
                            alt="kilic"
                            className="w-8 h-8"
                          />
                          <h1>{duck.base_power}</h1>
                        </div>
                      </div>
                    </div>
                  )}

                  {currentMatch.potions.map(potion =>
                    <div key={potion.id} className="bg-dark_light rounded-lg transition-colors duration-300 hover:bg-dark hover:cursor-pointer pt-2.5">
                      <div className="flex flex-col items-center justify-center h-full">
                        <img
                          src={process.env.NEXT_PUBLIC_API_URL + '/' + potion.potion.photo}
                          className="w-14 h-14"
                        />
                        <h1 className="font-bold text-sm">{potion.name}</h1>
                        <span className="flex items-center">
                          <img
                            src={Kilic.src}
                            alt="kilic"
                            className="w-8 h-8"
                          />
                          <h1 className="font-bold text-sm">{potion.power}</h1>
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {currentStatus() === 'Looting' ? (
                <div className={`grid grid-cols-4 gap-2 w-full h-auto py-2`}>
                  <div className="flex items-center text-white">
                    Miner team
                  </div>

                  {currentMatch.miner.matchingTeam.ducks.map(duck =>
                    <div key={duck.id} className="bg-dark_light rounded-lg transition-colors duration-300 hover:bg-dark hover:cursor-pointer pb-3" >
                      <div
                        className="flex flex-col items-center justify-center bg-dark_light_2 rounded-lg m-2 transition-all duration-300 hover:brightness-90 h-full"
                      >
                        <div className="flex flex-col items-center justify-center h-full">
                          <img
                            src={process.env.NEXT_PUBLIC_API_URL + '/' + duck.photo}
                            className="w-14 h-14"
                          />
                          <h1 className="font-bold text-sm text-center">{duck.name}</h1>
                        </div>
                        <div className="flex gap-1 justify-center items-center">
                          <img
                            src={Kilic.src}
                            alt="kilic"
                            className="w-8 h-8"
                          />
                          <h1>{duck.base_power}</h1>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : <></>}
            </div>
          </div>
        ) : ""}
        {/* <div className="h-0.5 w-full bg-white opacity-50 rounded-lg" /> */}

        <div className="flex w-full px-10 gap-2">
          <button onClick={() => setOpen(true)} className="bg-heading py-2.5 px-3 rounded-lg hover:text-heading hover:bg-dark border-2 border-transparent hover:border-heading w-full">Start Mining</button>
          <button onClick={() => setCurrentPage(ExplorePageEnum.LOOTING)} className="bg-heading py-2.5 px-3 rounded-lg hover:text-heading hover:bg-dark border-2 border-transparent hover:border-heading w-full">Start Looting</button>
          <button onClick={() => setCurrentPage(ExplorePageEnum.HISTORY)} className="bg-heading py-2.5 px-3 rounded-lg hover:text-heading hover:bg-dark border-2 border-transparent hover:border-heading w-full">History</button>
        </div>

        <div className="w-full pt-4 flex flex-col gap-4">
          {
            currentPage === ExplorePageEnum.HISTORY && <>

              <h1>Match History</h1>
              {matchHistory.map((match, index) => {
                //@ts-ignore
                const matchDetail = details[match.id];
                return (
                  <div
                    key={index}
                    className="bg-dark_light_2 w-full p-4 rounded-lg relative flex"
                  >
                    <div
                      //@ts-ignore
                      className={`absolute h-12 w-12 -left-4 -top-4 rounded-lg flex items-center justify-center ${
                        // @ts-ignore
                        match.winner?.id == cookie.userID
                          ? "bg-green-400 rounded-full font-bold"
                          : "bg-red-400 rounded-full font-bold"
                        }`}
                    >
                      <h1 className="text-center w-full text-sm font-bold text-dark">
                        {
                          //@ts-ignore
                          match.miner?.id == cookie.userID && "Mining"
                        }
                        {
                          //@ts-ignore
                          match.looter?.id == cookie.userID && "Looting"
                        }
                        <br />
                        {
                          //@ts-ignore
                          match.winner?.id == cookie.userID ? "Win" : "Lose"
                        }
                      </h1>
                    </div>

                    {/* <div className="w-1/5 flex flex-col gap-4 mx-10 bg-dark_light p-4 rounded-lg">
                  <h1 className="text-xl font-bold">Gecmis Takim</h1>
                  <div className="flex">
                    <div className="w-1/2 flex flex-col gap-2">
                      <h1 className="text-lg font-semibold opacity-70">
                        Battle Points
                      </h1>
                      <h1 className="font-semibold text-yellow-500">0</h1>
                    </div>
                    <div className="w-1/2 flex flex-col gap-2">
                      <h1 className="text-lg font-semibold opacity-70">
                        Mine Points
                      </h1>
                      <h1 className="font-semibold text-yellow-500">1</h1>
                    </div>
                  </div>
                </div> */}
                    <div className="w-full bg-dark_light grid grid-cols-3 grid-rows-1 rounded-2xl gap-y-3 pb-3">
                      {
                        //@ts-ignore
                        match?.detail?.ducks?.map((duck: any, index: Key) => (
                          <div
                            key={index}
                            className="flex flex-col items-center justify-center bg-dark_light_2 rounded-lg m-2 transition-all duration-300 hover:brightness-90 h-full"
                          >
                            <div className="flex flex-col items-center justify-center">
                              <img
                                src={process.env.NEXT_PUBLIC_API_URL + '/' + duck.photo}
                                className="w-14 h-14"
                              />
                              <h1 className="font-bold text-sm">{duck.name}</h1>
                            </div>
                            <div className="flex gap-1 justify-center items-center">
                              <img
                                src={Kilic.src}
                                alt="kilic"
                                className="w-8 h-8"
                              />
                              <h1>{duck.base_power}</h1>
                            </div>
                          </div>
                        ))
                      }

                      {/* {team?.ducks &&
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
                     ))} */}
                    </div>
                  </div>
                );
              })}

            </>
          }

          {
            currentPage === ExplorePageEnum.LOOTING && <>

              <h1>Miners {miners.length}</h1>
              {miners.map((miner, index) =>
                <MinerCard key={miner.id} miner={miner} onSelect={onLootingSelect} />
              )}

            </>
          }

        </div>

      </div>
    </div >
  );
};

export default ExploreContent;
