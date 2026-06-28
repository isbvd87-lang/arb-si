import { useEffect, useMemo, useState } from "react";

export function formatMmSs(seconds) {
  const s = Math.max(0, Math.floor(seconds));
  const mm = Math.floor(s / 60);
  const ss = s % 60;
  return `${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
}

/** عدّ تنازلي يبدأ من دقيقتين (١٢٠ ثانية) */
export function useTwoMinuteCountdown(initialSeconds = 120) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  useEffect(() => {
    const id = window.setInterval(() => {
      setSecondsLeft((prev) => (prev <= 0 ? 0 : prev - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  const formatted = useMemo(() => formatMmSs(secondsLeft), [secondsLeft]);

  return { secondsLeft, formatted };
}
