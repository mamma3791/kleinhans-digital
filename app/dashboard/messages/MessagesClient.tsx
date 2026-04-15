"use client";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

type Message = {
  id: string;
  sender: "client" | "agency";
  content: string;
  read: boolean;
  created_at: string;
};

function formatTime(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
  if (diffDays === 0) {
    return d.toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" });
  }
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return d.toLocaleDateString("en-ZA", { weekday: "short" });
  return d.toLocaleDateString("en-ZA", { day: "numeric", month: "short" });
}

function SendIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="22" y1="2" x2="11" y2="13"/>
      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
  );
}

export default function MessagesClient({
  initialMessages,
  userId,
}: {
  initialMessages: Message[];
  userId: string;
}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const supabase = createClient();

  // Mark unread agency messages as read on mount
  useEffect(() => {
    const unreadIds = initialMessages
      .filter(m => m.sender === "agency" && !m.read)
      .map(m => m.id);
    if (unreadIds.length > 0) {
      supabase.from("messages").update({ read: true }).in("id", unreadIds).then(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Scroll to latest message on load and when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: messages.length === initialMessages.length ? "instant" : "smooth" });
  }, [messages]);

  const handleSend = async () => {
    const content = input.trim();
    if (!content || sending) return;
    setSending(true);
    setInput("");

    // Optimistic update
    const tempId = `temp-${Date.now()}`;
    const tempMsg: Message = {
      id: tempId,
      sender: "client",
      content,
      read: true,
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, tempMsg]);

    const { data, error } = await supabase
      .from("messages")
      .insert({ user_id: userId, sender: "client", content, read: true })
      .select("id, sender, content, read, created_at")
      .single();

    if (!error && data) {
      setMessages(prev => prev.map(m => m.id === tempId ? (data as Message) : m));
    }
    setSending(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <style>{`
        .kd-messages-wrap {
          display: flex;
          flex-direction: column;
          height: calc(100vh - 0px);
        }
        @media (max-width: 767px) {
          .kd-messages-wrap {
            height: calc(100vh - 3.25rem - 4rem); /* mobile header + bottom nav */
          }
        }
        .kd-messages-area {
          flex: 1;
          overflow-y: auto;
          padding: 1.5rem 2rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          scroll-behavior: smooth;
        }
        @media (max-width: 767px) {
          .kd-messages-area { padding: 1.25rem 1.125rem; }
          .kd-msg-input-wrap { padding: 0.875rem 1.125rem; }
        }
        .kd-msg-input-wrap {
          padding: 1rem 2rem 1.25rem;
          border-top: 1px solid rgba(245,244,239,0.07);
          background: rgba(0,0,0,0.15);
          flex-shrink: 0;
        }
        .kd-msg-input-inner {
          display: flex;
          gap: 0.75rem;
          align-items: flex-end;
        }
        .kd-msg-textarea {
          flex: 1;
          background: rgba(245,244,239,0.06);
          border: 1px solid rgba(245,244,239,0.1);
          border-radius: 0.75rem;
          padding: 0.75rem 1rem;
          font-family: var(--font-sans);
          font-size: 0.875rem;
          color: var(--cream);
          resize: none;
          outline: none;
          line-height: 1.5;
          min-height: 2.75rem;
          max-height: 8rem;
          transition: border-color 0.15s;
        }
        .kd-msg-textarea::placeholder { color: rgba(245,244,239,0.25); }
        .kd-msg-textarea:focus { border-color: rgba(93,191,136,0.4); }
        .kd-msg-send-btn {
          background: var(--green);
          color: white;
          border: none;
          cursor: pointer;
          border-radius: 0.625rem;
          width: 2.75rem; height: 2.75rem;
          flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.15s, opacity 0.15s;
        }
        .kd-msg-send-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .kd-msg-send-btn:not(:disabled):hover { background: var(--green2); }

        /* Bubbles */
        .kd-msg-bubble-wrap {
          display: flex;
          gap: 0.625rem;
          max-width: 72%;
          align-items: flex-end;
        }
        .kd-msg-bubble-wrap.client {
          align-self: flex-end;
          flex-direction: row-reverse;
        }
        .kd-msg-bubble-wrap.agency {
          align-self: flex-start;
        }
        @media (max-width: 599px) {
          .kd-msg-bubble-wrap { max-width: 88%; }
        }
        .kd-msg-avatar {
          width: 1.75rem; height: 1.75rem;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          font-family: var(--font-sans);
          font-size: 0.65rem;
          font-weight: 700;
        }
        .kd-msg-bubble {
          padding: 0.75rem 1rem;
          border-radius: 1rem;
          font-family: var(--font-sans);
          font-size: 0.875rem;
          line-height: 1.6;
          word-break: break-word;
        }
        .kd-msg-bubble.client {
          background: var(--green);
          color: #fff;
          border-bottom-right-radius: 0.25rem;
        }
        .kd-msg-bubble.agency {
          background: rgba(245,244,239,0.07);
          color: rgba(245,244,239,0.85);
          border-bottom-left-radius: 0.25rem;
        }
        .kd-msg-time {
          font-family: var(--font-sans);
          font-size: 0.65rem;
          color: rgba(245,244,239,0.2);
          margin-top: 0.25rem;
          display: block;
        }
        .kd-msg-time.client { text-align: right; }

        .kd-msg-date-divider {
          text-align: center;
          font-family: var(--font-sans);
          font-size: 0.7rem;
          color: rgba(245,244,239,0.2);
          padding: 0.75rem 0;
        }
      `}</style>

      <div className="kd-messages-wrap">
        {/* Header */}
        <div style={{
          padding: "1.25rem 2rem",
          borderBottom: "1px solid rgba(245,244,239,0.07)",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{
              width: "2.25rem", height: "2.25rem", borderRadius: "50%",
              background: "var(--green)", display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="14" height="14" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M2 9L9 2L16 9L9 16L2 9Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M9 5.5L12.5 9L9 12.5L5.5 9L9 5.5Z" fill="white" opacity="0.7"/>
              </svg>
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "0.9375rem", color: "var(--cream)" }}>
                Kleinhans Digital
              </div>
              <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "var(--green3)" }}>
                Your project team
              </div>
            </div>
          </div>
        </div>

        {/* Messages area */}
        <div className="kd-messages-area">
          {messages.length === 0 && (
            <div style={{ margin: "auto", textAlign: "center" }}>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "rgba(245,244,239,0.3)", lineHeight: 1.65 }}>
                No messages yet. Say hello — we&apos;re here to help<br />with any questions about your project.
              </p>
            </div>
          )}

          {messages.map((msg, idx) => {
            // Show date divider when day changes
            const showDivider =
              idx === 0 ||
              new Date(msg.created_at).toDateString() !==
              new Date(messages[idx - 1].created_at).toDateString();

            return (
              <div key={msg.id}>
                {showDivider && (
                  <div className="kd-msg-date-divider">
                    {new Date(msg.created_at).toLocaleDateString("en-ZA", { weekday: "short", day: "numeric", month: "short" })}
                  </div>
                )}
                <div className={`kd-msg-bubble-wrap ${msg.sender}`}>
                  <div className="kd-msg-avatar" style={{
                    background: msg.sender === "agency" ? "var(--green)" : "rgba(245,244,239,0.1)",
                  }}>
                    {msg.sender === "agency" ? (
                      <svg width="11" height="11" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                        <path d="M2 9L9 2L16 9L9 16L2 9Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                        <path d="M9 5.5L12.5 9L9 12.5L5.5 9L9 5.5Z" fill="white" opacity="0.7"/>
                      </svg>
                    ) : (
                      <span style={{ color: "rgba(245,244,239,0.5)", fontSize: "0.6rem" }}>YOU</span>
                    )}
                  </div>
                  <div>
                    <div className={`kd-msg-bubble ${msg.sender}`}>
                      {msg.content}
                    </div>
                    <span className={`kd-msg-time ${msg.sender}`}>
                      {formatTime(msg.created_at)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input area */}
        <div className="kd-msg-input-wrap">
          <div className="kd-msg-input-inner">
            <textarea
              ref={inputRef}
              className="kd-msg-textarea"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message… (Enter to send, Shift+Enter for new line)"
              rows={1}
              aria-label="Message input"
            />
            <button
              className="kd-msg-send-btn"
              onClick={handleSend}
              disabled={!input.trim() || sending}
              aria-label="Send message"
            >
              <SendIcon />
            </button>
          </div>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.7rem", color: "rgba(245,244,239,0.18)", marginTop: "0.5rem" }}>
            We typically respond within 1 business day · Mon–Fri 08:00–17:00 SAST
          </p>
        </div>
      </div>
    </>
  );
}
