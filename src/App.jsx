import React from "react";
import { Routes, Route } from "react-router";
import { Navbar } from "./components/Navbar";
import TextAssistance from "./components/TextAssistance";
import { TextToImage } from "./components/TextToImage";
import { Home } from "./components/Home";

const App = () => {
  return (
    <div>
      <Navbar />
      <div style={{ padding: "20px" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/text-assistance" element={<TextAssistance />} />
          <Route path="/text-to-image" element={<TextToImage />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
