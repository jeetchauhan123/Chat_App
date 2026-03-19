import { createBrowserRouter } from "react-router-dom";
import Chat from "../pages/Chat";
import Auth from "../pages/Auth";
import ProtectedRoute from "../Components/ProtectedRoute";


const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Chat />
      </ProtectedRoute>
    ),
  },
  {
    path: "/auth",
    element: <Auth />,
  },
]);
export default router;
