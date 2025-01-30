import { useEffect } from "react";
import { Outlet, ScrollRestoration, useLocation } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Hero from "../pages/Hero";

export default function DefaultLayout() {
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.sectionId) {
      const section = document.getElementById(location.state.sectionId);
      if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [location.state]);

  return (
    <div>
      <Header />
      <ScrollRestoration />
      <Hero />
      <>
        <Outlet />
      </>
      <Footer />
    </div>
  );
}
