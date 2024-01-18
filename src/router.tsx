import { createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";
import Home from "./router/Home";
import Profile from "./router/Profile";
import Login from "./router/Login";
import Join from "./router/Join";
import ProtectedRoute from "./components/ProtectedRoute";
import Search from "./router/Search";
import Categories from "./router/Categories";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/search",
        element: <Search />,
      },
      {
        path: "/categories",
        element: <Categories />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/join",
    element: <Join />,
  },
]);

export default router;
