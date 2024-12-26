import { Outlet, ScrollRestoration } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function DefaultLayout() {
  return (
    <div>
      <Header />
      <Outlet />
      <ScrollRestoration />
      <Footer />
    </div>
  );
}
