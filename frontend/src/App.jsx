import "./App.css";
import { RouterProvider } from "react-router-dom";
import router from "./routes";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "./store/authSlice";
import axios from "axios";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      axios
        .get("https://localhost:7028/api/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          dispatch(setUser(res.data));
        })
        .catch(() => {
          localStorage.removeItem("token");
        });
    }
  }, []);
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;

// SuccessMessageBox.ShowDialogAsync(
//   "Success",
//   "Filter applied successfully",
// ).Wait();
