import gsap from "gsap";
import { useState, useRef, useEffect } from "react";
import { Navbar } from "./Navbar";
import axios from "axios"; // Dùng axios trực tiếp thay vì axiosInstance

export const ImageToText = () => {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [extractedText, setExtractedText] = useState("");
  const [loading, setLoading] = useState(false);
  const apiEndpoint = "http://localhost:8080/api/tools/ocr";

  const leftSection = useRef(null);
  const rightSection = useRef(null);

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

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const extractText = async () => {
    if (!imageFile) {
      alert("⚠️ Please upload an image first.");
      return;
    }
    setLoading(true);
    setExtractedText("");

    try {
      const formData = new FormData();
      formData.append("file", imageFile);

      // Debugging: Kiểm tra nội dung formData
      console.log("📌 FormData content:");
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const response = await axios.post(apiEndpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("✅ Response:", response.data);

      if (!response.data || response.data.length === 0) {
        setExtractedText("No text extracted.");
      } else {
        const textData = response.data.map((item) => item.text).join(" ");
        setExtractedText(textData);
      }
    } catch (err) {
      console.error("❌ Error extracting text:", err);
      alert(
        `Error extracting text: ${err.response?.data?.error || err.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-black via-gray-600 to-black text-white min-h-screen flex  items-center flex-col">
      <Navbar />
      <div className="flex w-[90%] max-w-[1200px]  rounded-2xl shadow-lg overflow-hidden my-6 justify-center m-auto">
        {/* Left Section - Upload Image */}
        <div ref={leftSection} className="flex-1 p-8 flex flex-col gap-5">
          <h3 className="text-lg font-semibold">Upload an Image</h3>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="p-2 border border-gray-700 rounded-md bg-gray-800"
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Uploaded Preview"
              className="mt-4 w-full max-h-80 object-contain rounded-lg"
            />
          )}
          <button
            onClick={extractText}
            disabled={loading}
            className={`px-6 py-3 text-white rounded-lg text-base ${
              loading
                ? "bg-gray-700 cursor-not-allowed"
                : "bg-[#6c63ff] hover:bg-[#5753ff] cursor-pointer"
            }`}
          >
            {loading ? "Extracting..." : "Extract Text"}
          </button>
        </div>

        {/* Right Section - Extracted Text */}
        <div
          ref={rightSection}
          className="flex-1 flex justify-center items-center bg-gradient-to-br from-black via-gray-600 to-black rounded-2xl p-6"
        >
          {loading ? (
            <div className="flex flex-col justify-center items-center">
              <div className="w-12 h-12 border-4 border-t-white rounded-full animate-spin"></div>
              <p className="mt-3 text-white">Extracting text...</p>
            </div>
          ) : extractedText ? (
            <div className="w-full text-left bg-gray-800 p-4 rounded-md text-white">
              <h3 className="text-lg font-semibold mb-2">Extracted Text:</h3>
              <p className="whitespace-pre-wrap text-white">{extractedText}</p>
            </div>
          ) : (
            <p className="text-gray-400">
              No text extracted yet. Upload an image and click "Extract Text".
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageToText;
