import { Routes, Route } from "react-router";

import TextAssistance from "./components/TextAssistance";
import { TextToImage } from "./components/TextToImage";
import { Home } from "./components/Home";
import { Login } from "./components/Login";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./context/AuthContext";
import TextToMusic from "./components/TextToMusic";
import ImageToText from "./components/ImageToText";
import { SignUp } from "./components/SignUp";
import { ToastContainer } from "react-toastify";

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
