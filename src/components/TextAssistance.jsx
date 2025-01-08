import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

function TextAssistance() {
  const [messages, setMessages] = useState([]); // Lưu trữ các tin nhắn
  const [input, setInput] = useState(""); // Tin nhắn nhập từ người dùng
  const [loading, setLoading] = useState(false); // Trạng thái tải
  const [error, setError] = useState(null); // Trạng thái lỗi

  const handleSend = async () => {
    if (!input.trim()) return;

    // Thêm tin nhắn của người dùng vào danh sách
    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput(""); // Xóa nội dung ô nhập sau khi gửi

    setLoading(true);
    setError(null);

    try {
      // Tạo instance của GoogleGenerativeAI
      const genAI = new GoogleGenerativeAI(
        "AIzaSyC0sbfptjebSoRgQIYYykVArHOFcdP-APk"
      );
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      // Gọi API
      const result = await model.generateContent({
        contents: messages.concat(userMessage).map((msg) => ({
          role: msg.role,
          parts: [{ text: msg.text }],
        })),
        generationConfig: {
          maxOutputTokens: 1000,
          temperature: 0.1,
        },
      });

      // Lấy phản hồi từ AI
      const aiResponse = {
        role: "assistant",
        text: result.response.text() || "Không có phản hồi.",
      };

      // Thêm phản hồi của AI vào danh sách tin nhắn
      setMessages((prev) => [...prev, aiResponse]);
    } catch (err) {
      setError("Lỗi khi gọi API: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Generative AI Chat</h1>
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        {/* Khu vực hiển thị tin nhắn */}
        <div
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            height: "400px",
            overflowY: "scroll",
            marginBottom: "10px",
            background: "#f9f9f9",
          }}
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                textAlign: msg.role === "user" ? "right" : "left",
                margin: "5px 0",
                color: msg.role === "user" ? "blue" : "green",
              }}
            >
              <p>
                <strong>{msg.role === "user" ? "Bạn" : "AI"}:</strong>{" "}
                {msg.text}
              </p>
            </div>
          ))}
        </div>

        {/* Khu vực nhập và gửi tin nhắn */}
        <div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Nhập tin nhắn..."
            style={{
              width: "75%",
              padding: "10px",
              marginRight: "10px",
              borderRadius: "5px",
            }}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input}
            style={{
              padding: "10px",
              borderRadius: "5px",
              background: loading ? "gray" : "blue",
              color: "white",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Đang gửi..." : "Gửi"}
          </button>
        </div>

        {/* Hiển thị lỗi nếu có */}
        {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
      </div>
    </div>
  );
}

export default TextAssistance;
