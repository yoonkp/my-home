import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Skill from "./pages/Skill";
import Project from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import ProjectDetail2 from "./pages/ProjectDetail2";
import ProjectDetail3 from "./pages/ProjectDetail3";
import Contact from "../components/Footer";
import DefaultLayout from "./layouts/Default";

const router = createBrowserRouter(
  [
    {
      element: <DefaultLayout />,
      children: [
        { path: "/", element: <Home /> },
        { path: "skill", element: <Skill /> },
        { path: "project", element: <Project /> },
        { path: "contact", element: <Contact /> },
        { path: "project/:id", element: <ProjectDetail /> },
      ],
    },
  ],
  {
    basename: "/my-home", // GitHub Pages 배포 경로 설정
  }
);

export default function Router() {
  return <RouterProvider router={router} />;
}
