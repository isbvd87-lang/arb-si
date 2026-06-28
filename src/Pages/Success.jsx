import React from "react";
import { IoCheckmark } from "react-icons/io5";
import { useLocation } from "react-router-dom";
import { BottomBar } from "../components/VisitorShared";
import VisitorLiveChat from "../components/VisitorLiveChat";
import { HeaderShell } from "../components/HeaderShell";
import { useLanguage } from "../context/LanguageContext";

const MESSAGE_BLUE = "#0c4a8c";

const Success = () => {
  const location = useLocation();
  const orderId =
    location.state?.orderId ?? sessionStorage.getItem("currentOrderId");
  const { t, dir: pageDir, textDir } = useLanguage();
  return (
    <div
      className="relative flex min-h-screen w-full flex-col bg-white pb-24"
      dir={pageDir}
    >
      <HeaderShell>
        <div className="relative flex w-full items-center justify-center">
          <div className="flex max-w-md justify-end pr-0 pt-1" dir="ltr">
            <img
              src="/header.jpeg"
              alt=""
              className="h-full w-[90%] object-contain"
            />
          </div>
        </div>
      </HeaderShell>

      <div className="mt-5 flex flex-col items-center px-4">
        <p
          className="mx-auto mt-8 max-w-md text-center text-base font-bold leading-relaxed md:text-[1.05rem]"
          style={{ color: MESSAGE_BLUE }}
          dir={textDir}
        >
          {t("success.headline")}
        </p>

        <div
          className="mt-10 flex size-24 items-center justify-center rounded-full shadow-md"
          style={{ backgroundColor: "#22c55e" }}
          aria-hidden
        >
          <IoCheckmark
            className="size-14 text-white"
            strokeWidth={3}
            style={{ strokeLinecap: "round", strokeLinejoin: "round" }}
          />
        </div>
      </div>

      <VisitorLiveChat orderId={orderId} />

      <BottomBar />
    </div>
  );
};

export default Success;
