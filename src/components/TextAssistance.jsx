import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import gsap from "gsap";
import { Navbar } from "./Navbar";
import axios from "axios";

function TextAssistance() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chatHistories, setChatHistories] = useState([]);
  const [activeHistoryIndex, setActiveHistoryIndex] = useState(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const titleRef = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      titleRef.current,
      { y: -50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
    );
  }, []);

  useEffect(() => {
    const storedHistories = JSON.parse(localStorage.getItem("chatHistories") || "[]");
    setChatHistories(storedHistories);
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleInput = (e) => setInput(e.target.value);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/tools/chatbot",
        { message: input }
      );

      let aiText;
      if (typeof response.data === "string") {
        if (response.data.startsWith("{")) {
          const jsonResponse = JSON.parse(response.data);
          aiText = jsonResponse.candidates?.[0]?.content?.parts?.[0]?.text || "No response text";
        } else {
          aiText = response.data;
        }
      } else if (typeof response.data === "object" && response.data !== null) {
        aiText = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "No response text";
      } else {
        aiText = "Unexpected response format";
      }

      const aiResponse = { role: "assistant", text: aiText };
      const finalMessages = [...updatedMessages, aiResponse];
      setMessages(finalMessages);

      const conversationTitle = input.substring(0, 50) + (input.length > 50 ? "..." : "");
      const updatedHistories = [...chatHistories];
      if (activeHistoryIndex !== null && updatedHistories[activeHistoryIndex]) {
        updatedHistories[activeHistoryIndex].messages = finalMessages;
      } else {
        updatedHistories.push({ title: conversationTitle, messages: finalMessages });
        setActiveHistoryIndex(updatedHistories.length - 1);
      }

      setChatHistories(updatedHistories);
      localStorage.setItem("chatHistories", JSON.stringify(updatedHistories));
    } catch (err) {
      setError("Lỗi khi gọi API: " + (err.response?.data || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  const handleHistorySelect = (index) => {
    setActiveHistoryIndex(index);
    setMessages(chatHistories[index].messages);
    setIsHistoryOpen(false);
  };

  const handleClearHistory = () => {
    localStorage.removeItem("chatHistories");
    setChatHistories([]);
    setMessages([]);
    setActiveHistoryIndex(null);
  };

  const startNewChat = () => {
    setMessages([]);
    setActiveHistoryIndex(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Fixed Navbar */}
      <Navbar />

      {/* Main Layout */}
      <div className="flex flex-1 pt-16"> {/* pt-16 để tránh overlap với Navbar */}
        {/* Fixed Chat History Sidebar */}
        <div
          className={`fixed top-16 left-0 w-64 h-[calc(100vh-4rem)] bg-gray-800 z-20 transform ${
            isHistoryOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 ease-in-out lg:translate-x-0`}
        >
          <div className="p-4 border-b border-gray-700 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Chat History</h2>
            <button
              onClick={() => setIsHistoryOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          <div className="p-4 space-y-2 overflow-y-auto h-[calc(100%-12rem)]">
            {chatHistories.length === 0 ? (
              <p className="text-gray-400">No history yet</p>
            ) : (
              chatHistories.map((history, index) => (
                <button
                  key={index}
                  onClick={() => handleHistorySelect(index)}
                  className={`w-full text-left p-3 rounded-lg ${
                    activeHistoryIndex === index ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"
                  } transition-colors`}
                >
                  {history.title}
                </button>
              ))
            )}
          </div>
          <div className="absolute bottom-0 w-full p-4 border-t border-gray-700">
            <button
              onClick={handleClearHistory}
              className="w-full p-2 bg-red-600 rounded-lg hover:bg-red-700 transition"
            >
              Clear History
            </button>
          </div>
        </div>

        {/* Chat Content */}
        <div className="flex-1 flex flex-col ml-0 lg:ml-64"> {/* ml-64 để tránh overlap sidebar */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-3xl mx-auto">
              <h1 ref={titleRef} className="text-3xl font-bold mb-4 text-center">
                AI Chat Assistant
              </h1>
              {messages.length === 0 && (
                <div className="text-center text-gray-400">
                  Start a conversation by typing below...
                </div>
              )}
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  } mb-4`}
                >
                  <div
                    className={`max-w-[70%] p-4 rounded-lg shadow-md ${
                      msg.role === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-700 text-gray-200"
                    }`}
                  >
                    <ReactMarkdown>{msg.text || "Error: No text available"}</ReactMarkdown>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start mb-4">
                  <div className="bg-gray-700 p-4 rounded-lg shadow-md max-w-[70%]">
                    <span className="text-gray-400 animate-pulse">Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className="sticky bottom-0 p-6 bg-gray-900">
            <div className="max-w-3xl mx-auto flex items-center bg-gray-800 rounded-full shadow-lg p-2">
              <button
                onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                className="p-2 text-gray-400 hover:text-white lg:hidden"
              >
                ☰
              </button>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={handleInput}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                className="flex-1 bg-transparent text-white p-3 outline-none placeholder-gray-400"
                disabled={loading}
              />
              <button
                onClick={handleSend}
                className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition disabled:bg-gray-500"
                disabled={loading}
              >
                ➤
              </button>
            </div>
            {error && <div className="text-red-500 text-center mt-2">{error}</div>}
          </div>

          {/* New Chat Button */}
          <button
            onClick={startNewChat}
            className="fixed bottom-20 right-6 p-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition shadow-lg z-10"
          >
            New Chat
          </button>
        </div>
      </div>
    </div>
  );
}

export default TextAssistance;