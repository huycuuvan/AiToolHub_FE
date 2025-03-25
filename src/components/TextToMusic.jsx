import React, { useState } from "react";
import { Navbar } from "./Navbar";

const TextToMusic = () => {
  const [text, setText] = useState(""); // Text input
  const [error, setError] = useState(""); // Error state
  const [loading, setLoading] = useState(false); // Loading state
  const [audioUrl, setAudioUrl] = useState(null); // Audio URL

  // Function to handle API call
  const handleConvert = async () => {
    if (!text) {
      setError("Please enter some text to convert!");
      return;
    }
    setError(""); // Clear error
    setLoading(true); // Set loading state

    try {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/facebook/musicgen-small",
        {
          headers: {
            Authorization: "Bearer ",
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({ inputs: text }),
        }
      );

      if (!response.ok) {
        throw new Error("Error while generating audio. Please try again.");
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioUrl(audioUrl); // Set the audio URL
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen text-white bg-gradient-to-br from-black via-gray-700 to-black">
      {/* Fixed Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex-1 w-full flex items-center justify-center">
        {" "}
        {/* Thêm pt-16 để tránh overlap với Navbar */}
        <div className="w-full max-w-2xl">
          <h1 className="text-4xl font-bold text-center mb-10">
            Generate Music
          </h1>
          {/* Input Section */}
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text here..."
            className="w-full h-32 bg-gray-800 text-white p-4 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
          {error && (
            <div className="text-red-500 mt-2 text-center">{error}</div>
          )}

          {/* Buttons */}
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={handleConvert}
              className={`px-6 py-3 rounded-lg text-white ${
                loading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-gray-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 shadow-md hover:shadow-lg"
              }`}
              disabled={loading}
            >
              {loading ? "Converting..." : "Convert to Music"}
            </button>

            <button
              onClick={() => {
                setText("");
                setAudioUrl(null);
                setError("");
              }}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Clear
            </button>
          </div>

          {/* Audio Player */}
          {audioUrl && (
            <div className="mt-6">
              <audio controls src={audioUrl} className="w-full">
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TextToMusic;
