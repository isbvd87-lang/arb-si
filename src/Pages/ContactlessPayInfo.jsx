import React from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { HeaderShell } from "../components/HeaderShell";

const LOGO = "/header.jpeg";
const FOOTER = "/footer.jpeg";

const ContactlessPayInfo = () => {
  const navigate = useNavigate();
  const { dir, t, textDir } = useLanguage();
  const goLanding = () => navigate("/");

  return (
    <HeaderShell>
      <div
        className="flex h-screen w-full flex-col justify-between bg-white "
        dir={dir}
      >
        <header className="relative flex w-full flex-col items-center  pt-3">
          <div className="-mt-20 flex w-full max-w-md justify-center ">
            <img src={LOGO} alt="" className=" w-auto object-contain" />
          </div>
        </header>

        <h1 className="mx-auto mt-5 max-w-md px-4 text-center text-2xl font-bold text-gray-900">
          {t("contactlessPay.headline")}
        </h1>

        <div className="mx-auto mt-6 w-full max-w-md px-4">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="w-full rounded-full py-3.5 text-base font-bold text-white shadow-md transition active:scale-[0.98]"
            style={{ backgroundColor: "#1A4B8F" }}
          >
            {t("contactlessPay.ctaPrimary")}
          </button>
        </div>

        <h2 className="mx-auto mt-8 max-w-md px-4 text-center text-lg font-bold text-gray-900">
          {t("contactlessPay.subtitleActivate")}
        </h2>

        <p
          className="mx-auto mt-3 max-w-md px-5 text-center text-[15px] leading-relaxed text-gray-800"
          dir={textDir}
        >
          {t("contactlessPay.body")}
        </p>

        <button
          type="button"
          onClick={goLanding}
          className="mt-auto w-full overflow-hidden border-0 bg-transparent p-0"
          aria-label={t("wearables.bannerAria")}
        >
          <img
            src={FOOTER}
            alt=""
            className="h-auto w-full object-cover object-center"
          />
        </button>
      </div>
    </HeaderShell>
  );
};

export default ContactlessPayInfo;
