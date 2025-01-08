import { useState, useEffect, useRef } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from "react-markdown";
import gsap from "gsap";

function TextAssistance() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chatHistories, setChatHistories] = useState([]); // Lưu trữ danh sách lịch sử
  const [activeHistoryIndex, setActiveHistoryIndex] = useState(null); // Chỉ số lịch sử đang chọn

  const titleRef = useRef(null); // Tham chiếu đến tiêu đề
  const paragraphRef = useRef(null); // Tham chiếu đến đoạn văn
  useEffect(() => {
    // Hiệu ứng cho tiêu đề
    gsap.fromTo(
      titleRef.current,
      { y: -50, opacity: 0 }, // Bắt đầu: di chuyển lên, ẩn đi
      { y: 0, opacity: 1, duration: 1, ease: "power2" } // Kết thúc: hiện ra
    );

    // Hiệu ứng cho đoạn văn
    gsap.fromTo(
      paragraphRef.current,
      { y: 50, opacity: 0 }, // Bắt đầu: di chuyển xuống, ẩn đi
      { y: 0, opacity: 1, duration: 1.5, ease: "power2.out", delay: 0.3 } // Kết thúc: hiện ra, delay 0.3 giây
    );
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
    setError(null);

    try {
      const genAI = new GoogleGenerativeAI(
        "AIzaSyC0sbfptjebSoRgQIYYykVArHOFcdP-APk"
      );
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const result = await model.generateContent({
        contents: updatedMessages.map((msg) => ({
          role: msg.role,
          parts: [{ text: msg.text }],
        })),
        generationConfig: {
          maxOutputTokens: 1000,
          temperature: 0.1,
        },
      });

      const aiResponse = {
        role: "assistant",
        text: result.response.text() || "Không có phản hồi.",
      };

      const finalMessages = [...updatedMessages, aiResponse];
      setMessages(finalMessages);

      // Lưu cuộc trò chuyện vào localStorage
      const updatedHistories = [...chatHistories];
      if (activeHistoryIndex !== null) {
        updatedHistories[activeHistoryIndex] = finalMessages;
      } else {
        updatedHistories.push(finalMessages);
        setActiveHistoryIndex(updatedHistories.length - 1); // Cập nhật chỉ số lịch sử đang chọn
      }

      setChatHistories(updatedHistories);
      localStorage.setItem("chatHistories", JSON.stringify(updatedHistories));
    } catch (err) {
      setError("Lỗi khi gọi API: " + err.message);
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
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <h1 ref={titleRef} className="text-4xl font-bold mt-10">
        What is AI
      </h1>
      <p ref={paragraphRef} className="text-center text-lg max-w-2xl mt-6">
        What is AI, and how does it enable machines to perform tasks requiring
        human intelligence, like speech recognition and decision-making? AI
        learns and adapts through new data, integrating into daily life via
        virtual assistants, recommendation algorithms, and self-driving cars.
        What is AI's potential for transforming our future? Wanna learn more?
        Just start chatting and have all your questions answered!
      </p>

      <div className="relative mt-10 w-full max-w-2xl">
        <select
          onChange={handleHistorySelect}
          className="w-full p-2 bg-gray-800 text-white rounded-lg"
        >
          <option value="">Select a conversation</option>
          {chatHistories.map((_, index) => (
            <option key={index} value={index}>
              Conversation {index + 1}
            </option>
          ))}
        </select>
        <button
          onClick={handleClearHistory}
          className="mt-4 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Clear History
        </button>
      </div>

      <div className="w-full max-w-2xl mt-6">
        <div className="bg-gray-800 rounded-t-lg p-4 h-64 overflow-y-auto">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-3 mb-3 rounded-lg ${
                msg.role === "user"
                  ? "bg-blue-600 self-end text-right"
                  : "bg-gray-600 self-start text-left"
              }`}
            >
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            </div>
          ))}
          {loading && <div className="text-center italic">Đang tải...</div>}
        </div>

        <div className="flex bg-gray-700 rounded-b-lg p-4">
          <input
            type="text"
            value={input}
            onChange={handleInput}
            placeholder="Chat with AI..."
            className="flex-1 bg-gray-800 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSend}
            className="ml-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Gửi
          </button>
        </div>
        {error && <div className="text-red-500 text-center mt-2">{error}</div>}
      </div>
    </div>
  );
}

export default TextAssistance;
