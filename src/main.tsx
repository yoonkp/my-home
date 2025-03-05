import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Router from "./routes";
import "./styles/index.scss";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router />
  </StrictMode>
);
