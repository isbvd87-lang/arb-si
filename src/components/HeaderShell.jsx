import { useLanguage } from "../context/LanguageContext";
import { GrLanguage } from "react-icons/gr";

/**
 * Language toggle anchored to physical top-left of the header strip.
 */
export function HeaderShell({ children }) {
  const { toggleLang, t, isArabic } = useLanguage();
  return (
    <div className="relative w-full ">
      <div
        className={`absolute  top-2 z-[35] isolate ${isArabic ? "left-3" : "right-3"}`}
      >
        <button
          type="button"
          onClick={toggleLang}
          className="overflow-hidden rounded-md flex items-center gap-1 transition hover:opacity-95 active:scale-95 focus-visible:outline focus-visible:ring-2 focus-visible:ring-blue-400"
          aria-label={t("common.toggleLanguage")}
        >
          <span className="text-sm font-bold text-gray-700 ">
            {" "}
            {isArabic ? "EN" : "AR"}
          </span>
          <GrLanguage className="h-6 w-5 text-blue-700" />
        </button>
      </div>
      {children}
    </div>
  );
}
