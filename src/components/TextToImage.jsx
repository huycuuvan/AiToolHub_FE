import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { Navbar } from "./Navbar";
import axiosInstance from "../api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "./Loader";

export const TextToImage = () => {
  const [input, setInput] = useState("");
  const [imageSrc, setImageSrc] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState("Default");
  const [apiEndpoint, setApiEndpoint] = useState(
    "http://localhost:8080/api/tools/model1"
  );
  const [history, setHistory] = useState([]);
  const [modalImage, setModalImage] = useState(null);
  const [generationTime, setGenerationTime] = useState(null); // Track generation time
  const [numInferenceSteps, setNumInferenceSteps] = useState(28); // Default 28

  const models = [
    {
      name: "Stable Diffusion 1.0",
      api: "http://localhost:8080/api/tools/model1",
    },
    {
      name: "Stable Diffusion 3.5",
      api: "http://localhost:8080/api/tools/model2",
    },
  ];

  const styles = [
    { name: "Default", thumbnail: "assets/images/blue.jpg" },
    { name: "Cartoon", thumbnail: "assets/images/cartoon.jpg" },
    { name: "Realistic", thumbnail: "assets/images/realistic.png" },
    { name: "Fantasy", thumbnail: "assets/images/fantasy.jpg" },
    { name: "Cyberpunk", thumbnail: "assets/images/cyberpunk.png" },
    { name: "Abstract", thumbnail: "assets/images/abstract.jpg" },
    { name: "Origami", thumbnail: "assets/images/origami-dragon.jpg" },
    { name: "Pixel Art", thumbnail: "assets/images/pixel-art.jpg" },
    { name: "Anime", thumbnail: "assets/images/anime.jpg" },
    { name: "Chibi", thumbnail: "assets/images/chibi.png" },
    { name: "3D", thumbnail: "assets/images/3d.jpg" },
    { name: "Watercolor", thumbnail: "assets/images/watercolor.jpg" },
    { name: "Oil Painting", thumbnail: "assets/images/oilpainting.jpg" },
    { name: "Sketch", thumbnail: "assets/images/sketch.jpg" },
    { name: "Glitch Art", thumbnail: "assets/images/glitch-art.jpg" },
    { name: "Steampunk", thumbnail: "assets/images/steampunk.jpg" },
    { name: "Sci-Fi", thumbnail: "assets/images/sci-fi.jpg" },
    { name: "Vaporwave", thumbnail: "assets/images/vaporwave.jpg" },
    { name: "Comic", thumbnail: "assets/images/comicbook.png" },
    { name: "Psychedelic", thumbnail: "assets/images/Psychedelic.png" },
    { name: "Mythological", thumbnail: "assets/images/Mythological.jpg" },
    { name: "Minimalist", thumbnail: "assets/images/Minimalist.jpg" },
  ];

  const negativePrompts = {
    Default: "distorted",
    Cartoon: "realistic, photo, ultra detail",
    Realistic:
      "unnatural colors, bad skin texture, plastic-like, uncanny valley, cartoon, anime, painting, abstract",
    Fantasy: "washed out colors, low contrast, lack of depth, bad anatomy",
    Cyberpunk:
      "muted colors, boring composition, lack of neon glow, bad reflections",
    Abstract: "realistic, structured, organized",
    Origami: "distorted, too detailed",
    "Pixel Art": "realistic, soft details, high resolution",
    Anime:
      "low detail, blurry lines, messy shading, bad anatomy, off-model, extra limbs",
    "3D": "flat, pixelated, hand-drawn",
    Watercolor: "sharp details, high contrast, digital rendering",
    "Oil Painting": "photorealistic, sharp details, digital effects",
    Sketch: "colorful, ultra detail, high resolution, realistic textures",
    "Glitch Art": "smooth, clean lines, high detail, natural colors",
    Steampunk: "modern, futuristic, minimalistic, soft details",
    "Sci-Fi": "old, outdated, low-tech, blurry details",
    Vaporwave: "sharp contrast, high realism, non-pastel colors",
    "Comic Book": "photo-realistic, soft edges, pastel colors",
    Psychedelic: "muted colors, lack of surreal elements, low contrast",
    Mythological: "modern, sci-fi, cyberpunk, futuristic, digital look",
    Minimalist: "high detail, complex background, realistic textures",
  };

  // Refs for animations
  const formRef = useRef(null);
  const imageRef = useRef(null);
  const historyRef = useRef(null);

  useEffect(() => {
    try {
      const savedHistory = JSON.parse(
        localStorage.getItem("imageHistory") || "[]"
      );
      if (Array.isArray(savedHistory)) {
        setHistory(savedHistory);
      }
    } catch (e) {
      console.error("Error parsing localStorage imageHistory:", e);
      setHistory([]); // Clear if invalid
    }

    // GSAP animations
    if (formRef.current && historyRef.current) {
      gsap.fromTo(
        formRef.current,
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 1, ease: "power2.out" }
      );
      gsap.fromTo(
        historyRef.current,
        { opacity: 0, x: 30 },
        { opacity: 1, x: 0, duration: 1, ease: "power2.out" }
      );
    }
  }, []);

  const handleModelClick = (model) => {
    setApiEndpoint(model.api);
    toast.info(`Switched to ${model.name}`);
  };

  const handleStyleClick = (style) => {
    setSelectedStyle(style.name);
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this image? Yes or No"
    );
    if (confirmDelete) {
      const updatedHistory = history.filter((entry) => entry.id !== id);
      setHistory(updatedHistory);
      localStorage.setItem("imageHistory", JSON.stringify(updatedHistory));
      toast.info("Image deleted successfully!");
    }
  };

  const query = async () => {
    if (!input.trim()) {
      toast.warn("⚠️ Please enter a prompt!");
      return;
    }

    setLoading(true);
    setImageSrc("");
    const startTime = Date.now(); // Start timer

    // Get the negative prompt for the selected style
    const negativePrompt = negativePrompts[selectedStyle] || "";

    // Combine the user input with the selected style
    const combinedInput =
      selectedStyle === "Default"
        ? input
        : `${input} in ${selectedStyle} style`;

    try {
      const payload = {
        input: combinedInput, // Send the combined input
        negativePrompt,
        numInferenceSteps, // Include the selected inference steps
      };

      const response = await axiosInstance.post(apiEndpoint, payload, {
        responseType: "blob",
      });

      // Convert Blob to Base64 for persistent storage
      const reader = new FileReader();
      reader.readAsDataURL(response.data);
      reader.onloadend = () => {
        const endTime = Date.now(); // End timer
        const duration = (endTime - startTime) / 1000; // Duration in seconds
        setGenerationTime(duration);

        const newImage = reader.result;
        const historyEntry = {
          id: Date.now(),
          image: newImage,
          prompt: input, // Store the original user input
          style: selectedStyle, // Store the selected style for display
          negativePrompt, // Store negative prompt in history
          numInferenceSteps, // Store inference steps in history
          timestamp: new Date().toISOString(),
          generationTime: duration, // Store duration in history
        };

        const updatedHistory = [historyEntry, ...history];
        setHistory(updatedHistory);
        localStorage.setItem("imageHistory", JSON.stringify(updatedHistory));

        setImageSrc(newImage);
        toast.success("🎨 Image generated successfully!");

        setTimeout(() => {
          if (imageRef.current) {
            gsap.fromTo(
              imageRef.current,
              { opacity: 0, scale: 0.8 },
              { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" }
            );
          }
        }, 200);
      };
    } catch (err) {
      console.error("Error generating image:", err);
      toast.error(err.response?.data?.error || "⚠️ Error generating image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-black via-gray-700 to-black min-h-screen text-white flex flex-col">
      <Navbar />
      <div className="grid grid-cols-12 gap-6 p-6 pt-10 mt-6 max-w-[1800px] xl:max-w-[95%] mx-auto w-full">
        {/* Left Sidebar - Form */}
        <div
          ref={formRef}
          className="col-span-12 md:col-span-4 lg:col-span-3 bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 flex flex-col justify-between"
        >
          {/* Models Section */}
          <h3 className="text-xl font-bold">Choose a Model</h3>
          <div className="grid grid-cols-1 gap-3 mt-3">
            {models.map((model) => (
              <button
                key={model.name}
                onClick={() => handleModelClick(model)}
                className={`p-2 rounded-lg transition-all ${
                  apiEndpoint === model.api
                    ? "bg-indigo-600"
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
              >
                {model.name}
              </button>
            ))}
          </div>

          {/* Styles Section (Flexible Height) */}
          <div className="flex-grow mt-6 min-h-[300px] flex flex-col">
            <h3 className="text-xl font-bold">Choose a Style</h3>
            <div className="mt-3 p-2 border border-gray-700 rounded-lg overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 max-h-[250px]">
              <div className="grid grid-cols-3 gap-3">
                {styles.map((style) => (
                  <div key={style.name} className="flex flex-col items-center">
                    <img
                      src={style.thumbnail}
                      alt={style.name}
                      onClick={() => handleStyleClick(style)}
                      className={`w-16 h-16 lg:w-20 lg:h-20 object-cover rounded-lg cursor-pointer transition-all ${
                        selectedStyle === style.name
                          ? "ring-4 ring-indigo-500 scale-105"
                          : "hover:opacity-80"
                      }`}
                    />
                    <span className="mt-1 text-xs">{style.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Inference Steps Slider */}
          <div className="mt-6">
            <h3 className="text-xl font-bold">Inference Steps</h3>
            <div className="mt-2">
              <input
                type="range"
                min="1"
                max="50"
                value={numInferenceSteps}
                onChange={(e) => setNumInferenceSteps(Number(e.target.value))}
                className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="text-center text-white mt-2">
                Selected: {numInferenceSteps} steps
              </div>
            </div>
          </div>

          {/* Prompt Input & Button (Fixed at Bottom) */}
          <div className="mt-4">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter your prompt"
              className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-indigo-500 focus:outline-none"
              rows="2"
            />
            <button
              onClick={query}
              disabled={loading}
              className={`w-full mt-4 p-3 rounded-lg font-bold text-lg transition-all ${
                loading
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-500"
              }`}
            >
              {loading ? "Generating..." : "Generate"}
            </button>
          </div>
        </div>

        {/* Center - Image Preview */}
        <div className="col-span-12 md:col-span-5 lg:col-span-6 flex items-center justify-center">
          <div
            ref={imageRef}
            className="bg-gray-700 p-8 lg:p-10 rounded-xl border border-gray-600 w-full max-w-[600px] h-[500px] flex items-center justify-center"
          >
            {loading ? (
              <Loader />
            ) : imageSrc ? (
              <img
                src={imageSrc}
                alt="Generated"
                className="w-full h-full object-cover rounded-xl shadow-lg"
              />
            ) : (
              <p className="text-gray-400 text-center">
                No image generated yet.
              </p>
            )}
          </div>
        </div>

        {/* Right Sidebar - History */}
        <div
          ref={historyRef}
          className="col-span-12 md:col-span-4 lg:col-span-3 bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 flex flex-col h-[90vh]"
        >
          <h3 className="text-xl font-bold mb-3">Generated Images</h3>
          <div className="space-y-3 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
            {history.length > 0 ? (
              history.map((entry) => (
                <div
                  key={entry.id}
                  className="bg-gray-700 rounded-lg p-2 shadow-md hover:shadow-lg transition"
                >
                  <div className="relative group">
                    <img
                      src={entry.image}
                      alt={`Generated ${entry.id}`}
                      className="w-full h-[150px] lg:h-[180px] object-cover rounded-lg cursor-pointer transition duration-300 hover:opacity-90"
                    />
                    <div className="absolute inset-0 flex justify-center items-center opacity-0 group-hover:opacity-100 transition duration-300 bg-black/50 rounded-lg">
                      <button
                        onClick={() => setModalImage(entry.image)}
                        className="p-2 bg-white text-black rounded-md mx-2 hover:bg-gray-200 transition"
                      >
                        🔍 View
                      </button>
                      <button
                        onClick={() => handleDelete(entry.id)}
                        className="p-2 bg-red-500 text-white rounded-md mx-2 hover:bg-red-600 transition"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-300 select-text">
                    <p className="text-white">📝 {entry.prompt}</p>
                    <p className="text-indigo-400">🎨 {entry.style}</p>
                    <p className="text-gray-500">
                      ⏳{" "}
                      {new Date(entry.timestamp).toLocaleDateString("en-US", {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}{" "}
                      {new Date(entry.timestamp).toLocaleTimeString()}
                    </p>
                    {entry.generationTime && (
                      <p className="text-gray-500">
                        🕒 Generated in {entry.generationTime.toFixed(2)}{" "}
                        seconds
                      </p>
                    )}
                    {entry.numInferenceSteps && (
                      <p className="text-gray-500">
                        🚀 Inference Steps: {entry.numInferenceSteps}
                      </p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center">No history available.</p>
            )}
          </div>
        </div>
      </div>

      {/* Modal for Viewing Image */}
      {modalImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setModalImage(null)} // Click anywhere to close
        >
          <div
            className="relative bg-gray-800 p-4 rounded-xl max-w-3xl w-full"
            onClick={(e) => e.stopPropagation()} // Prevent modal close when clicking on the image
          >
            <button
              onClick={() => setModalImage(null)}
              className="absolute top-2 right-2 text-white hover:text-gray-300"
            >
              ✕
            </button>
            <img
              src={modalImage}
              alt="Enlarged"
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TextToImage;
