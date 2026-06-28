import React from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { HeaderShell } from "../components/HeaderShell";

/** مسارات الصور في `site/public` — اضبط الأسماء لتطابق ملفاتك */
const WRIST_TOP = "/pay-landing-wrist.png";
const LOGO = "/header.jpeg";

const BANDS = [
  { src: "/ring-6.png", key: "blue" },
  { src: "/ring-5.png", key: "orange" },
  { src: "/ring-4.png", key: "black" },
];

const RINGS = [
  { src: "/ring-3.png", key: "silver" },
  { src: "/ring-2.png", key: "black" },
  { src: "/ring-1.png", key: "gold" },
];

const BANNER_BOTTOM = "/footer.jpeg";

const BAR = "mx-auto mt-2 block h-11 w-full rounded-xl shadow-sm ";

const WearablesLanding = () => {
  const navigate = useNavigate();
  const { dir, t } = useLanguage();
  const goInfo = () => navigate("/contactless-pay");

  return (
    <HeaderShell>
    <div
      className="flex min-h-screen w-full flex-col bg-white "
      dir={dir}
    >
      <header className="relative flex w-full flex-col items-center  pt-3">
        <div className="flex w-full max-w-md justify-end">
          <img
            src={WRIST_TOP}
            alt=""
            className="max-h-40 w-auto object-contain object-right"
          />
        </div>
        <div className="-mt-20 flex w-full max-w-md justify-center ">
          <img src={LOGO} alt="Arab Bank" className=" w-auto object-contain" />
        </div>
      </header>

      <p className="mx-auto  max-w-md px-4 text-center text-[15px] leading-relaxed text-[#1a4b6e]">
        {t("wearables.intro")}
      </p>

      <section
        className="mx-auto mt-2 w-full max-w-md px-3"
        aria-label={t("wearables.ariaBands")}
      >
        <div className="grid grid-cols-3 gap-2 ">
          {BANDS.map((item) => (
            <button
              key={item.src}
              type="button"
              onClick={goInfo}
              className="flex flex-col  gap-2 text-center justify-between"
            >
              <img
                src={item.src}
                alt={t(`wearables.bands.${item.key}`)}
                className={`mx-auto h-28 w-auto  ${item.key === "orange" ? "scale-110" : ""}`}
              />
              <span
                className="text-white text-sm font-bold py-2 px-4 rounded-full"
                style={{ backgroundColor: "#1A4B8F" }}
                aria-hidden
              >أطلب الآن</span>
            </button>
          ))}
        </div>
      </section>

      <section
        className="mx-auto mt-5 w-full max-w-md px-3"
        aria-label={t("wearables.ariaRings")}
      >
        <div className="grid grid-cols-3 gap-2">
          {RINGS.map((item) => (
            <button
              key={item.src}
              type="button"
              onClick={goInfo}
              className="flex flex-col items-stretch gap-2 text-center"
            >
              <img
                src={item.src}
                alt={item.alt}
                className="mx-auto h-28 w-full object-contain"
              />
              <span
                className="text-white text-sm font-bold py-2 px-4 rounded-full"
                style={{ backgroundColor: "#1A4B8F" }}
                aria-hidden
              >أطلب الآن</span>
            </button>
          ))}
        </div>
      </section>

      <button
        type="button"
        onClick={goInfo}
        className="mt-8 w-full overflow-hidden border-0 bg-transparent p-0"
        aria-label="ادفع بطريقتك — الانتقال للتفاصيل"
      >
        <img
          src={BANNER_BOTTOM}
          alt=""
          className="h-auto w-full object-cover object-center"
        />
      </button>
    </div>
    </HeaderShell>
  );
};

export default WearablesLanding;
