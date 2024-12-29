import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Skill from "./pages/Skill";
import Project from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Contact from "../components/Footer";
import DefaultLayout from "./layouts/Default";

const router = createBrowserRouter([
  {
    element: <DefaultLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/skill", element: <Skill /> },
      { path: "/project", element: <Project /> },
      { path: "/contact", element: <Contact /> },
      { path: "/project/:id", element: <ProjectDetail /> },
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
