import { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, X } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";
import { sendChat } from "../lib/api";
import { EASE } from "./Reveal";

export function ChatWidget() {
  const { t, lang } = useLanguage();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const listRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ role: "assistant", content: t.chat.welcome }]);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open, messages.length, t.chat.welcome]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  const onKeyDown = useCallback((e) => {
    if (e.key === "Escape") setOpen(false);
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    setFailed(false);
    setMessages((m) => [...m, { role: "user", content: text }]);
    setBusy(true);
    try {
      const res = await sendChat({ message: text, lang, history: messages.slice(-6) });
      setMessages((m) => [...m, { role: "assistant", content: res.reply }]);
    } catch {
      setFailed(true);
      setMessages((m) => [...m, { role: "assistant", content: t.chat.error }]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <button
        data-testid="chat-open-button"
        onClick={() => setOpen(true)}
        aria-label={t.chat.open}
        className={`fixed bottom-6 right-6 z-40 flex items-center gap-3 border bg-night px-5 py-3 text-paper shadow-lg transition-all duration-300 hover:bg-ink ${
          open ? "pointer-events-none translate-y-3 opacity-0" : "opacity-100"
        } border-nightline`}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-[#d8c9a3]" aria-hidden="true" />
        <span className="font-mono text-[11px] uppercase tracking-[0.25em]">{t.chat.trigger}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            data-testid="chat-panel"
            role="dialog"
            aria-label={t.chat.title}
            onKeyDown={onKeyDown}
            className="fixed bottom-0 right-0 z-50 flex h-[min(560px,85vh)] w-full flex-col border border-line bg-paper shadow-2xl sm:bottom-6 sm:right-6 sm:w-[380px]"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            <div className="flex items-start justify-between border-b border-line px-5 py-4">
              <div>
                <p className="font-serif text-xl text-ink">{t.chat.title}</p>
                <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.25em] text-mute">{t.chat.subtitle}</p>
                <p className="mt-1.5 flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-mute" data-testid="chat-status">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#c9b98a]" aria-hidden="true" />
                  {t.chat.status_demo}
                </p>
              </div>
              <button data-testid="chat-close-button" onClick={() => setOpen(false)} aria-label={t.chat.close} className="p-1 text-mute transition-colors hover:text-ink">
                <X size={18} strokeWidth={1.5} />
              </button>
            </div>

            <div ref={listRef} className="flex-1 space-y-4 overflow-y-auto px-5 py-4" data-testid="chat-messages">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <p
                    className={`max-w-[85%] px-4 py-2.5 text-sm font-light leading-relaxed ${
                      m.role === "user" ? "bg-night text-paper" : "border border-line bg-stone text-soot"
                    }`}
                  >
                    {m.content}
                  </p>
                </div>
              ))}
              {busy && (
                <div className="flex justify-start" data-testid="chat-loading">
                  <p className="animate-pulse border border-line bg-stone px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.2em] text-mute">···</p>
                </div>
              )}
            </div>

            <form onSubmit={submit} className="flex items-center gap-2 border-t border-line px-4 py-3">
              <input
                ref={inputRef}
                data-testid="chat-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t.chat.placeholder}
                maxLength={1000}
                className="flex-1 bg-transparent text-sm font-light text-ink placeholder:text-mute focus:outline-none"
              />
              <button
                data-testid="chat-send-button"
                type="submit"
                disabled={busy || !input.trim()}
                aria-label={t.chat.send}
                className="flex h-9 w-9 items-center justify-center bg-night text-paper transition-opacity disabled:opacity-30"
              >
                <ArrowUp size={16} strokeWidth={1.5} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
