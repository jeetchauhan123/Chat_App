import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Auth = () => {
  const [otpPage, setOtpPage] = useState(false);
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  const EmailBtnClick = async () => {
    if (!isValidEmail(email)) {
      alert("Please enter valid email");
      return;
    }
    try {
      const response = await fetch(
        "http://localhost:5001/api/users/generate-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: email })
        },
      );

      if (!response.ok) {
        throw new Error("Failed to generate OTP");
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
      const response = await fetch(
        "http://localhost:5001/api/users/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            otp: otp,
          }),
        },
      );

      if (!response.ok) {
        alert("Invalid OTP");
        return;
      }

      const user = await response.json();

      navigate("/", { state: { user } });
    } catch (error) {
      console.error(error);
      alert("Server error while verifying OTP");
    }
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  return (
    <section className="w-screen h-screen bg-amber-50 flex flex-row justify-center items-center gap-44 relative">
      <p className="absolute text-4xl top-5 left-6">ChatApp</p>

      {/* left section */}
      <div className="relative w-110 h-100 rounded-3xl overflow-hidden">
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
        <div className="bg-white w-150 px-7 py-10 flex justify-center items-center gap-2 rounded-3xl border">
          <img src="/lock.svg" alt="" className="text-lg w-8 h-8" />
          <p className="text-lg">
            Your messages are Safe and protected with us
          </p>
        </div>

        {/* main area */}
        {otpPage ? (
          // 2- otp page
          <div className="bg-white w-150 px-7 py-10 flex flex-col items-center gap-10 rounded-3xl border">
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
                className="bg-amber-100 w-1/2 h-10 mb-2 rounded-full text-lg"
                onClick={() => OtpBtnClick()}
              >
                Submit
              </button>
            </section>
          </div>
        ) : (
          // 1- email page
          <div className="bg-white w-150 px-7 py-10 flex flex-col items-center gap-10 rounded-3xl border">
            <section className="flex flex-col items-center gap-3">
              <h2 className="text-5xl font-normal">Welcome</h2>
              <p className="text-3xl">Enter Your Email</p>
            </section>
            <section className="flex flex-col gap-5">
              <input
                type="email"
                name="email"
                id="email"
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-100 w-70 h-10 rounded-full text-center border"
              />
              <button
                className="bg-amber-100 w-70 h-10 mb-2 rounded-full text-lg"
                onClick={() => EmailBtnClick()}
              >
                Next
              </button>
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
