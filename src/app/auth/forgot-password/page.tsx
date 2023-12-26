"use client";

import Wrapper from "@/layout/wrapper";
import Footer from "@/layout/footer/footer";
import brd_bg from "@/assets/img/bg/breadcrumb_bg01.jpg";
import brd_img from "@/assets/img/others/breadcrumb_img02.png";
import Image from "next/image";
import { useState } from "react";
import Header from "@/layout/header/header";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

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
                    <h2 className="title mb-5">Şifremi Unuttum</h2>
                    <nav aria-label="breadcrumb">
                      <form action="#" className="footer-newsletter-form">
                        <input
                          type="email"
                          placeholder="E-Posta"
                          className="mb-3"
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </form>
                      <div className="flex-column d-flex mt-2">
                        <button className="btn">Gönder</button>
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
