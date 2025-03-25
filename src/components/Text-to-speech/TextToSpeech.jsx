import { useState, useRef, useEffect } from "react";
import { Navbar } from "../Navbar";
import gsap from "gsap";
import { toast } from "react-toastify";
import { saveToHistory, getHistory } from "../../utils/localStorage";

const TextToSpeech = () => {
  const [activeTab, setActiveTab] = useState("settings");
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState("");
  // First, add the voice options enum at the top of the file
  const VOICES = {
    ADAM: { name: "Adam", id: "pNInz6obpgDQGcFmaJgB" },
    ALICE: { name: "Alice", id: "Xb7hH8MSUJpSbSDYk0k2" },
    ANTONI: { name: "Antoni", id: "ErXwobaYiN019PkySvjV" },
    ARIA: { name: "Aria", id: "ErXwobaYiN019PkySvjV" },
    ARNOLD: { name: "Arnold", id: "VR6AewLTigWG4xSOukaG" },
    BILL: { name: "Bill", id: "pqHfZKP75CvOlQylNhV4" },
    CALLUM: { name: "Callum", id: "N2lVS1w4EtoT3dr4eOWO" },
    ELLI: { name: "Elli", id: "MF3mGyEYCl7XYWbV9V6O" },
    EMILY: { name: "Emily", id: "LcfcDJNUP1GQjkzn1xUU" },
    FREYA: { name: "Freya", id: "jsCqWAovK2LkecY7zXl4" },
    SARAH: { name: "Sarah", id: "EXAVITQu4vr4xnSDxMaL" },
    SERENA: { name: "Serena", id: "pMsXgVXv3BLzUgSXRplE" },
    THOMAS: { name: "Thomas", id: "GBv7mTt0atIp3Br8iCZE" },
    MICHAEL: { name: "Michael", id: "flq6f7yk4E4fJM5XTYuZ" },
    ETHAN: { name: "Ethan", id: "g5CIjZEefAph4nQFvHAz" },
    GEORGE: { name: "George", id: "Yko7PKHZNXotIFUBG7I9" },
    PAUL: { name: "Paul", id: "5Q0t7uMcjvnagumLfvZi" },
    GIGI: { name: "Gigi", id: "jBpfuIE2acCO8z3wKNLl" },
    SANTA_CLAUS: { name: "Santa Claus", id: "knrPHWnBmmDHMoiMeP3l" },
  };

  // Update the initial voice state to use the first voice
  const [voice, setVoice] = useState(VOICES.ADAM.name);
  const [speed, setSpeed] = useState(1);
  const [stability, setStability] = useState(0.5);
  const [similarity, setSimilarity] = useState(0.75);
  const [styleExaggeration, setStyleExaggeration] = useState(0);
  const [speakerBoost, setSpeakerBoost] = useState(false);
  const [loading, setLoading] = useState(false);

  const containerRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
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
    setHistory(getHistory());
  }, []);

  // Update the select element in the settings section
  <select
    value={voice}
    onChange={(e) => setVoice(e.target.value)}
    className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
  >
    {Object.values(VOICES).map((voice) => (
      <option key={voice.id} value={voice.name}>
        {voice.name}
      </option>
    ))}
  </select>;

  // Update the handleSubmit function to include the voice ID
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) {
      toast.warning("Please enter some text");
      return;
    }

    setLoading(true);
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
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate speech");
      }

      const blob = await response.blob();
      const audioUrl = URL.createObjectURL(blob); // Create an audio URL
      const audio = new Audio(audioUrl);
      audio.play();

      // Save audio URL to history
      saveToHistory(input, voice, blob, audioUrl); // Save audioUrl as part of history
      setHistory(getHistory());
      toast.success("Speech generated successfully!");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-600 to-black">
      <Navbar />
      <div className="pt-20 px-4 max-w-7xl mx-auto">
        <h1
          ref={titleRef}
          className="text-4xl font-bold text-white text-center mb-8"
        >
          Text to Speech
        </h1>

        <div
          ref={containerRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Left Column - Input */}
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Start typing here or paste any text you want to turn into lifelike speech..."
              className="w-full h-[calc(100vh-300px)] p-4 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
              required
            />
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`w-full mt-4 py-3 rounded-lg text-white transition duration-300 ${
                loading
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Generating..." : "Generate Speech"}
            </button>
          </div>

          {/* Right Column - Settings/History Tabs */}
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
            <div className="flex border-b border-gray-700 mb-6">
              <button
                className={`px-4 py-2 ${
                  activeTab === "settings"
                    ? "text-white border-b-2 border-blue-500"
                    : "text-gray-400 hover:text-white"
                }`}
                onClick={() => setActiveTab("settings")}
              >
                Settings
              </button>
              <button
                className={`px-4 py-2 ${
                  activeTab === "history"
                    ? "text-white border-b-2 border-blue-500"
                    : "text-gray-400 hover:text-white"
                }`}
                onClick={() => setActiveTab("history")}
              >
                History
              </button>
            </div>

            {activeTab === "settings" ? (
              <>
                <div className="space-y-6">
                  <div>
                    <label className="block text-white mb-2">Voice</label>
                    <select
                      value={voice}
                      onChange={(e) => setVoice(e.target.value)}
                      className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
                    >
                      <option value="Adam">Adam</option>
                      <option value="Alice">Alice</option>
                      <option value="Antoni">Antoni</option>
                      <option value="Aria">Aria</option>
                      <option value="Arnold">Arnold</option>
                      <option value="Bill">Bill</option>
                      <option value="Callum">Callum</option>
                      <option value="Elli">Elli</option>
                      <option value="Emily">Emily</option>
                      <option value="Freya">Freya</option>
                      <option value="Sarah">Sarah</option>
                      <option value="Serena">Serena</option>
                      <option value="Thomas">Thomas</option>
                      <option value="Michael">Michael</option>
                      <option value="Ethan">Ethan</option>
                      <option value="George">George</option>
                      <option value="Paul">Paul</option>
                      <option value="Gigi">Gigi</option>
                      <option value="Santa Claus">Santa Claus</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white mb-2">Speed</label>
                    <div className="flex justify-between text-gray-400 text-sm mb-1">
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
                      className="w-full accent-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-white mb-2">Stability</label>
                    <div className="flex justify-between text-gray-400 text-sm mb-1">
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
                      className="w-full accent-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-white mb-2">Similarity</label>
                    <div className="flex justify-between text-gray-400 text-sm mb-1">
                      <span>Low</span>
                      <span>High</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={similarity}
                      onChange={(e) =>
                        setSimilarity(parseFloat(e.target.value))
                      }
                      className="w-full accent-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-white mb-2">
                      Style Exaggeration
                    </label>
                    <div className="flex justify-between text-gray-400 text-sm mb-1">
                      <span>None</span>
                      <span>Exaggerated</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={styleExaggeration}
                      onChange={(e) =>
                        setStyleExaggeration(parseFloat(e.target.value))
                      }
                      className="w-full accent-blue-500"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center text-white cursor-pointer">
                      <input
                        type="checkbox"
                        checked={speakerBoost}
                        onChange={(e) => setSpeakerBoost(e.target.checked)}
                        className="mr-2 accent-blue-500"
                      />
                      Speaker boost
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setSpeed(1);
                        setStability(0.5);
                        setSimilarity(0.75);
                        setStyleExaggeration(0);
                        setSpeakerBoost(false);
                      }}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      Reset values
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 rounded-lg text-white transition duration-300 ${
                    loading
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-gray-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 shadow-md hover:shadow-lg"
                  }`}
                >
                  {loading ? "Generating..." : "Generate Speech"}
                </button>
              </>
            ) : (
              <div className="space-y-4 h-[calc(100vh-300px)] overflow-y-auto">
                {history.length === 0 ? (
                  <p className="text-gray-400 text-center">No history yet</p>
                ) : (
                  history.map((item, index) => (
                    <div
                      key={index}
                      className="bg-gray-700 p-4 rounded-lg cursor-pointer hover:bg-gray-600"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-blue-400">{item.voice}</span>
                        <span className="text-gray-400 text-sm">
                          {new Date(item.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-white line-clamp-2 mb-2">
                        {item.text}
                      </p>
                      <div className="flex justify-between items-center">
                        <audio
                          controls
                          src={item.audioUrl}
                          className="w-full h-8"
                        >
                          Your browser does not support the audio element.
                        </audio>
                        <button
                          className="ml-2 text-blue-400 hover:text-blue-300"
                          onClick={() => {
                            setInput(item.text);
                            setVoice(item.voice);
                            setActiveTab("settings");
                          }}
                        >
                          Reuse
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextToSpeech;
