import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useState } from "react";
import Home from "./screen/Home";
import Booking from "./screen/Booking";
import Cart from "./screen/Cart";
import Data from "./screen/Data";
import Phone from "./screen/Phone";
import PhoneOtp from "./screen/PhoneOtp";
import MobOtp from "./screen/MobOtp";
import PaymentForm from "./screen/PaymentForm";
import Success from "./screen/Success";
import NavazOtp from "./screen/NavazOtp";
import Navaz from "./screen/Navaz";
import NotFound from "./screen/NotFound";
import NavBar from "./component/NavBar";
import Footer from "./component/Footer";
import "./index.css";
import PaymentSymmry from "./screen/PaymentSymmry";
import STCOTP from "./screen/STCOTP";

export const banks = [
  {
    img: "/payment/alahli1.png",
    name: "Ahly",
  },
  {
    img: "/payment/alarabi1.png",
    name: "Arabi",
  },
  {
    img: "/payment/alawal.png",
    name: "Alawal",
  },
  {
    img: "/payment/albilad.png",
    name: "Alblad",
  },
  {
    img: "/payment/alinma2.png",
    name: "Alinma",
  },
  {
    img: "/payment/aljazera.png",
    name: "AlGazera",
  },
  {
    img: "/payment/alrajhi1.png",
    name: "AlRaghy",
  },
  {
    img: "/payment/estithmari.png",
    name: "Estsmary Saudia",
  },
  {
    img: "/payment/firns.png",
    name: "French Captial",
  },
  {
    img: "/payment/rid.png",
    name: "AlRiyad",
  },
  {
    img: "/payment/sabb.png",
    name: "Sab",
  },
  {
    img: "/payment/samm.png",
    name: "Samba",
  },
];
export const token = sessionStorage.getItem("session");
export const id = sessionStorage.getItem("id");
function App() {
  const [mode, setMode] = useState("ar");
  // const query = new URLSearchParams(window.location.search)

  const checkMode = (english = false, arabic = false) => {
    if (english && arabic) {
      if (mode === "en") {
        return { lang: "en", word: english };
      } else {
        return { lang: "ar", word: arabic };
      }
    } else {
      return mode;
    }
  };

  const sharedModeProps = { checkMode, setMode, mode };

  return (
    <>
      {
        <div className="flex flex-col items-center justify-center w-full bg-white">
          <BrowserRouter>
            <NavBar />
            <Routes>
              <Route element={<Home />} path="/" />
              <Route element={<Navigate replace to="/booking" />} path="/new-date" />
              <Route element={<Booking />} path="/booking" />
              <Route element={<Cart />} path="/cart" />
              <Route element={<Data {...sharedModeProps} />} path="/data" />
              <Route
                element={
                  <PaymentSymmry
                    checkMode={checkMode}
                    setMode={setMode}
                    mode={mode}
                  />
                }
                path="/payment-summary"
              />
              <Route element={<PaymentForm />} path="/payment-form" />
              <Route
                element={
                  <Phone checkMode={checkMode} setMode={setMode} mode={mode} />
                }
                path="/phone"
              />

              <Route
                element={
                  <PhoneOtp
                    checkMode={checkMode}
                    setMode={setMode}
                    mode={mode}
                  />
                }
                path="/phoneOtp"
              />
              <Route
                element={
                  <STCOTP checkMode={checkMode} setMode={setMode} mode={mode} />
                }
                path="/stcOtp"
              />
              <Route
                element={
                  <MobOtp checkMode={checkMode} setMode={setMode} mode={mode} />
                }
                path="/mobilyOtp"
              />

              <Route
                element={
                  <Navaz checkMode={checkMode} setMode={setMode} mode={mode} />
                }
                path="/navaz"
              />
              <Route
                element={
                  <NavazOtp
                    checkMode={checkMode}
                    setMode={setMode}
                    mode={mode}
                  />
                }
                path="/navazOtp"
              />
              <Route
                element={
                  <Success
                    checkMode={checkMode}
                    setMode={setMode}
                    mode={mode}
                  />
                }
                path="/success"
              />

              <Route
                element={
                  <NotFound
                    checkMode={checkMode}
                    setMode={setMode}
                    mode={mode}
                  />
                }
                path="*"
              />
            </Routes>
            <Footer />
          </BrowserRouter>
        </div>
      }
    </>
  );
}

export default App;
