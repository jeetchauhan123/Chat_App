import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../store/authSlice";

const Auth = () => {
  const [otpPage, setOtpPage] = useState(false);
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [testerMode, setTesterMode] = useState(false);

  const { user } = useSelector((state) => state.auth);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user]);

  const EmailBtnClick = async () => {
    if (!isValidEmail(email)) {
      alert("Please enter valid email");
      return;
    }
    try {
      const response = await fetch(`${API}/api/users/generate-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          testerMode: testerMode, // ✅ IMPORTANT
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate OTP");
      }
      const data = await response.json(); // ✅ NEW

      // ✅ If tester mode → show OTP
      if (testerMode) {
        if (data?.otp) {
          alert(`Your OTP is ${data.otp}`);
          setOtp(data.otp);
        } else {
          alert("Tester mode enabled, but no OTP received from server");
        }
      }

      setOtpPage(true);
    } catch (error) {
      console.error(error);
      alert("Server error while generating OTP");
    }
  };

  const OtpBtnClick = async () => {
    if (otp.length !== 4) {
      alert("Enter 4 digit OTP");
      return;
    }

    try {
      const response = await fetch(`${API}/api/users/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          otp: otp,
        }),
      });

      if (!response.ok) {
        alert("Invalid OTP");
        return;
      }

      const data = await response.json(); // ✅ FIXED

      console.log(data); // optional debug

      localStorage.setItem("token", data.token); // ✅ FIXED
      dispatch(setUser(data.user)); // ✅ FIXED

      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Server error while verifying OTP");
    }
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  return (
    <section className="w-screen h-screen p-6 bg-amber-50 flex flex-col md:flex-row justify-center items-center gap-10 md:gap-24 lg:gap-28 xl:gap-44 relative">
      {/* <p className="absolute text-4xl top-5 left-6">ChatApp</p> */}
      <img
        src="/logo.png"
        alt="logo"
        className="w-30 h-30 absolute text-4xl top-5 left-10"
      />

      {/* left section */}
      <div className="relative w-50 md:w-70 lg:w-90 xl:w-110 h-40 md:h-60 lg:h-80 xl:h-100  rounded-3xl overflow-hidden">
        {/* Video */}
        <video
          src="/chat.mp4"
          className="w-full h-full object-cover rounded-3xl"
          autoPlay
          muted
          loop
        />

        {/* Animated Border */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <rect
            x="0.5"
            y="0.5"
            width="calc(100% - 1px)"
            height="calc(100% - 1px)"
            rx="24"
            ry="24"
            fill="none"
            stroke="#000"
            strokeWidth="1.5"
            strokeDasharray="10 6"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="0"
              to="32"
              dur="1s"
              repeatCount="indefinite"
            />
          </rect>
        </svg>
      </div>

      {/* right section */}
      <div className="flex flex-col justify-center items-center gap-4">
        {/* caption area */}
        <div className="bg-white w-90 md:w-110 lg:w-130 xl:w-150 px-4 md:px-5 lg:px-6 xl:px-7 py-7 md:py-8 lg:py-9 xl:py-10 flex justify-center items-center gap-2 rounded-3xl border">
          <img src="/lock.svg" alt="" className="w-6 md:w-7 lg:w-8 h-6 md:h-7 lg:h-8" />
          <p className="text-sm md:text-base lg:text-lg">
            Your messages are Safe and protected with us
          </p>
        </div>

        {/* main area */}
        {otpPage ? (
          // 2- otp page
          <div className="bg-white w-90 md:w-110 lg:w-130 xl:w-150 px-7 py-10 flex flex-col items-center gap-5.5 md:gap-7 lg:gap-8.5 xl:gap-10 rounded-3xl border">
            <p className="text-3xl">Enter OTP</p>

            <input
              type="text"
              value={otp}
              name="otp"
              id="otp"
              onChange={(e) => setOtp(e.target.value)}
              className="bg-gray-100 w-70 h-10 rounded-full text-center border"
            />
            <section className="w-70 flex gap-4">
              <button
                className="bg-amber-100 w-1/2 h-10 rounded-full text-lg"
                onClick={() => setOtpPage(false)}
              >
                Previous
              </button>
              <button
                className="bg-amber-100 w-1/2 h-10 mb-2 rounded-full text-lg cursor-pointer"
                onClick={() => OtpBtnClick()}
              >
                Submit
              </button>
            </section>
          </div>
        ) : (
          // 1- email page
          <div className="bg-white w-90 md:w-110 lg:w-130 xl:w-150 px-4 md:px-5 lg:px-6 xl:px-7 py-7 md:py-8 lg:py-9 xl:py-10 flex flex-col items-center gap-5.5 md:gap-7 lg:gap-8.5 xl:gap-10 rounded-3xl border">
            <section className="flex flex-col items-center gap-3">
              <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-normal">Welcome</h2>
              <p className="text-lg md:text-xl lg:text-2xl xl:text-3xl">Enter Your Email</p>
            </section>
            <section className="w-2/3 flex flex-col items-center gap-5">
              <input
                type="email"
                name="email"
                id="email"
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-100 w-40 md:w-50 lg:w-60 xl:w-70 h-8 lg:h-10 rounded-full text-center border"
              />

              {/* ✅ TESTER MODE TOGGLE */}
              <div className="flex items-center gap-2 justify-center">
                <input
                  type="checkbox"
                  checked={testerMode}
                  onChange={() => setTesterMode(!testerMode)}
                  className="cursor-pointer"
                />
                <label className="text-sm text-gray-600 cursor-pointer">
                  Tester Mode (otp in console)
                </label>
              </div>

              <button
                className="bg-amber-100 w-70 h-10 mb-2 rounded-full text-lg cursor-pointer"
                onClick={() => EmailBtnClick()}
              >
                Next
              </button>
              <p className=" text-xs text-gray-400 text-center wrap-break-word">
                Turn on Tester Mode to instantly access OTP without personal
                email
              </p>
            </section>
          </div>
        )}

        <p className="text-sm text-gray-500 text-center">
          <a href="" className="hover:underline">
            Terms and Conditions
          </a>
        </p>
      </div>
    </section>
  );
};

export default Auth;
