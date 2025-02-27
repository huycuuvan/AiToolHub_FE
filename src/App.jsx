import { Routes, Route } from "react-router";

import TextAssistance from "./components/TextAssistance";
import { TextToImage } from "./components/TextToImage";
import { Home } from "./components/Home";
import { Login } from "./components/Login";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./context/AuthContext";
import TextToSpeech from "./components/TextToSpeech";
import ImageToText from "./components/ImageToText";
import { SignUp } from "./components/SignUp";

const App = () => {
  const clientId =
    "522998804102-5uimtk30nrj73tunjkqjllkolma27970.apps.googleusercontent.com";

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <AuthProvider>
        <Routes>
          <Route index element={<Home />} />
          <Route path="/text-assistance" element={<TextAssistance />} />
          <Route path="/text-to-image" element={<TextToImage />} />
          <Route path="/text-to-speech" element={<TextToSpeech />} />
          <Route path="/image-to-text" element={<ImageToText />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
};

export default App;
