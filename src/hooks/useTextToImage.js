import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { toast } from "react-toastify";
import axiosInstance from "../api";
import { negativePrompts } from "../constants";

export const useTextToImage = (initialModel) => {
  const [input, setInput] = useState("");
  const [imageSrc, setImageSrc] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState("Default");
  const [model, setModel] = useState(initialModel);
  const [history, setHistory] = useState([]);
  const [modalImage, setModalImage] = useState(null);
  const [generationTime, setGenerationTime] = useState(null);
  const [numInferenceSteps, setNumInferenceSteps] = useState(28);

  const formRef = useRef(null);
  const imageRef = useRef(null);
  const historyRef = useRef(null);

  useEffect(() => {
    try {
      const savedHistory = JSON.parse(localStorage.getItem("imageHistory") || "[]");
      if (Array.isArray(savedHistory)) {
        setHistory(savedHistory);
      }
    } catch (e) {
      console.error("Error parsing localStorage imageHistory:", e);
      setHistory([]);
    }

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

  const handleModelClick = (selectedModel) => {
    setModel(selectedModel.api);
    toast.info(`Switched to ${selectedModel.name}`);
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
    const startTime = Date.now();

    const negativePrompt = negativePrompts[selectedStyle] || "";
    const combinedInput = selectedStyle === "Default" ? input : `${input} in ${selectedStyle} style`;

    try {
      const payload = {
        input: combinedInput,
        negativePrompt,
        numInferenceSteps,
      };

      const response = await axiosInstance.post(model, payload, {
        responseType: "blob",
      });

      const reader = new FileReader();
      reader.readAsDataURL(response.data);
      reader.onloadend = () => {
        const endTime = Date.now();
        const duration = (endTime - startTime) / 1000;
        setGenerationTime(duration);

        const newImage = reader.result;
        const historyEntry = {
          id: Date.now(),
          image: newImage,
          prompt: input,
          style: selectedStyle,
          negativePrompt,
          numInferenceSteps,
          timestamp: new Date().toISOString(),
          generationTime: duration,
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

  return {
    input,
    setInput,
    imageSrc,
    loading,
    selectedStyle,
    model,
    history,
    modalImage,
    setModalImage,
    numInferenceSteps,
    setNumInferenceSteps,
    handleModelClick,
    handleStyleClick,
    handleDelete,
    query,
    formRef,
    imageRef,
    historyRef,
  };
};
