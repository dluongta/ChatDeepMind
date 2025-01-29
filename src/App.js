import React, { useState } from "react";
import axios from "axios";
import './App.css'; // Ensure the CSS file is linked properly

function App() {
  const [message, setMessage] = useState("");  // Store current user input
  const [chatHistory, setChatHistory] = useState([]);  // Store conversation history
  const [isLoading, setIsLoading] = useState(false);  // For loading state
  const [error, setError] = useState(null);  // For error state

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message) return; // Avoid sending empty messages
    setIsLoading(true); // Set loading to true when sending message
    setError(null); // Reset errors

    // Add the user's message to the chat history
    const newMessage = { sender: "user", text: message };
    setChatHistory((prevHistory) => [...prevHistory, newMessage]);
    setMessage(""); // Reset the input field

    try {
      // Send request to Gemini API
      const response = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyCH3VT-wJX7iW53WRJTKopJgttnWuHzolY",
        {
          contents: [
            {
              parts: [
                {
                  text: message,
                },
              ],
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Extract bot's response from API response
      const botMessage = {
        sender: "bot",
        text: response.data.candidates[0].content.parts[0].text,
      };

      // Add the bot's response to the chat history
      setChatHistory((prevHistory) => [...prevHistory, botMessage]);
    } catch (error) {
      console.error("Error during API call:", error);
      setError("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setIsLoading(false); // After completing the request, set loading to false
    }
  };

  return (
    <div className="app-container">
      <div className="chat-box">
        <h1>Chatbot</h1>

        <div className="chat-history">
          {/* Render chat history dynamically */}
          {chatHistory.map((message, index) => (
            <div
              key={index}
              className={`message ${message.sender === "user" ? "user" : "bot"}`}
            >
              <p>{message.text}</p>
            </div>
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
