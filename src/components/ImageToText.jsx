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
  const [dragging, setDragging] = useState(false);
  const apiEndpoint = "http://localhost:8080/api/tools/ocr";

  const leftSection = useRef(null);
  const rightSection = useRef(null);
  const textRef = useRef(null);
  const dropZoneRef = useRef(null);
  const imagePreviewRef = useRef(null);
  const extractButtonRef = useRef(null);
  const extractedTextRef = useRef(null);

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

      // Hiệu ứng scale ảnh preview
      setTimeout(() => {
        gsap.fromTo(
          imagePreviewRef.current,
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
        );
      }, 100);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));

      // Hiệu ứng khi ảnh được thả vào
      setTimeout(() => {
        gsap.fromTo(
          imagePreviewRef.current,
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
        );
      }, 100);
    }
  };

  const extractText = async () => {
    if (!imageFile) {
      alert("⚠️ Please upload an image first.");
      return;
    }
    setLoading(true);
    setExtractedText("");

    // Hiệu ứng shake khi click button Extract Text
    gsap.to(extractButtonRef.current, {
      x: -5,
      repeat: 5,
      yoyo: true,
      duration: 0.1,
    });

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

        // Hiệu ứng xuất hiện dần cho văn bản trích xuất
        setTimeout(() => {
          gsap.fromTo(
            extractedTextRef.current,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
          );
        }, 200);
      }
      toast.success("Successfully extracted text!");
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
      toast.success("Copied to clipboard!");
    }
  };

  return (
    <div className="bg-gradient-to-br from-black via-gray-700 to-black text-white min-h-screen flex flex-col items-center">
      <Navbar />
      <div className="flex flex-col md:flex-row w-[90%] max-w-[1200px] rounded-2xl shadow-lg overflow-hidden my-8 bg-gray-900 p-6 gap-6 absolute top-[15%]">
        {/* Left Section - Upload Image */}
        <div ref={leftSection} className="flex-1 p-8 flex flex-col gap-6">
          <h3 className="text-lg font-semibold">Upload an Image</h3>

          <div
            ref={dropZoneRef}
            className={`cursor-pointer bg-gray-800 p-6 rounded-lg shadow-md border-2 border-dashed transition duration-200 text-center ${
              dragging ? "border-[#6c63ff] scale-105" : "border-gray-700"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="fileUpload"
            />
            <label
              htmlFor="fileUpload"
              className="cursor-pointer bg-gray-800 hover:bg-gray-700 p-3 rounded-lg shadow-md border border-gray-700 transition duration-200 flex flex-col items-center gap-2 text-sm text-center"
            >
              <span>Drag & Drop or Click to Upload</span>
              <span className="px-4 py-2 bg-gray-700 text-white rounded-md">
                Choose a file
              </span>
            </label>
          </div>

          {imagePreview && (
            <img
              ref={imagePreviewRef}
              src={imagePreview}
              alt="Uploaded Preview"
              className="w-full max-h-80 object-contain rounded-lg border border-gray-700 mt-3"
            />
          )}

          <button
            ref={extractButtonRef}
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
          className="flex-1 p-6 bg-gray-800 rounded-lg shadow-md"
        >
          {loading ? (
            <p className="text-center">Extracting text...</p>
          ) : extractedText ? (
            <div ref={extractedTextRef} className="w-full text-left">
              <h3 className="text-lg font-semibold mb-2">Extracted Text:</h3>
              <textarea
                ref={textRef}
                readOnly
                value={extractedText}
                className="w-full bg-gray-900 p-3 rounded-md border border-gray-700 resize-none h-[20rem]"
              />
              <button
                onClick={copyToClipboard}
                className="mt-3 px-5 py-2 bg-[#6c63ff] text-white rounded-lg"
              >
                Copy Text
              </button>
            </div>
          ) : (
            <p className="text-center">
              Upload an image and click "Extract Text".
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageToText;
