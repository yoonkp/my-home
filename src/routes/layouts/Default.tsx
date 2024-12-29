import { useEffect } from "react";
import { Outlet, ScrollRestoration } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function DefaultLayout() {
  useEffect(() => {
    const sectionId = window.location.pathname.slice(1);
    if (sectionId) {
      const section = document.getElementById(sectionId);
      section?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [window.location.pathname]);

  return (
    <div>
      <Header />
      <ScrollRestoration />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
