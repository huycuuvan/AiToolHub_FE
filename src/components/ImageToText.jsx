import gsap from "gsap";
import { useState, useRef, useEffect } from "react";
import { Navbar } from "./Navbar";
import axios from "axios";
import { toast } from "react-toastify";

export const ImageToText = () => {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [extractedText, setExtractedText] = useState("");
  const [loading, setLoading] = useState(false);
  const apiEndpoint = "http://localhost:8080/api/tools/ocr";

  const leftSection = useRef(null);
  const rightSection = useRef(null);
  const textRef = useRef(null);

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

      const response = await axios.post(apiEndpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (!response.data || response.data.length === 0) {
        setExtractedText("No text extracted.");
      } else {
        const textData = response.data.map((item) => item.text).join(" ");
        setExtractedText(textData);
      }
      toast.success("successfully!");
    } catch (err) {
      console.error("❌ Error extracting text:", err);
      alert(
        `Error extracting text: ${err.response?.data?.error || err.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (textRef.current) {
      navigator.clipboard.writeText(extractedText);
      alert("Copied to clipboard!");
    }
  };

  return (
    <div className="bg-gradient-to-br from-black via-gray-700 to-black text-white min-h-screen flex flex-col items-center">
      <Navbar />
      <div className="flex flex-col md:flex-row w-[90%] max-w-[1200px] rounded-2xl shadow-lg overflow-hidden my-8 bg-gray-900 p-6 gap-6">
        {/* Left Section - Upload Image */}
        <div ref={leftSection} className="flex-1 p-6 flex flex-col gap-6">
          <h3 className="text-lg font-semibold">Upload an Image</h3>
          <label className="cursor-pointer bg-gray-800 hover:bg-gray-700 p-3 rounded-lg shadow-md border border-gray-700 transition duration-200">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <span className="block text-center ">Choose a file</span>
          </label>
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Uploaded Preview"
              className="w-full max-h-80 object-contain rounded-lg border border-gray-700"
            />
          )}
          <button
            onClick={extractText}
            disabled={loading}
            className={`px-6 py-3 text-white rounded-lg text-base font-medium shadow-md transition duration-200 ${
              loading
                ? "bg-gray-700 cursor-not-allowed"
                : "bg-[#6c63ff] hover:bg-[#5753ff] active:scale-95"
            }`}
          >
            {loading ? "Extracting..." : "Extract Text"}
          </button>
        </div>

        {/* Right Section - Extracted Text */}
        <div
          ref={rightSection}
          className="flex-1 flex flex-col justify-center p-6 bg-gray-800 rounded-lg shadow-md"
        >
          {loading ? (
            <div className="flex flex-col justify-center items-center">
              <div className="w-12 h-12 border-4 border-t-white rounded-full animate-spin"></div>
              <p className="mt-3 ">Extracting text...</p>
            </div>
          ) : extractedText ? (
            <div className="w-full text-left">
              <h3 className="text-lg font-semibold mb-2 ">Extracted Text:</h3>
              <textarea
                ref={textRef}
                readOnly
                value={extractedText}
                className="w-full bg-gray-900 p-3 rounded-md border border-gray-700 resize-none h-[20rem]"
              />
              <button
                onClick={copyToClipboard}
                className="mt-3 px-5 py-2 bg-[#6c63ff] hover:bg-[#5753ff] text-white rounded-lg shadow-md active:scale-95 transition duration-200"
              >
                Copy Text
              </button>
            </div>
          ) : (
            <p className=" text-center">
              No text extracted yet. Upload an image and click &quot;Extract
              Text&quot;.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageToText;
