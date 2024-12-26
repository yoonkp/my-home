import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Skill from "./pages/Skill";
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
