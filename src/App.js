import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import IntroPage from "./intro";
import LoginPage from "./login";
import SignUpPage from "./signup";
import ModelPage from "./models";
import AatishGPTPage from "./aatish";

// import AdityaGPTPage from "./gpts/AdityaGPT";
import AnirudhGPTPage from "./anirudh";
// import ConnorGPTPage from "./gpts/ConnorGPT";
// import MayankGPTPage from "./gpts/MayankGPT";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<IntroPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/models" element={<ModelPage />} />
        <Route path="/aatish" element={<AatishGPTPage />} />

        {/* Add other models when available */}
        {/* <Route path="/aditya" element={<AdityaGPTPage />} /> */}
        <Route path="/anirudh" element={<AnirudhGPTPage />} /> 
        {/* <Route path="/connor" element={<ConnorGPTPage />} /> */}
        {/* <Route path="/mayank" element={<MayankGPTPage />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
