import { TailSpin } from "react-loader-spinner";

/**
 * طبقة تحميل بسيطة فوق النموذج أثناء إرسال البيانات أو انتظار رد الخادم/السوكِت.
 */
export function PendingFormOverlay({ show, ariaLabel }) {
  if (!show) return null;
  return (
    <div
      className="absolute inset-0 z-20 flex items-center justify-center rounded-lg bg-white/85 backdrop-blur-[1px]"
      aria-busy="true"
      aria-live="polite"
    >
      <TailSpin
        height={40}
        width={40}
        color="#0057FF"
        ariaLabel={ariaLabel}
        radius="1"
      />
    </div>
  );
}
