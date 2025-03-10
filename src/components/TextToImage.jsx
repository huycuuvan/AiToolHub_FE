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

  const models = [
    {
      name: "Stable Diffusion 1.0",
      api: "http://localhost:8080/api/tools/model1",
    },
    {
      name: "Stable Diffusion 3.5",
      api: "http://localhost:8080/api/tools/model2",
    },
    { name: "FLUX-2.0", api: "http://localhost:8080/api/tools/model3" },
    { name: "FLUX-1.0", api: "http://localhost:8080/api/tools/model4" },
  ];

  const styles = [
    { name: "Default", thumbnail: "assets/images/blue.jpg" },
    { name: "Cartoon", thumbnail: "assets/images/cartoon.jpg" },
    { name: "Realistic", thumbnail: "assets/images/realistic.png" },
    { name: "Fantasy", thumbnail: "assets/images/fantasy.jpg" },
    { name: "Cyberpunk", thumbnail: "assets/images/cyberpunk.png" },
    { name: "Abstract", thumbnail: "assets/images/abstract.jpg" },
  ];

  // Refs cho GSAP
  const modelRef = useRef(null);
  const styleRef = useRef(null);
  const promptRef = useRef(null);
  const generateButtonRef = useRef(null);
  const imageContainerRef = useRef(null);

  useEffect(() => {
    // Hiệu ứng xuất hiện khi tải trang
    gsap.fromTo(
      modelRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
    );
    gsap.fromTo(
      styleRef.current,
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 1, ease: "power2.out", delay: 0.3 }
    );
    gsap.fromTo(
      promptRef.current,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 1, ease: "back.out(1.7)", delay: 0.6 }
    );
    gsap.fromTo(
      generateButtonRef.current,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)", delay: 1 }
    );
  }, []);

  const handleModelClick = (model) => {
    setApiEndpoint(model.api);
    toast.info(`Switched to ${model.name}`);
  };

  const handleStyleClick = (style) => {
    setSelectedStyle(style.name);
  };

  const query = async () => {
    if (!input.trim()) {
      toast.warn("⚠️ Please enter a prompt!");
      return;
    }

    setLoading(true);
    setImageSrc("");

    // Hiệu ứng shake nhẹ khi click vào nút Generate
    gsap.to(generateButtonRef.current, {
      x: -5,
      repeat: 5,
      yoyo: true,
      duration: 0.1,
    });

    try {
      const response = await axiosInstance.post(
        apiEndpoint,
        { input, style: selectedStyle },
        { responseType: "blob" }
      );
      setImageSrc(URL.createObjectURL(response.data));
      toast.success("Image generated successfully!");

      // Hiệu ứng fade-in cho ảnh khi tạo thành công
      setTimeout(() => {
        gsap.fromTo(
          imageContainerRef.current,
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" }
        );
      }, 200);
    } catch (err) {
      toast.error(err.response?.data?.error || "Error generating image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-black via-gray-900 to-black min-h-screen text-white flex flex-col items-center">
      <Navbar />
      <div className="flex flex-col lg:flex-row w-full max-w-5xl p-6 rounded-xl shadow-2xl bg-gray-800 mt-8 border border-gray-700 mt-8 absolute top-[15%]">
        <div ref={modelRef} className="flex-1 p-6">
          <h3 className="text-xl font-bold">Choose a Model</h3>
          <div className="grid grid-cols-2 gap-3 mt-3">
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
          <h3 className="text-xl font-bold mt-6">Choose a Style</h3>
          <div ref={styleRef} className="flex gap-3 overflow-x-auto mt-3 p-1">
            {styles.map((style) => (
              <div key={style.name} className="flex flex-col items-center">
                {/* Ảnh Thumbnail */}
                <img
                  src={style.thumbnail}
                  alt={style.name}
                  onClick={() => handleStyleClick(style)}
                  className={`w-16 h-16 object-cover rounded-lg cursor-pointer transition-all ${
                    selectedStyle === style.name
                      ? "ring-4 ring-indigo-500 scale-105"
                      : "hover:opacity-80"
                  }`}
                />
                {/* Hiển thị tên Style */}
                <span
                  className={`mt-1 text-sm ${
                    selectedStyle === style.name
                      ? "text-indigo-400 font-bold"
                      : "text-gray-300"
                  }`}
                >
                  {style.name}
                </span>
              </div>
            ))}
          </div>

          <textarea
            ref={promptRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter your prompt"
            className="w-full p-3 mt-4 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-indigo-500 focus:outline-none"
            rows="3"
          />
          <button
            ref={generateButtonRef}
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
        <div
          ref={imageContainerRef}
          className="flex-1 flex items-center justify-center bg-gray-700 rounded-xl p-6 border border-gray-600"
        >
          {loading ? (
            <Loader />
          ) : imageSrc ? (
            <img
              src={imageSrc}
              alt="Generated"
              className="max-w-full max-h-96 rounded-xl shadow-lg"
            />
          ) : (
            <p className="text-gray-400">No image generated yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TextToImage;
