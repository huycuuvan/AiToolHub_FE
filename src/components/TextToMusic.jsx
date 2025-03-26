import React, { useState } from "react";
import { Navbar } from "./Navbar";

const TextToMusic = () => {
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);

  const handleConvert = async () => {
    if (!text) {
      setError("Please enter some text to convert!");
      return;
    }
    setError("");
    setLoading(true);

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
      setAudioUrl(audioUrl);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen text-white bg-gradient-to-br from-purple-300 via-purple-300 to-pink-200">
      <Navbar />

      <div className="flex-1 w-full flex items-center justify-center">
        <div className="w-full max-w-2xl px-4">
          <h1 className="text-4xl font-bold text-center mb-10 text-purple-800">
            Generate Music
          </h1>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text here..."
            className="w-full h-32 bg-white text-gray-800 p-4 rounded-lg resize-none shadow focus:outline-none focus:ring-2 focus:ring-purple-500"
          ></textarea>

          {error && (
            <div className="text-red-600 mt-2 text-center font-medium">
              {error}
            </div>
          )}

          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={handleConvert}
              className={`px-6 py-3 rounded-lg text-white font-semibold transition-all ${
                loading
                  ? "bg-purple-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-md hover:shadow-lg"
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
              className="px-6 py-3 bg-white text-purple-600 border border-purple-400 rounded-lg hover:bg-purple-50 transition font-semibold"
            >
              Clear
            </button>
          </div>

          {audioUrl && (
            <div className="mt-6 bg-white p-4 rounded-lg shadow">
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
