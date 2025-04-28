import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./models.css";

const ModelsPage = () => {
  const navigate = useNavigate();
  const [profilePicture, setProfilePicture] = useState(null);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("token");
    if (!isAuthenticated) {
      navigate("/"); // Redirect to login if not authenticated
    }

    const storedPicture = localStorage.getItem("profilePicture");
    if (storedPicture) {
      setProfilePicture(storedPicture);
    }
  }, [navigate]);

  return (
    <div className="models-container">
      {/* YachtGPT Logo */}
      <img src={`${process.env.PUBLIC_URL}/yacht gpt logo.png`} alt="Yacht GPT Logo" className="logo" />

      {/* Welcome Text */}
      <h1 className="models-title">Welcome!</h1>

      {/* Models List */}
      <div className="models-list">
        <h2 className="models-heading">Models:</h2>
        <ul className="models-links">
          <li><Link to="/aatish" className="model-link">AatishGPT</Link></li>
          <li><Link to="/aditya" className="model-link">AdityaGPT</Link></li>
          <li><Link to="/anirudh" className="model-link">AnirudhGPT</Link></li>
          <li><Link to="/connor" className="model-link">ConnorGPT</Link></li>
          <li><Link to="/mayank" className="model-link">MayankGPT</Link></li>
        </ul>
      </div>
    </div>
  );
};

export default ModelsPage;
