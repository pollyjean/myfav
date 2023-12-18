import { createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";
import Home from "./router/Home";
import Profile from "./router/Profile";
import Login from "./router/Login";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

export default router;
