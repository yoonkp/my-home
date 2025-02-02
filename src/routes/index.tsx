import { createBrowserRouter, RouterProvider, useParams } from "react-router-dom";
import Home from "./pages/Home";
import Skill from "./pages/Skill";
import Project from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import ProjectDetail2 from "./pages/ProjectDetail2";
import ProjectDetail3 from "./pages/ProjectDetail3";
import Contact from "../components/Footer";
import DefaultLayout from "./layouts/Default";

function ProjectDetailWrapper() {
  const { id } = useParams();

  switch (id) {
    case "1":
      return <ProjectDetail />;
    case "2":
      return <ProjectDetail2 />;
    case "3":
      return <ProjectDetail3 />;
    default:
      return <div>존재하지 않는 프로젝트입니다.</div>;
  }
}

const router = createBrowserRouter(
  [
    {
      element: <DefaultLayout />,
      children: [
        { path: "/", element: <Home /> },
        { path: "skill", element: <Skill /> },
        { path: "project", element: <Project /> },
        { path: "contact", element: <Contact /> },
        { path: "project-detail/:id", element: <ProjectDetailWrapper /> },
      ],
    },
  ],
  {
    basename: "/my-home/", // GitHub Pages 배포 경로 설정
  }
);

export default function Router() {
  return <RouterProvider router={router} />;
}
