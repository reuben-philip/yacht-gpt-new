import React from "react";
import { useNavigate } from "react-router-dom";
import "./intro.css";

const IntroPage = () => {
  const navigate = useNavigate();

  return (
    <div className="intro-container">
      {/* Clickable Logo */}
      <img
        src={`${process.env.PUBLIC_URL}/yacht gpt logo.png`}
        alt="YachtGPT Logo"
        className="logo"
      />

      {/* Title and Tagline */}
      <h1 className="title">YACHTGPT</h1>
      <p className="subtitle">WHERE AI COMES ALIVE</p>

      {/* Enter Button */}
      <button className="enter-button" onClick={() => navigate("/login")}>
        Enter
      </button>

      {/* Footer */}
      <p className="footer">MADE WITH ❤️ BY REUBEN PHILIP</p>
    </div>
  );
};

export default IntroPage;
