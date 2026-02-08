import { createBrowserRouter } from "react-router-dom";
import Chat from "../pages/Chat";
import Auth from "../pages/Auth";


const router = createBrowserRouter([
    {
        path:"/",
        element:<Chat />
    },
    {
        path:"/auth",
        element: <Auth />
    },
])
export default router;