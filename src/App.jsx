import { Routes, Route } from "react-router";

import { Home } from "./components/Home";

import { GoogleOAuthProvider } from "@react-oauth/google";

import TextToMusic from "./components/Text-to-music/TextToMusic";
import ImageToText from "./components/Image-to-text/ImageToText";

import { ToastContainer } from "react-toastify";
import TextToImage from "./components/Text-to-image/TextToImage";
import TextAssistance from "./components/Text-assis/TextAssistance";
import { Login } from "./components/auth/Login";
import { SignUp } from "./components/auth/SignUp";
import { AuthProvider } from "./context/AuthContext";

const App = () => {
  const clientId =
    "522998804102-5uimtk30nrj73tunjkqjllkolma27970.apps.googleusercontent.com";

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <GoogleOAuthProvider clientId={clientId}>
        <AuthProvider>
          <Routes>
            <Route index element={<Home />} />
            <Route path="/text-assistance" element={<TextAssistance />} />
            <Route path="/text-to-image" element={<TextToImage />} />
            <Route path="/text-to-music" element={<TextToMusic />} />
            <Route path="/image-to-text" element={<ImageToText />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        </AuthProvider>
      </GoogleOAuthProvider>
    </>
  );
};

export default App;
