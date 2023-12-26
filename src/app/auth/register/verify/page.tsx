"use client";

import Wrapper from "@/layout/wrapper";
import Header from "@/layout/header/header";
import Footer from "@/layout/footer/footer";
import brd_bg from "@/assets/img/bg/breadcrumb_bg01.jpg";
import brd_img from "@/assets/img/others/breadcrumb_img02.png";
import Image from "next/image";
import { useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useRouter } from "next/navigation";
import { client } from "@/app/client";


export default function VerifyPage() {
  const router = useRouter();
  const [cookie, setCookie] = useCookies(["token"]);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  const sendVerificationCode = async () => {
    const res = await client.post('auth/verify', { email, code })
    if (res.data.status === true) {
      setCookie("token", res.data.body);
      router.push("/");
    }
  };
  return (
    <Wrapper>
      <Header />
      <main className="main--area">
        <section
          className="breadcrumb-area"
          style={{ backgroundImage: `url(${brd_bg.src})` }}
        >
          <div className="container">
            <div className="breadcrumb__wrapper">
              <div className="row">
                <div className="col-xl-6 col-lg-7">
                  <div className="breadcrumb__content">
                    <h2 className="title mb-5">E-Posta Doğrulama</h2>
                    <nav aria-label="breadcrumb">
                      <form action="#" className="footer-newsletter-form">
                        <input
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          type="email"
                          placeholder="E-Posta Adresi"
                          className="mb-3"
                        />
                        <input
                          value={code}
                          onChange={(e) => setCode(e.target.value)}
                          type="email"
                          placeholder="Doğrulama Kodu"
                          className="mb-3"
                        />
                      </form>
                      <div className="flex-column d-flex mt-5">
                        <button
                          onClick={() => sendVerificationCode()}
                          className="btn mt-2"
                        >
                          Doğrula
                        </button>
                      </div>
                    </nav>
                  </div>
                </div>
                <div className="col-xl-6 col-lg-5 position-relative d-none d-lg-block">
                  <div className="breadcrumb__img">
                    <Image
                      src={brd_img}
                      alt="img"
                      style={{ height: "auto", width: "auto" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </Wrapper>
  );
}
