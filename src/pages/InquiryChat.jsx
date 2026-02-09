import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import api from "../utils/api";
import { getSocket } from "../utils/socket";
import { getStoredUser } from "../utils/auth";

function InquiryChat() {
  const { id: inquiryId } = useParams();
  const navigate = useNavigate();
  const user = getStoredUser();
  const [inquiry, setInquiry] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    let s = null;
    async function init() {
      try {
        const [inquiryRes, messagesRes] = await Promise.all([
          api(`/api/inquiries/${inquiryId}`),
          api(`/api/inquiries/${inquiryId}/messages`),
        ]);
        setInquiry(inquiryRes);
        setMessages(messagesRes);
        s = getSocket();

        s.on("connect", () => {
          setIsConnected(true);
          s.emit("join_inquiry", inquiryId, (ack) => {
            if (ack?.error) setError(ack.error);
          });
        });

        s.on("disconnect", () => {
          setIsConnected(false);
        });

        s.on("new_message", (msg) => {
          setMessages((prev) => [...prev, msg]);
        });
        s.on("connect_error", (err) => {
          setIsConnected(false);
          setError(err.message || "Connection failed");
        });

        setSocket(s);
        if (s.connected) setIsConnected(true);
      } catch (err) {
        setError(err.message || "Failed to load chat.");
      } finally {
        setLoading(false);
      }
    }
    init();
    return () => {
      if (s) {
        s.off("new_message");
        s.off("connect");
        s.off("disconnect");
        s.off("connect_error");
        s.disconnect();
      }
    };
  }, [inquiryId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim() || !isConnected) return;
    socket.emit("send_message", { inquiryId, text: input.trim() }, (ack) => {
      if (ack?.error) setError(ack.error);
      else setInput("");
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="content-card p-8 text-center text-slate-500">
          Loading chat...
        </div>
      </Layout>
    );
  }
  if (error && !inquiry) {
    return (
      <Layout>
        <div className="content-card p-6 text-red-600">{error}</div>
        <button className="btn-outline mt-4" onClick={() => navigate(-1)}>
          Back
        </button>
      </Layout>
    );
  }

  const otherName =
    user?.role === "farmer"
      ? inquiry?.buyer?.name
      : inquiry?.product?.farmer?.name;
  const productName = inquiry?.product?.name;

  return (
    <Layout>
      <div
        className="content-card overflow-hidden flex flex-col max-w-3xl mx-auto"
        style={{ minHeight: "420px" }}
      >
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-slate-900">
              Chat with {otherName || "user"}
            </h2>
            <p className="text-sm text-slate-500">Re: {productName}</p>
          </div>
          <button className="btn-outline text-sm" onClick={() => navigate(-1)}>
            Back
          </button>
        </div>
        {error && (
          <div className="px-4 py-2 bg-amber-50 text-amber-800 text-sm">
            {error}
          </div>
        )}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[240px]">
          {messages.length === 0 && (
            <p className="text-center text-slate-500 text-sm">
              No messages yet. Say hello!
            </p>
          )}
          {messages.map((m) => {
            const senderId = (m.sender?._id ?? m.sender)?.toString?.();
            const isMe = senderId === user?._id?.toString?.();
            return (
              <div
                key={m._id}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                    isMe
                      ? "bg-green-600 text-white"
                      : "bg-slate-200 text-slate-800"
                  }`}
                >
                  {!isMe && (
                    <p className="text-xs font-medium text-slate-500 mb-0.5">
                      {m.sender?.name}
                    </p>
                  )}
                  <p>{m.text}</p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
        <form
          onSubmit={sendMessage}
          className="p-4 border-t border-slate-200 flex gap-2"
        >
          <input
            type="text"
            className="input-field flex-1"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={!isConnected}
          />
          <button
            type="submit"
            className="btn-primary"
            disabled={!input.trim() || !isConnected}
          >
            Send
          </button>
        </form>
      </div>
    </Layout>
  );
}

export default InquiryChat;
