import "./App.css";
import { RouterProvider } from "react-router-dom";
import router from "./routes";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setUser, setLoading } from "./store/authSlice";
import axios from "axios";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    const token = localStorage.getItem("token");

    const startTime = Date.now(); // record start time
    const MIN_LOADING_TIME = 2000; // 1 second minimum

    if (!token) {
      dispatch(setLoading(false));
      return;
    }

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
        dispatch(setUser(null));
      })
      .finally(() => {
        const elapsed = Date.now() - startTime;
        const remainingTime = MIN_LOADING_TIME - elapsed;

        if (remainingTime > 0) {
          setTimeout(() => {
            dispatch(setLoading(false));
          }, remainingTime);
        } else {
          dispatch(setLoading(false));
        }
      });
  }, [dispatch]);

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
