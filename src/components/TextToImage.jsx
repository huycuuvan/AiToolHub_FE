import gsap from "gsap";
import { useState, useRef, useEffect } from "react";
import { Navbar } from "./Navbar";
import axiosInstance from "../api";

export const TextToImage = () => {
  const [input, setInput] = useState(""); // User input
  const [imageSrc, setImageSrc] = useState(""); // Generated image
  const [loading, setLoading] = useState(false); // Loading state
  const [size, setSize] = useState("512x512"); // Default size
  const [selectedStyle, setSelectedStyle] = useState("Default"); // Selected style
  const [selectedModel, setSelectedModel] = useState(null); // Selected model
  const [apiEndpoint, setApiEndpoint] = useState(
    "http://localhost:8080/api/tools/model1"
  ); // Default model API endpoint

  // Define available models
  const models = [
    {
      name: "Stable Diffusion 1.0", //20s~
      api: "http://localhost:8080/api/tools/model1",
    },
    {
      name: "Stable Diffusion 3.5", //42s~
      api: "http://localhost:8080/api/tools/model2",
    },
    {
      name: "FLUX", //2.1m~
      api: "http://localhost:8080/api/tools/model3",
    },
    {
      name: "FLUX-RealismLora", //2.1m-3m
      api: "http://localhost:8080/api/tools/model4",
    },
  ];

  // Define styles with their images and descriptions
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
    setSelectedModel(model);
    setApiEndpoint(model.api);
    // GSAP effect for the clicked model
    gsap.fromTo(
      modelRefs.current[index],
      { scale: 1 },
      { scale: 1.2, duration: 0.2, yoyo: true, repeat: 1, ease: "power1.out" }
    );
  };

  const handleStyleClick = (style, index) => {
    setSelectedStyle(style);
    // GSAP effect for the clicked style
    setSelectedStyle(style.name);
    gsap.fromTo(
      styleRefs.current[index],
      { rotate: 0 },
      { rotate: 15, duration: 0.2, yoyo: true, repeat: 1, ease: "power1.out" }
    );
  };
  useEffect(() => {
    // GSAP Animation for Left Section
    gsap.fromTo(
      leftSection.current,
      { opacity: 0, x: -100 },
      { opacity: 1, x: 0, duration: 1, ease: "power2.out" }
    );

    // GSAP Animation for Right Section
    gsap.fromTo(
      rightSection.current,
      { opacity: 0, x: 100 },
      { opacity: 1, x: 0, duration: 1, ease: "power2.out", delay: 0.5 }
    );
  }, []);
  const query = async () => {
    setLoading(true);
    setImageSrc(""); // Xóa ảnh cũ trước khi tạo ảnh mới

    try {
      // Thêm mô tả style vào input
      const styleDescription =
        styles.find((style) => style.name === selectedStyle)?.description || "";
      const fullInput = `${styleDescription} ${input}`; // Ghép mô tả style với prompt

      // Gọi API backend bằng Axios
      const response = await axiosInstance.post(
        apiEndpoint,
        {
          input: fullInput, // Prompt người dùng
          style: selectedStyle, // Style được chọn
        },
        { responseType: "blob" } // Yêu cầu trả về kiểu blob (ảnh binary)
      );

      // Tạo object URL từ blob ảnh
      const objectURL = URL.createObjectURL(response.data);
      setImageSrc(objectURL); // Lưu URL ảnh để hiển thị
    } catch (err) {
      console.error("Error generating image:", err);
      alert(
        err.response?.data?.error || err.message || "Error generating image"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = () => {
    if (!input.trim()) {
      alert("Please enter a prompt.");
      return;
    }
    query();
  };

  return (
    <>
      <div className="bg-gradient-to-br from-black via-gray-600 to-black text-white min-h-screen flex justify-center items-center flex-col">
        <Navbar />

        <div className="flex w-[90%] max-w-[1200px]  rounded-2xl shadow-lg overflow-hidden my-6">
          {/* Left Section */}
          <div ref={leftSection} className="flex-1 p-8 flex flex-col gap-5">
            {/* Model Selection */}
            <h3 className="text-lg font-semibold">Choose a Model</h3>
            <div className="flex gap-2">
              {models.map((model, index) => (
                <button
                  key={model}
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

            {/* Style Selection */}
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

            {/* Dynamic Title and Description */}
            <h1 className="text-left text-xl font-bold">
              {selectedStyle} Image Generator
            </h1>
            <p className="text-left text-red-400 mt-2">
              {styles.find((style) => style.name === selectedStyle)
                ?.description || "Choose a style to see its description."}
            </p>

            {/* Text Input */}
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter your prompt"
              rows="5"
              className="p-4 w-full border border-gray-700 rounded-lg bg-gray-800 text-white text-base resize-y"
            ></textarea>

            {/* Generate Button */}
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

          {/* Right Section */}
          <div
            ref={rightSection}
            className="flex-1 flex justify-center items-center bg-gradient-to-br from-black via-gray-600 to-black   rounded-2xl"
          >
            {loading ? (
              <div className="flex flex-col justify-center items-center">
                <div className="w-12 h-12 border-4 border-t-white rounded-full animate-spin"></div>
                <p className="mt-3 text-white">Generating image...</p>
              </div>
            ) : imageSrc ? (
              <img
                src={imageSrc}
                alt="Generated"
                className="w-full h-full object-cover rounded-2xl border  "
              />
            ) : (
              <div className="w-full h-[400px] flex justify-center items-center  text-gray-400">
                <p>No image generated yet. Enter a prompt to start.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TextToImage;
