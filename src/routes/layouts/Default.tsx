// DefaultLayout.tsx
import { Outlet } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ScrollToSection from "../../components/ScrollToSection";
import Hero from "../pages/Hero";

export default function DefaultLayout() {
  return (
    <div>
      <Header />
      {/* ScrollRestoration을 사용하면 커스텀 스크롤과 충돌할 수 있으므로 필요에 따라 제거하거나 위치를 조정하세요 */}
      {/* <ScrollRestoration /> */}
      <ScrollToSection />
      <Hero />
      <Outlet />
      <Footer />
    </div>
  );
}
