import { useState, useRef, useEffect } from "react";
import { Navbar } from "../Navbar";
import gsap from "gsap";
import { toast } from "react-toastify";
import {
  saveToHistory,
  getHistory,
  deleteFromHistory,
} from "../../utils/localStorage";
import { formatDistanceToNow } from "date-fns";

// Define voice options
const VOICES = {
  ADAM: { name: "Adam" },
  ALICE: { name: "Alice" },
  ANTONI: { name: "Antoni" },
  ARIA: { name: "Aria" },
  ARNOLD: { name: "Arnold" },
  BILL: { name: "Bill" },
  CALLUM: { name: "Callum" },
  ELLI: { name: "Elli" },
  EMILY: { name: "Emily" },
  FREYA: { name: "Freya" },
  SARAH: { name: "Sarah" },
  SERENA: { name: "Serena" },
  THOMAS: { name: "Thomas" },
  MICHAEL: { name: "Michael" },
  ETHAN: { name: "Ethan" },
  GEORGE: { name: "George" },
  PAUL: { name: "Paul" },
  GIGI: { name: "Gigi" },
  SANTA_CLAUS: { name: "Santa Claus" },
};

const TextToSpeech = () => {
  const [activeTab, setActiveTab] = useState("settings");
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState("");
  const [voice, setVoice] = useState(VOICES.CALLUM.name);
  const [model, setModel] = useState("Eleven Turbo v2.5");
  const [speed, setSpeed] = useState(1);
  const [stability, setStability] = useState(0.5);
  const [similarity, setSimilarity] = useState(0.75);
  const [loading, setLoading] = useState(false);
  const [generatedAudioUrl, setGeneratedAudioUrl] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentAudioTimestamp, setCurrentAudioTimestamp] = useState(null);

  const audioRef = useRef(null);
  const historyAudioRefs = useRef({}); // Refs for history audio elements
  const containerRef = useRef(null);
  const titleRef = useRef(null);

  // Load history on mount
  useEffect(() => {
    const savedHistory = getHistory();
    setHistory(savedHistory);

    // GSAP animations
    gsap.fromTo(
      titleRef.current,
      { y: -50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
    );
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, delay: 0.5, ease: "power3.out" }
    );
  }, []);

  // Timer to force re-render every 10 seconds for timestamp updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTick((prev) => prev + 1); // Increment tick to force re-render
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  // Handle form submission for main generation
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) {
      toast.warning("Please enter some text");
      return;
    }

    setLoading(true);
    setGeneratedAudioUrl(null);
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
    setCurrentAudioTimestamp(null);

    try {
      const selectedVoice = Object.values(VOICES).find((v) => v.name === voice);
      const response = await fetch(
        "http://localhost:8080/api/tools/text-to-speech",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            input,
            voice: selectedVoice.name,
            speed,
            stability,
            similarity,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server error:", errorData);
        throw new Error(errorData.message || "Failed to generate speech");
      }

      const blob = await response.blob();
      const audioUrl = URL.createObjectURL(blob);
      setGeneratedAudioUrl(audioUrl);

      // Save to history with all parameters, including the blob
      await saveToHistory(input, voice, speed, stability, similarity, blob);
      setHistory(getHistory());
      toast.success("Speech generated successfully!");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  // Handle playback for history entries
  const handleHistoryPlayback = (item, index) => {
    const audio = historyAudioRefs.current[index];
    if (audio) {
      if (audio.paused) {
        audio.play();
      } else {
        audio.pause();
      }
    }
  };

  // Handle deletion of a history entry
  const handleDeleteHistory = (index) => {
    const updatedHistory = deleteFromHistory(index);
    setHistory(updatedHistory);
    toast.success("History entry deleted!");
  };

  // Toggle play/pause for the main generated audio
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Handle timeline scrubbing for main audio
  const handleTimelineChange = (e) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  // Reset settings
  const resetSettings = () => {
    setSpeed(1);
    setStability(0.5);
    setSimilarity(0.75);
  };

  // Filter and group history by date
  const filteredHistory = history.filter(
    (item) =>
      item.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.voice.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedHistory = filteredHistory.reduce(
    (acc, item) => {
      const date = new Date(item.timestamp);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);

      if (date.toDateString() === today.toDateString()) {
        acc.today.push(item);
      } else if (date.toDateString() === yesterday.toDateString()) {
        acc.yesterday.push(item);
      }
      return acc;
    },
    { today: [], yesterday: [] }
  );

  // Format time in MM:SS
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-200 to-blue-500">
      <Navbar />
      <div className="pt-20 px-4 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 ref={titleRef} className="text-2xl font-semibold text-gray-900">
            Text to Speech
          </h1>
          <div className="flex space-x-2">
            <button className="text-gray-600 hover:text-gray-900 text-sm flex items-center">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
              Feedback
            </button>
            <button className="text-gray-600 hover:text-gray-900 text-sm flex items-center">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Documentation
            </button>
          </div>
        </div>

        <div ref={containerRef} className="flex flex-col md:flex-row gap-6">
          {/* Left Section: Textarea and Generated Audio */}
          <div className="w-full md:w-2/3">
            <form onSubmit={handleSubmit}>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Start typing here or paste any text you want to turn into lifelike speech..."
                className="w-full h-64 p-4 rounded-lg border border-gray-300 focus:border-blue-500 focus:outline-none text-gray-900 placeholder-gray-400 resize-none"
                required
              />

              {/* Character Count */}
              <div className="flex justify-between items-center mt-2">
                <div className="flex space-x-4 text-sm text-gray-600">
                  <span>{input.length} / 5,000 characters</span>
                </div>
                {generatedAudioUrl && (
                  <button
                    type="submit"
                    disabled={loading}
                    className={`px-4 py-2 rounded-lg font-semibold text-white transition duration-300 ${
                      loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600"
                    }`}
                  >
                    {loading ? "Generating..." : "Regenerate speech"}
                  </button>
                )}
              </div>
            </form>

            {/* Generated Audio Section */}
            {generatedAudioUrl && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-orange-500"></span>
                  <span className="text-sm text-gray-600">
                    {voice} •{" "}
                    {currentAudioTimestamp
                      ? formatDistanceToNow(new Date(currentAudioTimestamp)) +
                        " ago"
                      : "Created now"}
                  </span>
                </div>
                <div className="flex-1 flex items-center space-x-2">
                  <button
                    onClick={togglePlayPause}
                    className="focus:outline-none"
                  >
                    <svg
                      className="w-6 h-6 text-gray-600"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {isPlaying ? (
                        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                      ) : (
                        <path d="M8 5v14l11-7z" />
                      )}
                    </svg>
                  </button>
                  <audio
                    ref={audioRef}
                    src={generatedAudioUrl}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    className="hidden"
                  />
                  <div className="flex-1">
                    <div className="text-sm text-gray-600">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </div>
                    <input
                      type="range"
                      min="0"
                      max={duration || 0}
                      value={currentTime}
                      onChange={handleTimelineChange}
                      className="w-full h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #007bff ${
                          (currentTime / (duration || 1)) * 100
                        }%, #d1d5db ${(currentTime / (duration || 1)) * 100}%)`,
                      }}
                    />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="text-gray-600 hover:text-gray-900">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8.445 14.832A1 1 0 0010 14v-4a1 1 0 00-1.555-.832l-4 3a1 1 0 000 1.664l4 3zM15.555 9.168A1 1 0 0014 10v4a1 1 0 001.555.832l4-3a1 1 0 000-1.664l-4-3z"
                      />
                    </svg>
                  </button>
                  <a
                    href={generatedAudioUrl}
                    download={`speech-${Date.now()}.mp3`}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                  </a>
                  <button className="text-gray-600 hover:text-gray-900">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Section: Settings/History Panel */}
          <div className="w-full md:w-1/3 bg-gray-50 rounded-lg p-4 shadow-sm">
            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-4">
              <button
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === "settings"
                    ? "text-blue-500 border-b-2 border-blue-500"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => setActiveTab("settings")}
              >
                Settings
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === "history"
                    ? "text-blue-500 border-b-2 border-blue-500"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => setActiveTab("history")}
              >
                History
              </button>
            </div>

            {activeTab === "settings" ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Voice Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Voice
                  </label>
                  <div className="relative">
                    <select
                      value={voice}
                      onChange={(e) => setVoice(e.target.value)}
                      className="w-full p-2 rounded-lg border border-gray-300 text-gray-600 focus:border-blue-500 focus:outline-none appearance-none"
                    >
                      {Object.values(VOICES).map((voice) => (
                        <option key={voice.name} value={voice.name}>
                          {voice.name}
                        </option>
                      ))}
                    </select>
                    <svg
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>

                {/* Model Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Model
                  </label>
                  <div className="relative">
                    <select
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      className="w-full p-2 rounded-lg border border-gray-300 text-gray-600 focus:border-blue-500 focus:outline-none appearance-none"
                    >
                      <option value="Eleven Turbo v2.5">
                        Eleven Turbo v2.5
                      </option>
                    </select>
                    <svg
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>

                {/* Speed Slider */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Speed
                  </label>
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Slower</span>
                    <span>Faster</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={speed}
                    onChange={(e) => setSpeed(parseFloat(e.target.value))}
                    className="w-full h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #007bff ${
                        ((speed - 0.5) / 1.5) * 100
                      }%, #d1d5db ${((speed - 0.5) / 1.5) * 100}%)`,
                    }}
                  />
                </div>

                {/* Stability Slider */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Stability
                  </label>
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>More variable</span>
                    <span>More stable</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={stability}
                    onChange={(e) => setStability(parseFloat(e.target.value))}
                    className="w-full h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #007bff ${
                        (stability / 1) * 100
                      }%, #d1d5db ${(stability / 1) * 100}%)`,
                    }}
                  />
                </div>

                {/* Similarity Slider */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Similarity
                  </label>
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Low</span>
                    <span>High</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={similarity}
                    onChange={(e) => setSimilarity(parseFloat(e.target.value))}
                    className="w-full h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #007bff ${
                        (similarity / 1) * 100
                      }%, #d1d5db ${(similarity / 1) * 100}%)`,
                    }}
                  />
                </div>

                {/* Reset Values */}
                <div className="text-right">
                  <button
                    type="button"
                    onClick={resetSettings}
                    className="text-blue-500 hover:text-blue-600 text-sm"
                  >
                    Reset values
                  </button>
                </div>

                {/* Generate Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 rounded-lg font-semibold text-white transition duration-300 ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-black hover:bg-gray-800"
                  }`}
                >
                  {loading ? "Generating..." : "Generate"}
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search history..."
                    className="w-full p-2 rounded-lg border border-gray-300 text-gray-600 focus:border-blue-500 focus:outline-none"
                  />
                  <svg
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>

                {/* History Entries */}
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {filteredHistory.length === 0 ? (
                    <p className="text-gray-400 text-center">No history yet</p>
                  ) : (
                    <>
                      {groupedHistory.today.length > 0 && (
                        <>
                          <h3 className="text-sm font-semibold text-gray-600">
                            Today
                          </h3>
                          {groupedHistory.today.map((item, index) => (
                            <div
                              key={index}
                              className="p-3 rounded-lg bg-white border border-gray-200 hover:bg-gray-100 cursor-pointer"
                            >
                              <div className="flex justify-between items-center">
                                <div
                                  onClick={() => {
                                    setInput(item.text);
                                    setVoice(item.voice);
                                    setSpeed(item.speed || 1);
                                    setStability(item.stability || 0.5);
                                    setSimilarity(item.similarity || 0.75);
                                    setGeneratedAudioUrl(item.audioData);
                                    setCurrentAudioTimestamp(item.timestamp);
                                    setActiveTab("settings");
                                  }}
                                  className="flex-1"
                                >
                                  <p className="text-gray-900 line-clamp-1">
                                    {item.text}
                                  </p>
                                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                                    <span
                                      className={`w-3 h-3 rounded-full ${
                                        item.voice === "George"
                                          ? "bg-orange-500"
                                          : item.voice === "Antoni"
                                          ? "bg-green-500"
                                          : item.voice === "Emily"
                                          ? "bg-pink-500"
                                          : item.voice === "Callum"
                                          ? "bg-orange-500"
                                          : item.voice === "Adam"
                                          ? "bg-blue-500"
                                          : "bg-blue-500"
                                      }`}
                                    ></span>
                                    <span>{item.voice}</span>
                                    <span>·</span>
                                    <span>
                                      {formatDistanceToNow(
                                        new Date(item.timestamp)
                                      )}{" "}
                                      ago
                                    </span>
                                  </div>
                                </div>
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() =>
                                      handleHistoryPlayback(
                                        item,
                                        `today-${index}`
                                      )
                                    }
                                    className="text-gray-600 hover:text-gray-900"
                                  >
                                    <svg
                                      className="w-5 h-5"
                                      fill="currentColor"
                                      viewBox="0 0 24 24"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path d="M8 5v14l11-7z" />
                                    </svg>
                                  </button>
                                  <button className="text-gray-600 hover:text-gray-900">
                                    <svg
                                      className="w-5 h-5"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M8.445 14.832A1 1 0 0010 14v-4a1 1 0 00-1.555-.832l-4 3a1 1 0 000 1.664l4 3zM15.555 9.168A1 1 0 0014 10v4a1 1 0 001.555.832l4-3a1 1 0 000-1.664l-4-3z"
                                      />
                                    </svg>
                                  </button>
                                  <a
                                    href={item.audioData}
                                    download={`speech-${Date.now()}.mp3`}
                                    className={`text-gray-600 hover:text-gray-900 ${
                                      !item.audioData
                                        ? "opacity-50 cursor-not-allowed"
                                        : ""
                                    }`}
                                    onClick={(e) =>
                                      !item.audioData && e.preventDefault()
                                    }
                                  >
                                    <svg
                                      className="w-5 h-5"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                      />
                                    </svg>
                                  </a>
                                  <button
                                    onClick={() => handleDeleteHistory(index)}
                                    className="text-red-600 hover:text-red-800"
                                  >
                                    <svg
                                      className="w-5 h-5"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                      />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                              {item.audioData && (
                                <audio
                                  ref={(el) =>
                                    (historyAudioRefs.current[
                                      `today-${index}`
                                    ] = el)
                                  }
                                  src={item.audioData}
                                  className="hidden"
                                />
                              )}
                            </div>
                          ))}
                        </>
                      )}
                      {groupedHistory.yesterday.length > 0 && (
                        <>
                          <h3 className="text-sm font-semibold text-gray-600 mt-4">
                            Yesterday
                          </h3>
                          {groupedHistory.yesterday.map((item, index) => (
                            <div
                              key={index}
                              className="p-3 rounded-lg bg-white border border-gray-200 hover:bg-gray-100 cursor-pointer"
                            >
                              <div className="flex justify-between items-center">
                                <div
                                  onClick={() => {
                                    setInput(item.text);
                                    setVoice(item.voice);
                                    setSpeed(item.speed || 1);
                                    setStability(item.stability || 0.5);
                                    setSimilarity(item.similarity || 0.75);
                                    setGeneratedAudioUrl(item.audioData);
                                    setCurrentAudioTimestamp(item.timestamp);
                                    setActiveTab("settings");
                                  }}
                                  className="flex-1"
                                >
                                  <p className="text-gray-900 line-clamp-1">
                                    {item.text}
                                  </p>
                                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                                    <span
                                      className={`w-3 h-3 rounded-full ${
                                        item.voice === "George"
                                          ? "bg-orange-500"
                                          : item.voice === "Antoni"
                                          ? "bg-green-500"
                                          : item.voice === "Emily"
                                          ? "bg-pink-500"
                                          : item.voice === "Callum"
                                          ? "bg-orange-500"
                                          : item.voice === "Adam"
                                          ? "bg-blue-500"
                                          : "bg-blue-500"
                                      }`}
                                    ></span>
                                    <span>{item.voice}</span>
                                    <span>·</span>
                                    <span>
                                      {formatDistanceToNow(
                                        new Date(item.timestamp)
                                      )}{" "}
                                      ago
                                    </span>
                                  </div>
                                </div>
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() =>
                                      handleHistoryPlayback(
                                        item,
                                        `yesterday-${index}`
                                      )
                                    }
                                    className="text-gray-600 hover:text-gray-900"
                                  >
                                    <svg
                                      className="w-5 h-5"
                                      fill="currentColor"
                                      viewBox="0 0 24 24"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path d="M8 5v14l11-7z" />
                                    </svg>
                                  </button>
                                  <button className="text-gray-600 hover:text-gray-900">
                                    <svg
                                      className="w-5 h-5"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M8.445 14.832A1 1 0 0010 14v-4a1 1 0 00-1.555-.832l-4 3a1 1 0 000 1.664l4 3zM15.555 9.168A1 1 0 0014 10v4a1 1 0 001.555.832l4-3a1 1 0 000-1.664l-4-3z"
                                      />
                                    </svg>
                                  </button>
                                  <a
                                    href={item.audioData}
                                    download={`speech-${Date.now()}.mp3`}
                                    className={`text-gray-600 hover:text-gray-900 ${
                                      !item.audioData
                                        ? "opacity-50 cursor-not-allowed"
                                        : ""
                                    }`}
                                    onClick={(e) =>
                                      !item.audioData && e.preventDefault()
                                    }
                                  >
                                    <svg
                                      className="w-5 h-5"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                      />
                                    </svg>
                                  </a>
                                  <button
                                    onClick={() => handleDeleteHistory(index)}
                                    className="text-red-600 hover:text-red-800"
                                  >
                                    <svg
                                      className="w-5 h-5"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                      />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                              {item.audioData && (
                                <audio
                                  ref={(el) =>
                                    (historyAudioRefs.current[
                                      `yesterday-${index}`
                                    ] = el)
                                  }
                                  src={item.audioData}
                                  className="hidden"
                                />
                              )}
                            </div>
                          ))}
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style>{`
        /* Custom range input styling */
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          background: #fff;
          border: 2px solid #007bff;
          border-radius: 50%;
          cursor: pointer;
        }
        input[type="range"]::-moz-range-thumb {
          width: 16px;
          height: 16px;
          background: #fff;
          border: 2px solid #007bff;
          border-radius: 50%;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default TextToSpeech;
