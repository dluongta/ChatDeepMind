import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const formatBotResponse = (text) => {
    return text
      .replace(/\*\s\**(.*?)\*\*/g, "<h5><b>$1</b></h5>")  // Match * **text** to <h4>
      .replace(/\*(.*?)\*/g, "<h4><b>$1</b></h4>")        // Match *text* to <h3>
      .replace(/```([\s\S]*?)```/g, (match, code) => {
        return `<pre><code>${code}</code><button class="copy-button">📋</button></pre>`;
      })
      .replace(/`(.*?)`/g, "<code>$1</code>");      // Format single backticks to <code>
  };
  
  

  useEffect(() => {
    document.addEventListener("click", (event) => {
      if (event.target.classList.contains("copy-button")) {
        const codeElement = event.target.previousElementSibling;
        if (codeElement) {
          navigator.clipboard.writeText(codeElement.innerText).then(() => {
            event.target.textContent = "✔️";
            setTimeout(() => (event.target.textContent = "📋"), 2000);
          });
        }
      }
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message) return;
    setIsLoading(true);
    setError(null);

    const newMessage = { sender: "user", text: message };
    setChatHistory((prevHistory) => [...prevHistory, newMessage]);
    setMessage("");

    let isMounted = true;

    try {
      const response = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyAJC7L9bXORVgkjqQrF0Ta9mYDceu5mSYE",
        {
          contents: [{ parts: [{ text: message }] }],
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (isMounted) {
        const botMessage = {
          sender: "bot",
          text: formatBotResponse(response.data.candidates[0].content.parts[0].text),
        };
        setChatHistory((prevHistory) => [...prevHistory, botMessage]);
      }
    } catch (error) {
      console.error("Error during API call:", error);
      if (isMounted) setError("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      if (isMounted) setIsLoading(false);
    }

    return () => {
      isMounted = false;
    };
  };

  return (
    <div className="app-container">
      <div className="chat-box">
        <h1>Chatbot</h1>

        <div className="chat-history">
          {chatHistory.map((message, index) => (
            <div
              key={index}
              className={`message ${message.sender}`}
              dangerouslySetInnerHTML={{ __html: message.text }}
            />
          ))}
        </div>

        <form onSubmit={handleSubmit} className="input-container">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Nhập câu hỏi của bạn..."
            className="input-field"
          />
          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? "Đang gửi..." : "Gửi"}
          </button>
        </form>

        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
}

export default App;
