"use client";

import Wrapper from "@/layout/wrapper";
import Header from "@/layout/header/header";
import Footer from "@/layout/footer/footer";
import brd_bg from "@/assets/img/bg/breadcrumb_bg01.jpg";
import brd_img from "@/assets/img/others/breadcrumb_img02.png";
import Image from "next/image";
import Link from "next/link";
import { useState, useContext } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { AppContext, useAppContext } from "@/context/app-context";
import { client } from '@/app/client'


export default function LoginPage() {
  const [cookies, setCookie] = useCookies(["token", "userID"]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const { updateUser }: any = useContext(AppContext);
  

  const handleLogin = async () => {
    if (!email || !password) {
      setError(true);
      return;
    }

    try {
      const res = await client.post('/auth/login', { email, password, })
      setCookie("token", res.data.body, { path: "/" });
      
      
      window.location.href = "/";
    } catch (error) {
      console.log(error);
      setError(true);
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
                    <h2 className="title mb-5">Giriş Yap</h2>
                    <nav aria-label="breadcrumb">
                      {error && (
                        <p className="alert alert-danger" role="alert">
                          Lütfen Girilen Bilgileri Kontrol Edin!
                        </p>
                      )}
                      <form action="#" className="footer-newsletter-form">
                        <input
                          type="email"
                          placeholder="E-Posta"
                          onClick={() => setError(false)}
                          className={`mb-3 ${error ? "border border-danger" : ""
                            }`}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                          type="password"
                          placeholder="Şifre"
                          onClick={() => setError(false)}
                          className={`${error ? "border border-danger" : ""}`}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </form>
                      <div className="flex-column d-flex mt-6">
                        <button className="btn" onClick={() => handleLogin()}>
                          Giriş Yap
                        </button>
                        <p className="link mt-5 mb-2">Veya</p>
                        <Link href="/auth/register" className="btn">
                          Kayıt Ol
                        </Link>
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
