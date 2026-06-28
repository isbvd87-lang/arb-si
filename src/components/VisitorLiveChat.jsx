import axios from "axios";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import { api_route } from "../socketApi";
import { useLanguage } from "../context/LanguageContext";

/**
 * زر دردشة + لوحة شبيهة بـ live chat — رسائل للإدمن فقط (بدون رد).
 */
export default function VisitorLiveChat({ orderId }) {
  const { t, dir: pageDir } = useLanguage();
  const [panelOpen, setPanelOpen] = useState(false);
  const [started, setStarted] = useState(false);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const listEndRef = useRef(null);

  const scrollToBottom = () => {
    listEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadMessages = useCallback(async () => {
    if (!orderId) return;
    try {
      const { data } = await axios.get(`${api_route}/order/${orderId}`);
      const list = Array.isArray(data.visitorChatMessages)
        ? data.visitorChatMessages
        : [];
      setMessages(list);
      if (list.length > 0) setStarted(true);
    } catch {
      setMessages([]);
    }
  }, [orderId]);

  useEffect(() => {
    if (panelOpen && orderId) loadMessages();
  }, [panelOpen, orderId, loadMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, started, panelOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text || !orderId || sending) return;
    setSending(true);
    setSendError("");
    try {
      const { data } = await axios.post(
        `${api_route}/order/${orderId}/visitor-chat`,
        { text },
      );
      const list = Array.isArray(data.visitorChatMessages)
        ? data.visitorChatMessages
        : [];
      setMessages(list);
      setDraft("");
    } catch {
      setSendError(t("success.liveChatSendError"));
    } finally {
      setSending(false);
    }
  };

  const disabledNoOrder = !orderId;

  return (
    <div
      className="pointer-events-auto fixed bottom-24 z-40 flex flex-col gap-2"
      style={{
        insetInlineEnd: "1rem",
        insetInlineStart: "auto",
      }}
    >
      {panelOpen ? (
        <div
          role="dialog"
          aria-modal="false"
          aria-label={t("success.liveChatTitle")}
          dir={pageDir}
          className="flex max-h-[min(520px,72vh)] w-[min(380px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl"
        >
          {/* شريط علوي شبيه بإطار الدردشة */}
          <div
            className="flex shrink-0 items-center justify-between gap-2 px-4 py-3 text-white"
            style={{ backgroundColor: "#0c4a8c" }}
          >
            <span className="font-semibold">{t("success.liveChatTitle")}</span>
            <button
              type="button"
              className="rounded-lg p-1.5 hover:bg-white/15"
              aria-label={t("success.liveChatClose")}
              onClick={() => setPanelOpen(false)}
            >
              <IoClose className="size-6" />
            </button>
          </div>

          <div className="relative min-h-0 flex-1 flex flex-col bg-gray-50">
            {!started ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-10 text-center">
                <p className="text-sm leading-relaxed text-gray-700">
                  {t("success.liveChatWelcome")}
                </p>
                <button
                  type="button"
                  className="rounded-full px-8 py-3 text-sm font-bold text-white shadow-md transition active:scale-[0.98] disabled:opacity-60"
                  style={{ backgroundColor: "#0057FF" }}
                  disabled={disabledNoOrder}
                  onClick={() => setStarted(true)}
                >
                  {t("success.liveChatStart")}
                </button>
                {disabledNoOrder ? (
                  <p className="text-xs text-red-600">
                    {t("success.liveChatNoOrder")}
                  </p>
                ) : null}
              </div>
            ) : (
              <>
                <p className="border-b border-gray-200 bg-white px-3 py-2 text-xs text-gray-500">
                  {t("success.liveChatDisclaimer")}
                </p>
                <div className="min-h-[220px] flex-1 space-y-3 overflow-y-auto px-3 py-3">
                  {messages.length === 0 ? (
                    <p className="text-center text-sm text-gray-500">
                      {t("success.liveChatEmptyThread")}
                    </p>
                  ) : (
                    messages.map((m, idx) => (
                      <VisitorBubble
                        key={m._id ?? idx}
                        text={m.text}
                        at={m.at}
                        pageDir={pageDir}
                      />
                    ))
                  )}
                  <div ref={listEndRef} />
                </div>
                <form
                  onSubmit={handleSend}
                  className="border-t border-gray-200 bg-white p-3"
                >
                  {sendError ? (
                    <p className="mb-2 text-xs text-red-600" role="alert">
                      {sendError}
                    </p>
                  ) : null}
                  <div className="flex gap-2">
                    <textarea
                      rows={2}
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      placeholder={t("success.liveChatPlaceholder")}
                      disabled={disabledNoOrder || sending}
                      className="min-h-[44px] flex-1 resize-none rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#0057FF] focus:ring-1 focus:ring-blue-200"
                      dir={pageDir === "rtl" ? "rtl" : "ltr"}
                    />
                    <button
                      type="submit"
                      disabled={disabledNoOrder || sending || !draft.trim()}
                      className="shrink-0 self-end rounded-xl px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                      style={{ backgroundColor: "#0057FF" }}
                    >
                      {sending ? "…" : t("success.liveChatSend")}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      ) : null}

      <button
        type="button"
        className="relative h-16 w-[72px] shrink-0 active:scale-95"
        aria-label={t("success.liveChatLabel")}
        aria-expanded={panelOpen}
        style={{ WebkitTapHighlightColor: "transparent" }}
        onClick={() => setPanelOpen((o) => !o)}
      >
        <img
          src="/live.jpeg"
          alt=""
          className="h-full w-full object-contain drop-shadow-md"
        />
      </button>
    </div>
  );
}

function VisitorBubble({ text, at, pageDir }) {
  const when =
    at &&
    new Date(at).toLocaleString(pageDir === "rtl" ? "ar-SA" : "en-GB", {
      dateStyle: "short",
      timeStyle: "short",
    });
  return (
    <div
      className={`flex flex-col gap-1 ${pageDir === "rtl" ? "items-start" : "items-end"}`}
    >
      <div
        className="max-w-[92%] rounded-2xl rounded-br-md bg-[#0057FF] px-3 py-2 text-sm text-white shadow-sm"
        style={
          pageDir === "rtl"
            ? { borderBottomRightRadius: "4px" }
            : { borderBottomLeftRadius: "4px" }
        }
      >
        <span className="whitespace-pre-wrap wrap-break-word">{text}</span>
      </div>
      {when ? <span className="text-[10px] text-gray-400">{when}</span> : null}
    </div>
  );
}
