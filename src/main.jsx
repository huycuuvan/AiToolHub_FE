import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter, Route, Routes } from "react-router";
import TextAssistance from "../src/components/TextAssistance";
import { TextToImage } from "../src/components/TextToImage";
createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/text-assistance" element={<TextAssistance />} />
      <Route path="/text-to-image" element={<TextToImage />} />
    </Routes>
  </BrowserRouter>
);
