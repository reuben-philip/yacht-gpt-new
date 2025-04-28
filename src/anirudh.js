import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./anirudh.css";

const AatishGPTPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Load chat history on mount
  useEffect(() => {
    axios
      .get("http://localhost:5000/chat-history", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setMessages(res.data))
      .catch((err) => console.error("Error fetching chat history:", err));
  }, [token]);

  // Handle sending message
  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const newMessage = { text: input, sender: "user" };
    setMessages([...messages, newMessage]);
    setInput("");

    try {
      const response = await axios.post(
        "http://localhost:5000/chat",
        { messages: [...messages, newMessage] },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessages((prev) => [
        ...prev,
        { text: response.data.reply, sender: "chatgpt" },
      ]);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="outer-container">
      {/* Clickable Logo */}
      <img
        src={`${process.env.PUBLIC_URL}/yacht gpt logo.png`}
        alt="Yacht GPT Logo"
        className="logo"
        onClick={() => navigate("/models")}
      />

      {/* Title & Subtitle */}
      <div className="header">
        <h1 className="title">ANIRUDH-GPT</h1>
        <p className="subtitle">DAVES HOT CHICKEN #1 FAN</p>
      </div>

      {/* Chat Section */}
      <div className="chat-section">
        <div className="chatbox">
          {messages.map((msg, index) => (
            <p key={index} className={msg.sender}>
              {msg.text}
            </p>
          ))}
        </div>

        {/* Input Field & Send Button */}
        <div className="input-container">
          <textarea
            type="text"
            placeholder="Type something..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default AatishGPTPage;
