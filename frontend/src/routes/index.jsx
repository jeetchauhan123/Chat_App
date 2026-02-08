import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/authentication/login";
import Register from "../pages/authentication/Register";
import Chat from "../pages/Chat";


const router = createBrowserRouter([
    {
        path:"/",
        element:<Chat />
    },
    {
        path:"/login",
        element: <Login />
    },
    {
        path: "/register",
        element:<Register />
    }
])