import { useLanguage } from "../context/LanguageContext";

/** Inline validation message: follows active language direction. */
export function FieldError({ id, message, className = "" }) {
  const { textDir } = useLanguage();
  if (!message) return null;
  return (
    <p
      id={id}
      role="alert"
      className={`mt-1.5 text-start text-sm leading-relaxed text-red-600 ${className}`.trim()}
      dir={textDir}
    >
      {message}
    </p>
  );
}

export function formLevelErrorClass() {
  return "w-full rounded-2xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm leading-relaxed text-red-800";
}
