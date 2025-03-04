import gsap from "gsap";
import { useState, useRef, useEffect } from "react";
import { Navbar } from "./Navbar";
import axiosInstance from "../api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
    { name: "FLUX", api: "http://localhost:8080/api/tools/model3" },
    { name: "FLUX-RealismLora", api: "http://localhost:8080/api/tools/model4" },
  ];

  const styles = [
    {
      name: "Default",
      description: "Create an image from a text input using AI models.",
      thumbnail: "assets/images/blue.jpg",
    },
    {
      name: "Cartoon",
      description: "Generate images with a fun and cartoonish style.",
      thumbnail: "assets/images/cartoon.jpg",
    },
    {
      name: "Realistic",
      description: "Produce high-quality realistic images.",
      thumbnail: "assets/images/realistic.png",
    },
    {
      name: "Fantasy",
      description: "Bring your fantasy worlds to life with vivid imagery.",
      thumbnail: "assets/images/fantasy.jpg",
    },
    {
      name: "Cyberpunk",
      description: "Generate an image in cyberpunk style.",
      thumbnail: "assets/images/cyberpunk.png",
    },
    {
      name: "Abstract",
      description: "Create abstract art with unique shapes and colors.",
      thumbnail: "assets/images/abstract.jpg",
    },
  ];

  const leftSection = useRef(null);
  const rightSection = useRef(null);
  const modelRefs = useRef([]);
  const styleRefs = useRef([]);

  const handleModelClick = (model, index) => {
    setApiEndpoint(model.api);
    gsap.fromTo(
      modelRefs.current[index],
      { scale: 1 },
      { scale: 1.2, duration: 0.2, yoyo: true, repeat: 1, ease: "power1.out" }
    );
  };

  const handleStyleClick = (style, index) => {
    setSelectedStyle(style.name);
    gsap.fromTo(
      styleRefs.current[index],
      { rotate: 0 },
      { rotate: 15, duration: 0.2, yoyo: true, repeat: 1, ease: "power1.out" }
    );
  };

  useEffect(() => {
    gsap.fromTo(
      leftSection.current,
      { opacity: 0, x: -100 },
      { opacity: 1, x: 0, duration: 1, ease: "power2.out" }
    );
    gsap.fromTo(
      rightSection.current,
      { opacity: 0, x: 100 },
      { opacity: 1, x: 0, duration: 1, ease: "power2.out", delay: 0.5 }
    );
  }, []);

  const query = async () => {
    setLoading(true);
    setImageSrc("");

    try {
      const styleDescription =
        styles.find((style) => style.name === selectedStyle)?.description || "";
      const fullInput = `${styleDescription} ${input}`;

      const response = await axiosInstance.post(
        apiEndpoint,
        { input: fullInput, style: selectedStyle },
        { responseType: "blob" }
      );

      const objectURL = URL.createObjectURL(response.data);
      setImageSrc(objectURL);

      toast.success("Image generated successfully! 🎉");
    } catch (err) {
      console.error("Error generating image:", err);
      toast.error(err.response?.data?.error || "Error generating image");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = () => {
    if (!input.trim()) {
      toast.error("Please enter a prompt.");
      return;
    }
    query();
  };

  return (
    <>
      <div className="bg-gradient-to-br from-black via-gray-600 to-black text-white min-h-screen flex items-center flex-col">
        <Navbar />
        <div className="flex w-[90%] max-w-[1200px] rounded-2xl shadow-lg overflow-hidden my-6">
          <div ref={leftSection} className="flex-1 p-8 flex flex-col gap-5">
            <h3 className="text-lg font-semibold">Choose a Model</h3>
            <div className="flex gap-2">
              {models.map((model, index) => (
                <button
                  key={model.name}
                  ref={(el) => (modelRefs.current[index] = el)}
                  onClick={() => handleModelClick(model, index)}
                  className={`px-4 py-2 rounded-md text-sm ${
                    apiEndpoint === model.api
                      ? "border-2 border-[#6c63ff] bg-[#6c63ff]"
                      : "border border-gray-700 bg-gray-800"
                  }`}
                >
                  {model.name}
                </button>
              ))}
            </div>

            <h3 className="text-lg font-semibold">Choose a Style</h3>
            <div className="flex gap-2">
              {styles.map((styleOption, index) => (
                <button
                  key={styleOption.name}
                  ref={(el) => (styleRefs.current[index] = el)}
                  onClick={() => handleStyleClick(styleOption, index)}
                  className={`p-0 border-2 rounded-xl transition ${
                    selectedStyle === styleOption.name
                      ? "border-[#6c63ff]"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={styleOption.thumbnail}
                    alt={styleOption.name}
                    className="w-[60px] h-[60px] rounded-lg object-cover"
                  />
                </button>
              ))}
            </div>

            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter your prompt"
              rows="5"
              className="p-4 w-full border border-gray-700 rounded-lg bg-gray-800 text-white text-base resize-y"
            ></textarea>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className={`px-6 py-3 text-white rounded-lg text-base ${
                loading
                  ? "bg-gray-700 cursor-not-allowed"
                  : "bg-[#6c63ff] hover:bg-[#5753ff] cursor-pointer"
              }`}
            >
              {loading ? "Loading..." : "Generate"}
            </button>
          </div>

          <div
            ref={rightSection}
            className="flex-1 flex justify-center items-center bg-gradient-to-br from-black via-gray-600 to-black rounded-2xl"
          >
            {loading ? (
              <p className="text-white">Generating image...</p>
            ) : imageSrc ? (
              <img
                src={imageSrc}
                alt="Generated"
                className="w-full h-full object-cover rounded-2xl border"
              />
            ) : (
              <p className="text-gray-400">No image generated yet.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TextToImage;
