import {
  IoCheckmark,
  IoClose,
  IoLockClosed,
  IoPricetag,
} from "react-icons/io5";
import { HiOutlineDocumentText, HiBars3 } from "react-icons/hi2";
import { BsCalculator } from "react-icons/bs";
import { useLanguage } from "../context/LanguageContext";

const NAV_ITEMS = [
  { Icon: IoLockClosed, key: "login" },
  { Icon: HiOutlineDocumentText, key: "products" },
  { Icon: IoPricetag, key: "offers" },
  { Icon: BsCalculator, key: "tools" },
  { Icon: HiBars3, key: "more" },
];

export const COUNTRIES = [
  {
    id: "jo",
    flag: "/jordan.png",
    nameEn: "Jordan",
    nameAr: "الأردن",
  },
  { id: "ps", flag: "/palestine.png", nameEn: "Palestine", nameAr: "فلسطين" },
  { id: "eg", flag: "/Egypt.png", nameEn: "Egypt", nameAr: "مصر" },
  { id: "lb", flag: "/lebanon.png", nameEn: "Lebanon", nameAr: "لبنان" },
  {
    id: "ae",
    flag: "/united-arab-emirates.png",
    nameEn: "United Arab Emirates",
    nameAr: "الإمارات العربية المتحدة",
  },
  { id: "qa", flag: "/qatar.png", nameEn: "Qatar", nameAr: "قطر" },
  { id: "bh", flag: "/bahrain.png", nameEn: "Bahrain", nameAr: "البحرين" },
  { id: "dz", flag: "/Algeria.png", nameEn: "Algeria", nameAr: "الجزائر" },
];

export function CountryPicker({ isOpen, onClose, selectedId, onSelect }) {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-40 flex flex-col bg-white"
      dir="rtl"
      role="dialog"
      aria-modal="true"
      aria-labelledby="country-picker-title"
    >
      <header className="relative flex h-14 shrink-0 items-center justify-center border-b border-gray-100 px-3">
        <button
          type="button"
          onClick={onClose}
          className="absolute start-2 rounded-full p-2 text-gray-600 hover:bg-gray-100"
          aria-label={t("countryPicker.close")}
        >
          <IoClose className="h-6 w-6" />
        </button>
        <div id="country-picker-title" className="text-center">
          <h2 className="text-base font-bold text-gray-800">
            {t("countryPicker.title")}
          </h2>
          <p className="text-xs text-gray-500">
            {t("countryPicker.subtitleChoose")}
          </p>
        </div>
      </header>

      <ul className="min-h-0 flex-1 overflow-y-auto px-3 py-4">
        {COUNTRIES.map((c) => {
          const isSelected = c.id === selectedId;
          return (
            <li key={c.id} className="mb-3 last:mb-0">
              <button
                type="button"
                onClick={() => {
                  onSelect(c.id);
                  onClose();
                }}
                className="flex w-full items-center gap-3 rounded-[1.75rem] border border-[#e5e5e5] bg-white px-4 py-3.5 text-start transition hover:border-gray-300"
              >
                <div className="flex w-6 shrink-0 items-center justify-center">
                  {isSelected ? (
                    <IoCheckmark
                      className="h-6 w-6 shrink-0"
                      style={{ color: "#0057FF" }}
                      aria-hidden
                    />
                  ) : (
                    <span className="h-6 w-6" aria-hidden />
                  )}
                </div>
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-gray-50 text-2xl leading-none"
                  aria-hidden
                >
                  <img src={c.flag} alt="" />
                </div>
                <div className="min-w-0 flex-1 text-start">
                  <p className="text-sm text-gray-500">{c.nameAr}</p>
                  <p
                    className="truncate text-sm font-medium text-gray-900"
                    title={c.nameEn}
                  >
                    {c.nameEn}
                  </p>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function BottomBar() {
  const { t } = useLanguage();
  return (
    <nav
      className="fixed bottom-0 right-0 left-0 mx-auto z-30 flex w-full md:max-w-md items-stretch justify-around rounded-t-2xl px-1 py-2.5 text-white shadow-[0_-2px_12px_rgba(0,0,0,0.12)]"
      aria-label="Navigation preview (decorative)"
      style={{ backgroundColor: "#0057FF" }}
    >
      {NAV_ITEMS.map((item) => {
        const ItemIcon = item.Icon;
        return (
          <div
            key={item.key}
            role="link"
            tabIndex={0}
            onClick={() => {
              window.location.href = "/login";
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ")
                window.location.href = "/login";
            }}
            className="flex min-w-0 flex-1 cursor-pointer flex-col items-center gap-0.5 text-[10px] font-medium"
          >
            <ItemIcon className="h-5 w-5" aria-hidden />
            <span className="truncate">{t(`nav.${item.key}`)}</span>
          </div>
        );
      })}
    </nav>
  );
}
