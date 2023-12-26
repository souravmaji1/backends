"use client";

import { useAppContext } from "@/context/app-context";
import Footer from "@/layout/footer/footer";
import Header from "@/layout/header/header";
import Wrapper from "@/layout/wrapper";
import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { client } from "./client";
import HeroBanner from "./components/hero-banner/hero-banner";
import NftItemArea from "./components/nft-item/nft-item-area";
import RoadMapArea from "./components/road-map/road-map-area";
import VideoArea from "./components/video/video-area";


export default function Home() {
  const { updateUser } = useAppContext()
  const [cookies, setCookie] = useCookies(["userID", "token"]);
  const getUser = async () => {
    const res = await client.get('/user/me', {
      headers: {
        Authorization: `Bearer ${cookies.token}`,
      },
    })

    setCookie("userID", res.data.body.id, { path: "/" });
    updateUser(res.data.body)
  };

  useEffect(() => {
    getUser();
  }, []);
  return (
    <Wrapper>
      <Header />
      <main className="main--area">
        <HeroBanner />
        <NftItemArea />
        <VideoArea />
        <RoadMapArea />
      </main>
      <Footer />
    </Wrapper>
  );
}
