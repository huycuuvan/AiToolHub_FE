import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import gsap from "gsap";
import { Navbar } from "./Navbar";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function TextAssistance() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatHistories, setChatHistories] = useState([]);
  const [activeHistoryIndex, setActiveHistoryIndex] = useState(null);

  const titleRef = useRef(null);
  const paragraphRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      titleRef.current,
      { y: -50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power2" }
    );

    gsap.fromTo(
      paragraphRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.5, ease: "power2.out", delay: 0.3 }
    );
  }, []);

  useEffect(() => {
    const storedHistories = JSON.parse(
      localStorage.getItem("chatHistories") || "[]"
    );
    setChatHistories(storedHistories);
  }, []);

  const handleInput = (e) => {
    setInput(e.target.value);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/tools/chatbot",
        {
          inputs: updatedMessages,
          userId: Math.random(0, 2),
        }
      );

      const aiResponse = {
        role: "assistant",
        text: response.data.text || "Không có phản hồi.",
      };
      const finalMessages = [...updatedMessages, aiResponse];
      setMessages(finalMessages);

      toast.success("Phản hồi từ AI đã nhận được!");

      const conversationTitle =
        updatedMessages[0]?.text.substring(0, 50) + "...";
      const updatedHistories = [...chatHistories];

      if (activeHistoryIndex !== null && updatedHistories[activeHistoryIndex]) {
        updatedHistories[activeHistoryIndex] = finalMessages;
      } else {
        updatedHistories.push({
          title: conversationTitle,
          messages: finalMessages,
        });
        setActiveHistoryIndex(updatedHistories.length - 1);
      }

      setChatHistories(updatedHistories);
      localStorage.setItem("chatHistories", JSON.stringify(updatedHistories));
    } catch (err) {
      toast.error("Lỗi khi gọi API: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleHistorySelect = (e) => {
    const selectedIndex = parseInt(e.target.value, 10);
    if (!isNaN(selectedIndex)) {
      setActiveHistoryIndex(selectedIndex);
      setMessages(chatHistories[selectedIndex]);
    } else {
      setActiveHistoryIndex(null);
      setMessages([]);
    }
  };

  const handleClearHistory = () => {
    localStorage.removeItem("chatHistories");
    setChatHistories([]);
    setMessages([]);
    setActiveHistoryIndex(null);
    toast.info("Lịch sử trò chuyện đã được xóa.");
  };

  const startNewChat = () => {
    setMessages([]);
    setActiveHistoryIndex(null);
    toast.info("Bắt đầu cuộc trò chuyện mới!");
  };

  return (
    <div className="flex flex-col items-center min-h-screen text-white bg-gradient-to-br from-black via-gray-600 to-black">
      <Navbar />
      <div className="flex flex-col bg-blue-glow-gradient justify-center text-center">
        <h1 ref={titleRef} className="text-4xl font-bold mt-10">
          What is AI
        </h1>
        <p ref={paragraphRef} className="text-center text-lg max-w-2xl mt-6">
          What is AI, and how does it enable machines to perform tasks requiring
          human intelligence?
        </p>
      </div>
      <div className="relative mt-10 w-full max-w-2xl">
        <select
          onChange={handleHistorySelect}
          className="w-full p-3 bg-gray-800 text-white rounded-lg"
        >
          <option value="">Chat history</option>
          {chatHistories.map((_, index) => (
            <option key={index} value={index}>
              Conversation {index + 1}
            </option>
          ))}
        </select>
        <button
          onClick={handleClearHistory}
          className="mt-4 px-6 py-3 bg-red-600 text-white rounded-lg"
        >
          Clear History
        </button>
        <button
          onClick={startNewChat}
          className="mt-4 px-6 py-3 bg-green-600 text-white rounded-lg ml-4"
        >
          New Chat
        </button>
      </div>
      <div className="w-full max-w-2xl mt-6">
        <div className="bg-gray-800 rounded-t-lg p-4 h-64 overflow-y-auto">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-3 mb-3 rounded-lg ${
                msg.role === "user"
                  ? "bg-blue-600 text-right"
                  : "bg-gray-600 text-left"
              }`}
            >
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            </div>
          ))}
          {loading && <div className="text-center italic">Đang tải...</div>}
        </div>
        <div className="flex bg-gray-700 rounded-b-lg p-4 mb-6">
          <input
            type="text"
            value={input}
            onChange={handleInput}
            placeholder="Chat with AI..."
            className="flex-1 bg-gray-800 text-white p-3 rounded-lg"
          />
          <button
            onClick={handleSend}
            className="ml-4 px-6 py-3 bg-blue-600 text-white rounded-lg"
          >
            Gửi
          </button>
        </div>
      </div>
    </div>
  );
}

export default TextAssistance;
