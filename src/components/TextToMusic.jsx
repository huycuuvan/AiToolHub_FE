import React, { useState, useRef, useEffect } from "react";
import { Navbar } from "./Navbar";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

// Random music prompts for the bubbles
const musicPrompts = [
  "Upbeat jazz melody",
  "Calm piano tune",
  "Energetic rock beat",
  "Soothing classical violin",
  "Chill lo-fi hip hop",
  "Epic orchestral soundtrack",
  "Funky disco groove",
  "Relaxing acoustic guitar",
  "Dreamy synthwave",
  "Lively pop anthem",
];

// Generate random positions and delays for the bubbles
const getRandomBubbleProps = () => ({
  x: Math.random() * 400 - 200, // Random x position between -200 and 200
  y: Math.random() * 400 - 200, // Random y position between -200 and 200
  delay: Math.random() * 3, // Random delay between 0 and 3 seconds
  duration: 5 + Math.random() * 5, // Random duration between 5 and 10 seconds
});

const TextToMusic = () => {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // Handle audio play/pause state
  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);

  // Handle conversion to music
  const handleConvert = async () => {
    if (!text) {
      setError("Please enter some text to convert!");
      return;
    }
    setError("");
    setLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in to generate music.");
      setTimeout(() => {
        navigate("/login");
      }, 1000); // Add delay to ensure toast is visible
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.post(
        "/api/tools/text-to-music",
        text,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          responseType: "blob", // Expect binary audio data
        }
      );

      const audioBlob = response.data;
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioUrl(audioUrl);
    } catch (err) {
      let errorMessage = "Error generating music. Please try again.";
      if (err.response) {
        if (err.response.status === 401) {
          errorMessage = "Session expired. Please log in again.";
          localStorage.removeItem("token");
          setTimeout(() => {
            navigate("/login");
          }, 1000);
        } else if (err.response.data) {
          errorMessage = "Error generating music.";
        }
      }
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle download of the generated audio
  const handleDownload = () => {
    if (audioUrl) {
      const link = document.createElement("a");
      link.href = audioUrl;
      link.download = "generated_music.mp3";
      link.click();
    }
  };

  return (
    <div className="relative flex flex-col items-center min-h-screen text-white bg-gradient-to-br from-black via-gray-700 to-black overflow-hidden">
      <Navbar />

      <div className="flex-1 w-full flex items-center justify-center relative z-10">
        <div className="w-full max-w-2xl px-4 relative">
          <h1 className="text-4xl font-bold text-center mb-10 text-purple-800">
            Generate Music
          </h1>

          {/* Floating Music Prompt Bubbles */}
          <div className="absolute inset-0 pointer-events-none">
            {musicPrompts.map((prompt, index) => {
              const bubbleProps = getRandomBubbleProps();
              return (
                <motion.div
                  key={index}
                  className="absolute bg-purple-500 bg-opacity-30 text-white text-xs font-medium px-4 py-2 rounded-full shadow-lg"
                  initial={{ opacity: 0, scale: 0.5, x: 0, y: 0 }}
                  animate={{
                    opacity: [0, 1, 1, 0],
                    scale: [0.5, 1, 1, 0.5],
                    x: bubbleProps.x,
                    y: bubbleProps.y,
                  }}
                  transition={{
                    duration: bubbleProps.duration,
                    delay: bubbleProps.delay,
                    repeat: Infinity,
                    repeatDelay: 1,
                    ease: "easeInOut",
                  }}
                >
                  {prompt}
                </motion.div>
              );
            })}
          </div>

          {/* Textarea Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-20"
          >
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text here..."
              className="w-full h-32 bg-white text-gray-800 p-4 rounded-lg resize-none shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
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
                  setIsPlaying(false);
                }}
                className="px-6 py-3 bg-white text-purple-600 border border-purple-400 rounded-lg hover:bg-purple-50 transition font-semibold"
              >
                Clear
              </button>
            </div>

            {audioUrl && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mt-6 bg-white p-4 rounded-lg shadow-lg flex items-center gap-4"
              >
                <audio
                  ref={audioRef}
                  controls
                  src={audioUrl}
                  className="w-full"
                  onPlay={handlePlay}
                  onPause={handlePause}
                >
                  Your browser does not support the audio element.
                </audio>
                <button
                  onClick={handleDownload}
                  className="p-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-200"
                  title="Download"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Music Wave at the Bottom */}
      <AnimatePresence>
        {isPlaying && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.5 }}
            className="fixed bottom-0 left-0 right-0 h-24 bg-purple-800 bg-opacity-80 flex items-center justify-center overflow-hidden"
          >
            <svg
              className="w-full h-full"
              viewBox="0 0 100 20"
              preserveAspectRatio="none"
            >
              {[...Array(50)].map((_, i) => {
                const baseHeight = Math.random() * 10 + 5;
                const bounceHeight = baseHeight + Math.random() * 10;

                return (
                  <motion.rect
                    key={i}
                    x={i * 2}
                    width={1}
                    initial={{ height: baseHeight, y: 20 - baseHeight }}
                    animate={{
                      height: [baseHeight, bounceHeight, baseHeight],
                      y: [20 - baseHeight, 20 - bounceHeight, 20 - baseHeight],
                    }}
                    transition={{
                      duration: 0.5 + Math.random() * 0.5,
                      repeat: Infinity,
                      repeatType: "reverse",
                      delay: Math.random() * 0.5,
                    }}
                    fill="rgba(255, 255, 255, 0.8)"
                  />
                );
              })}
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TextToMusic;
