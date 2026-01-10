import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Hi! I’m the Digital Voyager assistant. Ask me anything about our digital forensics, incident response, or cybersecurity services.",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const toggleChat = () => setIsOpen((prev) => !prev);

  const handleSend = async (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    const newMessages = [...messages, { from: "user", text: trimmed }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const history = newMessages.map((m) =>
        m.from === "user" ? { user: m.text } : { bot: m.text }
      );

      const res = await axios.post("http://localhost:5000/api/chat", {
        message: trimmed,
        history,
      });

      setMessages((prev) => [
        ...prev,
        { from: "bot", text: res.data.reply || "I’m not sure how to answer that." },
      ]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text:
            "Sorry, I’m having trouble reaching the server right now. Please try again later.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <motion.button
        onClick={toggleChat}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 shadow-xl text-white"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="mt-3 w-80 md:w-96 bg-[#0b1220] border border-gray-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="px-4 py-3 bg-[#111827] border-b border-gray-700 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">Digital Voyager Assistant</p>
                <p className="text-xs text-gray-400">
                  Ask about our services, support, or contact options.
                </p>
              </div>
              <button
                onClick={toggleChat}
                className="text-gray-400 hover:text-gray-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 max-h-80 overflow-y-auto px-4 py-3 space-y-3">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    m.from === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`px-3 py-2 rounded-lg text-sm max-w-[80%] whitespace-pre-wrap ${
                      m.from === "user"
                        ? "bg-sky-500 text-white rounded-br-none"
                        : "bg-[#111827] text-gray-100 border border-gray-700 rounded-bl-none"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {loading && (
                <p className="text-xs text-gray-400">Assistant is typing…</p>
              )}
            </div>

            <form
              onSubmit={handleSend}
              className="border-t border-gray-700 px-3 py-2 flex items-center gap-2 bg-[#050816]"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about services, support, or incidents..."
                className="flex-1 bg-transparent text-sm text-white px-2 py-1 outline-none"
              />
              <button
                type="submit"
                disabled={loading}
                className="text-sky-400 hover:text-sky-300 disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Chatbot;