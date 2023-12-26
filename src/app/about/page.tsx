import Wrapper from "@/layout/wrapper";
import Header from "@/layout/header/header";
import Footer from "@/layout/footer/footer";
import BreadcrumbArea from "../components/breadcrumb/breadcrumb-area";
import AboutAreaThree from "../components/about-area/about-area-3";

export default function AboutPage() {
  return (
    <Wrapper>
      {/* header start */}
      <Header />
      {/* header end */}

      {/* main area start */}
      <main className="main--area"></main>
      {/* main area end */}

      {/* footer start */}
      <Footer />
      {/* footer end */}
    </Wrapper>
  );
}
