import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Skill from "./pages/Skill";
import Project from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import ProjectDetail2 from "./pages/ProjectDetail2";
import ProjectDetail3 from "./pages/ProjectDetail3";
import Contact from "../components/Footer";
import DefaultLayout from "./layouts/Default";

const router = createBrowserRouter([
  {
    element: <DefaultLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/skill",
        element: <Skill />,
      },
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
